import { useEffect } from 'react'

const SCRIPT_SRC = 'https://www.stilpunkte.de/richsnippet.js?u=amkg-bjm-bju&type=image'
const SCRIPT_ID = 'stilpunkte-richsnippet'

/** STILPUNKTE Rich-Snippet Zertifikat (offizielles Embed). */
export function StilpunkteRichSnippet() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
        Zum Stilpunkte Zertifikat
      </p>
      <div className="sp-richsnippets min-h-[120px] min-w-[120px]" />
    </div>
  )
}
