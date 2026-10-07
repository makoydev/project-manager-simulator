import { BACKGROUNDS } from './backgrounds'
import { check } from './conditions'
import { getRisk, getScenario } from './content'
import { addProgress, addSkill, applyEffects, changeMeter, changeRel, revealHidden, unblock, wsName, type Delta } from './effects'
import { READINESS_BY_KEY } from './meta'
import { makeRng } from './rng'
import { isDone } from './schedule'
import { isBehind, meetConcept, week } from './state'
import { fill } from './text'
import type { ConceptId, GameState, ReadinessKey, Role, WsRole } from './types'

export type ActionId =
  | 'kopi'
  | 'riskReview'
  | 'update'
  | 'teamLunch'
  | 'celebrate'
  | 'focusTime'
  | 'overtime'
  | 'rebaseline'
  | 'contractor'
  | 'codeIt'
  | 'descope'
  | 'facilitate'
  | 'escalate'
  | 'mitigate'
  | 'readiness'

export type ActionTarget = Role | WsRole | ReadinessKey | string

export interface ActionDef {
  id: ActionId
  name: string
  icon: string
  blurb: string
  category: 'people' | 'delivery' | 'risk' | 'comms' | 'self'
  concept: ConceptId
  /** What the action needs a target of; contextual actions live on board rows / risks / checklist items. */
  target?: 'role' | 'ws' | 'risk' | 'readiness'
  contextual?: boolean
  /** Shown as a tooltip: the principle behind the move. */
  tip: string
}

