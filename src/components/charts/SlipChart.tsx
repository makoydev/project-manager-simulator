import { motion } from 'motion/react'
import { useState } from 'react'
import type { DaySnapshot } from '../../game/types'

/**
 * Launch ETA over time — the TPM's "slip chart". One series (projected launch day)
 * against the target reference. Hover/focus a day for its reading.
 */
export function SlipChart({ history, height = 180 }: { history: DaySnapshot[]; height?: number }) {
  const [active, setActive] = useState<number | null>(null)
  if (history.length < 2) {
    return <p className="rounded-xl bg-surface-2 p-4 text-[13px] text-ink-2">The slip chart fills in as days pass: one point per evening.</p>
  }
  const W = 560
  const H = height
  const pad = { l: 34, r: 16, t: 14, b: 26 }
  const days = history.map((h) => h.day)
  const xMax = Math.max(...days, 5)
  const vals = history.flatMap((h) => [Math.min(h.projectedDay, 40), h.targetDay])
  const yMin = Math.floor(Math.min(...vals) - 1)
  const yMax = Math.ceil(Math.max(...vals) + 1)
  const x = (d: number) => pad.l + (d / xMax) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * (H - pad.t - pad.b)
  const pts = history.map((h) => [x(h.day), y(Math.min(h.projectedDay, 40))] as const)
  const path = pts.map(([px, py], i) => `${i ? 'L' : 'M'} ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
  const area = `${path} L ${pts[pts.length - 1][0]} ${H - pad.b} L ${pts[0][0]} ${H - pad.b} Z`
  const step = Math.max(1, Math.ceil((yMax - yMin) / 5))
  const yTicks: number[] = []
  for (let v = yMin; v <= yMax; v += step) yTicks.push(v)
  const last = history[history.length - 1]
  const act = active === null ? null : history[active]

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Launch ETA by day. Latest: Day ${last.projectedDay} against target Day ${last.targetDay}.`}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
            <text x={pad.l - 6} y={y(v) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted)" fontFamily="var(--font-mono)">
              D{v}
            </text>
          </g>
        ))}
        {/* Target reference (can move when re-baselined) */}
        <path
          d={history.map((h, i) => `${i ? 'L' : 'M'} ${x(h.day)} ${y(h.targetDay)}`).join(' ')}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
        <text x={W - pad.r} y={y(last.targetDay) - 6} textAnchor="end" fontSize={10.5} fill="var(--ink-2)" fontWeight={700}>
          🚀 target D{last.targetDay}
        </text>
        <path d={area} fill="var(--ink)" opacity={0.06} />
        <motion.path d={path} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
        {history.map((h, i) => (
          <text key={h.day} x={x(h.day)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--muted)" fontFamily="var(--font-mono)">
            {h.day === 0 ? 'start' : i % Math.ceil(history.length / 8) === 0 || i === history.length - 1 ? `D${h.day}` : ''}
          </text>
        ))}
        {act && <line x1={x(act.day)} x2={x(act.day)} y1={pad.t} y2={H - pad.b} stroke="var(--line-strong)" strokeWidth={1} />}
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={5} fill="var(--ink)" stroke="var(--surface)" strokeWidth={2} />
        {act && <circle cx={x(act.day)} cy={y(Math.min(act.projectedDay, 40))} r={5} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />}
        {/* Hit targets: one column per snapshot, bigger than the marks */}
        {history.map((h, i) => {
          const w = (W - pad.l - pad.r) / Math.max(1, history.length - 1)
          return (
            <rect
              key={h.day}
              x={x(h.day) - w / 2}
              y={pad.t}
              width={w}
              height={H - pad.t - pad.b}
              fill="transparent"
              tabIndex={0}
              aria-label={`${h.day === 0 ? 'Start' : `Day ${h.day}`}: ETA Day ${h.projectedDay}, target Day ${h.targetDay}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
          )
        })}
      </svg>
      <p className="mt-1 min-h-[20px] text-[12px] text-ink-2" aria-live="polite">
        {act ? (
          <>
            <b className="text-ink">ETA Day {act.projectedDay}</b> on {act.day === 0 ? 'the first morning' : `the evening of Day ${act.day}`} · target Day {act.targetDay} ·{' '}
            {act.progress}% complete
          </>
        ) : (
          <>
            Latest ETA <b className="text-ink">Day {last.projectedDay}</b> vs target Day {last.targetDay}. A line drifting upward is a slip, and execs should hear about it from you first.
          </>
        )}
      </p>
    </div>
  )
}
