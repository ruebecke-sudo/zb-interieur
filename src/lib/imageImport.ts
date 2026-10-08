/** Helpers for uploading single images and whole folders into Image Manager Pro. */

const IMAGE_FILE = /\.(jpe?g|png|webp|gif|avif)$/i

/** Larger images are scaled down to this edge length before upload. */
const MAX_EDGE = 2400
/** Images below this size and edge length are uploaded unchanged. */
const KEEP_BELOW_BYTES = 1.5 * 1024 * 1024

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || IMAGE_FILE.test(file.name)
}

function tidy(text: string): string {
  return text
    .replace(/[_\-.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    // Only lowercase words get a capital letter; "AL2" or "McQueen" stay as typed.
    .map((word) => (word === word.toLowerCase() ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
}

/**
 * Readable product name from a file name: drops the extension, copy markers like "(2)",
 * pixel sizes like "1200x800", "scaled" and a trailing image number ("Sofa Luna 2" -> "Sofa Luna").
 * Model numbers inside the name ("Chair 012 Oak") are kept.
 */
export function nameFromFilename(fileName: string): string {
  const base = fileName.replace(/(\.(jpe?g|png|webp|gif|avif))+$/i, '')
  const cleaned = base
    .replace(/\(\d+\)/g, ' ')
    .replace(/\b\d{2,5}x\d{2,5}\b/gi, ' ')
    .replace(/\bscaled\b/gi, ' ')
    .replace(/[\s_\-.]+\d{1,2}$/, '')
  return tidy(cleaned) || tidy(base) || 'Bild'
}

/** Name of the folder that directly contains the file, if it was picked as part of a folder. */
export function folderOf(file: File): string {
  const parts = (file.webkitRelativePath || '').split('/').filter(Boolean)
  return parts.length >= 2 ? tidy(parts[parts.length - 2]) : ''
}

/**
 * Scales large photos down to MAX_EDGE and stores them as WebP, which keeps the
 * customer's storage small and websites fast. Small images, GIFs (animation) and
 * anything the browser cannot decode are uploaded unchanged.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (/gif/i.test(file.type) || typeof createImageBitmap !== 'function') return file
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }
  const { width, height } = bitmap
  if (Math.max(width, height) <= MAX_EDGE && file.size <= KEEP_BELOW_BYTES) {
    bitmap.close()
    return file
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
  // Some browsers cannot write WebP and fall back to PNG, which can be larger.
  if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
  const name = file.name.replace(/(\.(jpe?g|png|webp|avif))+$/i, '') + '.webp'
  return new File([blob], name, { type: 'image/webp', lastModified: file.lastModified })
}
