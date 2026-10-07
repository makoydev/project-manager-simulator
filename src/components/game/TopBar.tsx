import { motion } from 'motion/react'
import { METER_META } from '../../game/meta'
import { week, weekday } from '../../game/state'
import type { MeterKey } from '../../game/types'
import { cx } from '../../lib/cx'
import { useGame } from '../../store/game'
import { CountUp, FloatDelta } from '../ui/bits'
import { Button } from '../ui/Button'
import { SettingsControls } from '../ui/Settings'
import { useProjection, useRun, useScenario } from './hooks'

function Meter({ k, value, max }: { k: MeterKey; value: number; max: number }) {
  const m = METER_META[k]
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const tone = pct < 22 ? 'var(--bad)' : pct < 40 ? 'var(--warn)' : 'var(--accent)'
  return (
    <div className="group relative flex min-w-0 items-center gap-2" title={`${m.label}: ${m.help}`}>
      <motion.span key={Math.round(value)} initial={{ scale: 1.35 }} animate={{ scale: 1 }} className="text-[15px]" aria-hidden>
        {m.icon}
      </motion.span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[11px] font-semibold text-muted">{m.label}</span>
          <span className="relative font-mono text-[12.5px] font-semibold text-ink tabular">
            {k === 'budget' ? (
              <>
                <span className="hidden sm:inline">{value < 0 ? '−S$' : 'S$'}</span>
                {value < 0 && <span className="sm:hidden">−</span>}
                <CountUp value={Math.abs(value)} suffix="k" decimals={0} />
              </>
            ) : (
              <CountUp value={value} />
            )}
            <FloatDelta value={value} />
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: tone }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
    </div>
  )
}

function FocusBank() {
  const g = useRun()
  return (
    <div className="flex items-center gap-2" data-tour="focus" title="Focus: what you can still do today. Each choice and move costs focus.">
      <span className="text-[11px] font-semibold text-muted">Focus</span>
      <div className="flex gap-1" aria-label={`${g.focus} of ${g.maxFocus} focus left`}>
        {Array.from({ length: Math.max(g.maxFocus, g.focus) }, (_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: i < g.focus ? 1 : 0.7, opacity: i < g.focus ? 1 : 0.35 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20, delay: i * 0.02 }}
            className={cx('grid h-6 w-[18px] place-items-center rounded-md', i < g.focus ? 'bg-accent' : 'bg-surface-3')}
          >
            <svg viewBox="0 0 12 16" className={cx('h-3 w-2.5', i < g.focus ? 'fill-accent-ink' : 'fill-muted')}>
              <path d="M7 0 0 9h4.5L3.5 16 12 6H7.4L7 0Z" />
            </svg>
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/** Day cells grouped by week: today, Fridays (status report) and the launch target. */
function CalendarStrip() {
  const g = useRun()
  const sc = useScenario()
  const last = Math.max(15, g.targetDay, g.day)
  const days = Array.from({ length: last }, (_, i) => i + 1)
  return (
    <div className="flex items-end gap-[3px]" aria-label={`Day ${g.day} of ${g.targetDay}`}>
      {days.map((d) => {
        const isToday = d === g.day
        const isTarget = d === g.targetDay
        const friday = d % 5 === 0
        return (
          <div key={d} className={cx('flex flex-col items-center', d % 5 === 0 && d !== last && 'mr-1.5')}>
            <span className="h-3 text-[9px] leading-none" aria-hidden>
              {isTarget ? '🚀' : friday && d > g.day ? '📝' : ''}
            </span>
            <motion.span
              title={`Day ${d}${isTarget ? ' · launch target' : ''}${friday ? ' · status report' : ''}${d > sc.targetDay ? ' · slip' : ''}`}
              initial={false}
              animate={{ height: isToday ? 18 : 12 }}
              className={cx(
                'w-[7px] rounded-full',
                isToday ? 'bg-accent' : d < g.day ? 'bg-ink-2/60' : d > sc.targetDay ? 'bg-bad/40' : 'bg-line-strong',
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

export function LaunchEta() {
  const g = useRun()
  const p = useProjection(g)
  const eta = p.launchDay
  const late = eta === null ? null : eta - g.targetDay
  return (
    <div className="flex items-center gap-2" data-tour="eta" title="When the last workstream is projected to finish at today’s pace">
      <span aria-hidden className="text-[15px]">
        🚆
      </span>
      <div className="leading-tight">
        <p className="text-[11px] font-semibold text-muted">Launch ETA</p>
        <p className="font-mono text-[13px] font-semibold tabular">
          {eta === null ? 'No ETA' : `Day ${eta}`}
          <span
            className={cx(
              'ml-1.5 rounded-md px-1.5 py-0.5 text-[11px]',
              late === null || late > 2 ? 'bg-bad-soft text-bad-ink' : late > 0 ? 'bg-warn-soft text-warn-ink' : 'bg-good-soft text-good-ink',
            )}
          >
            {late === null ? 'stalled' : late > 0 ? `+${late}d` : late === 0 ? 'on time' : `${-late}d early`}
          </span>
        </p>
      </div>
    </div>
  )
}

export function TopBar() {
  const g = useRun()
  const sc = useScenario()
  const setModal = useGame((s) => s.setModal)
  const openGuide = useGame((s) => s.openGuide)
  const meters: MeterKey[] = ['morale', 'trust', 'quality', 'budget', 'energy']
  return (
    <header className="border-b border-line bg-surface">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg" style={{ background: 'var(--accent-soft)' }} aria-hidden>
            {sc.icon}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-[14px] font-bold">{sc.program}</p>
            <p className="truncate text-[12px] text-muted">
              {sc.company} · {sc.product}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right leading-tight">
            <p className="font-display text-[15px] font-bold">
              {weekday(g.day)} · Day {g.day}
            </p>
            <p className="text-[11.5px] text-muted">
              Week {week(g.day)} · launch target Day {g.targetDay}
            </p>
          </div>
          <CalendarStrip />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <SettingsControls compact />
          </div>
          <Button variant="ghost" size="sm" onClick={() => openGuide('concepts')} title="Field Guide">
            📖<span className="hidden xl:inline">Guide</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModal({ kind: 'confirmQuit' })} aria-label="Menu" title="Quit program">
            ⏏︎
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 border-t border-line px-4 py-2 sm:grid-cols-6 lg:flex lg:items-center lg:gap-5 lg:px-5" data-tour="meters">
        {meters.map((k) => (
          <div key={k} className="min-w-0 lg:w-[124px]">
            <Meter k={k} value={g.meters[k]} max={k === 'budget' ? Math.max(sc.start.budget, 1) : 100} />
          </div>
        ))}
        <div className="col-span-1 sm:col-span-1 lg:ml-auto">
          <LaunchEta />
        </div>
        <div className="col-span-3 flex items-center justify-between gap-3 sm:col-span-6 lg:col-span-1">
          <FocusBank />
          <span className="font-display text-[13px] font-bold md:hidden">
            {weekday(g.day)} · Day {g.day}
          </span>
        </div>
      </div>
    </header>
  )
}
