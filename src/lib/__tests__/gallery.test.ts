import { describe, expect, it } from 'vitest'
import { gallery } from '../gallery'

/** Does the layout gallery() picks actually fit inside w×h? */
function fits(n: number, w: number, h: number, gap: number) {
  const { cols, tile } = gallery(n, w, h, gap)
  const rows = Math.ceil(n / cols)
  return cols * tile + (cols - 1) * gap <= w + 0.001 && rows * ((tile * 9) / 16) + (rows - 1) * gap <= h + 0.001
}

describe('gallery layout', () => {
  it('fits every call size in short-laptop, desktop and phone stages', () => {
    const stages = [
      [1024, 445],
      [1024, 555],
      [1024, 695],
      [1232, 380],
      [359, 327],
    ]
    for (const [w, h] of stages) for (let n = 1; n <= 9; n++) expect(fits(n, w, h, 12), `${n} tiles in ${w}×${h}`).toBe(true)
  })

  it('uses the room: six people go 3×2 on a wide stage and 2×3 on a phone', () => {
    expect(gallery(6, 1024, 445, 12).cols).toBe(3)
    expect(gallery(6, 359, 327, 8).cols).toBe(2)
  })

  it('puts a one-on-one side by side and caps the tile width', () => {
    expect(gallery(2, 1024, 695, 12)).toEqual({ cols: 2, tile: 480 })
  })
})
