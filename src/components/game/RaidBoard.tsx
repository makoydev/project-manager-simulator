import { motion } from 'motion/react'
import { useState } from 'react'
import { availability } from '../../game/actions'
import { isDone } from '../../game/schedule'
import type { RiskDef, RiskStatus } from '../../game/types'
import { cx } from '../../lib/cx'
import { useGame } from '../../store/game'
import { Avatar, CostPips } from '../ui/bits'
import { Button } from '../ui/Button'
import { useRun, useScenario, WS_ORDER, wsDef } from './hooks'

const LIKELIHOOD = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const IMPACT = ['Minor', 'Moderate', 'Major', 'Severe', 'Critical']

/** Exposure band for a cell (likelihood × impact). Semantic heat, labelled in the legend. */
export function band(exposure: number): { label: string; bg: string } {
  if (exposure >= 16) return { label: 'Critical', bg: 'color-mix(in oklch, var(--bad) 30%, var(--surface))' }
  if (exposure >= 10) return { label: 'High', bg: 'color-mix(in oklch, var(--bad) 14%, var(--surface))' }
  if (exposure >= 5) return { label: 'Medium', bg: 'color-mix(in oklch, var(--warn) 20%, var(--surface))' }
  return { label: 'Low', bg: 'var(--surface-2)' }
}

const STATUS: Record<Exclude<RiskStatus, 'hidden' | 'dormant'>, { label: string; glyph: string; cls: string }> = {
  open: { label: 'Open', glyph: '●', cls: 'bg-ink text-surface' },
  mitigated: { label: 'Mitigated', glyph: '🛡', cls: 'bg-good text-white' },
  occurred: { label: 'Occurred', glyph: '✕', cls: 'bg-bad text-white' },
}

function RiskMatrix({ risks, onPick }: { risks: RiskDef[]; onPick: (id: string) => void }) {
  const g = useRun()
  const [hover, setHover] = useState<string | null>(null)
  const hovered = risks.find((r) => r.id === hover)
  return (
    <div className="min-w-0">
      <div className="flex gap-2">
        <div className="flex w-5 items-center justify-center">
          <span className="-rotate-90 font-mono text-[10px] tracking-wider whitespace-nowrap text-muted uppercase">Likelihood →</span>
        </div>
        <div className="grid flex-1 grid-cols-5 gap-[3px]" role="grid" aria-label="Risk matrix: likelihood by impact">
          {[5, 4, 3, 2, 1].map((l) =>
            [1, 2, 3, 4, 5].map((i) => {
              const here = risks.filter((r) => r.likelihood === l && r.impact === i)
              const b = band(l * i)
              return (
                <div
                  key={`${l}-${i}`}
                  role="gridcell"
                  aria-label={`Likelihood ${LIKELIHOOD[l - 1]}, impact ${IMPACT[i - 1]}: ${here.length} risks`}
                  className="relative flex aspect-[1.35] flex-wrap content-center items-center justify-center gap-1 rounded-md p-1"
                  style={{ background: b.bg }}
                >
                  {here.map((r) => {
                    const st = STATUS[g.risks[r.id] as keyof typeof STATUS]
                    return (
                      <motion.button
                        key={r.id}
                        type="button"
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.25 }}
                        onClick={() => onPick(r.id)}
                        onMouseEnter={() => setHover(r.id)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(r.id)}
                        onBlur={() => setHover(null)}
                        aria-label={`${r.title}: ${st.label}`}
                        className={cx('grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ring-2 ring-[var(--surface)]', st.cls)}
                      >
                        {st.glyph}
                      </motion.button>
                    )
                  })}
                </div>
              )
            }),
          )}
        </div>
      </div>
      <div className="mt-1 ml-7 text-center font-mono text-[10px] tracking-wider text-muted uppercase">Impact →</div>
      <div className="mt-2 ml-7 min-h-[40px] rounded-lg bg-surface-2 px-3 py-2 text-[12.5px] text-ink-2" aria-live="polite">
        {hovered ? (
          <>
            <b className="text-ink">{hovered.title}</b> · exposure {hovered.likelihood}×{hovered.impact} = {hovered.likelihood * hovered.impact} ·{' '}
            {STATUS[g.risks[hovered.id] as keyof typeof STATUS].label}
          </>
        ) : (
          'Hover or tab to a risk to read it; select it to mitigate.'
        )}
      </div>
      <div className="mt-2 ml-7 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">
        {[2, 6, 12, 20].map((e) => (
          <span key={e} className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm border border-line" style={{ background: band(e).bg }} />
            {band(e).label}
          </span>
        ))}
        <span>· ● open · 🛡 mitigated · ✕ occurred</span>
      </div>
    </div>
  )
}

