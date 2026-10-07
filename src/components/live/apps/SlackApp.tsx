import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { fmtClock } from '../../../live/engine'
import type { LiveEpisode, SlackMessage } from '../../../live/types'
import type { LiveApi } from '../../../live/useLive'
import { cx } from '../../../lib/cx'
import { Avatar } from '../../ui/bits'

export function unreadCount(ep: LiveEpisode, live: LiveApi, channel?: string): number {
  const s = live.state
  return ep.messages.filter((m) => (!channel || m.channel === channel) && s.messages.includes(m.id) && !s.readMessages.includes(m.id)).length
}

function Message({ ep, live, m }: { ep: LiveEpisode; live: LiveApi; m: SlackMessage }) {
  const p = ep.people.find((x) => x.id === m.from)
  const replied = live.state.replied[m.id]
  const r = m.replies?.find((x) => x.id === replied)
  return (
    <motion.li layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="group">
      <div className="flex gap-2.5 px-4 py-2 hover:bg-surface-2">
        {p && <Avatar c={p} size={34} className="mt-0.5 rounded-lg" />}
        <div className="min-w-0 flex-1">
          <p className="text-[13px]">
            <b className="text-ink">{p?.name ?? m.from}</b> <span className="text-[11px] text-muted">{p?.title}</span>
          </p>
          <p className="text-[14px] leading-relaxed whitespace-pre-line text-ink">{m.text}</p>
          {m.replies && !replied && (
            <div className="mt-2 flex flex-col items-start gap-1.5">
              {m.replies.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => live.reply(m.id, x.id)}
                  className="rounded-xl border border-line-strong bg-surface px-3 py-1.5 text-left text-[13px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
                >
                  ↩︎ {x.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {r && (
        <>
          <div className="flex gap-2.5 px-4 py-2">
            <span className="mt-0.5 grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg bg-accent text-[12px] font-bold text-accent-ink">You</span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold">You</p>
              <p className="text-[14px] leading-relaxed">{r.text}</p>
            </div>
          </div>
          {r.response && p && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex gap-2.5 px-4 py-2">
              <Avatar c={p} size={34} className="mt-0.5 rounded-lg" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold">{p.name}</p>
                <p className="text-[14px] leading-relaxed">{r.response}</p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.li>
  )
}

export function SlackApp({ ep, live, channel, setChannel }: { ep: LiveEpisode; live: LiveApi; channel: string; setChannel: (c: string) => void }) {
  const s = live.state
  const visible = useMemo(() => ep.messages.filter((m) => m.channel === channel && s.messages.includes(m.id)), [ep, channel, s.messages])
  const ch = ep.channels.find((c) => c.id === channel) ?? ep.channels[0]

  // Whatever is on screen counts as read — including messages that arrive while you watch.
  const visibleKey = visible.map((m) => m.id).join(',')
  useEffect(() => {
    if (visible.length) live.seen({ messages: visible.map((m) => m.id) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey])

  const groups: { label: string; kind: 'channel' | 'dm' }[] = [
    { label: 'Channels', kind: 'channel' },
    { label: 'Direct messages', kind: 'dm' },
  ]
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <aside className="flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-surface-2 p-2 md:w-48 md:flex-col md:overflow-visible md:border-r md:border-b-0">
        <p className="hidden px-2 pt-1 pb-2 font-display text-[14px] font-bold md:block">Shiok</p>
        {groups.map((g) => (
          <div key={g.kind} className="contents md:block">
            <p className="eyebrow hidden px-2 pt-2 pb-1 md:block">{g.label}</p>
            {ep.channels
              .filter((c) => c.kind === g.kind)
              .map((c) => {
                const n = unreadCount(ep, live, c.id)
                const who = c.with ? ep.people.find((p) => p.id === c.with) : undefined
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id)}
                    className={cx(
                      'flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] whitespace-nowrap md:w-full',
                      c.id === channel ? 'bg-accent text-accent-ink' : n ? 'font-bold text-ink' : 'text-ink-2 hover:bg-surface-3',
                    )}
                  >
                    <span aria-hidden>{who ? who.avatar : '#'}</span>
                    <span className="truncate">{c.kind === 'channel' ? c.name.replace(/^#/, '') : c.name}</span>
                    {n > 0 && c.id !== channel && (
                      <motion.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="ml-auto rounded-full bg-bad px-1.5 text-[10px] font-bold text-white">
                        {n}
                      </motion.span>
                    )}
                  </button>
                )
              })}
          </div>
        ))}
      </aside>
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="border-b border-line px-4 py-2.5">
          <p className="text-[14px] font-bold">{ch.kind === 'channel' ? ch.name : `${ch.name}`}</p>
          {ch.topic && <p className="truncate text-[12px] text-muted">{ch.topic}</p>}
        </header>
        <ul className="scroll-y min-h-0 flex-1 py-2">
          {visible.length === 0 && <li className="px-4 py-6 text-center text-[13px] text-muted">Nothing here yet.</li>}
          <AnimatePresence initial={false}>
            {visible.map((m) => (
              <Message key={m.id} ep={ep} live={live} m={m} />
            ))}
          </AnimatePresence>
        </ul>
        <div className="border-t border-line p-3">
          <div className="rounded-xl border border-line-strong px-3 py-2 text-[13px] text-muted">Message {ch.kind === 'channel' ? ch.name : ch.name} · {fmtClock(s.clock)}</div>
        </div>
      </section>
    </div>
  )
}
