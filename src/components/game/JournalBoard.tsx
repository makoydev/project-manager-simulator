import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { cx } from '../../lib/cx'
import { SlipChart } from '../charts/SlipChart'
import { RagChip } from '../ui/bits'
import { GRADE_META } from './EventModal'
import { useRun } from './hooks'

export function JournalBoard() {
  const g = useRun()
  const [open, setOpen] = useState<number | null>(null)
  const log = [...g.log].reverse()
  return (
    <section className="space-y-4" aria-label="Journal">
      <div>
        <h2 className="font-display text-[15px] font-bold">Journal</h2>
        <p className="text-[12.5px] text-ink-2">Every decision you’ve made, how a seasoned TPM would grade it, and why.</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="eyebrow mb-2">Launch ETA by day</h3>
        <SlipChart history={g.history} />
      </div>
      {g.statusReports.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-2">Status reports</h3>
          <ul className="divide-y divide-line">
            {g.statusReports.map((r) => (
              <li key={r.day} className="flex flex-wrap items-center gap-2 py-2 text-[13px]">
                <span className="w-16 font-semibold">Week {r.week}</span>
                <span className="text-muted">You said</span>
                <RagChip rag={r.input.overall} size="sm" />
                <span className="text-muted">Reality</span>
                <RagChip rag={r.truth.overall} size="sm" />
                {r.watermelon && <span title="Watermelon: green outside, red inside">🍉</span>}
                <span className={cx('ml-auto font-mono font-semibold', r.trustDelta >= 0 ? 'text-good-ink' : 'text-bad-ink')}>
                  {r.trustDelta >= 0 ? '+' : '−'}
                  {Math.abs(r.trustDelta)} trust
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="eyebrow mb-2">Decisions ({g.log.length})</h3>
        {log.length === 0 && <p className="text-[13px] text-ink-2">Nothing yet. Open your inbox and make your first call.</p>}
        <ul className="space-y-1.5">
          {log.map((d, i) => (
            <li key={`${d.day}-${d.eventId}-${i}`} className="rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start gap-3 p-3 text-left"
                aria-expanded={open === i}
              >
                <span className="font-mono text-[11px] text-muted">D{d.day}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold">{d.title}</span>
                  <span className="block truncate text-[12.5px] text-ink-2">{d.choiceLabel}</span>
                </span>
                <span className={cx('shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold', GRADE_META[d.grade].cls)}>
                  {d.ignored ? '⏳ Ignored' : `${GRADE_META[d.grade].icon} ${GRADE_META[d.grade].label}`}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-3 text-[13px] leading-relaxed text-ink-2"
                  >
                    <span className="mb-3 block border-l-2 border-accent pl-3">{d.insight}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
