import { motion } from 'motion/react'
import { ACTIONS, availability, PANEL_ACTIONS, type ActionId } from '../../game/actions'
import { BACKGROUNDS } from '../../game/backgrounds'
import { READINESS } from '../../game/meta'
import { canLaunchEarly } from '../../game/launch'
import { fill } from '../../game/text'
import { cx } from '../../lib/cx'
import { useGame } from '../../store/game'
import { Avatar, CostPips } from '../ui/bits'
import { Button } from '../ui/Button'
import { useRun, useScenario } from './hooks'

function ActionCard({ id, index }: { id: ActionId; index: number }) {
  const g = useRun()
  const act = useGame((s) => s.act)
  const setModal = useGame((s) => s.setModal)
  const def = ACTIONS[id]
  const av = availability(g, id)
  const needsPick = id === 'kopi' || id === 'contractor' || id === 'codeIt'
  const onClick = () => {
    if (id === 'kopi') setModal({ kind: 'pickRole' })
    else if (id === 'contractor') setModal({ kind: 'pickWs', action: 'contractor' })
    else if (id === 'codeIt') setModal({ kind: 'pickWs', action: 'codeIt' })
    else act(id)
  }
  const ok = needsPick ? av.ok || av.reason === 'Pick a workstream' : av.ok
  return (
    <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
      <motion.button
        type="button"
        disabled={!ok}
        onClick={onClick}
        whileHover={ok ? { y: -2 } : undefined}
        whileTap={ok ? { scale: 0.97 } : undefined}
        title={ok ? def.tip : av.reason}
        className={cx(
          'flex h-full w-full flex-col rounded-2xl border bg-surface p-3 text-left transition-colors',
          ok ? 'border-line hover:border-accent' : 'border-line opacity-50',
          id === 'codeIt' && ok && 'border-dashed',
        )}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="text-[18px]" aria-hidden>
            {def.icon}
          </span>
          <CostPips cost={av.cost} />
        </span>
        <span className="mt-1.5 text-[13px] leading-tight font-bold">{def.name}</span>
        <span className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-2">{ok ? def.blurb : av.reason}</span>
      </motion.button>
    </motion.li>
  )
}

function ReadinessList() {
  const g = useRun()
  const act = useGame((s) => s.act)
  const sc = useScenario()
  const done = READINESS.filter((r) => g.readiness[r.key]).length
  const pct = done / READINESS.length
  const R = 15
  const C = 2 * Math.PI * R
  return (
    <div data-tour="readiness">
      <div className="mb-2 flex items-center gap-3">
        <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90" aria-hidden>
          <circle cx="20" cy="20" r={R} fill="none" stroke="var(--surface-3)" strokeWidth="5" />
          <motion.circle
            cx="20"
            cy="20"
            r={R}
            fill="none"
            stroke="var(--good)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={false}
            animate={{ strokeDashoffset: C * (1 - pct) }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          />
        </svg>
        <div>
          <h3 className="font-display text-[14px] font-bold">Launch readiness</h3>
          <p className="text-[12px] text-muted">
            {done}/{READINESS.length} ready · reviewed at Go/No-Go on Day {g.targetDay}
          </p>
        </div>
      </div>
      <ul className="space-y-1.5">
        {READINESS.map((r) => {
          const isDone = g.readiness[r.key]
          const av = availability(g, 'readiness', r.key)
          return (
            <li key={r.key} className={cx('flex items-center gap-2.5 rounded-xl border px-2.5 py-2', isDone ? 'border-good/30 bg-good-soft' : 'border-line bg-surface')}>
              <span className="text-[15px]" aria-hidden>
                {isDone ? '✅' : r.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx('block truncate text-[12.5px] font-semibold', isDone && 'text-good-ink')}>{r.name}</span>
                {!isDone && <span className="block truncate text-[11px] text-muted">{av.ok ? r.description : av.reason ?? fill(r.requirementText, g)}</span>}
              </span>
              {!isDone && (
                <span className="flex shrink-0 items-center gap-1.5">
                  <Avatar c={sc.cast[r.owner]} size={20} />
                  <Button size="sm" variant={av.ok ? 'secondary' : 'ghost'} disabled={!av.ok} onClick={() => act('readiness', r.key)} title={r.description}>
                    Drive <CostPips cost={av.cost} />
                  </Button>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function MovesPanel() {
  const g = useRun()
  const callGoNoGo = useGame((s) => s.callGoNoGo)
  const ids: ActionId[] = [...PANEL_ACTIONS]
  if (BACKGROUNDS[g.background].canCode) ids.splice(ids.length - 1, 0, 'codeIt')
  return (
    <section className="space-y-5" aria-label="Moves" data-tour="moves">
      {canLaunchEarly(g) && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shine rounded-2xl border border-accent bg-accent-soft p-3">
          <p className="text-[13px] font-semibold">Every line has arrived. You can call Go/No-Go early.</p>
          <Button variant="primary" size="sm" className="mt-2" onClick={callGoNoGo} sound="ping">
            Call Go/No-Go now 🚀
          </Button>
        </motion.div>
      )}
      <div>
        <h3 className="font-display text-[14px] font-bold">Proactive moves</h3>
        <p className="mb-2 text-[12px] text-muted">Firefighting is reactive. These moves are how you get ahead.</p>
        <ul className="grid grid-cols-2 gap-2">
          {ids.map((id, i) => (
            <ActionCard key={id} id={id} index={i} />
          ))}
        </ul>
      </div>
      <ReadinessList />
    </section>
  )
}
