import { describe, expect, it } from 'vitest'
import { validateEventList } from '../../game/validate'
import { PEOPLE_EVENTS } from '../events/people'
import { expectFairChoices } from './helpers'

describe('people events', () => {
  it('pass structural validation', () => {
    expect(validateEventList(PEOPLE_EVENTS)).toEqual([])
  })
  it('are generic and prefixed', () => {
    for (const e of PEOPLE_EVENTS) {
      expect(e.id.startsWith('p-'), e.id).toBe(true)
      expect(e.scenarios, e.id).toBeUndefined()
    }
    expect(PEOPLE_EVENTS.length).toBeGreaterThanOrEqual(20)
  })
  it('do not telegraph answers', () => expectFairChoices(PEOPLE_EVENTS))
})
