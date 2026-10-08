import { fmtClock, nameOf, toClock } from '../../../live/engine'
import type { LiveEpisode } from '../../../live/types'
import type { LiveApi } from '../../../live/useLive'
import { cx } from '../../../lib/cx'

export function CalendarApp({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const start = toClock('09:00')
  const end = toClock('18:00')
  const y = (min: number) => ((min - start) / (end - start)) * 100
  return (
    <div className="scroll-y h-full p-5">
      <p className="eyebrow">Calendar</p>
      <h2 className="mt-1 font-display text-[18px] font-bold">{ep.dayLabel}</h2>
      <div className="relative mt-4 h-[560px] border-l border-line pl-14">
        {Array.from({ length: 10 }, (_, i) => start + i * 60).map((t) => (
          <div key={t} className="absolute right-0 left-0 border-t border-line" style={{ top: `${y(t)}%` }}>
            <span className="absolute -top-2 -left-14 w-12 text-right font-mono text-[10px] text-muted">{fmtClock(t).replace(':00', '')}</span>
          </div>
        ))}
        {ep.calendar.map((c) => {
          const t = toClock(c.time)
          const done = c.meetingId ? !!s.outcomes[c.meetingId] : s.clock > t + 30
          const meeting = ep.meetings.find((m) => m.id === c.meetingId)
          return (
            <div
              key={c.time + c.title}
              className={cx('absolute right-2 left-14 rounded-lg border-l-4 px-2 py-1 text-[12px]', done ? 'border-line-strong bg-surface-2 text-muted' : 'border-accent bg-accent-soft text-ink')}
              style={{ top: `${y(t)}%`, minHeight: `${((meeting?.minutes ?? 30) / (end - start)) * 100}%` }}
            >
              <b>{c.title}</b> <span className="text-muted">· {fmtClock(t)}</span>
            </div>
          )
        })}
        <div className="absolute right-0 left-12 h-0.5 bg-bad" style={{ top: `${Math.max(0, Math.min(100, y(s.clock)))}%` }}>
          <span className="absolute -top-1 -left-1.5 h-2.5 w-2.5 rounded-full bg-bad" />
        </div>
      </div>
    </div>
  )
}

export function NotesApp({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const lines = s.transcript.filter((c) => c.who !== 'system')
  const pinned = lines.filter((c) => s.pinned.includes(c.id))
  return (
    <div className="scroll-y h-full p-5">
      <p className="eyebrow">Notes</p>
      <h2 className="mt-1 font-display text-[18px] font-bold">Today’s notes</h2>
      <p className="mt-1 text-[12.5px] text-ink-2">Pin the lines that matter (decisions, owners, dates, risks). You’ll want them when you write the decision record tonight.</p>
      {pinned.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {pinned.map((c) => (
            <li key={c.id} className="rounded-xl bg-warn-soft px-3 py-2 text-[13px]">
              📌 <b>{nameOf(ep, c.who)}:</b> {c.text}
            </li>
          ))}
        </ul>
      )}
      <p className="eyebrow mt-5 mb-2">Transcript</p>
      {lines.length === 0 && <p className="text-[13px] text-muted">Nothing said yet. Join a meeting.</p>}
      <ul className="space-y-1">
        {lines.map((c) => (
          <li key={c.id} className="group flex items-start gap-2 rounded-lg px-2 py-1 text-[13px] hover:bg-surface-2">
            <span className="w-14 shrink-0 font-mono text-[10.5px] text-muted">{fmtClock(c.clock).replace(' AM', '').replace(' PM', '')}</span>
            <span className="min-w-0 flex-1">
              <b>{nameOf(ep, c.who)}:</b> {c.text}
            </span>
            <button
              type="button"
              onClick={() => live.pin(c.id)}
              aria-pressed={s.pinned.includes(c.id)}
              aria-label="Pin this line"
              className={cx('shrink-0 rounded px-1 text-[13px]', s.pinned.includes(c.id) ? 'opacity-100' : 'opacity-30 group-hover:opacity-100')}
            >
              📌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
