import { motion } from 'motion/react'
import { availability, type ActionId } from '../../game/actions'
import { BACKGROUNDS } from '../../game/backgrounds'
import { capFor, isDone, waitingOn } from '../../game/schedule'
import type { WsRole } from '../../game/types'
import { cx, wsVar } from '../../lib/cx'
import { useGame } from '../../store/game'
import { Avatar, CostPips } from '../ui/bits'
import { useProjection, useRun, useScenario, WS_ORDER, wsDef } from './hooks'

function Track({ role, pct, cap, blocked, done, moving }: { role: WsRole; pct: number; cap: number; blocked: boolean; done: boolean; moving: boolean }) {
  const color = wsVar(role)
  return (
    <div className="relative mx-3 h-9" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full" style={{ background: `color-mix(in oklch, ${color} 22%, var(--surface))` }} />
      <motion.div
        className={cx('absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full', moving && !done && 'stripes')}
        style={{ backgroundColor: color }}
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      />
      {[0.25, 0.5, 0.75].map((s) => (
        <span
          key={s}
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-surface"
          style={{ left: `${s * 100}%`, borderColor: pct >= s ? color : `color-mix(in oklch, ${color} 35%, var(--surface))` }}
        />
      ))}
      {cap < 1 && (
        <span className="absolute top-0 bottom-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${cap * 100}%` }}>
          <span className="h-full w-[3px] rounded-full bg-ink/70" />
          <span className="absolute -top-1 grid h-5 w-5 place-items-center rounded-full border border-line-strong bg-surface text-[10px]">🔒</span>
        </span>
      )}
      <span
        className="absolute top-1/2 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px]"
        style={{ left: '100%', borderColor: 'var(--ink)', background: done ? color : 'var(--surface)' }}
      />
      <motion.span
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={{ left: `${Math.max(0.02, Math.min(0.98, pct)) * 100}%` }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      >
        <motion.span
          animate={blocked ? { x: [0, -2, 2, -2, 0] } : { y: moving && !done ? [0, -1.5, 0] : 0 }}
          transition={blocked ? { repeat: Infinity, duration: 0.5, repeatDelay: 1.4 } : { repeat: Infinity, duration: 0.6 }}
          className={cx(
            'flex h-6 items-center gap-1 rounded-full border-2 px-1.5 text-[12px] shadow-[var(--shadow-card)]',
            blocked ? 'border-bad bg-bad-soft' : 'border-ink bg-surface',
          )}
        >
          <span>{blocked ? '⚠️' : done ? '🏁' : '🚆'}</span>
        </motion.span>
      </motion.span>
    </div>
  )
}

function RowAction({ id, role, label, icon }: { id: ActionId; role: WsRole; label: string; icon: string }) {
  const g = useRun()
  const act = useGame((s) => s.act)
  const av = availability(g, id, role)
  return (
    <button
      type="button"
      disabled={!av.ok}
      onClick={() => act(id, role)}
      title={av.ok ? label : av.reason}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[12px] font-semibold text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-2"
    >
      <span aria-hidden>{icon}</span>
      {label}
      <CostPips cost={av.cost} />
    </button>
  )
}

function LineRow({ role, index }: { role: WsRole; index: number }) {
  const g = useRun()
  const sc = useScenario()
  const p = useProjection(g)
  const w = g.ws[role]
  const def = wsDef(sc, role)
  const owner = sc.cast[def.owner]
  const pct = Math.min(1, w.done / w.work)
  const cap = capFor(w, g.ws)
  const waiting = waitingOn(w, g.ws)
  const done = isDone(w)
  const blocked = w.blockedDays > 0
  const critical = p.critical.includes(role) && !done
  const finish = p.finish[role]
  const late = finish === null ? null : finish - g.targetDay
  const mods = g.modifiers.filter((m) => (m.ws === role || m.ws === 'all') && m.untilDay >= g.day && (m.fromDay ?? 0) <= g.day)
  const canCode = BACKGROUNDS[g.background].canCode

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cx('group rounded-2xl border bg-surface p-3 sm:p-4', critical ? 'border-accent/45' : 'border-line')}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: wsVar(role) }} aria-hidden />
        <h3 className="text-[14.5px] font-bold">
          <span aria-hidden>{def.icon}</span> {def.name}
        </h3>
        {critical && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">◆ Critical path</span>}
        {blocked && (
          <span className="pulse-ring rounded-full bg-bad-soft px-2 py-0.5 text-[11px] font-bold text-bad-ink">
            ⛔ Train fault · {w.blockedDays}d
          </span>
        )}
        {waiting && !blocked && (
          <span className="rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-bold text-warn-ink">🔒 Waiting for {wsDef(sc, waiting).name}</span>
        )}
        {done && <span className="rounded-full bg-good-soft px-2 py-0.5 text-[11px] font-bold text-good-ink">✓ Arrived</span>}
        <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted">
          <Avatar c={owner} size={22} />
          {owner.short}
        </span>
      </div>
      {blocked && w.blockReason && <p className="mt-1 text-[12.5px] text-bad-ink">{w.blockReason}</p>}

      <Track role={role} pct={pct} cap={cap} blocked={blocked} done={done} moving={!blocked && !waiting} />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px]">
        <span className="font-mono font-semibold tabular">{Math.round(pct * 100)}%</span>
        <span className="text-muted tabular">
          {Math.round(w.done)}/{Math.round(w.work)} pts
        </span>
        <span className="text-ink-2">
          {done ? (
            'Complete'
          ) : (
            <>
              ETA <b className="font-mono tabular">{finish === null ? '—' : `Day ${finish}`}</b>
              {late !== null && late > 0 && <span className="ml-1 font-semibold text-bad-ink">+{late}d</span>}
            </>
          )}
        </span>
        {mods.map((m, i) => (
          <span key={i} className={cx('rounded-md px-1.5 py-0.5 text-[11px] font-semibold', m.mult >= 1 ? 'bg-good-soft text-good-ink' : 'bg-bad-soft text-bad-ink')}>
            {m.mult >= 1 ? '🚀' : '🐢'} {m.label} ×{m.mult}
          </span>
        ))}
        {!done && (
          <span className="ml-auto flex flex-wrap gap-1.5">
            {blocked && <RowAction id="facilitate" role={role} label="Facilitate" icon="🧩" />}
            {blocked && <RowAction id="escalate" role={role} label="Escalate" icon="🚨" />}
            <span className="flex gap-1.5 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
              <RowAction id="descope" role={role} label="Descope" icon="✂️" />
              {canCode && <RowAction id="codeIt" role={role} label="Code it" icon="⌨️" />}
            </span>
          </span>
        )}
      </div>
    </motion.li>
  )
}