export function RaidBoard() {
  const g = useRun()
  const sc = useScenario()
  const setModal = useGame((s) => s.setModal)
  const act = useGame((s) => s.act)
  const known = sc.risks.filter((r) => g.risks[r.id] !== 'hidden' && g.risks[r.id] !== 'dormant')
  const hiddenCount = sc.risks.filter((r) => g.risks[r.id] === 'hidden').length
  const sorted = [...known].sort((a, b) => {
    const order = { open: 0, occurred: 1, mitigated: 2 } as Record<string, number>
    return order[g.risks[a.id]] - order[g.risks[b.id]] || b.likelihood * b.impact - a.likelihood * a.impact
  })
  const review = availability(g, 'riskReview')
  const blocked = WS_ORDER.filter((r) => g.ws[r].blockedDays > 0)
  const deps = WS_ORDER.flatMap((r) => g.ws[r].deps.map((d) => ({ from: r, ...d })))

  return (
    <section className="space-y-4" aria-label="RAID log" data-tour="raid">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-[15px] font-bold">RAID log</h2>
          <p className="text-[12.5px] text-ink-2">Risks, Assumptions, Issues, Dependencies. A risk is what might happen; an issue is a risk that already did.</p>
        </div>
        <Button size="sm" variant="secondary" disabled={!review.ok} title={review.reason} onClick={() => act('riskReview')}>
          🔍 Run pre-mortem <CostPips cost={review.cost} />
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-3">Risk matrix</h3>
          <RiskMatrix risks={known} onPick={(id) => setModal({ kind: 'risk', id })} />
          {hiddenCount > 0 && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-line-strong p-3">
              <span className="flex gap-1" aria-hidden>
                {Array.from({ length: hiddenCount }, (_, i) => (
                  <span key={i} className="twinkle grid h-5 w-5 place-items-center rounded-full border-2 border-dashed border-muted text-[10px] text-muted" style={{ animationDelay: `${i * 0.4}s` }}>
                    ?
                  </span>
                ))}
              </span>
              <p className="text-[12.5px] text-ink-2">
                <b className="text-ink">Unknown unknowns.</b> Risks nobody has written down yet. Pre-mortems and kopi chats surface them before they surface themselves.
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-2">Risks ({known.length})</h3>
          {sorted.length === 0 && <p className="text-[13px] text-ink-2">No risks logged yet. That doesn’t mean there aren’t any.</p>}
          <ul className="divide-y divide-line">
            {sorted.map((r) => {
              const st = g.risks[r.id] as keyof typeof STATUS
              const av = availability(g, 'mitigate', r.id)
              return (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold', STATUS[st].cls)} aria-hidden>
                    {STATUS[st].glyph}
                  </span>
                  <button type="button" onClick={() => setModal({ kind: 'risk', id: r.id })} className="min-w-0 flex-1 text-left">
                    <span className="line-clamp-2 text-[13.5px] leading-snug font-semibold hover:text-accent">{r.title}</span>
                    <span className="block text-[11.5px] text-muted">
                      {r.likelihood}×{r.impact} = {r.likelihood * r.impact} · {STATUS[st].label}
                      {r.ws ? ` · ${wsDef(sc, r.ws).name}` : ''}
                    </span>
                  </button>
                  <Avatar c={sc.cast[r.owner]} size={22} />
                  {st === 'open' && (
                    <Button size="sm" variant="secondary" disabled={!av.ok} title={av.reason} onClick={() => act('mitigate', r.id)}>
                      Mitigate <CostPips cost={av.cost} />
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-2">Issues · blocked now</h3>
          {blocked.length === 0 ? (
            <p className="text-[13px] text-ink-2">Nothing blocked. Enjoy it while it lasts.</p>
          ) : (
            <ul className="space-y-2">
              {blocked.map((r) => (
                <li key={r} className="text-[13px]">
                  <b>
                    {wsDef(sc, r).icon} {wsDef(sc, r).name}
                  </b>
                  <span className="block text-bad-ink">
                    {g.ws[r].blockReason ?? 'Blocked'} · {g.ws[r].blockedDays}d
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-2">Dependencies</h3>
          <ul className="space-y-2">
            {deps.map((d) => {
              const clear = isDone(g.ws[d.on])
              const at = g.ws[d.from].done >= g.ws[d.from].work * d.capAt - 0.01
              return (
                <li key={`${d.from}-${d.on}`} className="text-[13px]">
                  <span className="font-semibold">{wsDef(sc, d.from).name}</span>
                  <span className="text-muted"> needs </span>
                  <span className="font-semibold">{wsDef(sc, d.on).name}</span>
                  <span className="block text-[12px] text-muted">
                    from {Math.round(d.capAt * 100)}% ·{' '}
                    {clear ? <span className="text-good-ink">✓ clear</span> : at ? <span className="text-warn-ink">⏳ waiting now</span> : 'not yet blocking'}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <h3 className="eyebrow mb-2">Assumptions</h3>
          <ul className="list-disc space-y-1.5 pl-4 text-[13px] text-ink-2">
            {sc.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
