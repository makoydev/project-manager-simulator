import { BACKGROUNDS } from './backgrounds'
import { getScenario, SCENARIOS } from './content'
import type { FinalScore } from './scoring'
import type { GameState, ScenarioId } from './types'

export interface AchievementDef {
  id: string
  name: string
  icon: string
  description: string
  /** Shame achievements are funny, not shameful. They still teach. */
  shame?: boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-day', name: 'Day One Done', icon: '🌅', description: 'Survive your first day as a TPM.' },
  { id: 'ship-it', name: 'Ship It, Lah!', icon: '🚀', description: 'Launch a program.' },
  { id: 'clean-launch', name: 'Zero Drama', icon: '🧘', description: 'Launch with no incident at all.' },
  { id: 'on-time', name: 'Like Clockwork', icon: '⏱️', description: 'Launch on or before the original target day.' },
  { id: 'canary', name: 'Canary in the Coal Mine', icon: '🐤', description: 'Launch with a phased rollout behind feature flags.' },
  { id: 'courage', name: 'The Courage to Say No', icon: '✋', description: 'Call a No-Go, then launch cleanly.' },
  { id: 'honest-broker', name: 'Honest Broker', icon: '⚖️', description: 'File 2 status reports with exactly the right overall RAG.' },
  { id: 'rag-to-riches', name: 'RAG to Riches', icon: '🟢', description: 'Report Red honestly, then finish with an A or better.' },
  { id: 'watermelon', name: 'Watermelon Farmer', icon: '🍉', description: 'Report green while the program was actually red inside.', shame: true },
  { id: 'kopi-diplomat', name: 'Kopi Diplomat', icon: '☕', description: 'Have 8 kopi chats in one program.' },
  { id: 'risk-radar', name: 'Risk Radar', icon: '📡', description: 'Uncover every hidden risk before it materialises.' },
  { id: 'no-surprises', name: 'No Surprises', icon: '🛡️', description: 'Finish a program where no unmitigated risk ever fired.' },
  { id: 'hands-off', name: 'Hands Off the Keyboard', icon: '🙌', description: 'Finish as a Builder or Hybrid without writing code yourself.' },
  { id: 'old-habits', name: 'Old Habits Die Hard', icon: '⌨️', description: 'Write the code yourself 3 times in one program.', shame: true },
  { id: 'diplomat', name: 'Peer-to-Peer', icon: '🤝', description: 'Launch without escalating a single blocker.' },
  { id: 'escalator', name: 'Escalator Operator', icon: '🛗', description: 'Escalate 3 times in one program.', shame: true },
  { id: 'kopi-o-kosong', name: 'Running on Kopi-O Kosong', icon: '🫗', description: 'Burn out and take an MC day.', shame: true },
  { id: 'steady', name: 'Steady Lah', icon: '😎', description: 'Finish with team morale of 80 or more.' },
  { id: 'trusted', name: 'Trusted Advisor', icon: '🏅', description: 'Finish with stakeholder trust of 85 or more.' },
  { id: 'inbox-zero', name: 'Inbox Zero Hero', icon: '📭', description: 'Finish a program without letting a single message expire.' },
  { id: 'fired', name: 'Thank You for Your Contribution', icon: '📦', description: 'Get replaced as TPM. It happens to the best of us.', shame: true },
  { id: 'grade-s', name: 'Outstanding', icon: '🏆', description: 'Earn an S rating in your performance review.' },
  { id: 'bank-survivor', name: 'Merlion Tamer', icon: '🦁', description: 'Launch Project Merlion at Lion City Bank.' },
  { id: 'open-season', name: 'Open Enrollment Hero', icon: '🩺', description: 'Launch Tamarind’s spending accounts before the plan year starts.' },
  { id: 'client-whisperer', name: 'Client Whisperer', icon: '🏔️', description: 'Launch for Alpenrose Private Bank as the vendor.' },
  { id: 'human-in-the-loop', name: 'Human in the Loop', icon: '🧑‍⚖️', description: 'Roll out governed AI tools at Orchid Digital Bank.' },
  { id: 'regional', name: 'Regional Head Material', icon: '🌏', description: 'Launch every program.' },
  { id: 'scholar', name: 'Walking PMBOK', icon: '📚', description: 'Unlock every Field Guide entry.' },
  { id: 'interview-ready', name: 'Offer Letter', icon: '✉️', description: 'Score 8+ correct in one Interview Arcade round.' },
]

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<string, AchievementDef>

/** Achievements earned by the live state of a run (checked after every move). */
export function liveAchievements(s: GameState): string[] {
  const out: string[] = []
  if (s.day >= 2 || s.history.length > 1) out.push('first-day')
  if (s.counters.watermelons > 0) out.push('watermelon')
  if (s.counters.accurateReports >= 2) out.push('honest-broker')
  if (s.counters.kopi >= 8) out.push('kopi-diplomat')
  if (s.counters.codeIt >= 3) out.push('old-habits')
  if (s.counters.escalations >= 3) out.push('escalator')
  if (s.counters.burnouts > 0) out.push('kopi-o-kosong')
  const sc = getScenario(s.scenarioId)
  const hiddenAtStart = sc.risks.filter((r) => r.initial === 'hidden')
  if (hiddenAtStart.length && hiddenAtStart.every((r) => s.risks[r.id] === 'open' || s.risks[r.id] === 'mitigated')) out.push('risk-radar')
  return out
}

/** Achievements earned at the end of a run. `completed` are scenarios launched across all runs, including this one. */
export function endAchievements(s: GameState, score: FinalScore, completed: ScenarioId[]): string[] {
  const out = liveAchievements(s)
  if (s.ending === 'fired') return [...out, 'fired']
  const l = s.launch
  if (!l) return out
  out.push('ship-it')
  if (l.tier === 'smooth' && !l.caughtInCanary) out.push('clean-launch')
  if (l.day <= s.originalTargetDay) out.push('on-time')
  if (l.mode === 'phased') out.push('canary')
  if (s.counters.noGos > 0 && l.tier === 'smooth') out.push('courage')
  if (s.statusReports.some((r) => r.truth.overall === 'red' && r.input.overall === 'red') && (score.grade === 'A' || score.grade === 'S'))
    out.push('rag-to-riches')
  if (s.counters.risksFiredUnmitigated === 0) out.push('no-surprises')
  if (BACKGROUNDS[s.background].canCode && s.counters.codeIt === 0) out.push('hands-off')
  if (s.counters.escalations === 0) out.push('diplomat')
  if (s.meters.morale >= 80) out.push('steady')
  if (s.meters.trust >= 85) out.push('trusted')
  if (s.counters.ignored === 0) out.push('inbox-zero')
  if (score.grade === 'S') out.push('grade-s')
  const launched: Partial<Record<ScenarioId, string>> = { lioncity: 'bank-survivor', tamarind: 'open-season', alpenrose: 'client-whisperer', orchid: 'human-in-the-loop' }
  const named = launched[s.scenarioId]
  if (named) out.push(named)
  if (SCENARIOS.every((sc) => completed.includes(sc.id))) out.push('regional')
  return out
}
