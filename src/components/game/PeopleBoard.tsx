import { motion } from 'motion/react'
import { availability } from '../../game/actions'
import { ROLE_LABEL } from '../../game/meta'
import type { Role } from '../../game/types'
import { cx } from '../../lib/cx'
import { useGame } from '../../store/game'
import { Avatar, CostPips } from '../ui/bits'
import { Button } from '../ui/Button'
import { useRun, useScenario } from './hooks'

const ROLES: Role[] = ['sponsor', 'boss', 'pm', 'lead', 'partner', 'sre', 'security', 'compliance']

export function relTone(v: number): { ring: string; mood: string; label: string } {
  if (v >= 75) return { ring: 'var(--good)', mood: '😄', label: 'Ally' }
  if (v >= 55) return { ring: 'var(--good)', mood: '🙂', label: 'Friendly' }
  if (v >= 35) return { ring: 'var(--warn)', mood: '😐', label: 'Neutral' }
  return { ring: 'var(--bad)', mood: '😠', label: 'Strained' }
}

const QUADRANTS = [
  { label: 'Keep satisfied', hint: 'High power, low interest: brief, no surprises', cls: 'top-0 left-0' },
  { label: 'Manage closely', hint: 'High power, high interest: partner with them', cls: 'top-0 right-0 text-right' },
  { label: 'Monitor', hint: 'Low power, low interest: light touch', cls: 'bottom-0 left-0' },
  { label: 'Keep informed', hint: 'Low power, high interest: regular updates', cls: 'bottom-0 right-0 text-right' },
]

export function PeopleBoard() {
  const g = useRun()
  const sc = useScenario()
  const setModal = useGame((s) => s.setModal)
  const act = useGame((s) => s.act)
  // Nudge stakeholders who share a grid spot so nobody hides behind anybody.
  const seen = new Map<string, number>()
  const FAN = [
    [0, 0],
    [11, 4],
    [-11, 4],
    [0, 13],
  ]
  const placed = ROLES.map((r) => {
    const c = sc.cast[r]
    const key = `${c.power}-${c.interest}`
    const n = seen.get(key) ?? 0
    seen.set(key, n + 1)
    const [dx, dy] = FAN[n % FAN.length]
    // Inset so avatars never sit on the quadrant labels in the corners.
    return { r, c, x: 12 + ((c.interest - 1) / 4) * 76 + dx, y: 24 + (1 - (c.power - 1) / 4) * 50 + dy }
  })

  return (
    <section className="space-y-4" aria-label="Stakeholders" data-tour="people">
      <div>
        <h2 className="font-display text-[15px] font-bold">Stakeholder map</h2>
        <p className="text-[12.5px] text-ink-2">
          Nobody here reports to you. Influence without authority runs on relationships, so build them before you need them.
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="relative mx-auto aspect-[1.6] w-full max-w-[640px]">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[3px] overflow-hidden rounded-xl">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cx(i === 1 ? 'bg-accent-soft' : 'bg-surface-2')} />
            ))}
          </div>
          {QUADRANTS.map((q) => (
            <div key={q.label} className={cx('absolute max-w-[46%] p-2', q.cls)}>
              <p className="text-[11px] font-bold tracking-wide text-ink-2 uppercase">{q.label}</p>
              <p className="hidden text-[10.5px] text-muted sm:block">{q.hint}</p>
            </div>
          ))}
          {placed.map(({ r, c, x, y }, i) => {
            const tone = relTone(g.rel[r])
            return (
              <motion.button
                key={r}
                type="button"
                onClick={() => setModal({ kind: 'person', role: r })}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 380, damping: 18 }}
                whileHover={{ scale: 1.12, zIndex: 5 }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${Math.min(92, Math.max(8, x))}%`, top: `${Math.min(84, Math.max(16, y))}%` }}
                aria-label={`${c.name}, ${c.title}. Relationship ${Math.round(g.rel[r])} (${tone.label})`}
              >
                <span className="relative">
                  <Avatar c={c} size={40} ring={tone.ring} />
                  <span className="absolute -right-1.5 -bottom-1 text-[13px]" aria-hidden>
                    {tone.mood}
                  </span>
                </span>
                <span className="mt-1 rounded-md bg-surface/90 px-1.5 text-[11px] font-semibold whitespace-nowrap">{c.short}</span>
              </motion.button>
            )
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] tracking-wider text-muted uppercase">
          <span>↑ Power</span>
          <span>Interest →</span>
        </div>
      </div>

      <ul className="grid gap-2 md:grid-cols-2">
        {ROLES.map((r) => {
          const c = sc.cast[r]
          const v = g.rel[r]
          const tone = relTone(v)
          const av = availability(g, 'kopi', r)
          return (
            <li key={r} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <button type="button" onClick={() => setModal({ kind: 'person', role: r })} aria-label={`About ${c.name}`}>
                <Avatar c={c} size={36} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold">
                  {c.short} <span className="font-normal text-muted">· {ROLE_LABEL[r]}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                    <motion.div className="h-full rounded-full" style={{ background: tone.ring }} initial={false} animate={{ width: `${v}%` }} />
                  </div>
                  <span className="w-16 text-right text-[11px] text-muted">
                    {tone.mood} {Math.round(v)}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="secondary" disabled={!av.ok} title={av.reason} onClick={() => act('kopi', r)}>
                ☕ <CostPips cost={av.cost} />
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
