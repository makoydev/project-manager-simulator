import { motion } from 'motion/react'
import { useEffect } from 'react'
import { debrief, nameOf, optionLocked } from '../../live/engine'
import type { LiveEpisode } from '../../live/types'
import type { LiveApi } from '../../live/useLive'
import { cx } from '../../lib/cx'
import { confetti } from '../../lib/confetti'
import { play } from '../../lib/sfx'
import { Avatar } from '../ui/bits'
import { Button } from '../ui/Button'
import { GRADE_META } from '../game/EventModal'

export function WrapUp({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const w = ep.wrapUp
  const pinned = s.transcript.filter((c) => s.pinned.includes(c.id))
  const complete = w.fields.every((f) => s.wrap.fields[f.id]) && !!s.wrap.post
  return (
    <div className="scroll-y h-full">
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <p className="eyebrow">5:30 PM · end of day</p>
        <h1 className="mt-1 font-display text-[clamp(22px,3vw,30px)] font-bold">{w.title}</h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{w.intro}</p>
        {pinned.length > 0 && (
          <div className="mt-4 rounded-2xl bg-warn-soft p-3">
            <p className="eyebrow mb-1.5">Your pinned notes</p>
            <ul className="space-y-1 text-[13px]">
              {pinned.map((c) => (
                <li key={c.id}>
                  📌 <b>{nameOf(ep, c.who)}:</b> {c.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-5 space-y-5">
          {w.fields.map((f, fi) => (
            <motion.fieldset key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fi * 0.06 }}>
              <legend className="text-[14px] font-bold">{f.label}</legend>
              <p className="text-[12.5px] text-muted">{f.help}</p>
              <div className="mt-2 grid gap-1.5" role="radiogroup" aria-label={f.label}>
                {f.options.map((o) => (
                  <label
                    key={o.id}
                    className={cx(
                      'flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-[13.5px]',
                      s.wrap.fields[f.id] === o.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong',
                    )}
                  >
                    <input type="radio" name={f.id} className="mt-1 accent-[var(--accent)]" checked={s.wrap.fields[f.id] === o.id} onChange={() => live.setWrap(f.id, o.id)} />
                    {o.text}
                  </label>
                ))}
              </div>
            </motion.fieldset>
          ))}
          <fieldset>
            <legend className="text-[14px] font-bold">Post the update to {w.post.channel}</legend>
            <p className="text-[12.5px] text-muted">{w.post.prompt}</p>
            <div className="mt-2 grid gap-1.5" role="radiogroup" aria-label="Team update">
              {w.post.options.map((o) => {
                const locked = optionLocked(s, o.needs)
                return (
                  <label
                    key={o.id}
                    className={cx(
                      'flex items-start gap-2 rounded-xl border px-3 py-2 text-[13.5px] whitespace-pre-line',
                      locked ? 'cursor-not-allowed border-line opacity-55' : 'cursor-pointer',
                      s.wrap.post === o.id ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-line-strong',
                    )}
                  >
                    <input type="radio" name="post" disabled={locked} className="mt-1 accent-[var(--accent)]" checked={s.wrap.post === o.id} onChange={() => live.setWrap('__post', o.id)} />
                    <span>
                      {o.text}
                      {locked && o.lockedHint && <span className="mt-1 block text-[12px] text-warn-ink">🔒 {o.lockedHint}</span>}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 pb-24">
          <p className="text-[12.5px] text-muted">{complete ? 'Ready to send.' : 'Fill in every field to finish the day.'}</p>
          <Button
            variant="primary"
            size="lg"
            disabled={!complete}
            sound="send"
            onClick={() => {
              live.submitWrap()
            }}
          >
            Post & log off 🌙
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Debrief({ ep, live, onExit }: { ep: LiveEpisode; live: LiveApi; onExit: () => void }) {
  const d = debrief(live.state, ep)
  useEffect(() => {
    const t = window.setTimeout(() => {
      play('stamp')
      if (d.score >= 85) confetti({ count: 140 })
    }, 500)
    return () => window.clearTimeout(t)
  }, [d.score])
  const tone = d.score >= 85 ? 'var(--accent)' : d.score >= 70 ? 'var(--good)' : d.score >= 50 ? 'var(--warn)' : 'var(--bad)'
  return (
    <div className="scroll-y h-full">
      <div className="mx-auto max-w-4xl p-4 pb-28 sm:p-6">
        <p className="eyebrow">Debrief · {ep.dayLabel}</p>
        <section className="mt-3 grid items-center gap-5 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-[auto_1fr]">
          <motion.div
            initial={{ scale: 2.6, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -6, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 360, damping: 16 }}
            className="mx-auto grid h-28 w-28 place-items-center rounded-full border-[6px] font-display text-[40px] font-extrabold"
            style={{ borderColor: tone, color: tone }}
          >
            {d.score}
          </motion.div>
          <div>
            <h1 className="font-display text-[clamp(22px,3vw,30px)] font-bold">{d.rating}</h1>
            <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{d.headline}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[12.5px]">
              <span className="rounded-full bg-surface-3 px-3 py-1">🤝 Exec trust {d.meters.trust}</span>
              <span className="rounded-full bg-surface-3 px-3 py-1">😊 Team morale {d.meters.morale}</span>
              <span className="rounded-full bg-surface-3 px-3 py-1">🎯 Clarity {d.meters.clarity}</span>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="eyebrow mb-2">Signals you missed ({d.missed.length})</h2>
            {d.missed.length === 0 ? (
              <p className="text-[13.5px] text-good-ink">You read every key message, comment and chart. That is what walking in prepared looks like.</p>
            ) : (
              <ul className="space-y-1.5 text-[13px]">
                {d.missed.map((m) => (
                  <li key={m.id} className="rounded-lg bg-bad-soft px-2.5 py-1.5 text-bad-ink">
                    <b>{m.where}:</b> {m.label}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[12px] text-muted">TPMs win meetings before they start: the facts that change a decision usually sit in a DM, a dashboard or a doc comment.</p>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="eyebrow mb-2">Your decision record</h2>
            <ul className="space-y-2">
              {d.record.map((r) => (
                <li key={r.field} className="text-[13px]">
                  <p>
                    <b>{r.label}:</b> {r.correct ? '✅' : '❌'} {r.chosen ?? '—'}
                  </p>
                  {!r.correct && r.right.length > 0 && <p className="text-[12.5px] text-good-ink">Accurate: {r.right.join(' / ')}</p>}
                  <p className="text-[12px] text-muted">{r.why}</p>
                </li>
              ))}
            </ul>
            {d.post && (
              <p className="mt-3 border-t border-line pt-2 text-[12.5px]">
                <b>Team update:</b> {GRADE_META[d.post.grade].icon} {d.post.insight}
              </p>
            )}
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <h2 className="eyebrow mb-3">Every moment, graded</h2>
          <ol className="space-y-2.5">
            {d.choices.map((c, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-[12px] text-muted">
                    {c.where} · <span className="text-ink-2">{c.prompt}</span>
                  </p>
                  <span className={cx('shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold', GRADE_META[c.grade].cls)}>
                    {c.optionId === null ? '🤐 Silence' : `${GRADE_META[c.grade].icon} ${GRADE_META[c.grade].label}`}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] font-semibold">“{c.text}”</p>
                <p className="mt-1 border-l-2 border-accent pl-2 text-[13px] leading-relaxed text-ink-2">{c.insight}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {d.rel.length > 0 && (
          <section className="mt-4 rounded-2xl border border-line bg-surface p-4">
            <h2 className="eyebrow mb-2">Relationships today</h2>
            <ul className="flex flex-wrap gap-2">
              {d.rel.map((r) => {
                const p = ep.people.find((x) => x.id === r.id)
                if (!p) return null
                return (
                  <li key={r.id} className={cx('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px]', r.delta > 0 ? 'bg-good-soft text-good-ink' : 'bg-bad-soft text-bad-ink')}>
                    <Avatar c={p} size={20} /> {p.short} {r.delta > 0 ? '+' : '−'}
                    {Math.abs(r.delta)}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="primary" size="lg" onClick={live.restart} sound="ping">
            Replay the day
          </Button>
          <Button size="lg" onClick={onExit}>
            Back to title
          </Button>
        </div>
      </div>
    </div>
  )
}
