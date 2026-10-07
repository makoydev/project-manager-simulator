import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { DashPanel, LiveEpisode } from '../../../live/types'
import type { LiveApi } from '../../../live/useLive'

/** One series with an optional threshold; hover or focus shows the value at a point. */
export function DashChart({ p, compact }: { p: DashPanel; compact?: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 420
  const H = compact ? 110 : 150
  const pad = { l: 40, r: 10, t: 10, b: 20 }
  const vals = [...p.points, p.threshold?.value ?? p.points[0]]
  const max = Math.max(...vals) * 1.12
  const min = Math.min(0, ...vals)
  const x = (i: number) => pad.l + (i / Math.max(1, p.points.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)
  const line = p.points.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(p.points.length - 1)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`
  const ticks = [min, (min + max) / 2, max * 0.92].map((v) => Math.round(v))
  const fmt = (v: number) => `${v.toLocaleString()}${p.unit}`
  const peak = p.points.indexOf(Math.max(...p.points))
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-bold">{p.title}</span>
        <span className="font-mono text-[11px] text-muted">{hover === null ? `peak ${fmt(p.points[peak])}` : fmt(p.points[hover])}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label={`${p.title}: peak ${fmt(p.points[peak])}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize={9} fill="var(--muted)" fontFamily="var(--font-mono)">
              {t.toLocaleString()}
            </text>
          </g>
        ))}
        {p.threshold && (
          <g>
            <line x1={pad.l} x2={W - pad.r} y1={y(p.threshold.value)} y2={y(p.threshold.value)} stroke="var(--bad)" strokeWidth={1.2} />
            <text x={W - pad.r} y={y(p.threshold.value) - 4} textAnchor="end" fontSize={9} fill="var(--bad-ink)" fontWeight={700}>
              {p.threshold.label}
            </text>
          </g>
        )}
        <path d={area} fill="var(--ws-core)" opacity={0.12} />
        <motion.path d={line} fill="none" stroke="var(--ws-core)" strokeWidth={2} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        <circle cx={x(peak)} cy={y(p.points[peak])} r={4} fill="var(--ws-core)" stroke="var(--surface)" strokeWidth={2} />
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="var(--line-strong)" strokeWidth={1} />
            <circle cx={x(hover)} cy={y(p.points[hover])} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
          </>
        )}
        <text x={pad.l} y={H - 5} fontSize={9} fill="var(--muted)">
          {p.span[0]}
        </text>
        <text x={W - pad.r} y={H - 5} textAnchor="end" fontSize={9} fill="var(--muted)">
          {p.span[1]}
        </text>
        {p.points.map((_, i) => {
          const w = (W - pad.l - pad.r) / Math.max(1, p.points.length - 1)
          return <rect key={i} x={x(i) - w / 2} y={pad.t} width={w} height={H - pad.t - pad.b} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        })}
      </svg>
      {!compact && <p className="mt-1 text-[12px] text-ink-2">{p.caption}</p>}
    </figure>
  )
}

export function DashApp({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  useEffect(() => {
    live.seen({ dashboards: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="scroll-y h-full p-5">
      <p className="eyebrow">Observability</p>
      <h2 className="mt-1 font-display text-[18px] font-bold">Checkout · ShiokPay</h2>
      <div className="mt-4 space-y-6">
        {ep.dashboards.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line p-3">
            <DashChart p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
