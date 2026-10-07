import { motion } from 'motion/react'
import { SKILL_META } from '../../game/meta'
import type { SkillKey } from '../../game/types'

const ORDER: SkillKey[] = ['stakeholder', 'comms', 'leadership', 'execution', 'technical', 'risk']

/** Six-axis skills profile (0–100). Values are also listed beside it, so nothing is gated on the shape. */
export function SkillsRadar({ values }: { values: Record<SkillKey, number> }) {
  const cx = 130
  const cy = 120
  const R = 86
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ORDER.length
    return [cx + Math.cos(a) * R * (v / 100), cy + Math.sin(a) * R * (v / 100)] as const
  }
  const poly = ORDER.map((k, i) => pt(i, Math.max(4, values[k])).join(',')).join(' ')
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      <svg viewBox="-34 0 328 240" className="w-full max-w-[340px]" role="img" aria-label="Skills radar">
        {[25, 50, 75, 100].map((r) => (
          <polygon key={r} points={ORDER.map((_, i) => pt(i, r).join(',')).join(' ')} fill="none" stroke="var(--line)" strokeWidth={1} />
        ))}
        {ORDER.map((_, i) => {
          const [x, y] = pt(i, 100)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth={1} />
        })}
        <motion.polygon
          points={poly}
          fill="var(--accent)"
          fillOpacity={0.16}
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.4 }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />
        {ORDER.map((k, i) => {
          const [x, y] = pt(i, Math.max(4, values[k]))
          return <circle key={k} cx={x} cy={y} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
        })}
        {ORDER.map((k, i) => {
          const [x, y] = pt(i, 122)
          return (
            <text key={k} x={x} y={y + 4} textAnchor="middle" fontSize={10.5} fill="var(--ink-2)" fontWeight={600}>
              {SKILL_META[k].label}
            </text>
          )
        })}
      </svg>
      <ul className="w-full max-w-[220px] space-y-1.5 text-[12.5px]">
        {ORDER.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden>{SKILL_META[k].icon}</span>
            <span className="flex-1 text-ink-2">{SKILL_META[k].label}</span>
            <span className="font-mono font-semibold tabular">{values[k]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
