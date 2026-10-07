import { motion } from 'motion/react'
import { RETRO_OPTIONS, type RetroOption } from '../../../game/report'
import type { Delta } from '../../../game/effects'
import { cx } from '../../../lib/cx'
import { useGame } from '../../../store/game'
import { DeltaChips } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { GradeStamp } from '../EventModal'
import { useRun } from '../hooks'

const NOTE_COLORS = ['#fff1a8', '#ffd6e7', '#c9f0ff', '#d9f7c9', '#ffe0c2']

export function RetroModal({ picked, deltas }: { picked?: RetroOption; deltas?: Delta[] }) {
  const g = useRun()
  const submit = useGame((s) => s.submitRetro)
  const proceed = useGame((s) => s.proceedEndDay)
  const well = [
    g.counters.kopi >= 3 ? 'People actually talk to each other now' : 'Standups are short and useful',
    g.counters.riskReviews > 0 ? 'Risks are written down, not whispered' : 'We shipped the hard part of the API',
  ]
  const notWell = [
    'CI is flaky. Re-runs eat ~40 min a day',
    'PRs wait a day for first review',
    g.counters.ignored > 0 ? 'Some messages fell through the cracks' : 'Too many status syncs',
    g.meters.morale < 50 ? 'Everyone is tired' : 'Unclear who decides what',
  ]
  return (
    <Modal label="Sprint 1 retrospective" size="lg">
      <div className="p-5 sm:p-7">
        <p className="eyebrow">Day 10 · end of sprint 1</p>
        <h2 className="mt-1 font-display text-[22px] font-bold">Sprint retro</h2>
        <p className="mt-1 text-[13.5px] text-ink-2">The team has filled the board. Your job: help them commit to one change that actually sticks.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Went well', notes: well },
            { title: 'Didn’t go well', notes: notWell },
          ].map((col, ci) => (
            <div key={col.title} className="rounded-2xl bg-surface-2 p-3">
              <p className="eyebrow mb-2">{col.title}</p>
              <div className="flex flex-wrap gap-2">
                {col.notes.map((n, i) => (
                  <motion.p
                    key={n}
                    initial={{ opacity: 0, y: -20, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: ((i + ci) % 2 ? 1 : -1) * (1.5 + i) }}
                    transition={{ delay: 0.1 + (ci * 2 + i) * 0.08, type: 'spring', stiffness: 260, damping: 14 }}
                    className="w-[46%] min-w-[130px] flex-1 rounded-sm p-2 text-[12.5px] leading-snug text-[#2b2b2b] shadow-[var(--shadow-card)]"
                    style={{ background: NOTE_COLORS[(i + ci * 2) % NOTE_COLORS.length] }}
                  >
                    {n}
                  </motion.p>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!picked ? (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-bold">Pick ONE action item for sprint 2</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {RETRO_OPTIONS.map((o, i) => (
                <motion.li key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }}>
                  <motion.button
                    type="button"
                    onClick={() => submit(o.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex h-full w-full items-start gap-3 rounded-2xl border-2 border-line bg-surface p-3.5 text-left hover:border-accent"
                  >
                    <span className="text-xl" aria-hidden>
                      {o.icon}
                    </span>
                    <span className="text-[14px] font-semibold">{o.label}</span>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[14px] font-semibold">
                {picked.icon} {picked.label}
              </p>
              <GradeStamp grade={picked.grade} />
            </div>
            {deltas && <DeltaChips deltas={deltas} className="mt-3" delay={0.2} />}
            <p className={cx('mt-4 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-[14px] leading-relaxed')}>
              <b className="text-accent">☕ Mentor’s take ·</b> {picked.insight}
            </p>
            <div className="mt-5 flex justify-end">
              <Button variant="primary" onClick={proceed}>
                Wrap up the sprint →
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}
