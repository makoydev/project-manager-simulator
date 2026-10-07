import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ASKS, RAG_LABEL, reportableRisks } from '../../../game/report'
import { capFor, isDone } from '../../../game/schedule'
import { week } from '../../../game/state'
import type { AskId, Rag, StatusReportResult, WsRole } from '../../../game/types'
import type { Delta } from '../../../game/effects'
import { cx } from '../../../lib/cx'
import { useGame } from '../../../store/game'
import { Avatar, DeltaChips, RagChip } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { useProjection, useRun, useScenario, WS_ORDER, wsDef } from '../hooks'

const RAGS: Rag[] = ['green', 'amber', 'red']
const RAG_BTN: Record<Rag, string> = {
  green: 'aria-checked:bg-good aria-checked:text-white aria-checked:border-good',
  amber: 'aria-checked:bg-warn aria-checked:text-[#3a2600] aria-checked:border-warn',
  red: 'aria-checked:bg-bad aria-checked:text-white aria-checked:border-bad',
}
const RAG_EMOJI: Record<Rag, string> = { green: '🟢', amber: '🟡', red: '🔴' }

function RagPicker({ value, onChange, label, big }: { value: Rag | null; onChange: (r: Rag) => void; label: string; big?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {RAGS.map((r) => (
        <motion.button
          key={r}
          type="button"
          role="radio"
          aria-checked={value === r}
          onClick={() => onChange(r)}
          whileTap={{ scale: 0.92 }}
          className={cx(
            'rounded-lg border border-line-strong bg-surface font-bold uppercase transition-colors hover:border-ink-2',
            big ? 'h-11 flex-1 text-[13px]' : 'h-8 w-[58px] text-[10.5px]',
            RAG_BTN[r],
          )}
        >
          {RAG_LABEL[r]}
        </motion.button>
      ))}
    </div>
  )
}

function Facts({ role }: { role: WsRole }) {
  const g = useRun()
  const p = useProjection(g)
  const w = g.ws[role]
  const f = p.finish[role]
  const late = f === null ? null : f - g.targetDay
  const waiting = !isDone(g.ws[role]) && capFor(w, g.ws) < 1 && w.done >= w.work * capFor(w, g.ws) - 0.01
  return (
    <span className="text-[11.5px] text-muted">
      {Math.round((w.done / w.work) * 100)}% ·{' '}
      {isDone(w) ? (
        'done'
      ) : (
        <>
          ETA {f === null ? '—' : `D${f}`}
          {late !== null && late > 0 && <b className="text-bad-ink"> +{late}d</b>}
        </>
      )}
      {w.blockedDays > 0 && <b className="text-bad-ink"> · blocked {w.blockedDays}d</b>}
      {waiting && <b className="text-warn-ink"> · waiting</b>}
    </span>
  )
}

