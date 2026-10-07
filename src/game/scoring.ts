import { completion } from './schedule'
import type { GameState, SkillKey } from './types'
import { ROLES } from './validate'

export type LetterGrade = 'S' | 'A' | 'B' | 'C' | 'D'

export interface ScoreLine {
  key: string
  label: string
  icon: string
  score: number
  max: number
  note: string
}

export interface FinalScore {
  total: number
  grade: LetterGrade
  rating: string
  ratingNum: number
  bonusMonths: number
  headline: string
  lines: ScoreLine[]
  launchDelay: number
  completion: number
  bestPct: number
  decisions: { best: number; okay: number; poor: number; ignored: number }
}

const GRADES: { min: number; grade: LetterGrade; rating: string; num: number; bonus: number; headline: string }[] = [
  { min: 88, grade: 'S', rating: 'Outstanding', num: 5, bonus: 4, headline: 'Promotion packet material. The sponsor asks for you by name on the next program.' },
  { min: 76, grade: 'A', rating: 'Exceeds Expectations', num: 4, bonus: 3, headline: 'A strong program, landed well. You are clearly operating as a TPM now.' },
  { min: 62, grade: 'B', rating: 'Meets Expectations', num: 3, bonus: 2, headline: 'Solid delivery with some scar tissue. Every TPM has a program like this.' },
  { min: 48, grade: 'C', rating: 'Partially Meets', num: 2, bonus: 1, headline: 'It shipped, but it hurt. Your manager books a long 1:1 to talk about “growth areas”.' },
  { min: 0, grade: 'D', rating: 'Does Not Meet', num: 1, bonus: 0, headline: 'A rough one. The good news: every lesson below is one you will never have to learn twice.' },
]

const r1 = (n: number) => Math.round(n * 10) / 10

export function finalScore(s: GameState): FinalScore {
  const fired = s.ending === 'fired'
  const done = completion(s.ws)
  const launchDay = s.launch?.day ?? s.day
  const delay = launchDay - s.originalTargetDay

  // Delivery (30): on time, scope, launch quality.
  let onTime = 0
  if (!fired) onTime = delay <= 0 ? 12 : delay <= 2 ? 8 : delay <= 5 ? 4 : 0
  const scope = fired ? 0 : done * 10
  const tier = s.launch?.tier
  const launchPts = fired || !tier ? 0 : tier === 'smooth' ? 8 : tier === 'bumpy' ? 4 : 0

  const avgRel = ROLES.reduce((a, r) => a + s.rel[r], 0) / ROLES.length
  const stakeholders = s.meters.trust * 0.14 + avgRel * 0.06
  const team = s.meters.morale * 0.15
  const quality = s.meters.quality * 0.1
  const budget = s.meters.budget >= 0 ? 5 : Math.max(0, 5 + s.meters.budget / 10)

  const decisions = { best: 0, okay: 0, poor: 0, ignored: 0 }
  for (const d of s.log) {
    if (d.ignored) decisions.ignored++
    else decisions[d.grade]++
  }
  const total = s.log.length
  const bestPct = total ? (decisions.best + decisions.okay * 0.4) / total : 0
  const judgement = bestPct * 20

  const lines: ScoreLine[] = [
    {
      key: 'delivery',
      label: 'Delivery',
      icon: '🚀',
      score: r1(onTime + scope + launchPts),
      max: 30,
      note: fired
        ? 'Replaced before launch.'
        : `${delay <= 0 ? 'On time' : `${delay} day${delay > 1 ? 's' : ''} late`} · ${Math.round(done * 100)}% scope · ${tier === 'smooth' ? 'clean launch' : tier === 'bumpy' ? 'bumpy launch' : 'Sev-1 launch'}`,
    },
    { key: 'stakeholders', label: 'Stakeholders', icon: '🤝', score: r1(stakeholders), max: 20, note: `Trust ${Math.round(s.meters.trust)} · avg relationship ${Math.round(avgRel)}` },
    { key: 'judgement', label: 'Judgement', icon: '🧠', score: r1(judgement), max: 20, note: `${decisions.best} best · ${decisions.okay} okay · ${decisions.poor} poor · ${decisions.ignored} ignored` },
    { key: 'team', label: 'Team health', icon: '😊', score: r1(team), max: 15, note: `Morale ${Math.round(s.meters.morale)}` },
    { key: 'quality', label: 'Quality', icon: '🧱', score: r1(quality), max: 10, note: `Quality ${Math.round(s.meters.quality)}` },
    { key: 'budget', label: 'Budget', icon: '💰', score: r1(budget), max: 5, note: s.meters.budget >= 0 ? `S$${Math.round(s.meters.budget)}k contingency left` : `S$${Math.round(-s.meters.budget)}k over budget` },
  ]
  const sum = Math.round(lines.reduce((a, l) => a + l.score, 0))
  const g = fired ? GRADES[GRADES.length - 1] : GRADES.find((x) => sum >= x.min)!
  return {
    total: sum,
    grade: g.grade,
    rating: g.rating,
    ratingNum: g.num,
    bonusMonths: g.bonus,
    headline: fired ? 'Thank you for your contribution. The sponsor has asked another TPM to take over the program.' : g.headline,
    lines,
    launchDelay: delay,
    completion: done,
    bestPct,
    decisions,
  }
}

/** Skill levels normalised 0–100 for the radar chart. */
export function skillProfile(s: GameState): Record<SkillKey, number> {
  const out = {} as Record<SkillKey, number>
  for (const [k, v] of Object.entries(s.skills)) out[k as SkillKey] = Math.min(100, Math.round((v / 24) * 100))
  return out
}
