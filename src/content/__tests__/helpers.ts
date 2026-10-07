import { expect } from 'vitest'
import type { EventDef } from '../../game/types'

/** Guards against content that telegraphs the right answer. */
export function expectFairChoices(events: EventDef[]) {
  const multi = events.filter((e) => e.choices.length >= 3)
  const bestFirst = multi.filter((e) => e.choices[0].grade === 'best').length
  const bestLongest = multi.filter((e) => {
    const longest = [...e.choices].sort((a, b) => b.label.length - a.label.length)[0]
    return longest.grade === 'best'
  }).length
  // Best answer shouldn't usually sit in the same slot or always be the wordiest option.
  expect(bestFirst / Math.max(1, multi.length), 'too many events put the best choice first').toBeLessThanOrEqual(0.45)
  expect(bestLongest / Math.max(1, multi.length), 'best choice is too often the longest label').toBeLessThanOrEqual(0.6)
  // Every event should have a tempting poor choice.
  for (const e of events) expect(e.choices.some((c) => c.grade === 'poor'), `${e.id} has no poor choice`).toBe(true)
}
