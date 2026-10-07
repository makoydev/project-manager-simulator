import { describe, expect, it } from 'vitest'
import { validateEventList } from '../../game/validate'
import { SYSTEM_EVENTS } from '../events/system'

describe('system events', () => {
  it('pass structural validation and are never drawn at random', () => {
    expect(validateEventList(SYSTEM_EVENTS)).toEqual([])
    for (const e of SYSTEM_EVENTS) {
      expect(e.id.startsWith('sys-'), e.id).toBe(true)
      expect(e.weight, e.id).toBe(0)
    }
  })
})
