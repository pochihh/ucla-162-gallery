import { useEffect, useState } from 'react'
import GridOverlay, { CELL } from './GridOverlay'

// ── Tuning ────────────────────────────────────────────────────────────────────
const TITLE_ABOVE_CENTER = 56   // Hero title block: calc(50vh - 3.5rem)
const HALF_COLS          = 4    // horizontal half-width in cells (4×2×96 = 768px = max-w-3xl)
const MOBILE_FULL_WIDTH  = 768  // below md, clear the full title/about row width
// ─────────────────────────────────────────────────────────────────────────────

const positiveModulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor

interface Props {
  /**
   * Document y-coordinate (px, multiple of CELL) where the cleared merged block stops.
   * Computed in Home so both PageGrid and ProjectGrid share the same value.
   */
  mergedEnd: number
  /** Document y-coordinate (px, multiple of CELL) where the page grid stops. */
  gridEnd: number
}

export default function PageGrid({ mergedEnd, gridEnd }: Props) {
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    const sync = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const { w, h } = vp

  // Vertical: Hero title top → mergedEnd. The grid itself continues to gridEnd.
  const zy = Math.floor((h / 2 - TITLE_ABOVE_CENTER) / CELL) * CELL
  const zb = mergedEnd
  const zh = zb - zy

  // Horizontal: center the grid system, then merge the centered content cells.
  const isMobile = w < MOBILE_FULL_WIDTH
  const mergedCols = isMobile ? Math.ceil(w / CELL) + 2 : HALF_COLS * 2
  const zw = mergedCols * CELL
  const zx = (w - zw) / 2
  const gridX = positiveModulo(zx, CELL)

  return <GridOverlay zx={zx} zy={zy} zw={zw} zh={zh} gridX={gridX} clipH={gridEnd} />
}
