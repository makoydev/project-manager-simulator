import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import type { Delta } from '../../../game/effects'
import { INCIDENT_OPTIONS } from '../../../game/launch'
import type { LaunchResult } from '../../../game/types'
import { confetti } from '../../../lib/confetti'
import { cx } from '../../../lib/cx'
import { play } from '../../../lib/sfx'
import { useGame } from '../../../store/game'
import { DeltaChips } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { GradeStamp } from '../EventModal'
import { useRun, useScenario } from '../hooks'

type Stage = { label: string; err: number }

/** Build the rollout stations and the error rate the dashboards will show at each. */
function plan(result: LaunchResult): { stages: Stage[]; incidentAt: number | null } {
  const phased = result.mode === 'phased'
  const labels = phased ? ['Deploy', '1%', '10%', '50%', '100%'] : ['Deploy', '100%']
  const base = labels.map((label) => ({ label, err: 0.3 + Math.random() * 0.4 }))
  if (result.caughtInCanary) {
    base[1].err = 6
    return { stages: base, incidentAt: null }
  }
  if (result.tier === 'smooth') return { stages: base, incidentAt: null }
  const at = phased ? 3 : 1
  base[at].err = result.tier === 'sev1' ? 18 : 7
  return { stages: base.slice(0, at + 1), incidentAt: at }
}

