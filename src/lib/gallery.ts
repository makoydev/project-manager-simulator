/**
 * Gallery view: the column count that makes 16:9 tiles as large as possible inside w×h.
 * Ties go to more columns, so small calls sit side by side. Tiles are capped at `max` px wide.
 */
export function gallery(n: number, w: number, h: number, gap: number, max = 480) {
  let best = { cols: 1, tile: 0 }
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols)
    const tile = Math.min((w - (cols - 1) * gap) / cols, ((h - (rows - 1) * gap) / rows) * (16 / 9), max)
    if (tile >= best.tile) best = { cols, tile }
  }
  return best
}