export const ACTIONS: Record<ActionId, ActionDef> = {
  kopi: {
    id: 'kopi',
    name: 'Kopi chat',
    icon: '☕',
    blurb: '1:1 with a stakeholder. Builds trust; people tell you things over kopi they never say in meetings.',
    category: 'people',
    concept: 'influence',
    target: 'role',
    tip: 'Build relationships before you need them. Goodwill is the currency of influence without authority.',
  },
  riskReview: {
    id: 'riskReview',
    name: 'Pre-mortem risk review',
    icon: '🔍',
    blurb: '“It’s launch day and we failed — why?” Surfaces hidden risks onto your RAID log.',
    category: 'risk',
    concept: 'raid-log',
    tip: 'You can only mitigate risks you know about. Pre-mortems give people permission to be pessimistic.',
  },
  update: {
    id: 'update',
    name: 'Stakeholder update',
    icon: '📣',
    blurb: 'A crisp async update: progress, risks, decisions needed. Execs hate surprises.',
    category: 'comms',
    concept: 'status-report',
    tip: 'Over-communicate in a predictable rhythm. A short update on time beats a perfect one late.',
  },
  teamLunch: {
    id: 'teamLunch',
    name: 'Team lunch',
    icon: '🍜',
    blurb: 'Zi char at the hawker centre, on the program budget. Morale up, walls down.',
    category: 'people',
    concept: 'team-health',
    tip: 'Morale is a delivery metric. Tired, unappreciated teams ship slower and break more things.',
  },
  celebrate: {
    id: 'celebrate',
    name: 'Celebrate a win',
    icon: '🎉',
    blurb: 'Specific, public recognition of the team that moved the needle this week.',
    category: 'people',
    concept: 'team-health',
    tip: 'Specific praise in public (“the retry logic Wei Ling wrote saved launch”) beats generic thanks.',
  },
  focusTime: {
    id: 'focusTime',
    name: 'Shield focus time',
    icon: '🛡️',
    blurb: 'Cancel low-value syncs for two days and take the status questions yourself.',
    category: 'delivery',
    concept: 'meetings',
    tip: 'A TPM absorbs coordination overhead so engineers can build. Every meeting needs a decision or a reason.',
  },
  overtime: {
    id: 'overtime',
    name: 'Stay late tonight',
    icon: '🌙',
    blurb: '+2 focus today. Your energy pays for it tomorrow.',
    category: 'self',
    concept: 'self-care',
    tip: 'Heroics are a loan against tomorrow. A burnt-out TPM makes worse calls and misses signals.',
  },
  rebaseline: {
    id: 'rebaseline',
    name: 'Re-baseline the date',
    icon: '📅',
    blurb: 'Go to the sponsor with data and a new date (+3 days). Costs trust — less if you warned them early.',
    category: 'comms',
    concept: 'iron-triangle',
    tip: 'Moving a date is survivable. Surprising people with it is not. Flag slips early, with a recovery plan.',
  },
  contractor: {
    id: 'contractor',
    name: 'Bring in contractors',
    icon: '🧑‍💻',
    blurb: 'S$40k for two contractors on one workstream. Slower for 2 days while they onboard, faster after.',
    category: 'delivery',
    concept: 'brooks-law',
    target: 'ws',
    tip: 'Adding people to a late project makes it later — unless the work splits cleanly and there is time to ramp up.',
  },
  codeIt: {
    id: 'codeIt',
    name: 'Write the code yourself',
    icon: '⌨️',
    blurb: 'You know how to fix it. You could just… do it. (3 focus.)',
    category: 'delivery',
    concept: 'tl-trap',
    target: 'ws',
    contextual: true,
    tip: 'Every hour you code is an hour nobody is doing the TPM job: unblocking, aligning, communicating.',
  },
  descope: {
    id: 'descope',
    name: 'Negotiate a descope',
    icon: '✂️',
    blurb: 'Agree with the PM to move ~15% of this workstream to a fast-follow.',
    category: 'delivery',
    concept: 'scope-creep',
    target: 'ws',
    contextual: true,
    tip: 'Scope is usually the most flexible side of the triangle. Cut to a real MVP, not a hollow one.',
  },
  facilitate: {
    id: 'facilitate',
    name: 'Facilitate a working session',
    icon: '🧩',
    blurb: 'Get the right people in a room with a clear decision to make. Works better with goodwill.',
    category: 'people',
    concept: 'raci',
    target: 'ws',
    contextual: true,
    tip: 'Most blockers are undecided decisions. Name the decision, the decider (RACI), and the deadline.',
  },
  escalate: {
    id: 'escalate',
    name: 'Escalate to the sponsor',
    icon: '🚨',
    blurb: 'Instant unblock, paid for in goodwill. Each escalation costs more trust than the last.',
    category: 'comms',
    concept: 'escalation',
    target: 'ws',
    contextual: true,
    tip: 'Escalate early, with options and a recommendation — and tell your peer before you go over their head.',
  },
  mitigate: {
    id: 'mitigate',
    name: 'Mitigate risk',
    icon: '🛡️',
    blurb: 'Spend focus now to cut the odds of a risk blowing up later.',
    category: 'risk',
    concept: 'risk-mgmt',
    target: 'risk',
    contextual: true,
    tip: 'Respond to risks by exposure (likelihood × impact). Not every risk deserves a mitigation — some you accept.',
  },
  readiness: {
    id: 'readiness',
    name: 'Drive readiness item',
    icon: '✅',
    blurb: 'Make a launch-readiness item actually happen.',
    category: 'delivery',
    concept: 'launch-readiness',
    target: 'readiness',
    contextual: true,
    tip: 'Launch readiness is a checklist you drive for weeks, not a meeting you hold on launch day.',
  },
}

/** Global actions shown in the actions panel, in display order. */
export const PANEL_ACTIONS: ActionId[] = ['kopi', 'riskReview', 'update', 'teamLunch', 'celebrate', 'focusTime', 'contractor', 'rebaseline', 'overtime']

const CONTRACTOR_COST = 40
const LUNCH_COST = 0.6

export interface Availability {
  ok: boolean
  cost: number
  reason?: string
}

const usedWithin = (s: GameState, key: string, days: number) => s.cooldowns[key] !== undefined && s.day - s.cooldowns[key] < days

function updatesThisWeek(s: GameState): number {
  return s.cooldowns[`update:w${week(s.day)}`] ?? 0
}

export function actionCost(s: GameState, id: ActionId, target?: ActionTarget): number {
  switch (id) {
    case 'kopi':
    case 'update':
    case 'teamLunch':
    case 'celebrate':
    case 'focusTime':
    case 'escalate':
      return 1
    case 'riskReview':
    case 'rebaseline':
    case 'contractor':
    case 'descope':
    case 'facilitate':
      return 2
    case 'codeIt':
      return 3
    case 'overtime':
      return 0
    case 'mitigate':
      return getRisk(getScenario(s.scenarioId), String(target))?.mitigation.cost ?? 1
    case 'readiness':
      return READINESS_BY_KEY[target as ReadinessKey]?.cost ?? 1
  }
}

