import { describe, expect, it } from 'vitest'
import { KAYA_WEDNESDAY } from '../episodes/kaya-wednesday'
import { validateEpisode } from '../validate'

describe('live episode: Kaya Wednesday', () => {
  it('passes structural validation', () => {
    expect(validateEpisode(KAYA_WEDNESDAY)).toEqual([])
  })

  it('has a full day: three meetings and a wrap-up', () => {
    expect(KAYA_WEDNESDAY.meetings).toHaveLength(3)
    expect(KAYA_WEDNESDAY.wrapUp.fields.length).toBeGreaterThanOrEqual(3)
  })

  it('rewards gathering information: some options need things you have to read', () => {
    const gated = KAYA_WEDNESDAY.meetings.flatMap((m) => Object.values(m.script).flat()).flatMap((b) => (b.t === 'choice' ? b.options : [])).filter((o) => o.needs?.length)
    expect(gated.length).toBeGreaterThanOrEqual(3)
  })
})