/** Projected timeline: each line's bar runs to its ETA; the critical path is outlined. */
function Timeline() {
  const g = useRun()
  const sc = useScenario()
  const p = useProjection(g)
  const finishes = WS_ORDER.map((r) => p.finish[r] ?? 30)
  const horizon = Math.min(30, Math.max(sc.maxDay, g.targetDay, ...finishes))
  const x = (day: number) => `${(day / horizon) * 100}%`
  const ticks = [1, 5, 10, 15, 20, 25, 30].filter((d) => d <= horizon)
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="eyebrow">Projected timeline</h3>
        <span className="text-[12px] text-muted">Solid = done so far · hatched = projected · ◆ = critical path</span>
      </div>
      <div className="relative">
        <div className="space-y-2">
          {WS_ORDER.map((r) => {
            const def = wsDef(sc, r)
            const f = p.finish[r]
            const end = Math.min(horizon, f ?? horizon)
            const critical = p.critical.includes(r) && !isDone(g.ws[r])
            return (
              <div key={r} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center text-[13px]" title={def.name} aria-hidden>
                  {def.icon}
                </span>
                <div className="relative h-5 flex-1">
                  <motion.div
                    title={`${def.name}: ${f === null ? 'no ETA' : `ETA Day ${f}`}`}
                    className={cx('absolute top-0 h-full overflow-hidden rounded-[5px]', critical && 'ring-2 ring-accent ring-offset-1 ring-offset-[var(--surface)]')}
                    style={{ left: 0 }}
                    initial={false}
                    animate={{ width: x(Math.max(0.5, end)) }}
                    transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                  >
                    <div className="absolute inset-0" style={{ background: `color-mix(in oklch, ${wsVar(r)} 30%, var(--surface))` }} />
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{ width: `${(Math.min(g.day - 1, end) / Math.max(end, 0.5)) * 100}%`, background: wsVar(r) }}
                    />
                    <div className="stripes absolute inset-0 opacity-60" />
                  </motion.div>
                  {f !== null && (
                    <span className="absolute top-0 h-full text-[10px] leading-5 font-semibold text-ink-2" style={{ left: `calc(${x(end)} + 6px)` }}>
                      {critical ? '◆ ' : ''}D{f}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 left-8" aria-hidden>
          <div className="absolute -top-1 -bottom-1 w-[2px] bg-ink/60" style={{ left: x(g.day - 1) }} title="Today" />
          <div className="absolute -top-2 -bottom-1 w-[2px] bg-accent" style={{ left: x(g.targetDay) }} />
          <span className="absolute -top-5 -translate-x-1/2 text-[11px]" style={{ left: x(g.targetDay) }}>
            🚀
          </span>
        </div>
        <div className="relative mt-2 ml-8 h-4 text-[10px] text-muted">
          {ticks.map((d) => (
            <span key={d} className="absolute -translate-x-1/2 font-mono" style={{ left: x(d) }}>
              D{d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function NetworkBoard() {
  const g = useRun()
  const sc = useScenario()
  const p = useProjection(g)
  const chain = p.critical.filter((r) => !isDone(g.ws[r]))
  return (
    <section className="space-y-3" data-tour="board" aria-label="Network map">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-[15px] font-bold">Network map</h2>
          <p className="text-[12.5px] text-ink-2">Five lines, one terminal. The slowest chain of dependencies, your critical path, sets the launch date.</p>
        </div>
        {chain.length > 0 && (
          <p className="flex flex-wrap items-center gap-1 text-[12px] text-ink-2">
            <span className="font-semibold text-accent">◆ Critical path:</span>
            {[...chain].reverse().map((r, i) => (
              <span key={r} className="inline-flex items-center gap-1">
                {i > 0 && <span aria-hidden>→</span>}
                <span className="rounded-md bg-surface-3 px-1.5 py-0.5 font-semibold">
                  {wsDef(sc, r).icon} {wsDef(sc, r).name}
                </span>
              </span>
            ))}
          </p>
        )}
      </div>
      <ul className="space-y-2.5">
        {WS_ORDER.map((r, i) => (
          <LineRow key={r} role={r} index={i} />
        ))}
      </ul>
      <Timeline />
    </section>
  )
}
