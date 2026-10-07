import { motion } from 'motion/react'
import { canNoGo, goNoGoVotes, noGoSlip, problemChance, readyCount } from '../../../game/launch'
import { READINESS } from '../../../game/meta'
import { completion } from '../../../game/schedule'
import { cx } from '../../../lib/cx'
import { useGame } from '../../../store/game'
import { Avatar } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { useRun, useScenario } from '../hooks'

const VOTE = {
  go: { label: 'GO', cls: 'bg-good text-white' },
  concerns: { label: 'CONCERNS', cls: 'bg-warn text-[#3a2600]' },
  nogo: { label: 'NO-GO', cls: 'bg-bad text-white' },
}

/** Semicircle gauge for launch-day risk. */
function Gauge({ value }: { value: number }) {
  const angle = -90 + value * 180
  const tone = value > 0.45 ? 'var(--bad)' : value > 0.2 ? 'var(--warn)' : 'var(--good)'
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-36" aria-hidden>
        <path d="M 10 62 A 50 50 0 0 1 110 62" fill="none" stroke="var(--surface-3)" strokeWidth={12} strokeLinecap="round" />
        <motion.path
          d="M 10 62 A 50 50 0 0 1 110 62"
          fill="none"
          stroke={tone}
          strokeWidth={12}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.max(0.02, value) }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        {/* Motion transforms SVG in fill-box space: pivot at the bottom-centre of the needle. */}
        <motion.line
          x1={60}
          y1={62}
          x2={60}
          y2={20}
          stroke="var(--ink)"
          strokeWidth={3}
          strokeLinecap="round"
          style={{ originX: 0.5, originY: 1 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 60, damping: 9, delay: 0.4 }}
        />
        <circle cx={60} cy={62} r={5} fill="var(--ink)" />
      </svg>
      <p className="font-mono text-[20px] font-semibold">{Math.round(value * 100)}%</p>
      <p className="text-[11.5px] text-muted">chance something breaks on launch day</p>
    </div>
  )
}

export function GoNoGoModal() {
  const g = useRun()
  const sc = useScenario()
  const launch = useGame((s) => s.launch)
  const noGo = useGame((s) => s.noGo)
  const votes = goNoGoVotes(g)
  const p = problemChance(g)
  const done = completion(g.ws)
  const flags = g.readiness.featureFlags
  const slip = noGoSlip(g)
  const nogoOk = canNoGo(g)
  const tally = { go: votes.filter((v) => v.vote === 'go').length, concerns: votes.filter((v) => v.vote === 'concerns').length, nogo: votes.filter((v) => v.vote === 'nogo').length }

  return (
    <Modal label="Go/No-Go meeting" size="xl">
      <div className="p-5 sm:p-7">
        <p className="eyebrow">Day {g.day} · 9:00am · the big meeting room</p>
        <h2 className="mt-1 font-display text-[clamp(22px,3vw,28px)] font-bold">Go/No-Go: {sc.product}</h2>
        <p className="mt-1 max-w-3xl text-[14px] text-ink-2">
          Everyone who owns a piece of the launch gives their call. You chair it, but the decision should follow the criteria, not the loudest voice in the room.
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-bold">Around the table</p>
              <p className="font-mono text-[12px] text-muted">
                {tally.go} go · {tally.concerns} concerns · {tally.nogo} no-go
              </p>
            </div>
            <ul className="space-y-2">
              {votes.map((v, i) => {
                const c = sc.cast[v.role]
                return (
                  <motion.li
                    key={v.role}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.22 }}
                    className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-3"
                  >
                    <Avatar c={c} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] text-muted">
                        <b className="text-ink">{c.short}</b> · {c.title}
                      </p>
                      <p className="text-[13.5px] leading-snug">“{v.reason}”</p>
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.22, type: 'spring', stiffness: 500, damping: 15 }}
                      className={cx('shrink-0 rounded-md px-2 py-1 text-[10.5px] font-extrabold tracking-wide', VOTE[v.vote].cls)}
                    >
                      {VOTE[v.vote].label}
                    </motion.span>
                  </motion.li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <Gauge value={p} />
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[12px]">
                <div className="rounded-xl bg-surface p-2">
                  <p className="text-muted">Scope done</p>
                  <p className="font-mono text-[15px] font-semibold">{Math.round(done * 100)}%</p>
                </div>
                <div className="rounded-xl bg-surface p-2">
                  <p className="text-muted">Quality</p>
                  <p className="font-mono text-[15px] font-semibold">{Math.round(g.meters.quality)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <p className="mb-2 text-[13px] font-bold">
                Readiness checklist · {readyCount(g)}/{READINESS.length}
              </p>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {READINESS.map((r, i) => (
                  <motion.li
                    key={r.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className={cx('flex items-center gap-1.5 text-[12.5px]', g.readiness[r.key] ? 'text-good-ink' : 'text-bad-ink')}
                  >
                    <span aria-hidden>{g.readiness[r.key] ? '✅' : '❌'}</span> {r.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-[13.5px] leading-relaxed">
          <b className="text-accent">☕ Mentor’s take ·</b> A No-Go based on agreed criteria is the process working, not failing. If you do go, a phased rollout behind
          feature flags turns a launch-day surprise into a small, reversible one.
        </div>

        <div className="sticky bottom-0 -mx-5 mt-5 grid gap-2 border-t border-line bg-surface px-5 pt-3 pb-1 sm:-mx-7 sm:grid-cols-3 sm:px-7">
          <Button size="lg" variant="danger" disabled={!nogoOk} title={nogoOk ? undefined : 'No room left in the calendar'} onClick={noGo}>
            ✋ NO-GO · slip {slip} days
          </Button>
          <Button size="lg" variant="secondary" disabled={!flags} title={flags ? undefined : 'Needs feature flags & kill switch'} onClick={() => launch('phased')} sound={null}>
            🐤 GO · phased rollout
          </Button>
          <Button size="lg" variant="primary" onClick={() => launch('full')} sound={null}>
            🚀 GO · full launch
          </Button>
        </div>
        {!flags && <p className="mt-2 text-center text-[12px] text-muted">Phased rollout needs the “Feature flags & kill switch” readiness item.</p>}
      </div>
    </Modal>
  )
}
