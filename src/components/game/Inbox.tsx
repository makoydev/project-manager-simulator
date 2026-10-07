import { AnimatePresence, motion } from 'motion/react'
import { getEvent } from '../../game/content'
import { CHANNEL_META } from '../../game/meta'
import { fill } from '../../game/text'
import type { InboxItem, Urgency } from '../../game/types'
import { cx } from '../../lib/cx'
import { useGame } from '../../store/game'
import { Avatar } from '../ui/bits'
import { useRun, useScenario } from './hooks'

const URGENCY_ORDER: Record<Urgency, number> = { critical: 0, high: 1, normal: 2, low: 3 }
const STRIPE: Record<Urgency, string> = { critical: 'bg-bad', high: 'bg-warn', normal: 'bg-line-strong', low: 'bg-line' }

export function sortInbox(items: InboxItem[]): InboxItem[] {
  return [...items].sort(
    (a, b) =>
      URGENCY_ORDER[getEvent(a.eventId).urgency] - URGENCY_ORDER[getEvent(b.eventId).urgency] ||
      a.expiresDay - b.expiresDay ||
      b.arrivedDay - a.arrivedDay,
  )
}

function InboxCard({ item, index }: { item: InboxItem; index: number }) {
  const g = useRun()
  const sc = useScenario()
  const openEvent = useGame((s) => s.openEvent)
  const e = getEvent(item.eventId)
  const c = sc.cast[e.from]
  const ch = CHANNEL_META[e.channel]
  const left = item.expiresDay - g.day
  const fresh = item.arrivedDay === g.day
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, delay: index * 0.06 }}
    >
      <motion.button
        type="button"
        onClick={() => openEvent(item.uid)}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.985 }}
        className={cx(
          'group relative flex w-full gap-3 overflow-hidden rounded-2xl border bg-surface p-3 pl-4 text-left transition-colors hover:border-accent',
          e.urgency === 'critical' ? 'border-bad/50' : 'border-line',
        )}
      >
        <span className={cx('absolute inset-y-0 left-0 w-1', STRIPE[e.urgency])} aria-hidden />
        <span className="relative">
          <Avatar c={c} size={38} />
          <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-surface text-[10px]" aria-hidden>
            {ch.icon}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <span className="truncate font-semibold text-ink-2">{c.short}</span>
            <span aria-hidden>·</span>
            <span>{ch.label}</span>
            {fresh && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="new" />}
          </span>
          <span className="mt-0.5 block text-[14px] leading-snug font-bold text-ink">{fill(e.title, g)}</span>
          <span className="mt-0.5 line-clamp-1 text-[12.5px] text-ink-2">{fill(e.body, g)}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {e.urgency === 'critical' && (
              <span className="pulse-ring rounded-full bg-bad px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">Urgent</span>
            )}
            {item.fromRisk && (
              <span className="rounded-full bg-bad-soft px-2 py-0.5 text-[10px] font-bold text-bad-ink">⚠️ Risk materialised</span>
            )}
            <span
              className={cx(
                'rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold',
                left <= 0 ? 'bg-bad-soft text-bad-ink' : left === 1 ? 'bg-warn-soft text-warn-ink' : 'bg-surface-3 text-muted',
              )}
            >
              ⏳ {left <= 0 ? 'expires today' : left === 1 ? 'expires tomorrow' : `${left + 1} days`}
            </span>
          </span>
        </span>
      </motion.button>
    </motion.li>
  )
}

export function InboxPanel() {
  const g = useRun()
  const items = sortInbox(g.inbox)
  const expiring = g.inbox.filter((i) => i.expiresDay <= g.day).length
  return (
    <section className="flex min-h-0 flex-col" data-tour="inbox" aria-label="Inbox">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-[15px] font-bold">
          Inbox <span className="ml-1 font-mono text-[12px] text-muted">{items.length}</span>
        </h2>
        {expiring > 0 && <span className="text-[12px] font-semibold text-bad-ink">{expiring} expiring today</span>}
      </div>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <InboxCard key={it.uid} item={it} index={i} />
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dashed border-line-strong p-5 text-center"
        >
          <p className="text-2xl" aria-hidden>
            📭
          </p>
          <p className="mt-1 font-semibold">Inbox zero</p>
          <p className="mt-1 text-[13px] text-ink-2">
            Spend your remaining focus on proactive moves: kopi chats, risk reviews, launch readiness. The best TPMs work ahead of the fires.
          </p>
        </motion.div>
      )}
    </section>
  )
}