export function availability(s: GameState, id: ActionId, target?: ActionTarget): Availability {
  const cost = actionCost(s, id, target)
  const no = (reason: string): Availability => ({ ok: false, cost, reason })
  if (s.phase !== 'day') return no('Not now')
  const sc = getScenario(s.scenarioId)
  switch (id) {
    case 'kopi':
      if (!target) return { ok: true, cost }
      if (usedWithin(s, `kopi:${target}`, 2)) return no('You had kopi together recently')
      break
    case 'riskReview':
      if (usedWithin(s, 'riskReview', 3)) return no('Ran one recently — give it a few days')
      break
    case 'update':
      if (updatesThisWeek(s) >= 2) return no('Two updates this week already — more is noise')
      break
    case 'teamLunch':
      if (usedWithin(s, 'teamLunch', 4)) return no('Had one recently')
      break
    case 'celebrate':
      if (usedWithin(s, 'celebrate', 3)) return no('Celebrated recently — keep it meaningful')
      break
    case 'focusTime':
      if (usedWithin(s, 'focusTime', 4)) return no('Already shielding the team')
      break
    case 'overtime':
      if (usedWithin(s, 'overtime', 1)) return no('Already staying late tonight')
      break
    case 'rebaseline':
      if (s.flags['sys:rebaselined']) return no('You can only re-baseline once')
      if (s.targetDay + 3 > sc.maxDay) return no('No room left in the calendar')
      if (!isBehind(s)) return no('You are on track — no need')
      break
    case 'contractor':
      if (s.flags['sys:contractor']) return no('Already brought in contractors')
      if (s.meters.budget < CONTRACTOR_COST) return no(`Needs S$${CONTRACTOR_COST}k budget`)
      if (target && isDone(s.ws[target as WsRole])) return no('Already complete')
      break
    case 'codeIt':
      if (!BACKGROUNDS[s.background].canCode) return no('Not your background')
      if (!target) return no('Pick a workstream')
      if (isDone(s.ws[target as WsRole])) return no('Already complete')
      if (s.ws[target as WsRole].blockedDays > 0) return no('Blocked — code won’t help')
      break
    case 'descope': {
      const w = s.ws[target as WsRole]
      if (!w) return no('Pick a workstream')
      if (s.cooldowns[`descope:${target}`] !== undefined) return no('Already descoped once')
      if (w.done / w.work >= 0.9) return no('Too late to cut — it’s nearly done')
      break
    }
    case 'facilitate':
    case 'escalate':
      if (!target || s.ws[target as WsRole]?.blockedDays <= 0) return no('Not blocked')
      break
    case 'mitigate': {
      const st = s.risks[String(target)]
      if (st !== 'open') return no(st === 'mitigated' ? 'Already mitigated' : 'Not on your RAID log')
      break
    }
    case 'readiness': {
      const def = READINESS_BY_KEY[target as ReadinessKey]
      if (!def) return no('Unknown item')
      if (s.readiness[def.key]) return no('Done')
      if (!check(def.requires, s, () => isBehind(s))) return no(`Needs ${fill(def.requirementText, s)}`)
      break
    }
  }
  if (cost > s.focus) return no(`Needs ${cost} focus`)
  return { ok: true, cost }
}

export interface ActionResult {
  actionId: ActionId
  title: string
  icon: string
  text: string
  insight: string
  deltas: Delta[]
  concept: ConceptId
  newConcept: boolean
}

const KOPI_LINES = [
  '{x} talks about their weekend cycling at East Coast Park — then, unprompted, about what is really slowing the team down.',
  'Two kopi-c siew dai later, {x} admits they have been too polite to push back in the big meetings.',
  'You mostly listen. {x} notices — and says they wish more people did.',
  '{x} walks you through what their team is measured on this half. Suddenly a lot of their behaviour makes sense.',
  'You ask “what would make your week easier?” {x} has a list. You can fix two things on it by Friday.',
  '{x} shares the history of a failed launch three years ago. Half the org’s caution now has an origin story.',
]

