import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fmtClock, meetingAt, nameOf, optionLocked } from '../../live/engine'
import type { LiveEpisode, LivePerson } from '../../live/types'
import type { LiveApi } from '../../live/useLive'
import { cx } from '../../lib/cx'
import { gallery } from '../../lib/gallery'
import { play } from '../../lib/sfx'
import { Kbd, Typewriter } from '../ui/bits'
import { DashChart } from './apps/DashApp'
import { DocView } from './apps/DocsApp'

export interface Reaction {
  id: number
  who: string
  emoji: string
}

const MOOD_TINT: Record<string, string> = {
  annoyed: 'var(--bad)',
  worried: 'var(--warn)',
  excited: 'var(--good)',
  amused: 'var(--good)',
}

function Tile({ p, speaking, reactions, small, you }: { p?: LivePerson; speaking: boolean; reactions: Reaction[]; small?: boolean; you?: boolean }) {
  const hue = p?.hue ?? 280
  const camera = you ? false : (p?.camera ?? true)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={cx('relative overflow-hidden rounded-2xl', small ? 'aspect-video' : 'aspect-video min-h-0')}
      style={{
        background: camera ? `radial-gradient(120% 90% at 50% 30%, hsl(${hue} 45% 32%), var(--call-tile))` : 'var(--call-tile)',
        boxShadow: speaking ? '0 0 0 3px var(--good), 0 0 24px -4px var(--good)' : '0 0 0 1px var(--call-line)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div className="absolute inset-0 grid place-items-center">
        {you ? (
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent font-display text-[15px] font-bold text-accent-ink">You</span>
        ) : camera ? (
          <motion.span
            animate={speaking ? { y: [0, -3, 0], rotate: [0, -2, 2, 0] } : { y: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: speaking ? 0.7 : 3.5 }}
            className={small ? 'text-[30px]' : 'text-[clamp(22px,6vw,64px)]'}
            aria-hidden
          >
            {p?.avatar}
          </motion.span>
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-full text-[24px]" style={{ background: `hsl(${hue} 30% 26%)` }} aria-hidden>
            {p?.avatar}
          </span>
        )}
      </div>
      {!camera && !you && (
        <span className="absolute top-2 right-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] text-call-muted" aria-label="camera off">
          📷✕
        </span>
      )}
      <div className="absolute right-2 bottom-2 left-2 flex items-center gap-1.5">
        <span className="truncate rounded-md bg-black/45 px-1.5 py-0.5 text-[11.5px] font-semibold text-call-ink">{you ? 'You' : p?.short}</span>
        {speaking ? (
          <span className="eq flex h-3 items-end gap-0.5 text-good" aria-label="speaking">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className="text-[10px] text-call-muted" aria-hidden>
            🔇
          </span>
        )}
      </div>
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1.3 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1.1 }}
            className="pointer-events-none absolute bottom-1/3 left-1/2 -translate-x-1/2 text-[28px]"
          >
            {r.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

function Captions({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const m = meetingAt(ep, s)
  const lines = s.transcript.filter((c) => c.meetingId === m?.id).slice(-2)
  // While it's your turn the choice panel owns the bottom of the stage; the prompt carries the context.
  if (s.pending) return null
  return (
    <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex flex-col items-center gap-1" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {lines.map((c, i) => {
          const last = i === lines.length - 1
          const p = ep.people.find((x) => x.id === c.who)
          return (
            <motion.p
              key={c.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: last ? 1 : 0.55, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={cx('max-w-[46rem] rounded-xl px-3 py-1.5 text-center text-[14.5px] leading-snug', c.who === 'system' ? 'bg-black/30 text-call-muted italic' : 'bg-black/60 text-call-ink')}
            >
              {c.who !== 'system' && (
                <b className="mr-1.5" style={{ color: c.who === 'you' ? 'var(--accent-2)' : p ? `hsl(${p.hue} 80% 75%)` : undefined }}>
                  {nameOf(ep, c.who)}
                  {c.overlap && <span className="ml-1 rounded bg-white/15 px-1 text-[10px] font-semibold text-call-muted">over</span>}
                  {c.mood && MOOD_TINT[c.mood] && <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: MOOD_TINT[c.mood] }} />}
                </b>
              )}
              {last && c.who !== 'system' && c.who !== 'you' ? <Typewriter text={c.text} speed={22} /> : c.text}
            </motion.p>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function ChoicePanel({ live }: { live: LiveApi }) {
  const c = live.state.pending
  // Read through a ref: facts read mid-choice (e.g. a Slack DM) can unlock options.
  const liveRef = useRef(live)
  liveRef.current = live
  useEffect(() => {
    if (!c) return
    play('ping')
    const onKey = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1
      const o = c.options[i]
      if (o && !optionLocked(liveRef.current.state, o.needs)) liveRef.current.answer(o.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c?.id])
  const left = live.secondsLeft
  const frac = c && left !== null ? left / c.timeout : 1
  useEffect(() => {
    if (left !== null && left > 0 && left < 5.2 && Math.abs(left - Math.round(left)) < 0.08) play('tick')
  }, [left])
  return (
    <AnimatePresence>
      {c && (
        <motion.div
          key={c.id}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="scroll-y absolute inset-x-2 bottom-2 z-20 max-h-[calc(100%-1rem)] rounded-2xl border border-call-line bg-call-bg p-3 shadow-2xl sm:inset-x-4 sm:bottom-4 sm:max-h-[calc(100%-2rem)] sm:p-4"
          role="dialog"
          aria-label="Your turn to speak"
        >
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--call-line)" strokeWidth="4" />
              {left !== null && (
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke={frac < 0.3 ? 'var(--bad)' : 'var(--accent-2)'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={94.2}
                  strokeDashoffset={94.2 * (1 - frac)}
                />
              )}
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold tracking-wide text-accent-2 uppercase">
                Your turn {left !== null && <span className="font-mono text-call-muted">· {Math.ceil(left)}s</span>}
              </p>
              <p className="text-[14px] font-semibold text-call-ink">{c.prompt}</p>
            </div>
          </div>
          <ol className="mt-3 grid gap-1.5">
            {c.options.map((o, i) => {
              const locked = optionLocked(live.state, o.needs)
              return (
                <li key={o.id}>
                  <motion.button
                    type="button"
                    disabled={locked}
                    onClick={() => live.answer(o.id)}
                    whileHover={locked ? undefined : { x: 4 }}
                    whileTap={locked ? undefined : { scale: 0.98 }}
                    className={cx(
                      'flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-[13.5px] leading-snug',
                      locked ? 'border-call-line text-call-muted' : 'border-call-line bg-white/5 text-call-ink hover:border-accent-2 hover:bg-white/10',
                    )}
                  >
                    <span className="mt-0.5 hidden sm:block">
                      <Kbd>{i + 1}</Kbd>
                    </span>
                    <span className="flex-1">
                      “{o.text}”
                      {locked && o.lockedHint && <span className="mt-0.5 block text-[11.5px] text-warn">🔒 {o.lockedHint}</span>}
                    </span>
                  </motion.button>
                </li>
              )
            })}
          </ol>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** An element's client size (keep it padding-free), kept current with a ResizeObserver. Pass the setter as a callback ref. */
function useSize<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [el])
  return [setEl, size] as const
}

export function CallView({ ep, live, reactions }: { ep: LiveEpisode; live: LiveApi; reactions: Reaction[] }) {
  const [gridRef, box] = useSize<HTMLDivElement>()
  const s = live.state
  const m = meetingAt(ep, s)
  if (!m) return null
  const people = s.present.map((id) => ep.people.find((p) => p.id === id)).filter(Boolean) as LivePerson[]
  const n = people.length + 1
  // Fit every tile in the stage at 16:9; fixed breakpoint columns overflowed onto the controls in short windows.
  const gap = box.w < 600 ? 8 : 12
  const fit = gallery(n, box.w, box.h, gap)
  const share = s.sharing
  const doc = share?.app === 'doc' ? ep.docs.find((d) => d.id === share.id) : undefined
  const dash = share?.app === 'dash' ? ep.dashboards.find((d) => d.id === share.id) : undefined
  const sharer = share ? nameOf(ep, share.who) : ''
  const tiles = (small: boolean) => (
    <AnimatePresence>
      {people.map((p) => (
        <Tile key={p.id} p={p} small={small} speaking={s.speaking.includes(p.id)} reactions={reactions.filter((r) => r.who === p.id)} />
      ))}
      <Tile key="you" you small={small} speaking={false} reactions={reactions.filter((r) => r.who === 'you')} />
    </AnimatePresence>
  )

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-call-bg text-call-ink">
      <div className="flex items-center justify-between gap-2 border-b border-call-line px-3 py-2 text-[12.5px]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-bad pulse-ring" aria-hidden />
          <b className="truncate">{m.title}</b>
        </span>
        <span className="shrink-0 font-mono text-call-muted">
          {fmtClock(s.clock)} · {people.length + 1} in call
        </span>
      </div>
      <div className="relative min-h-0 flex-1 p-2 sm:p-3">
        {share && (doc || dash) ? (
          <div className="flex h-full min-h-0 flex-col gap-2 lg:flex-row">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="scroll-y min-h-0 flex-1 rounded-2xl border border-call-line bg-surface p-4 text-ink"
            >
              <p className="mb-2 text-[11px] font-semibold text-muted">🖥 {sharer} is sharing</p>
              {doc && <DocView ep={ep} doc={doc} comments={s.comments} compact />}
              {dash && <DashChart p={dash} />}
            </motion.div>
            <div className="grid shrink-0 auto-rows-max grid-cols-4 gap-2 lg:w-44 lg:grid-cols-1 lg:content-start lg:overflow-y-auto">{tiles(true)}</div>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="mx-auto grid h-full max-w-5xl content-center justify-center"
            style={box.w ? { gap, gridTemplateColumns: `repeat(${fit.cols}, ${Math.max(48, Math.floor(fit.tile))}px)` } : undefined}
          >
            {tiles(false)}
          </div>
        )}
        <Captions ep={ep} live={live} />
        <ChoicePanel live={live} />
      </div>
    </div>
  )
}