function Reaction({ result }: { result: StatusReportResult }) {
  const sc = useScenario()
  const s = sc.cast.sponsor
  const d = result.trustDelta
  const quote = result.watermelon
    ? 'Love to see it on track! 👍 Keep it up.'
    : d >= 5
      ? 'Clear, honest and I know exactly what you need from me. This is the bar.'
      : d >= 1
        ? 'Thanks, helpful. Noted the risk.'
        : d >= -3
          ? 'Hmm. I’ll have a few questions on Monday.'
          : 'This doesn’t match what I’m hearing from the teams. Can we talk?'
  return (
    <div className="flex items-start gap-3">
      <motion.span initial={{ scale: 0.5, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
        <Avatar c={s} size={46} />
      </motion.span>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl rounded-tl-md border border-line bg-surface-2 px-4 py-3 text-[14.5px]"
      >
        <p className="text-[11.5px] font-semibold text-muted">{s.name} replied</p>
        <p className="mt-0.5">“{quote}”</p>
        {result.watermelon && (
          <p className="mt-2 text-[12.5px] text-bad-ink">
            🍉 They believe you, for now. Your manager, who talks to the teams, spotted the gap. Reality always comes out eventually.
          </p>
        )}
      </motion.div>
    </div>
  )
}

export function StatusReportModal({ result, deltas }: { result?: StatusReportResult; deltas?: Delta[] }) {
  const g = useRun()
  const sc = useScenario()
  const submit = useGame((s) => s.submitReport)
  const proceed = useGame((s) => s.proceedEndDay)
  const [overall, setOverall] = useState<Rag | null>(null)
  const [ws, setWs] = useState<Partial<Record<WsRole, Rag>>>({})
  const [topRisk, setTopRisk] = useState<string | null | undefined>(undefined)
  const [ask, setAsk] = useState<AskId | null>(null)
  const [cheat, setCheat] = useState(false)
  const risks = useMemo(() => reportableRisks(g).filter((r) => g.risks[r.id] === 'open'), [g])
  const complete = overall && WS_ORDER.every((r) => ws[r]) && topRisk !== undefined && ask
  const wk = week(g.day)
  const p = useProjection(g)

  if (result) {
    return (
      <Modal label="Status report sent" size="lg">
        <div className="p-5 sm:p-7">
          <p className="eyebrow">Week {result.week} status report · sent</p>
          <h2 className="mt-1 font-display text-[22px] font-bold">How it landed</h2>
          <div className="mt-4">
            <Reaction result={result} />
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-2 text-left text-[11px] text-muted uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Line</th>
                  <th className="px-3 py-2 font-semibold">You said</th>
                  <th className="px-3 py-2 font-semibold">Reality</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...WS_ORDER, 'overall' as const].map((r, i) => {
                  const said = r === 'overall' ? result.input.overall : result.input.ws[r]
                  const truth = r === 'overall' ? result.truth.overall : result.truth.ws[r]
                  return (
                    <motion.tr key={r} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                      <td className={cx('px-3 py-2', r === 'overall' && 'font-bold')}>{r === 'overall' ? 'Overall' : `${wsDef(sc, r).icon} ${wsDef(sc, r).name}`}</td>
                      <td className="px-3 py-2">
                        <RagChip rag={said} size="sm" />
                      </td>
                      <td className="px-3 py-2">
                        <RagChip rag={truth} size="sm" />
                      </td>
                      <td className="px-3 py-2 text-right">{said === truth ? '✓' : said === 'green' && truth === 'red' ? '🍉' : '✗'}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-1.5">
            {result.feedback.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className={cx(
                  'rounded-xl px-3 py-2 text-[13.5px]',
                  f.tone === 'good' ? 'bg-good-soft text-good-ink' : f.tone === 'bad' ? 'bg-bad-soft text-bad-ink' : 'bg-surface-2 text-ink-2',
                )}
              >
                {f.text}
              </motion.li>
            ))}
          </ul>
          {deltas && <DeltaChips deltas={deltas} className="mt-4" delay={1} />}
          <div className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-[13.5px] leading-relaxed">
            <b className="text-accent">☕ Mentor’s take ·</b> A great status report is boring in the best way: accurate RAG, the one risk that matters most, and a specific
            ask. Execs forgive bad news. They don’t forgive surprises.
          </div>
          <div className="mt-5 flex justify-end">
            <Button variant="primary" onClick={proceed}>
              Head home for the weekend →
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  const topRiskDef = risks.find((r) => r.id === topRisk)
  return (
    <Modal label="Friday status report" size="xl">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="p-5 sm:p-7">
          <p className="eyebrow">Friday · Week {wk}</p>
          <h2 className="mt-1 font-display text-[22px] font-bold">Write your status report</h2>
          <p className="mt-1 text-[13.5px] text-ink-2">
            {sc.cast.sponsor.short} reads these on the MRT home. Be accurate, name the top risk, and ask for exactly what you need.
          </p>
          <button type="button" onClick={() => setCheat((v) => !v)} className="mt-3 text-[12.5px] font-semibold text-accent" aria-expanded={cheat}>
            {cheat ? '▾' : '▸'} RAG rules you agreed with your sponsor
          </button>
          <AnimatePresence initial={false}>
            {cheat && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-1 overflow-hidden rounded-xl bg-surface-2 p-3 text-[12.5px] text-ink-2"
              >
                <li>
                  🟢 <b>Green</b>: on track for the target date, nothing blocked.
                </li>
                <li>
                  🟡 <b>Amber</b>: 1–2 days late, blocked, or carrying a high-exposure risk (L×I ≥ 12). Recoverable.
                </li>
                <li>
                  🔴 <b>Red</b>: more than 2 days late or blocked 3+ days. Needs a decision or help.
                </li>
                <li>Overall: the worst of the lines, or the launch ETA against the target date.</li>
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-2 text-[13px] font-bold">Overall status</p>
              <RagPicker big value={overall} onChange={setOverall} label="Overall status" />
              <p className="mt-1.5 text-[12px] text-muted">
                Launch ETA {p.launchDay === null ? 'unknown' : `Day ${p.launchDay}`} · target Day {g.targetDay}
              </p>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold">Workstreams</p>
              <ul className="space-y-2">
                {WS_ORDER.map((r) => (
                  <li key={r} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-3 py-2">
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold">
                        {wsDef(sc, r).icon} {wsDef(sc, r).name}
                      </span>
                      <Facts role={r} />
                    </span>
                    <RagPicker value={ws[r] ?? null} onChange={(v) => setWs((x) => ({ ...x, [r]: v }))} label={`${wsDef(sc, r).name} status`} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold">Top risk to highlight</p>
              <div role="radiogroup" aria-label="Top risk" className="space-y-1.5">
                {risks.map((r) => (
                  <label key={r.id} className={cx('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[13px]', topRisk === r.id ? 'border-accent bg-accent-soft' : 'border-line')}>
                    <input type="radio" name="toprisk" className="accent-[var(--accent)]" checked={topRisk === r.id} onChange={() => setTopRisk(r.id)} />
                    <span className="flex-1">{r.title}</span>
                    <span className="font-mono text-[11px] text-muted">
                      {r.likelihood}×{r.impact}
                    </span>
                  </label>
                ))}
                <label className={cx('flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[13px]', topRisk === null ? 'border-accent bg-accent-soft' : 'border-line')}>
                  <input type="radio" name="toprisk" className="accent-[var(--accent)]" checked={topRisk === null} onChange={() => setTopRisk(null)} />
                  No major risks to report
                </label>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold">Your ask</p>
              <div role="radiogroup" aria-label="Your ask" className="grid gap-1.5 sm:grid-cols-2">
                {(Object.keys(ASKS) as AskId[]).map((a) => (
                  <label key={a} className={cx('flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-[13px]', ask === a ? 'border-accent bg-accent-soft' : 'border-line')}>
                    <input type="radio" name="ask" className="mt-1 accent-[var(--accent)]" checked={ask === a} onChange={() => setAsk(a)} />
                    <span>
                      <span className="block font-semibold">{ASKS[a].label}</span>
                      <span className="block text-[11.5px] text-muted">{ASKS[a].hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-surface-2 p-5 sm:p-7 lg:border-t-0 lg:border-l">
          <p className="eyebrow mb-2">Preview</p>
          <div className="rounded-2xl border border-line bg-surface p-4 text-[13.5px] shadow-[var(--shadow-card)]">
            <div className="space-y-0.5 border-b border-line pb-3 text-[12px] text-muted">
              <p>
                <b className="text-ink-2">From:</b> {g.playerName}
              </p>
              <p>
                <b className="text-ink-2">To:</b> {sc.cast.sponsor.name} · <b className="text-ink-2">Cc:</b> {sc.cast.boss.name}, workstream leads
              </p>
              <p className="pt-1 text-[13px] font-semibold text-ink">
                [{sc.program}] Weekly status · W{wk} · {overall ? `${RAG_EMOJI[overall]} ${RAG_LABEL[overall].toUpperCase()}` : '…'}
              </p>
            </div>
            <div className="space-y-3 pt-3 leading-relaxed">
              <p>Hi {sc.cast.sponsor.short},</p>
              <p>
                <b>Overall: {overall ? RAG_LABEL[overall] : '—'}.</b> Launch ETA {p.launchDay === null ? 'TBC' : `Day ${p.launchDay}`} against target Day {g.targetDay}.
              </p>
              <ul className="space-y-0.5">
                {WS_ORDER.map((r) => (
                  <motion.li key={`${r}-${ws[r]}`} initial={{ backgroundColor: 'var(--accent-soft)' }} animate={{ backgroundColor: 'rgba(0,0,0,0)' }} transition={{ duration: 0.8 }} className="rounded px-1">
                    {ws[r] ? RAG_EMOJI[ws[r]!] : '⚪'} {wsDef(sc, r).name}: {ws[r] ? RAG_LABEL[ws[r]!] : '—'}
                  </motion.li>
                ))}
              </ul>
              <p>
                <b>Top risk:</b>{' '}
                {topRisk === undefined ? '—' : topRiskDef ? `${topRiskDef.title} (${topRiskDef.likelihood}×${topRiskDef.impact}). Mitigation in progress.` : 'None material this week.'}
              </p>
              <p>
                <b>Ask:</b> {ask ? ASKS[ask].label : '—'}.
              </p>
              <p>
                Thanks,
                <br />
                {g.playerName}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[12px] text-muted">{complete ? 'Ready to send.' : 'Fill in every section to send.'}</p>
            <Button
              variant="primary"
              size="lg"
              disabled={!complete}
              sound={null}
              onClick={() => complete && submit({ overall: overall!, ws: ws as Record<WsRole, Rag>, topRisk: topRisk ?? null, ask: ask! })}
            >
              Send ✈️
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
