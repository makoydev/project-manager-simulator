import { getScenario } from './content'
import { applyEffects, changeMeter, changeRel, unblock, wsName, type Delta } from './effects'
import { makeRng } from './rng'
import { WS_ROLES } from './schedule'
import { grantXp, logDecision, meetConcept, projectionOf, week } from './state'
import type { AskId, Effects, GameState, Grade, Rag, StatusReportInput, StatusReportResult, WsRole } from './types'

const LEVEL: Record<Rag, number> = { green: 0, amber: 1, red: 2 }
export const RAG_LABEL: Record<Rag, string> = { green: 'Green', amber: 'Amber', red: 'Red' }

export interface Truth {
  overall: Rag
  ws: Record<WsRole, Rag>
  reasons: Record<WsRole, string>
  overallReason: string
  projected: number | null
}

/**
 * The objective RAG status, by the rules shown to the player:
 * Red   — projected > 2 days late, or blocked for 3+ more days.
 * Amber — projected 1–2 days late, blocked, or carrying an open high-exposure risk (L×I ≥ 12).
 * Green — otherwise.
 */
export function truthRag(s: GameState): Truth {
  const sc = getScenario(s.scenarioId)
  const p = projectionOf(s)
  const ws = {} as Record<WsRole, Rag>
  const reasons = {} as Record<WsRole, string>
  for (const r of WS_ROLES) {
    const w = s.ws[r]
    const finish = p.finish[r]
    const late = finish === null ? 99 : finish - s.targetDay
    const hot = sc.risks.find((k) => k.ws === r && s.risks[k.id] === 'open' && k.likelihood * k.impact >= 12)
    if (w.done >= w.work) {
      ws[r] = 'green'
      reasons[r] = 'Complete'
    } else if (w.blockedDays >= 3) {
      ws[r] = 'red'
      reasons[r] = `Blocked for ${w.blockedDays} more days`
    } else if (late > 2) {
      ws[r] = 'red'
      reasons[r] = finish === null ? 'No credible finish date' : `Projected Day ${finish} — ${late} days late`
    } else if (w.blockedDays > 0) {
      ws[r] = 'amber'
      reasons[r] = `Blocked (${w.blockReason ?? 'waiting'})`
    } else if (late > 0) {
      ws[r] = 'amber'
      reasons[r] = `Projected Day ${finish} — ${late} day${late > 1 ? 's' : ''} late`
    } else if (hot) {
      ws[r] = 'amber'
      reasons[r] = `High-exposure risk: ${hot.title}`
    } else {
      ws[r] = 'green'
      reasons[r] = finish === null ? 'On track' : `Projected Day ${finish}`
    }
  }
  const launch = p.launchDay
  const lateAll = launch === null ? 99 : launch - s.targetDay
  let overall: Rag = 'green'
  let overallReason = launch === null ? 'On track' : `Projected launch Day ${launch} vs target Day ${s.targetDay}`
  if (WS_ROLES.some((r) => ws[r] === 'red') || lateAll > 2) overall = 'red'
  else if (WS_ROLES.some((r) => ws[r] === 'amber') || lateAll > 0) overall = 'amber'
  if (launch === null) overallReason = 'No credible launch date at current pace'
  return { overall, ws, reasons, overallReason, projected: launch }
}

export function statusReportDue(s: GameState): boolean {
  return s.phase === 'day' && s.day % 5 === 0 && s.day !== s.targetDay && !s.statusReports.some((r) => r.day === s.day)
}

/** Open risks sorted by exposure, highest first — candidates for "top risk". */
export function reportableRisks(s: GameState) {
  const sc = getScenario(s.scenarioId)
  return sc.risks
    .filter((r) => s.risks[r.id] === 'open' || s.risks[r.id] === 'mitigated')
    .sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact)
}

export const ASKS: Record<AskId, { label: string; hint: string }> = {
  none: { label: 'No asks this week', hint: 'Everything is under control.' },
  unblock: { label: 'Help unblocking a dependency', hint: 'Ask the sponsor to clear a blocker.' },
  decision: { label: 'A decision on scope or date', hint: 'Flag the trade-off early so they can decide.' },
  headcount: { label: 'Extra budget / headcount', hint: 'Ask for more resources.' },
  recognition: { label: 'Recognition for the team', hint: 'Ask the sponsor to thank the team publicly.' },
}

