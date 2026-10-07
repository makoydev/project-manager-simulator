import { describe, expect, it } from 'vitest'
import { validateEventList } from '../../game/validate'
import { DELIVERY_EVENTS } from '../events/delivery'
import { expectFairChoices } from './helpers'

describe('delivery events', () => {
  it('pass structural validation', () => {
    expect(validateEventList(DELIVERY_EVENTS)).toEqual([])
  })
  it('are generic and prefixed', () => {
    for (const e of DELIVERY_EVENTS) {
      expect(e.id.startsWith('d-'), e.id).toBe(true)
      expect(e.scenarios, e.id).toBeUndefined()
    }
    expect(DELIVERY_EVENTS.length).toBeGreaterThanOrEqual(20)
  })
  it('do not telegraph answers', () => expectFairChoices(DELIVERY_EVENTS))
})
