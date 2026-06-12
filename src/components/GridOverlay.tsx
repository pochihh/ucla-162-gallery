import { useId } from 'react'

export const CELL = 96    // px — exported so callers can snap to the same grid
const WEIGHT = 2          // px — stroke width
const OPACITY = 0.11      // line darkness
const CLEAR_PAD = WEIGHT  // erase underlying strokes before redrawing merged edges

interface Props {
  /** Zone bounds in the SVG's own coordinate space, aligned to the shifted grid. */
  zx?: number; zy?: number; zw?: number; zh?: number
  /** Horizontal grid origin, used to center the grid system in the viewport. */
  gridX?: number
  /**
   * If set, the SVG is clipped to this height (px) — grid renders only above this point.
   * Used to stop the grid exactly at the merged-zone bottom border.
   */
  clipH?: number
  opacity?: number
}

/** Full-coverage grid with an optional rectangular merged zone cleared out. */
export default function GridOverlay({
  zx = 0,
  zy = 0,
  zw = 0,
  zh = 0,
  gridX = 0,
  clipH,
  opacity = OPACITY,
}: Props) {
  const uid   = useId()
  const patId  = `gp-${uid}`
  const maskId = `gm-${uid}`
  const stroke = `rgba(28,28,26,${opacity})`
  const hasMergedZone = zw > 0 && zh > 0

  return (
    <svg
      className="absolute inset-0 w-full pointer-events-none"
      style={{ height: clipH != null ? `${clipH + WEIGHT}px` : '100%' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        {/* Top + left edges of each tile → tiling produces lines at every n×CELL */}
        <pattern
          id={patId}
          width={CELL}
          height={CELL}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${gridX} 0)`}
        >
          <line x1="0" y1="0" x2={CELL} y2="0" stroke={stroke} strokeWidth={WEIGHT} />
          <line x1="0" y1="0" x2="0"    y2={CELL} stroke={stroke} strokeWidth={WEIGHT} />
        </pattern>

        {/* White = show grid, black = erase grid inside merged zone */}
        {hasMergedZone && (
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={zx - CLEAR_PAD}
              y={zy - CLEAR_PAD}
              width={zw + CLEAR_PAD * 2}
              height={zh + CLEAR_PAD * 2}
              fill="black"
            />
          </mask>
        )}
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patId})`}
        mask={hasMergedZone ? `url(#${maskId})` : undefined}
      />

      {/* Merged-cell border — identical style to grid lines */}
      {hasMergedZone && (
        <rect
          x={zx}
          y={zy}
          width={zw}
          height={zh}
          fill="none"
          stroke={stroke}
          strokeWidth={WEIGHT}
        />
      )}
    </svg>
  )
}