export function LaunchModal({ result, deltas }: { result: LaunchResult; deltas: Delta[] }) {
  const g = useRun()
  const sc = useScenario()
  const incident = useGame((s) => s.incident)
  const finish = useGame((s) => s.finish)
  const reduce = useReducedMotion()
  const { stages, incidentAt } = useMemo(() => plan(result), [result])
  const [step, setStep] = useState(reduce ? stages.length - 1 : 0)
  const rolling = step < stages.length - 1
  const incidentNow = incidentAt !== null && step >= incidentAt
  const needsResponse = g.phase === 'launch' && !result.incidentChoice
  const chosen = INCIDENT_OPTIONS.find((o) => o.id === result.incidentChoice)
  const done = !rolling && !needsResponse

  useEffect(() => {
    if (!rolling) return
    const id = window.setTimeout(() => {
      setStep((s) => s + 1)
      play(stages[step + 1]?.err > 5 ? 'alarm' : 'tick')
    }, 900)
    return () => window.clearTimeout(id)
  }, [step, rolling, stages])

  useEffect(() => {
    if (!rolling && result.tier === 'smooth') {
      play('good')
      confetti()
      const id = window.setTimeout(() => confetti({ x: window.innerWidth * 0.25, count: 80 }), 400)
      return () => window.clearTimeout(id)
    }
  }, [rolling, result.tier])

  const pts = stages.slice(0, step + 1).map((s, i) => [20 + (i / Math.max(1, stages.length - 1)) * 260, 80 - Math.min(70, s.err * 3.6)] as const)

  return (
    <Modal label="Launch" size="lg">
      <motion.div
        className="p-5 sm:p-7"
        animate={incidentNow && !reduce ? { backgroundColor: ['rgba(208,59,59,0)', 'rgba(208,59,59,0.12)', 'rgba(208,59,59,0)'] } : {}}
        transition={{ repeat: needsResponse ? Infinity : 0, duration: 1.2 }}
      >
        <p className="eyebrow">Day {result.day} · {result.mode === 'phased' ? 'phased rollout' : 'full launch'}</p>
        <h2 className="mt-1 font-display text-[clamp(22px,3vw,28px)] font-bold">
          {rolling ? `Rolling out ${sc.product}…` : incidentAt !== null ? '🚨 Incident!' : `${sc.product} is live 🚀`}
        </h2>

        {/* Rollout line: stations from deploy to 100% */}
        <div className="relative mt-6 h-12">
          <div className="absolute top-1/2 right-4 left-4 h-2 -translate-y-1/2 rounded-full bg-surface-3" />
          <motion.div
            className={cx('absolute top-1/2 left-4 h-2 -translate-y-1/2 rounded-full', incidentNow ? 'bg-bad' : 'bg-accent')}
            animate={{ width: `calc((100% - 2rem) * ${step / Math.max(1, (incidentAt === null ? stages.length : stages.length) - 1)})` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          {stages.map((s, i) => {
            const left = `calc(1rem + (100% - 2rem) * ${i / Math.max(1, stages.length - 1)})`
            const reached = i <= step
            return (
              <div key={s.label} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ left }}>
                <motion.span
                  animate={{ scale: i === step ? 1.25 : 1 }}
                  className={cx(
                    'block h-5 w-5 rounded-full border-4 bg-surface',
                    reached ? (incidentAt === i ? 'border-bad' : 'border-accent') : 'border-line-strong',
                  )}
                />
                <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[11px] font-semibold whitespace-nowrap">{s.label}</span>
              </div>
            )
          })}
        </div>

        {/* Error-rate trace */}
        <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-3">
          <div className="flex items-center justify-between text-[11.5px] text-muted">
            <span>Error rate · 5xx %</span>
            <span className="font-mono font-semibold text-ink">{stages[Math.min(step, stages.length - 1)].err.toFixed(1)}%</span>
          </div>
          <svg viewBox="0 0 300 90" className="mt-1 w-full" aria-hidden>
            <line x1={20} x2={280} y1={80 - 2 * 3.6} y2={80 - 2 * 3.6} stroke="var(--line-strong)" strokeWidth={1} />
            <text x={278} y={80 - 2 * 3.6 - 3} fontSize={8} textAnchor="end" fill="var(--muted)">
              alert threshold 2%
            </text>
            <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={incidentNow ? 'var(--bad)' : 'var(--ink)'} strokeWidth={2} strokeLinejoin="round" />
            {pts.length > 0 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={incidentNow ? 'var(--bad)' : 'var(--ink)'} stroke="var(--surface)" strokeWidth={2} />}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {!rolling && needsResponse && (
            <motion.div key="respond" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5">
              <p className="rounded-xl bg-bad-soft px-3 py-2 text-[14px] font-semibold text-bad-ink">
                {result.tier === 'sev1' ? 'Sev-1: customers are failing at checkout and social media has noticed.' : 'Sev-2: errors above threshold for a slice of users.'} Everyone is
                looking at you. What do you do in the first five minutes?
              </p>
              <ul className="mt-3 space-y-2">
                {INCIDENT_OPTIONS.map((o) => (
                  <li key={o.id}>
                    <motion.button
                      type="button"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => incident(o.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border-2 border-line bg-surface p-3.5 text-left hover:border-accent"
                    >
                      <span className="text-xl" aria-hidden>
                        {o.icon}
                      </span>
                      <span className="text-[14px] font-semibold">{o.label}</span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {done && (
            <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
              {chosen && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13.5px] font-semibold">
                      {chosen.icon} {chosen.label}
                    </p>
                    <GradeStamp grade={chosen.grade} />
                  </div>
                  <p className="mt-2 rounded-2xl border border-accent/30 bg-accent-soft p-3 text-[13.5px]">
                    <b className="text-accent">☕ Mentor’s take ·</b> {chosen.insight}
                  </p>
                </div>
              )}
              <ul className="space-y-1.5">
                {result.notes.map((n, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className={cx(
                      'rounded-xl px-3 py-2 text-[13.5px]',
                      n.tone === 'good' ? 'bg-good-soft text-good-ink' : n.tone === 'bad' ? 'bg-bad-soft text-bad-ink' : 'bg-surface-2 text-ink-2',
                    )}
                  >
                    {n.text}
                  </motion.li>
                ))}
              </ul>
              <DeltaChips deltas={deltas} delay={0.3} />
              <div className="flex justify-end pt-2">
                <Button variant="primary" size="lg" onClick={finish} sound="ping">
                  Open your performance review →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  )
}
