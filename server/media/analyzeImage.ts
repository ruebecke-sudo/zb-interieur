/** Analyze image buffers: format, dimensions, color space (no native deps). */

export type ImageAnalysis = {
  width: number
  height: number
  format: string
  mimeType: string
  colorSpace: string
  extension: string
}

function readUInt16BE(buf: Buffer, offset: number): number {
  return buf.readUInt16BE(offset)
}

function readUInt32BE(buf: Buffer, offset: number): number {
  return buf.readUInt32BE(offset)
}

function detectJpeg(buf: Buffer): ImageAnalysis | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null

  let colorSpace = 'sRGB'
  let width = 0
  let height = 0

  // Adobe APP14 marker often indicates CMYK/YCCK
  for (let i = 0; i < Math.min(buf.length - 14, 256_000); i++) {
    if (buf[i] === 0xff && buf[i + 1] === 0xee) {
      const transform = buf[i + 13]
      if (transform === 0) colorSpace = 'CMYK / Unknown'
      else if (transform === 1) colorSpace = 'YCbCr'
      else if (transform === 2) colorSpace = 'YCCK'
    }
  }

  const asLatin = buf.subarray(0, Math.min(buf.length, 512_000)).toString('latin1')
  if (/Adobe RGB/i.test(asLatin)) colorSpace = 'Adobe RGB'
  else if (/sRGB/i.test(asLatin) && colorSpace === 'sRGB') colorSpace = 'sRGB'
  else if (/ProPhoto/i.test(asLatin)) colorSpace = 'ProPhoto RGB'
  else if (/Display P3/i.test(asLatin)) colorSpace = 'Display P3'

  let offset = 2
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = buf[offset + 1]
    if (marker === 0xd9 || marker === 0xda) break
    const size = readUInt16BE(buf, offset + 2)
    // SOF0–SOF3, SOF5–SOF7, SOF9–SOF11, SOF13–SOF15
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      height = readUInt16BE(buf, offset + 5)
      width = readUInt16BE(buf, offset + 7)
      const components = buf[offset + 9]
      if (components === 4 && colorSpace === 'sRGB') colorSpace = 'CMYK'
      else if (components === 1) colorSpace = 'Grayscale'
      break
    }
    offset += 2 + size
  }

  return {
    width,
    height,
    format: 'JPEG',
    mimeType: 'image/jpeg',
    colorSpace,
    extension: '.jpg',
  }
}

function detectPng(buf: Buffer): ImageAnalysis | null {
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null

  const width = readUInt32BE(buf, 16)
  const height = readUInt32BE(buf, 20)
  const colorType = buf[25]
  let colorSpace = 'sRGB'
  if (colorType === 0 || colorType === 4) colorSpace = 'Grayscale'
  else if (colorType === 2 || colorType === 6) colorSpace = 'sRGB'
  else if (colorType === 3) colorSpace = 'Indexed'

  const latin = buf.subarray(0, Math.min(buf.length, 256_000)).toString('latin1')
  if (latin.includes('sRGB')) colorSpace = 'sRGB'
  if (/Adobe RGB/i.test(latin)) colorSpace = 'Adobe RGB'
  if (latin.includes('iCCP') && /CMYK/i.test(latin)) colorSpace = 'CMYK'

  return {
    width,
    height,
    format: 'PNG',
    mimeType: 'image/png',
    colorSpace,
    extension: '.png',
  }
}

function detectWebp(buf: Buffer): ImageAnalysis | null {
  if (buf.length < 30) return null
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null

  let width = 0
  let height = 0
  const chunk = buf.toString('ascii', 12, 16)
  if (chunk === 'VP8X' && buf.length >= 30) {
    width = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16)
    height = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16)
  } else if (chunk === 'VP8 ' && buf.length >= 30) {
    width = buf[26] | (buf[27] << 8)
    height = buf[28] | (buf[29] << 8)
    width &= 0x3fff
    height &= 0x3fff
  } else if (chunk === 'VP8L' && buf.length >= 25) {
    const b0 = buf[21]
    const b1 = buf[22]
    const b2 = buf[23]
    const b3 = buf[24]
    width = 1 + (((b1 & 0x3f) << 8) | b0)
    height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
  }

  return {
    width,
    height,
    format: 'WEBP',
    mimeType: 'image/webp',
    colorSpace: 'sRGB',
    extension: '.webp',
  }
}

function detectGif(buf: Buffer): ImageAnalysis | null {
  if (buf.length < 10) return null
  const sig = buf.toString('ascii', 0, 6)
  if (sig !== 'GIF87a' && sig !== 'GIF89a') return null
  const width = buf[6] | (buf[7] << 8)
  const height = buf[8] | (buf[9] << 8)
  return {
    width,
    height,
    format: 'GIF',
    mimeType: 'image/gif',
    colorSpace: 'Indexed',
    extension: '.gif',
  }
}

function detectAvif(buf: Buffer): ImageAnalysis | null {
  if (buf.length < 12) return null
  if (buf.toString('ascii', 4, 8) !== 'ftyp') return null
  const brand = buf.toString('ascii', 8, 12)
  if (!['avif', 'avis', 'mif1'].includes(brand) && !buf.includes(Buffer.from('avif'))) return null
  // Minimal: format known; dimensions often need full isobmff parse — leave 0 if unknown
  return {
    width: 0,
    height: 0,
    format: 'AVIF',
    mimeType: 'image/avif',
    colorSpace: 'sRGB / BT.709',
    extension: '.avif',
  }
}

export function analyzeImageBuffer(buf: Buffer): ImageAnalysis {
  const detected =
    detectJpeg(buf) || detectPng(buf) || detectWebp(buf) || detectGif(buf) || detectAvif(buf)
  if (!detected) {
    throw new Error('Ungültiges oder nicht unterstütztes Bildformat.')
  }
  return detected
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() || 'image'
  return base
    .normalize('NFKD')
    .replace(/[^\w.\- ()äöüÄÖÜßØ°]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 180) || 'image'
}

export function filenameToDefaultName(filename: string): string {
  const base = sanitizeFilename(filename)
  return base.replace(/\.(jpe?g|png|webp|gif|avif)$/i, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
}