const RISK_HINTS = [
  'Over kopi, {x} lowers their voice: “Can I tell you something that isn’t in any status report?”',
  '{x} hesitates, then mentions something that has been keeping them up at night.',
]

/** Apply one action. Pure: returns a new state and a result for the UI. */
export function performAction(state: GameState, id: ActionId, target?: ActionTarget): { state: GameState; result: ActionResult } {
  const av = availability(state, id, target)
  if (!av.ok) throw new Error(`Action ${id} unavailable: ${av.reason}`)
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const sc = getScenario(s.scenarioId)
  const def = ACTIONS[id]
  s.focus -= av.cost
  changeMeter(s, 'energy', -av.cost * 2, [])
  const deltas: Delta[] = []
  let title = def.name
  let text = ''
  let insight = def.tip
  let concept = def.concept

  switch (id) {
    case 'kopi': {
      const role = target as Role
      const c = sc.cast[role]
      title = `Kopi with ${c.short}`
      changeRel(s, role, s.rel[role] >= 80 ? 3 : 6, deltas)
      if (role === 'sponsor' || role === 'boss') changeMeter(s, 'trust', 1, deltas)
      const hasHidden = sc.risks.some((r) => r.owner === role && s.risks[r.id] === 'hidden')
      if (hasHidden && rng.chance(0.55)) {
        text = rng.pick(RISK_HINTS).replace('{x}', c.short)
        revealHidden(s, 1, rng, deltas, role)
        insight = 'Hidden risks live in people’s heads. Regular 1:1s are your best early-warning system.'
      } else {
        text = rng.pick(KOPI_LINES).replace('{x}', c.short)
      }
      addSkill(s, 'stakeholder', 1)
      s.counters.kopi++
      s.cooldowns[`kopi:${role}`] = s.day
      break
    }
    case 'riskReview': {
      const found = revealHidden(s, 2, rng, deltas)
      if (found.length === 0) {
        text = 'The team stress-tests the plan for 45 minutes. Nothing new surfaces — your RAID log is in good shape.'
        changeMeter(s, 'quality', 1, deltas)
      } else {
        text = `You run a 45-minute pre-mortem: “It’s launch day and we failed. Why?” ${found.length === 1 ? 'A risk nobody had written down surfaces.' : 'Two risks nobody had written down surface.'}`
      }
      addSkill(s, 'risk', 2)
      s.counters.riskReviews++
      s.cooldowns.riskReview = s.day
      break
    }
    case 'update': {
      const n = updatesThisWeek(s)
      changeMeter(s, 'trust', n === 0 ? 3 : 1, deltas)
      changeRel(s, 'sponsor', 2, deltas)
      text =
        n === 0
          ? 'Five bullets: what moved, what’s at risk, what you need. Your sponsor replies with a 👍 within minutes.'
          : 'A second update this week. Useful — but the replies are getting shorter.'
      addSkill(s, 'comms', 1)
      s.cooldowns[`update:w${week(s.day)}`] = n + 1
      break
    }
    case 'teamLunch': {
      changeMeter(s, 'budget', -LUNCH_COST, deltas)
      changeMeter(s, 'morale', 5, deltas)
      changeRel(s, 'lead', 2, deltas)
      changeRel(s, 'partner', 2, deltas)
      text = 'Sambal kangkong, cereal prawns and the first honest conversation about the deadline. Worth every cent.'
      addSkill(s, 'leadership', 1)
      s.cooldowns.teamLunch = s.day
      break
    }
    case 'celebrate': {
      const best = (['core', 'client', 'platform', 'data', 'review'] as WsRole[]).reduce((a, b) =>
        s.ws[b].done / s.ws[b].work > s.ws[a].done / s.ws[a].work ? b : a,
      )
      const owner = sc.workstreams.find((w) => w.role === best)!.owner
      changeMeter(s, 'morale', 3, deltas)
      changeRel(s, owner, 4, deltas)
      text = `You call out ${wsName(s, best)}’s progress in the company channel — naming the people and what they did. ${sc.cast[owner].short} forwards it to their whole team.`
      addSkill(s, 'leadership', 1)
      s.cooldowns.celebrate = s.day
      break
    }
    case 'focusTime': {
      s.modifiers.push({ ws: 'all', mult: 1.12, untilDay: s.day + 1, label: 'Focus time' })
      deltas.push({ icon: '🚀', label: 'Focus time · All teams ×1.12 for 2d', good: true })
      changeMeter(s, 'morale', 2, deltas)
      changeRel(s, 'pm', -2, deltas)
      text = 'You cancel four status syncs and answer the questions in writing yourself. The team gets two quiet days to build.'
      addSkill(s, 'execution', 1)
      s.cooldowns.focusTime = s.day
      break
    }
    case 'overtime': {
      s.focus += 2
      deltas.push({ icon: '⚡', label: 'Focus today', value: 2, good: true })
      changeMeter(s, 'energy', -15, deltas)
      s.flags['sys:overtime-today'] = true
      s.counters.overtime++
      s.cooldowns.overtime = s.day
      text = 'You order supper to your desk and keep going. The office cleaner says goodnight at 11pm.'
      break
    }
    case 'rebaseline': {
      const warned = !!s.flags['sys:decision-asked'] || s.statusReports.some((r) => r.input.overall !== 'green' && !r.watermelon)
      s.targetDay += 3
      deltas.push({ icon: '📅', label: `Target moved to Day ${s.targetDay}`, good: false })
      changeMeter(s, 'trust', warned ? -5 : -10, deltas)
      changeMeter(s, 'morale', 5, deltas)
      s.flags['sys:rebaselined'] = true
      text = warned
        ? 'Because you flagged the slip early, the conversation is calm. “Thanks for the heads-up. Make Day ' + s.targetDay + ' stick.”'
        : '“Why am I only hearing this now?” The new date is approved, but the room is cold.'
      insight = warned
        ? 'Early warning turns a re-plan into a decision instead of a crisis. That is what honest RAG reporting buys you.'
        : 'Re-baselining without prior warning costs double. Signal slips in your status reports before you need the new date.'
      addSkill(s, 'stakeholder', 1)
      break
    }
    case 'contractor': {
      const ws = target as WsRole
      changeMeter(s, 'budget', -CONTRACTOR_COST, deltas)
      s.modifiers.push({ ws, mult: 0.8, fromDay: s.day, untilDay: s.day + 1, label: 'Onboarding contractors' })
      s.modifiers.push({ ws, mult: 1.2, fromDay: s.day + 2, untilDay: 99, label: 'Contractors ramped up' })
      deltas.push({ icon: '🐢', label: `${wsName(s, ws)} ×0.8 while onboarding`, good: false })
      deltas.push({ icon: '🚀', label: `${wsName(s, ws)} ×1.2 from Day ${s.day + 2}`, good: true })
      changeMeter(s, 'morale', -2, deltas)
      changeMeter(s, 'quality', -3, deltas)
      s.flags['sys:contractor'] = true
      text = 'Two contractors start tomorrow. Someone has to give them laptops, access, and a codebase tour — that someone is your busiest engineer.'
      addSkill(s, 'execution', 1)
      break
    }
    case 'codeIt': {
      const ws = target as WsRole
      addProgress(s, ws, 5, deltas)
      changeMeter(s, 'quality', -2, deltas)
      changeMeter(s, 'trust', -2, deltas)
      changeRel(s, 'lead', -3, deltas)
      changeMeter(s, 'energy', -6, deltas)
      s.flags['sys:coded'] = true
      s.counters.codeIt++
      title = `You code on ${wsName(s, ws)}`
      text =
        s.counters.codeIt === 1
          ? 'Headphones on. You close two tickets and it feels amazing. Meanwhile, five Slack threads and a dependency question went unanswered.'
          : 'Again? The team has started waiting for you to review “your” code before merging theirs.'
      insight = 'It feels productive, but you are now the most expensive engineer on the team — and nobody is doing your job. Unblock ten engineers instead of being one.'
      addSkill(s, 'technical', 1)
      break
    }
    case 'descope': {
      const ws = target as WsRole
      applyEffects(s, { scope: { [ws]: -15 } }, rng).forEach((d) => deltas.push(d))
      changeMeter(s, 'trust', -3, deltas)
      changeRel(s, 'pm', -6, deltas)
      changeMeter(s, 'morale', 2, deltas)
      s.counters.descopes++
      s.cooldowns[`descope:${ws}`] = s.day
      text = `You and ${sc.cast.pm.short} go through ${wsName(s, ws)} line by line. Three nice-to-haves move to a fast-follow release. ${sc.cast.pm.short} is not thrilled, but agrees the MVP still solves the customer problem.`
      addSkill(s, 'stakeholder', 1)
      break
    }
    case 'facilitate': {
      const ws = target as WsRole
      const owner = sc.workstreams.find((w) => w.role === ws)!.owner
      const p = Math.max(0.15, Math.min(0.95, 0.6 + (s.rel[owner] - 50) / 100))
      if (rng.chance(p)) {
        unblock(s, ws, deltas)
        changeRel(s, owner, 3, deltas)
        text = `You book 45 minutes with one agenda item: “Decide X. ${sc.cast[owner].short} decides; others advise.” It is decided in 30.`
        addSkill(s, 'leadership', 2)
      } else {
        s.ws[ws].blockedDays = Math.max(1, s.ws[ws].blockedDays - 1)
        text = 'Good discussion, no decision — two people still need to check with their managers. You schedule a follow-up for tomorrow.'
        insight = 'If a meeting ends without a decision, the decider was not in the room. Check your RACI before the next one.'
        addSkill(s, 'leadership', 1)
      }
      break
    }
    case 'escalate': {
      const ws = target as WsRole
      const n = s.counters.escalations
      unblock(s, ws, deltas)
      changeMeter(s, 'trust', n === 0 ? -2 : n === 1 ? -5 : -8, deltas)
      changeRel(s, 'partner', -6, deltas)
      const owner = sc.workstreams.find((w) => w.role === ws)!.owner
      if (owner !== 'partner') changeRel(s, owner, -3, deltas)
      s.counters.escalations++
      s.flags['sys:escalated'] = true
      text =
        n === 0
          ? `${sc.cast.sponsor.short} makes one phone call and the blocker evaporates. ${sc.cast.partner.short} is cooler with you at the next standup.`
          : n === 1
            ? `It works again — but ${sc.cast.sponsor.short} asks, “Is there a reason you can’t sort these out with the teams directly?”`
            : `${sc.cast.sponsor.short} unblocks it with a sigh. Word is getting around that you escalate everything.`
      addSkill(s, 'stakeholder', 1)
      break
    }
    case 'mitigate': {
      const risk = getRisk(sc, String(target))!
      s.risks[risk.id] = 'mitigated'
      deltas.push({ icon: '🛡️', label: `Mitigated: ${risk.title}`, good: true })
      applyEffects(s, risk.mitigation.effects, rng).forEach((d) => deltas.push(d))
      title = risk.mitigation.label
      text = risk.mitigation.text
      addSkill(s, 'risk', 2)
      break
    }
    case 'readiness': {
      const rd = READINESS_BY_KEY[target as ReadinessKey]
      s.readiness[rd.key] = true
      deltas.push({ icon: '✅', label: rd.name, good: true })
      title = rd.name
      concept = rd.concept
      if (rd.discovery && rng.chance(rd.discovery.chance)) {
        text = rd.discovery.text
        applyEffects(s, rd.discovery.effects, rng).forEach((d) => deltas.push(d))
        insight = 'Readiness work that finds problems is working. Every issue found in rehearsal is one your customers never see.'
      } else {
        text = `${sc.cast[rd.owner].short} confirms: ${rd.description.charAt(0).toLowerCase()}${rd.description.slice(1)}`
      }
      addSkill(s, 'execution', 2)
      break
    }
  }

  const newConcept = meetConcept(s, concept)
  s.rng = rng.state()
  return {
    state: s,
    result: { actionId: id, title: fill(title, s), icon: def.icon, text: fill(text, s), insight: fill(insight, s), deltas, concept, newConcept },
  }
}
