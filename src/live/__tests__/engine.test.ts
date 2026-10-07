import { describe, expect, it } from 'vitest'
import { choose, debrief, initLive, joinMeeting, leaveMeeting, markSeen, optionLocked, reply, setWrap, startDay, step, submitWrap, type LiveState } from '../engine'
import { KAYA_WEDNESDAY as EP } from '../episodes/kaya-wednesday'

/** Play beats until the meeting needs input or ends. */
function run(s: LiveState): LiveState {
  for (let i = 0; i < 400; i++) {
    const r = step(s, EP)
    s = r.state
    if (s.pending || s.phase !== 'meeting') return s
  }
  throw new Error('meeting did not stop within 400 beats')
}

function readEverything(s: LiveState): LiveState {
  return markSeen(s, EP, { messages: EP.messages.map((m) => m.id), docs: true, dashboards: true })
}

/** Depth-first over every option (and silence) at every choice. Returns the outcomes reached. */
function explore(start: LiveState, prep: boolean, outcomes: Set<string>, depth = 0): number {
  let s = run(start)
  if (prep) s = readEverything(s)
  if (s.phase === 'meetingEnd') {
    const m = EP.meetings[s.meetingIndex]
    outcomes.add(s.outcomes[m.id])
    return 1
  }
  expect(s.pending, 'stopped without a choice or an end').toBeTruthy()
  expect(depth).toBeLessThan(20)
  let paths = explore(choose(s, EP, null), prep, outcomes, depth + 1)
  for (const o of s.pending!.options) if (!optionLocked(s, o.needs)) paths += explore(choose(s, EP, o.id), prep, outcomes, depth + 1)
  return paths
}

function atMeeting(index: number): LiveState {
  let s = startDay(initLive(EP), EP)
  for (let i = 0; i < index; i++) s = { ...s, meetingIndex: i + 1 }
  return joinMeeting({ ...s, phase: 'desk' }, EP)
}

describe('live engine', () => {
  for (const [i, m] of EP.meetings.entries()) {
    it(`every path through “${m.title}” ends, with and without prep`, () => {
      for (const prep of [false, true]) {
        const outcomes = new Set<string>()
        let s = atMeeting(i)
        if (prep) s = readEverything({ ...s, messages: EP.messages.map((x) => x.id), comments: EP.docs.flatMap((d) => d.comments.map((c) => c.id)) })
        const paths = explore(s, prep, outcomes)
        expect(paths).toBeGreaterThan(1)
        expect(outcomes.size).toBeGreaterThan(0)
      }
    })
  }

  it('reading key items sets read flags', () => {
    let s = startDay(initLive(EP), EP)
    const key = EP.messages.find((m) => m.key && m.at === 'morning')
    if (key) {
      expect(s.flags[`read:${key.id}`]).toBeUndefined()
      s = markSeen(s, EP, { messages: [key.id] })
      expect(s.flags[`read:${key.id}`]).toBe(true)
    }
    s = markSeen(s, EP, { dashboards: true })
    for (const p of EP.dashboards.filter((d) => d.key)) expect(s.flags[`read:${p.id}`]).toBe(true)
  })

  it('a Slack quick reply is recorded once as a graded choice', () => {
    const msg = EP.messages.find((m) => m.replies?.length && m.at === 'morning')
    if (!msg) return
    let s = startDay(initLive(EP), EP)
    s = reply(s, EP, msg.id, msg.replies![0].id)
    expect(s.choices).toHaveLength(1)
    expect(s.choices[0].grade).toBe(msg.replies![0].grade)
    expect(reply(s, EP, msg.id, msg.replies![0].id)).toBe(s)
  })

  /** A whole day with a fixed strategy. */
  function playDay(strategy: 'prepared' | 'silent'): number {
    let s = startDay(initLive(EP), EP)
    for (let guard = 0; guard < 200 && s.phase !== 'wrapup'; guard++) {
      if (s.phase === 'desk') {
        if (strategy === 'prepared') s = readEverything(s)
        s = joinMeeting(s, EP)
      }
      s = run(s)
      if (strategy === 'prepared') s = readEverything(s)
      if (s.pending) {
        const best = s.pending.options.find((o) => o.grade === 'best' && !optionLocked(s, o.needs))
        s = choose(s, EP, strategy === 'prepared' ? (best?.id ?? null) : null)
      } else if (s.phase === 'meetingEnd') s = leaveMeeting(s, EP)
    }
    expect(s.phase).toBe('wrapup')
    // Fill the record: prepared players pick what's accurate; silent ones pick the first option.
    for (const f of EP.wrapUp.fields) {
      const right = f.options.find((o) => o.correctWhen && (o.correctWhen.flags ?? []).every((x) => s.flags[x]) && !(o.correctWhen.notFlags ?? []).some((x) => s.flags[x]))
      s = setWrap(s, f.id, strategy === 'prepared' && right ? right.id : f.options[0].id)
    }
    const post = EP.wrapUp.post.options.filter((o) => !optionLocked(s, o.needs))
    const pick = strategy === 'prepared' ? (post.find((o) => o.grade === 'best') ?? post[0]) : (post.find((o) => o.grade === 'poor') ?? post[0])
    s = setWrap(s, '__post', pick.id)
    s = submitWrap(s)
    expect(s.phase).toBe('debrief')
    return debrief(s, EP).score
  }

  it('a prepared, decisive TPM has a great day; a silent, unprepared one does not', () => {
    const good = playDay('prepared')
    const bad = playDay('silent')
    expect(good).toBeGreaterThanOrEqual(85)
    expect(bad).toBeLessThan(45)
  })
})