export function submitStatusReport(state: GameState, input: StatusReportInput): { state: GameState; result: StatusReportResult; deltas: Delta[] } {
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const sc = getScenario(s.scenarioId)
  const truth = truthRag(s)
  const feedback: StatusReportResult['feedback'] = []
  const deltas: Delta[] = []
  let score = 0

  for (const r of WS_ROLES) {
    const diff = LEVEL[truth.ws[r]] - LEVEL[input.ws[r]]
    const name = wsName(s, r)
    if (diff === 0) score += 1
    else if (diff > 0) {
      score -= 1.5 * diff
      feedback.push({ tone: 'bad', text: `🍉 ${name}: you said ${RAG_LABEL[input.ws[r]]}, reality is ${RAG_LABEL[truth.ws[r]]} — ${truth.reasons[r]}.` })
    } else {
      score -= 0.5
      feedback.push({ tone: 'neutral', text: `${name}: more pessimistic than the data (${truth.reasons[r]}). Crying wolf erodes urgency.` })
    }
  }

  const overallDiff = LEVEL[truth.overall] - LEVEL[input.overall]
  const watermelon = overallDiff > 0
  if (overallDiff === 0) {
    score += 3
    feedback.unshift({ tone: 'good', text: `Overall ${RAG_LABEL[truth.overall]} matches reality. ${truth.overallReason}.` })
  } else if (watermelon) {
    score -= 4 * overallDiff
    feedback.unshift({ tone: 'bad', text: `Watermelon report: green outside, red inside. Reality is ${RAG_LABEL[truth.overall]} — ${truth.overallReason}. It will come out; the only question is when.` })
  } else {
    score -= 1.5
    feedback.unshift({ tone: 'neutral', text: `Overall reported worse than reality (${truth.overallReason}). Over-alarming makes execs stop listening.` })
  }

  // Top risk.
  const risks = reportableRisks(s).filter((r) => s.risks[r.id] === 'open')
  const top = risks[0]
  if (input.topRisk && top && input.topRisk === top.id) {
    score += 2
    feedback.push({ tone: 'good', text: `Top risk “${top.title}” is the highest exposure on your RAID log (${top.likelihood}×${top.impact}).` })
  } else if (input.topRisk) {
    const chosen = sc.risks.find((r) => r.id === input.topRisk)
    score += 0.5
    if (top) feedback.push({ tone: 'neutral', text: `“${chosen?.title}” matters, but “${top.title}” has higher exposure (${top.likelihood}×${top.impact}).` })
  } else if (top && top.likelihood * top.impact >= 9) {
    score -= 2
    feedback.push({ tone: 'bad', text: `You left out “${top.title}” (${top.likelihood}×${top.impact}). Risks you don’t report become surprises you have to explain.` })
  } else {
    score += 1
  }

  // The ask.
  const blocked = WS_ROLES.filter((r) => s.ws[r].blockedDays > 0).sort((a, b) => s.ws[b].blockedDays - s.ws[a].blockedDays)
  const late = truth.projected === null || truth.projected > s.targetDay
  switch (input.ask) {
    case 'unblock':
      if (blocked.length) {
        score += 2
        unblock(s, blocked[0], deltas)
        feedback.push({ tone: 'good', text: `${sc.cast.sponsor.short} clears the ${wsName(s, blocked[0])} blocker within the hour. Specific asks get specific help.` })
      } else {
        score -= 1
        feedback.push({ tone: 'neutral', text: 'You asked for unblocking help, but nothing is blocked. Vague asks train execs to skim.' })
      }
      break
    case 'decision':
      if (late) {
        score += 2
        s.flags['sys:decision-asked'] = true
        changeRel(s, 'sponsor', 3, deltas)
        feedback.push({ tone: 'good', text: 'Flagging the scope/date trade-off early lets the sponsor decide calmly instead of in a crisis.' })
      } else {
        score -= 1
        feedback.push({ tone: 'neutral', text: 'You asked for a decision, but you are on track. Save the ask for when you need it.' })
      }
      break
    case 'headcount':
      if (late) {
        score += 1
        changeMeter(s, 'budget', 25, deltas)
        feedback.push({ tone: 'good', text: `${sc.cast.sponsor.short} releases S$25k of contingency. Remember: people take time to ramp up.` })
      } else {
        score -= 1.5
        feedback.push({ tone: 'bad', text: 'Asking for headcount while on track reads as empire-building.' })
      }
      break
    case 'recognition':
      if (truth.overall !== 'red') {
        score += 1
        changeMeter(s, 'morale', 4, deltas)
        feedback.push({ tone: 'good', text: `${sc.cast.sponsor.short} thanks the team by name in the all-hands. Morale jumps.` })
      } else {
        score -= 1
        feedback.push({ tone: 'bad', text: 'Asking for applause while the program is red reads as tone-deaf.' })
      }
      break
    case 'none':
      if (truth.overall === 'green') score += 1
      else {
        score -= 2
        feedback.push({ tone: 'bad', text: `You’re ${RAG_LABEL[truth.overall]} and asking for nothing? Execs can only help if you tell them how.` })
      }
      break
  }

  // Last week's watermelon catches up with you.
  if (s.flags['sys:watermelon']) {
    if (!watermelon && truth.overall !== 'green') {
      score -= 4
      feedback.push({ tone: 'bad', text: '“Last week you said we were fine. What changed?” Honesty now is right — but last week’s optimism costs you.' })
      delete s.flags['sys:watermelon']
    } else if (watermelon) {
      score -= 2
      feedback.push({ tone: 'bad', text: 'Two watermelon reports in a row. The gap between your reports and reality is getting harder to hide.' })
    } else delete s.flags['sys:watermelon']
  }

  const trustDelta = Math.max(-12, Math.min(8, Math.round(score)))
  changeMeter(s, 'trust', trustDelta, deltas)
  if (watermelon) {
    s.flags['sys:watermelon'] = true
    s.counters.watermelons++
  } else if (overallDiff === 0) s.counters.accurateReports++

  const grade: Grade = score >= 7 ? 'best' : score >= 2 ? 'okay' : 'poor'
  grantXp(s, 'comms', grade)
  meetConcept(s, 'rag-status')
  meetConcept(s, 'status-report')
  logDecision(s, {
    eventId: `status-report-w${week(s.day)}`,
    title: `Week ${week(s.day)} status report`,
    choiceLabel: `Reported ${RAG_LABEL[input.overall]} (reality: ${RAG_LABEL[truth.overall]})`,
    grade,
    insight: watermelon
      ? 'Green-outside-red-inside reports feel safe this week and cost you your credibility next week. Report reality, with a recovery plan.'
      : 'Accurate RAG plus a clear top risk and a specific ask is what makes a status report worth reading.',
    concept: 'rag-status',
  })

  const result: StatusReportResult = {
    day: s.day,
    week: week(s.day),
    input,
    truth: { overall: truth.overall, ws: truth.ws },
    score,
    trustDelta,
    feedback,
    watermelon,
  }
  s.statusReports.push(result)
  s.rng = rng.state()
  return { state: s, result, deltas }
}

