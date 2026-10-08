import { describe, expect, it } from 'vitest'
import { INTERVIEW_QUESTIONS } from '../interview'

describe('interview arcade questions', () => {
  it('has enough well-formed questions', () => {
    expect(INTERVIEW_QUESTIONS.length).toBeGreaterThanOrEqual(36)
    const ids = new Set(INTERVIEW_QUESTIONS.map((q) => q.id))
    expect(ids.size).toBe(INTERVIEW_QUESTIONS.length)
    for (const q of INTERVIEW_QUESTIONS) {
      expect(q.options.length, q.id).toBe(4)
      expect(q.prompt.length, q.id).toBeLessThanOrEqual(260)
      for (const o of q.options) expect(o.length, `${q.id}: ${o}`).toBeLessThanOrEqual(160)
      expect(q.explanation.length, q.id).toBeLessThanOrEqual(360)
      expect(q.lookFor.length, q.id).toBeLessThanOrEqual(160)
    }
  })
  it('spreads correct answers across positions and avoids "longest is right"', () => {
    const counts = [0, 0, 0, 0]
    let longestRight = 0
    for (const q of INTERVIEW_QUESTIONS) {
      counts[q.answer]++
      const longest = q.options.reduce((best, o, i) => (o.length > q.options[best].length ? i : best), 0)
      if (longest === q.answer) longestRight++
    }
    for (const c of counts) expect(c / INTERVIEW_QUESTIONS.length).toBeGreaterThanOrEqual(0.15)
    expect(longestRight / INTERVIEW_QUESTIONS.length).toBeLessThanOrEqual(0.5)
  })
  it('covers every category', () => {
    const cats = new Set(INTERVIEW_QUESTIONS.map((q) => q.category))
    expect(cats.size).toBe(7)
  })
})
