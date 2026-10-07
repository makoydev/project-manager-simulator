import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fmtClock, meetingAt, toClock, type LiveEvent } from '../../live/engine'
import { KAYA_WEDNESDAY } from '../../live/episodes/kaya-wednesday'
import { useLive, type LiveApi } from '../../live/useLive'
import type { LiveEpisode } from '../../live/types'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sfx'
import { useGame } from '../../store/game'
import { Avatar } from '../ui/bits'
import { Button } from '../ui/Button'
import { DashApp } from './apps/DashApp'
import { DocsApp } from './apps/DocsApp'
import { SlackApp, unreadCount } from './apps/SlackApp'
import { CalendarApp, NotesApp } from './apps/SmallApps'
import { CallView, type Reaction } from './Stage'
import { Debrief, WrapUp } from './WrapUpDebrief'

type AppId = 'slack' | 'docs' | 'dash' | 'calendar' | 'notes'

const APPS: { id: AppId; label: string; icon: string; tint: string }[] = [
  { id: 'slack', label: 'Slack', icon: '💬', tint: '#5b2a86' },
  { id: 'docs', label: 'Docs', icon: '📄', tint: '#1f6fd1' },
  { id: 'dash', label: 'Dashboards', icon: '📈', tint: '#0f9aa8' },
  { id: 'calendar', label: 'Calendar', icon: '🗓️', tint: '#d03b3b' },
  { id: 'notes', label: 'Notes', icon: '📝', tint: '#c98a00' },
]

interface Notice {
  id: number
  app: AppId
  icon: string
  title: string
  text: string
  channel?: string
}

