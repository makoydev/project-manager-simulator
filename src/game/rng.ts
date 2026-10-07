/**
 * Seeded PRNG (mulberry32). The state is a single uint32 stored in GameState,
 * so every run is reproducible from its seed — handy for tests and balance sims.
 */
export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number
  /** true with probability p. */
  chance(p: number): boolean
  /** Uniform float in [lo, hi). */
  range(lo: number, hi: number): number
  /** Uniform integer in [lo, hi]. */
  int(lo: number, hi: number): number
  pick<T>(items: readonly T[]): T
  /** Pick by non-negative weights; returns -1 if all weights are 0. */
  weightedIndex(weights: readonly number[]): number
  /** Current internal state, to persist back into GameState. */
  state(): number
}

export function makeRng(seed: number): Rng {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    chance: (p) => next() < p,
    range: (lo, hi) => lo + next() * (hi - lo),
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    weightedIndex: (weights) => {
      const total = weights.reduce((s, w) => s + Math.max(0, w), 0)
      if (total <= 0) return -1
      let r = next() * total
      for (let i = 0; i < weights.length; i++) {
        r -= Math.max(0, weights[i])
        if (r < 0) return i
      }
      return weights.length - 1
    },
    state: () => a,
  }
}

export function randomSeed(): number {
  return (Math.random() * 2 ** 32) >>> 0
}