// ───────────────────────────── Sprint retro (Day 10) ─────────────────────────────

export interface RetroOption {
  id: string
  icon: string
  label: string
  grade: Grade
  effects: Effects
  insight: string
}

export const RETRO_OPTIONS: RetroOption[] = [
  {
    id: 'deadline',
    icon: '📢',
    label: 'Use the retro to remind everyone the launch date is non-negotiable',
    grade: 'poor',
    effects: { morale: -8, quality: -2 },
    insight: 'A retro is for the team to improve how it works, not a pressure channel. Turning it into a lecture guarantees nobody speaks up next time.',
  },
  {
    id: 'ci',
    icon: '🔧',
    label: 'Fix the flaky CI pipeline that eats 40 minutes a day',
    grade: 'best',
    effects: { velocity: { ws: 'all', mult: 1.1, days: 5, label: 'Faster CI' }, quality: 3 },
    insight: 'Pick one concrete, owned, measurable action. Removing a daily tax on every engineer compounds fast.',
  },
  {
    id: 'shoutouts',
    icon: '🙌',
    label: 'Start every standup with a shout-out',
    grade: 'okay',
    effects: { morale: 5 },
    insight: 'Nice for morale — but a retro action should fix a systemic problem. Pair appreciation with one real process fix.',
  },
  {
    id: 'reviews',
    icon: '👀',
    label: 'Agree a PR review SLA: first review within 4 working hours',
    grade: 'best',
    effects: { velocity: { ws: 'core', mult: 1.15, days: 5, label: 'Review SLA' }, morale: 2 },
    insight: 'Waiting for review is often the biggest hidden queue in a team. A working agreement the team owns beats any tool.',
  },
]

export function retroDue(s: GameState): boolean {
  return s.phase === 'day' && s.day === 10 && !s.retroDone
}

export function submitRetro(state: GameState, optionId: string): { state: GameState; deltas: Delta[]; option: RetroOption } {
  const s = structuredClone(state)
  const rng = makeRng(s.rng)
  const option = RETRO_OPTIONS.find((o) => o.id === optionId)
  if (!option) throw new Error(`Unknown retro option ${optionId}`)
  const deltas = applyEffects(s, option.effects, rng)
  s.retroDone = true
  grantXp(s, 'leadership', option.grade)
  meetConcept(s, 'agile-ceremonies')
  logDecision(s, {
    eventId: 'sprint-retro',
    title: 'Sprint 1 retrospective',
    choiceLabel: option.label,
    grade: option.grade,
    insight: option.insight,
    concept: 'agile-ceremonies',
  })
  s.rng = rng.state()
  return { state: s, deltas, option }
}