function LockScreen({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const previews = ep.messages.filter((m) => m.at === 'morning').slice(-3).reverse()
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden p-6 text-white"
      style={{ background: 'radial-gradient(120% 80% at 20% 10%, #3a1d5c 0%, #0d121d 55%, #071018 100%)' }}
    >
      <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[15px] font-semibold opacity-80">
        {ep.dayLabel}
      </motion.p>
      <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-[clamp(64px,12vw,120px)] leading-none font-bold">
        9:15
      </motion.p>
      <div className="mt-6 w-full max-w-md space-y-2">
        {previews.map((m, i) => {
          const p = ep.people.find((x) => x.id === m.from)
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-start gap-2.5 rounded-2xl bg-white/12 p-3 backdrop-blur"
            >
              {p && <Avatar c={p} size={32} />}
              <div className="min-w-0 text-[13px]">
                <p className="font-bold">
                  💬 {p?.short ?? m.from} <span className="font-normal opacity-60">· Slack</span>
                </p>
                <p className="line-clamp-2 opacity-90">{m.text}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-6 max-w-md space-y-2 text-center text-[14px] leading-relaxed opacity-85">
        {ep.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6">
        <Button variant="primary" size="lg" sound="ping" className="shine" onClick={live.startDay}>
          Open your laptop →
        </Button>
      </motion.div>
    </div>
  )
}

function DeskView({ ep, live, openApp }: { ep: LiveEpisode; live: LiveApi; openApp: (a: AppId) => void }) {
  const s = live.state
  const m = meetingAt(ep, s)
  if (!m) return null
  const prev = ep.meetings[s.meetingIndex - 1]
  const minutes = Math.max(1, Math.round(toClock(m.start) - s.clock))
  return (
    <div className="scroll-y flex h-full items-center justify-center p-4" style={{ background: 'radial-gradient(100% 70% at 80% 0%, var(--accent-soft), var(--bg) 60%)' }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-pop)] sm:p-6">
        {prev && s.outcomes[prev.id] && (
          <p className="mb-4 rounded-xl bg-surface-2 px-3 py-2 text-[12.5px] text-ink-2">
            <b>{prev.title}</b> ended: {s.outcomes[prev.id]}
          </p>
        )}
        <p className="eyebrow">Up next · in {minutes} min</p>
        <h2 className="mt-1 font-display text-[20px] leading-tight font-bold">{m.title}</h2>
        <p className="text-[13px] text-muted">{fmtClock(toClock(m.start))} · {m.minutes} min · video call</p>
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-[13.5px] text-ink-2">
          {m.agenda.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <div className="mt-3 flex -space-x-2">
          {m.attendees.map((id) => {
            const p = ep.people.find((x) => x.id === id)
            return p ? <Avatar key={id} c={p} size={30} className="ring-2 ring-[var(--surface)]" /> : null
          })}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-line-strong p-3 text-[12.5px] text-ink-2">
          <b className="text-ink">Desk time.</b> The best TPMs walk in prepared. Skim{' '}
          <button type="button" className="font-semibold text-accent underline-offset-2 hover:underline" onClick={() => openApp('slack')}>
            Slack
          </button>
          , the{' '}
          <button type="button" className="font-semibold text-accent underline-offset-2 hover:underline" onClick={() => openApp('docs')}>
            RFC
          </button>{' '}
          and the{' '}
          <button type="button" className="font-semibold text-accent underline-offset-2 hover:underline" onClick={() => openApp('dash')}>
            dashboards
          </button>
          , or join early.
        </div>
        <Button variant="primary" size="lg" className="mt-5 w-full" sound="whoosh" onClick={live.join}>
          🎥 Join call
        </Button>
      </motion.div>
    </div>
  )
}

function CallControls({ live, onLeave }: { live: LiveApi; onLeave: () => void }) {
  const ended = live.state.phase === 'meetingEnd'
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-call-line bg-call-bg px-3 py-2 text-call-ink">
      <span className="hidden items-center gap-1 rounded-full bg-white/8 px-3 py-1.5 text-[12px] text-call-muted sm:flex" title="You're muted until it's your turn to speak">
        🔇 Muted
      </span>
      <div className="flex items-center rounded-full bg-white/8 p-0.5 text-[12px]" role="radiogroup" aria-label="Speed">
        {[1, 1.5, 2].map((x) => (
          <button
            key={x}
            type="button"
            role="radio"
            aria-checked={live.speed === x}
            onClick={() => live.setSpeed(x)}
            className={cx('rounded-full px-2.5 py-1 font-semibold', live.speed === x ? 'bg-white text-call-bg' : 'text-call-muted hover:text-call-ink')}
          >
            {x}×
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => live.setPaused(!live.paused)}
        className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-semibold hover:bg-white/15"
        aria-pressed={live.paused}
      >
        {live.paused ? '▶ Resume' : '⏸ Pause'}
      </button>
      <button
        type="button"
        onClick={() => live.setRelaxed(!live.relaxed)}
        className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-semibold hover:bg-white/15"
        aria-pressed={live.relaxed}
        title="Turn answer timers on or off"
      >
        {live.relaxed ? '⏱ Timers off' : '⏱ Timers on'}
      </button>
      {ended && (
        <Button variant="danger" size="sm" onClick={onLeave} sound="click">
          Leave call
        </Button>
      )}
    </div>
  )
}

function MeetingEnded({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const m = meetingAt(ep, s)
  if (s.phase !== 'meetingEnd' || !m) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 grid place-items-center bg-[var(--scrim)] p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-line bg-surface p-5 text-ink shadow-[var(--shadow-pop)]">
        <p className="eyebrow">Call ended · {fmtClock(s.clock)}</p>
        <h3 className="mt-1 font-display text-[18px] font-bold">{m.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.outcomes[m.id]}</p>
        <Button variant="primary" className="mt-4 w-full" onClick={live.leave}>
          {s.meetingIndex + 1 < ep.meetings.length ? 'Back to your desk →' : 'Wrap up the day →'}
        </Button>
      </motion.div>
    </motion.div>
  )
}

export function LiveScreen() {
  const ep = KAYA_WEDNESDAY
  const go = useGame((s) => s.go)
  const [open, setOpen] = useState<AppId | null>(null)
  const [channel, setChannel] = useState(ep.channels[0]?.id ?? '')
  const [notices, setNotices] = useState<Notice[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [bounce, setBounce] = useState<Record<string, number>>({})
  const [confirmExit, setConfirmExit] = useState(false)
  const seq = useRef(0)

  const onEvent = useCallback(
    (e: LiveEvent) => {
      if (e.type === 'react') {
        const id = ++seq.current
        setReactions((r) => [...r, { id, who: e.who, emoji: e.emoji }])
        window.setTimeout(() => setReactions((r) => r.filter((x) => x.id !== id)), 1300)
      } else if (e.type === 'notify') {
        const id = ++seq.current
        if (e.app === 'slack') {
          const m = ep.messages.find((x) => x.id === e.id)
          const p = m && ep.people.find((x) => x.id === m.from)
          if (!m) return
          setNotices((n) => [...n.slice(-2), { id, app: 'slack', icon: p?.avatar ?? '💬', title: `${p?.short ?? m.from} · Slack`, text: m.text, channel: m.channel }])
        } else {
          const c = ep.docs.flatMap((d) => d.comments).find((x) => x.id === e.id)
          const p = c && ep.people.find((x) => x.id === c.who)
          if (!c) return
          setNotices((n) => [...n.slice(-2), { id, app: 'docs', icon: p?.avatar ?? '📄', title: `${p?.short ?? c.who} commented on the RFC`, text: c.text }])
        }
        setBounce((b) => ({ ...b, [e.app]: (b[e.app] ?? 0) + 1 }))
        play('ping')
        window.setTimeout(() => setNotices((n) => n.filter((x) => x.id !== id)), 6000)
      } else if (e.type === 'join') play('click')
      else if (e.type === 'end') play('stamp')
    },
    [ep],
  )
  const live = useLive(ep, onEvent)
  const s = live.state
  const inCall = s.phase === 'meeting' || s.phase === 'meetingEnd'

  // Space pauses during calls (unless typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' && inCall && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        live.setPaused(!live.paused)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inCall, live])

  const openApp = (a: AppId, ch?: string) => {
    if (ch) setChannel(ch)
    setOpen(a)
    play('click')
  }
  const badge = (a: AppId) =>
    a === 'slack' ? unreadCount(ep, live) : a === 'docs' ? ep.docs.flatMap((d) => d.comments).filter((c) => c.key && s.comments.includes(c.id) && !s.flags[`read:${c.id}`]).length : 0

  const app =
    open === 'slack' ? (
      <SlackApp ep={ep} live={live} channel={channel} setChannel={setChannel} />
    ) : open === 'docs' ? (
      <DocsApp ep={ep} live={live} />
    ) : open === 'dash' ? (
      <DashApp ep={ep} live={live} />
    ) : open === 'calendar' ? (
      <CalendarApp ep={ep} live={live} />
    ) : open === 'notes' ? (
      <NotesApp ep={ep} live={live} />
    ) : null

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Menu bar */}
      <header className="flex h-9 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-3 text-[12.5px]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="font-display font-bold">Shiok OS</span>
          <span className="hidden truncate text-muted sm:inline">· {ep.title}</span>
        </span>
        <span className="flex items-center gap-3">
          {inCall && s.pending && open && (
            <button type="button" onClick={() => setOpen(null)} className="pulse-ring rounded-full bg-bad px-2.5 py-0.5 text-[11.5px] font-bold text-white">
              🎙 Your turn{live.secondsLeft !== null ? ` · ${Math.ceil(live.secondsLeft)}s` : ''}
            </button>
          )}
          <span className="font-mono font-semibold tabular">{fmtClock(s.clock)}</span>
          {confirmExit ? (
            <span className="flex items-center gap-1">
              <span className="text-muted">Leave the day?</span>
              <button type="button" className="font-bold text-bad-ink" onClick={() => go('title')}>
                Yes
              </button>
              <button type="button" className="font-semibold text-ink-2" onClick={() => setConfirmExit(false)}>
                No
              </button>
            </span>
          ) : (
            <button type="button" className="text-muted hover:text-ink" onClick={() => (s.phase === 'debrief' ? go('title') : setConfirmExit(true))}>
              ⏏ Exit
            </button>
          )}
        </span>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <main className={cx('relative flex min-w-0 flex-1 flex-col', s.phase !== 'lock' && 'pb-16', inCall && 'bg-call-bg')}>
          <div className="relative min-h-0 flex-1">
            {s.phase === 'lock' && <LockScreen ep={ep} live={live} />}
            {s.phase === 'desk' && <DeskView ep={ep} live={live} openApp={openApp} />}
            {inCall && <CallView ep={ep} live={live} reactions={reactions} />}
            {s.phase === 'wrapup' && <WrapUp ep={ep} live={live} />}
            {s.phase === 'debrief' && <Debrief ep={ep} live={live} onExit={() => go('title')} />}
            <MeetingEnded ep={ep} live={live} />
          </div>
          {inCall && <CallControls live={live} onLeave={live.leave} />}
        </main>

        <AnimatePresence>
          {open && s.phase !== 'lock' && (
            <motion.aside
              key="app"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="fixed inset-x-0 top-9 bottom-16 z-40 flex flex-col border-l border-line bg-surface lg:static lg:z-auto lg:w-[440px] lg:shrink-0"
            >
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="text-[13px] font-bold">
                  {APPS.find((a) => a.id === open)?.icon} {APPS.find((a) => a.id === open)?.label}
                </span>
                <button type="button" onClick={() => setOpen(null)} className="rounded-lg px-2 py-0.5 text-[13px] text-muted hover:bg-surface-3 hover:text-ink">
                  {inCall ? '← Back to call' : '✕'}
                </button>
              </div>
              <div className="min-h-0 flex-1">{app}</div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Dock */}
      {s.phase !== 'lock' && (
        <nav className="pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center pb-[env(safe-area-inset-bottom,0px)]" aria-label="Apps">
          <div className="pointer-events-auto flex items-end gap-1.5 rounded-2xl border border-line bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-2 py-1.5 shadow-[var(--shadow-pop)] backdrop-blur">
            {APPS.map((a) => {
              const n = badge(a.id)
              return (
                <motion.button
                  key={`${a.id}-${bounce[a.id] ?? 0}`}
                  type="button"
                  onClick={() => (open === a.id ? setOpen(null) : openApp(a.id))}
                  initial={bounce[a.id] ? { y: 0 } : false}
                  animate={bounce[a.id] ? { y: [0, -14, 0, -7, 0] } : { y: 0 }}
                  transition={{ duration: 0.7 }}
                  whileHover={{ y: -6, scale: 1.12 }}
                  className="relative grid h-11 w-11 place-items-center rounded-xl text-[21px]"
                  style={{ background: `color-mix(in oklch, ${a.tint} 22%, var(--surface))`, boxShadow: open === a.id ? `0 0 0 2px ${a.tint}` : undefined }}
                  aria-label={`${a.label}${n ? `, ${n} unread` : ''}`}
                  title={a.label}
                >
                  {a.icon}
                  {n > 0 && <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] font-bold text-white">{n}</span>}
                </motion.button>
              )
            })}
          </div>
        </nav>
      )}

      {/* Notification banners */}
      <ol className="pointer-events-none fixed top-11 right-3 z-[60] flex w-[min(340px,calc(100%-24px))] flex-col gap-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {notices.map((n) => (
            <motion.li
              key={n.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => {
                  openApp(n.app, n.channel)
                  setNotices((x) => x.filter((y) => y.id !== n.id))
                }}
                className="flex w-full items-start gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left shadow-[var(--shadow-pop)]"
              >
                <span className="text-[22px]" aria-hidden>
                  {n.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-bold">{n.title}</span>
                  <span className="line-clamp-2 block text-[12.5px] text-ink-2">{n.text}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )
}
