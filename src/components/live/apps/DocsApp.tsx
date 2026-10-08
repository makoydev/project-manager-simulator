import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect, type ReactNode } from 'react'
import type { LiveDoc, LiveEpisode } from '../../../live/types'
import type { LiveApi } from '../../../live/useLive'
import { Avatar } from '../../ui/bits'

/** Wrap every quoted comment anchor in a highlight. */
function highlight(text: string, quotes: string[]): ReactNode {
  const hits = quotes.filter((q) => q && text.includes(q))
  if (!hits.length) return text
  const out: ReactNode[] = []
  let rest = text
  let k = 0
  while (rest.length) {
    const next = hits.map((q) => ({ q, i: rest.indexOf(q) })).filter((h) => h.i >= 0).sort((a, b) => a.i - b.i)[0]
    if (!next) {
      out.push(rest)
      break
    }
    out.push(rest.slice(0, next.i))
    out.push(
      <mark key={k++} className="rounded bg-warn-soft px-0.5 text-ink">
        {next.q}
      </mark>,
    )
    rest = rest.slice(next.i + next.q.length)
  }
  return out
}

export function DocView({ ep, doc, comments, compact }: { ep: LiveEpisode; doc: LiveDoc; comments: string[]; compact?: boolean }) {
  const shown = doc.comments.filter((c) => comments.includes(c.id))
  const author = ep.people.find((p) => p.id === doc.author)
  return (
    <div className={compact ? 'text-[12px]' : ''}>
      <p className="eyebrow">Design doc</p>
      <h2 className={compact ? 'mt-1 font-display text-[15px] font-bold' : 'mt-1 font-display text-[20px] leading-tight font-bold'}>{doc.title}</h2>
      {author && <p className="mt-1 text-[12px] text-muted">by {author.name}</p>}
      <div className={compact ? 'mt-3 space-y-3' : 'mt-4 space-y-5'}>
        {doc.sections.map((sec) => (
          <section key={sec.heading}>
            <h3 className={compact ? 'text-[12.5px] font-bold' : 'text-[15px] font-bold'}>{sec.heading}</h3>
            {sec.body.map((p, i) => (
              <p key={i} className={compact ? 'mt-1 leading-snug text-ink-2' : 'mt-1.5 text-[14px] leading-relaxed text-ink-2'}>
                {highlight(
                  p,
                  shown.map((c) => c.quote),
                )}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export function DocsApp({ ep, live }: { ep: LiveEpisode; live: LiveApi }) {
  const s = live.state
  const doc = ep.docs[0]
  const shown = doc ? doc.comments.filter((c) => s.comments.includes(c.id)) : []
  const shownKey = shown.map((c) => c.id).join(',')
  useEffect(() => {
    live.seen({ docs: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownKey])
  if (!doc) return null
  return (
    <div className="scroll-y h-full">
      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_220px]">
        <DocView ep={ep} doc={doc} comments={s.comments} />
        <aside>
          <p className="eyebrow mb-2">Comments ({shown.length})</p>
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {shown.map((c) => {
                const p = ep.people.find((x) => x.id === c.who)
                return (
                  <motion.li
                    key={c.id}
                    layout
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-line bg-surface-2 p-2.5 text-[12.5px]"
                  >
                    <div className="flex items-center gap-1.5">
                      {p && <Avatar c={p} size={20} />}
                      <b>{p?.short ?? c.who}</b>
                    </div>
                    <p className="mt-1 border-l-2 border-warn pl-2 text-[11.5px] text-muted italic">“{c.quote}”</p>
                    <p className="mt-1 leading-snug">
                      {c.text.split('\n').map((line, i) => (
                        <Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </Fragment>
                      ))}
                    </p>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </aside>
      </div>
    </div>
  )
}
