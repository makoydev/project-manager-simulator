import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo } from 'react'
import type { DayReport } from '../../../game/engine'
import { weekday } from '../../../game/state'
import { confetti } from '../../../lib/confetti'
import { cx, wsVar } from '../../../lib/cx'
import { play } from '../../../lib/sfx'
import { useGame } from '../../../store/game'
import { DeltaChips } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { useRun, useScenario, WS_ORDER, wsDef } from '../hooks'
import { Skyline } from '../Skyline'

export function DayReportOverlay({ report }: { report: DayReport }) {
  const g = useRun()
  const sc = useScenario()
  const next = useGame((s) => s.continueAfterDay)
  const reduce = useReducedMotion()
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ x: (i * 37) % 100, y: (i * 53) % 55, d: (i % 7) * 0.4 })), [])

  useEffect(() => {
    const timers: number[] = []
    if (report.completed.length) timers.push(window.setTimeout(() => (play('good'), confetti({ y: window.innerHeight * 0.45 })), 1300))
    if (report.risk) timers.push(window.setTimeout(() => play('alarm'), 1500))
    if (report.fired) timers.push(window.setTimeout(() => play('bad'), 900))
    const onKey = (e: KeyboardEvent) => e.key === 'Enter' && next()
    window.addEventListener('keydown', onKey)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
    }
  }, [report, next])

  const label = report.fired ? 'See your performance review' : report.goNoGo ? 'Walk into the Go/No-Go meeting' : `Start ${weekday(g.day)}, Day ${g.day}`
  const slip = report.projectedAfter - report.projectedBefore

  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
      <motion.div
        className="absolute inset-0"
        initial={{ background: 'linear-gradient(180deg, #f08a5d 0%, #f7c59f 100%)' }}
        animate={{ background: 'linear-gradient(180deg, #08112a 0%, #2b2350 100%)' }}
        transition={{ duration: reduce ? 0 : 1.6, ease: 'easeInOut' }}
      />
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="twinkle absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + (i % 10) * 0.05 }}
        />
      ))}
      <motion.div
        className="absolute top-[9%] right-[12%] h-14 w-14 rounded-full bg-[#fdf1c7] shadow-[0_0_60px_10px_rgba(253,241,199,0.35)]"
        initial={{ y: 140, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.6, ease: 'easeOut' }}
        aria-hidden
      />
      <Skyline className="absolute inset-x-0 bottom-0 h-[34%] w-full [--skyline:#05080f] [--window:#ffcf5c]" />

      <div className="relative flex h-full items-end justify-center p-3 sm:items-center sm:p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Day ${report.day} report`}
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.7, type: 'spring', stiffness: 220, damping: 26 }}
          className="scroll-y max-h-[86%] w-full max-w-xl rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-pop)] sm:p-6"
        >
          <p className="eyebrow">
            {sc.program} · {report.weekend ? 'Friday night' : 'Overnight'}
          </p>
          <h2 className="mt-1 font-display text-[24px] font-bold">Day {report.day} done</h2>

          {report.fired && (
            <p className="mt-3 rounded-2xl bg-bad-soft p-4 text-[14.5px] font-semibold text-bad-ink">
              📦 {sc.cast.sponsor.short} has lost confidence. Another TPM will take over {sc.program} on Monday.
            </p>
          )}

          <div className="mt-4">
            <p className="mb-2 text-[12.5px] font-bold text-ink-2">Overnight progress</p>
            <ul className="space-y-1.5">
              {WS_ORDER.map((r, i) => {
                const w = g.ws[r]
                const pct = Math.min(100, (w.done / w.work) * 100)
                const gain = report.gained[r]
                return (
                  <li key={r} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-5 text-center" aria-hidden>
                      {wsDef(sc, r).icon}
                    </span>
                    <span className="w-28 truncate sm:w-36">{wsDef(sc, r).name}</span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: wsVar(r) }}
                        initial={{ width: `${Math.max(0, pct - gain)}%` }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </span>
                    <span className={cx('w-12 text-right font-mono font-semibold tabular', gain > 0.05 ? 'text-good-ink' : 'text-muted')}>
                      {report.completed.includes(r) ? '🏁' : gain > 0.05 ? `+${gain.toFixed(0)}%` : w.blockedDays > 0 ? '⛔' : '—'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-4 space-y-2">
            {report.completed.map((r) => (
              <motion.p key={r} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3 }} className="rounded-xl bg-good-soft px-3 py-2 text-[13.5px] font-semibold text-good-ink">
                🎉 {wsDef(sc, r).name} has arrived at the terminal!
              </motion.p>
            ))}
            {report.unblocked.map((r) => (
              <p key={r} className="rounded-xl bg-surface-2 px-3 py-2 text-[13px]">
                🔓 {wsDef(sc, r).name} is moving again.
              </p>
            ))}
            {report.risk && (
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: [0, -4, 4, -2, 0], opacity: 1 }} transition={{ delay: 1.5 }} className="rounded-xl border border-bad/40 bg-bad-soft px-3 py-2 text-[13.5px] text-bad-ink">
                <b>⚠️ Risk materialised: {report.risk.title}.</b>{' '}
                {report.risk.mitigated
                  ? 'You had mitigated it, so the damage should be contained.'
                  : report.risk.wasKnown
                    ? 'It was on your RAID log but unmitigated.'
                    : 'It was never on your RAID log. That’s the cost of unknown unknowns.'}{' '}
                Details in tomorrow’s inbox.
              </motion.div>
            )}
            {report.expired.map((x, i) => (
              <div key={i} className="rounded-xl border border-line px-3 py-2 text-[13px]">
                <p>
                  <b>⏳ Expired: {x.title}.</b> <span className="text-ink-2">{x.text}</span>
                </p>
                <DeltaChips deltas={x.deltas} className="mt-1.5" delay={1.2} />
              </div>
            ))}
            {report.pressure.length > 0 && (
              <div className="rounded-xl border border-line px-3 py-2 text-[13px]">
                <p className="text-ink-2">{report.burnout ? 'You were unreachable today.' : 'The team can feel the date slipping. Pressure is wearing them down.'}</p>
                <DeltaChips deltas={report.pressure} className="mt-1.5" delay={1.2} />
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[12.5px]">
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-muted">Launch ETA</p>
              <p className="font-mono text-[15px] font-semibold">
                Day {report.projectedAfter}
                {slip !== 0 && <span className={cx('ml-1 text-[12px]', slip > 0 ? 'text-bad-ink' : 'text-good-ink')}>({slip > 0 ? `+${slip}` : slip})</span>}
              </p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-muted">Your energy</p>
              <p className="font-mono text-[15px] font-semibold">
                🔋 {Math.round(report.energyBefore)} → {Math.round(report.energyAfter)}
              </p>
            </div>
          </div>
          {report.weekend && !report.fired && <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-[13px]">🏖️ Weekend: cycling at East Coast Park and chilli crab with friends. +25 energy.</p>}
          {report.burnout && (
            <p className="mt-3 rounded-xl bg-bad-soft px-3 py-2 text-[13px] text-bad-ink">
              🤒 Your body files the MC for you. Tomorrow you only have 2 focus. Sustainable pace is a delivery skill too.
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <Button variant="primary" size="lg" onClick={next} sound={null} autoFocus>
              {report.fired ? '📦' : report.goNoGo ? '🚀' : '☀️'} {label} →
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
