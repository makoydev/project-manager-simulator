import { motion, useReducedMotion } from 'motion/react'

/**
 * The signature visual: five MRT-style lines drawn at 45° bends that converge
 * on the LAUNCH interchange. Each line is a workstream colour.
 */
const LINES = [
  { id: 'core', d: 'M 0 60 H 230 L 356 186 H 430', stations: [{ x: 70, y: 60, label: 'Kickoff' }, { x: 160, y: 60, label: 'API contract' }] },
  { id: 'client', d: 'M 0 140 H 250 L 308 198 H 430', stations: [{ x: 120, y: 140, label: 'Designs' }] },
  { id: 'platform', d: 'M 0 210 H 430', stations: [{ x: 110, y: 210, label: 'Load test' }, { x: 215, y: 210, label: 'Rollback drill' }] },
  { id: 'data', d: 'M 0 290 H 250 L 318 222 H 430', stations: [{ x: 96, y: 290, label: 'Risk review' }] },
  { id: 'review', d: 'M 0 360 H 220 L 346 234 H 430', stations: [{ x: 130, y: 360, label: 'VAPT' }] },
]

export function NetworkArt({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="-10 0 532 420" className={className} role="img" aria-label="Five project workstreams drawn as metro lines converging on a Launch station">
      {LINES.map((l, i) => (
        <g key={l.id}>
          <motion.path
            d={l.d}
            fill="none"
            stroke={`var(--ws-${l.id})`}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.25 + i * 0.14, ease: [0.6, 0, 0.2, 1] }}
          />
          {l.stations.map((s, j) => (
            <motion.g
              key={s.label}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.14 + j * 0.12, type: 'spring', stiffness: 400, damping: 18 }}
              // Motion transforms SVG in fill-box space; the circle sits at the bottom of label + dot.
              style={{ originX: 0.5, originY: 0.72 }}
            >
              <circle cx={s.x} cy={s.y} r={8.5} fill="var(--surface)" stroke={`var(--ws-${l.id})`} strokeWidth={4} />
              <text x={s.x} y={s.y - 16} textAnchor="middle" fill="var(--muted)" fontSize={11} fontFamily="var(--font-mono)">
                {s.label}
              </text>
            </motion.g>
          ))}
        </g>
      ))}

      {/* A train running the core line, forever late by five minutes. */}
      {!reduce && (
        <g>
          <rect x={-13} y={-7} width={26} height={14} rx={7} fill="var(--ink)" />
          <rect x={4} y={-3} width={6} height={6} rx={2} fill="var(--window)" />
          <animateMotion dur="6.5s" begin="1.6s" repeatCount="indefinite" rotate="auto" path={LINES[0].d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
        </g>
      )}

      {/* LAUNCH interchange */}
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.55, type: 'spring', stiffness: 260, damping: 16 }}
        style={{ originX: 0.5, originY: 0.32 }}
      >
        <rect x={424} y={170} width={48} height={80} rx={24} fill="var(--surface)" stroke="var(--ink)" strokeWidth={6} />
        <circle cx={448} cy={210} r={9} fill="var(--accent)" />
        <text x={448} y={278} textAnchor="middle" fill="var(--ink)" fontSize={17} fontWeight={800} fontFamily="var(--font-display)">
          LAUNCH
        </text>
        <text x={448} y={296} textAnchor="middle" fill="var(--muted)" fontSize={11} fontFamily="var(--font-mono)">
          DAY 15 · GO/NO-GO
        </text>
      </motion.g>
    </svg>
  )
}
