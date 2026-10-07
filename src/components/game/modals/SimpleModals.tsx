import { motion } from 'motion/react'
import { ACTIONS, availability } from '../../../game/actions'
import { getEvent } from '../../../game/content'
import { ROLE_LABEL } from '../../../game/meta'
import { isDone } from '../../../game/schedule'
import { fill } from '../../../game/text'
import type { Role } from '../../../game/types'
import { wsVar } from '../../../lib/cx'
import { useGame } from '../../../store/game'
import { Avatar, CostPips } from '../../ui/bits'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { useRun, useScenario, WS_ORDER, wsDef } from '../hooks'
import { relTone } from '../PeopleBoard'
import { band } from '../RaidBoard'

const ROLES: Role[] = ['sponsor', 'boss', 'pm', 'lead', 'partner', 'sre', 'security', 'compliance']

export function PickRoleModal() {
  const g = useRun()
  const sc = useScenario()
  const act = useGame((s) => s.act)
  const close = () => useGame.getState().setModal(null)
  return (
    <Modal label="Kopi with whom?" onClose={close} size="md">
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-[19px] font-bold">☕ Kopi with whom?</h2>
        <p className="mt-1 text-[13.5px] text-ink-2">{ACTIONS.kopi.tip}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {ROLES.map((r, i) => {
            const c = sc.cast[r]
            const av = availability(g, 'kopi', r)
            const tone = relTone(g.rel[r])
            return (
              <motion.li key={r} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <button
                  type="button"
                  disabled={!av.ok}
                  onClick={() => act('kopi', r)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:border-accent disabled:opacity-45"
                >
                  <Avatar c={c} size={38} ring={tone.ring} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold">{c.short}</span>
                    <span className="block truncate text-[11.5px] text-muted">{av.ok ? `${ROLE_LABEL[r]} · ${tone.mood} ${Math.round(g.rel[r])}` : av.reason}</span>
                  </span>
                  <CostPips cost={av.cost} />
                </button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </Modal>
  )
}

export function PickWsModal({ action }: { action: 'contractor' | 'codeIt' }) {
  const g = useRun()
  const sc = useScenario()
  const act = useGame((s) => s.act)
  const close = () => useGame.getState().setModal(null)
  const def = ACTIONS[action]
  return (
    <Modal label={def.name} onClose={close} size="md">
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-[19px] font-bold">
          {def.icon} {def.name}
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-2">{def.blurb}</p>
        {action === 'codeIt' && (
          <p className="mt-2 rounded-xl bg-warn-soft p-3 text-[12.5px] text-warn-ink">
            You’re the TPM now. Are you sure the best use of your afternoon is a pull request?
          </p>
        )}
        <ul className="mt-4 space-y-2">
          {WS_ORDER.map((r) => {
            const w = g.ws[r]
            const d = wsDef(sc, r)
            const av = availability(g, action, r)
            return (
              <li key={r}>
                <button
                  type="button"
                  disabled={!av.ok}
                  onClick={() => act(action, r)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:border-accent disabled:opacity-45"
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: wsVar(r) }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-bold">
                      {d.icon} {d.name}
                    </span>
                    <span className="block text-[11.5px] text-muted">
                      {isDone(w) ? 'Complete' : av.ok ? `${Math.round((w.done / w.work) * 100)}% done` : av.reason}
                    </span>
                  </span>
                  <CostPips cost={av.cost} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Modal>
  )
}

export function ConfirmEndDayModal({ expiring }: { expiring: string[] }) {
  const g = useRun()
  const proceed = useGame((s) => s.proceedEndDay)
  const close = () => useGame.getState().setModal(null)
  return (
    <Modal label="End the day?" onClose={close} size="sm">
      <div className="p-5 sm:p-6">
        <p className="text-3xl" aria-hidden>
          ⏳
        </p>
        <h2 className="mt-2 font-display text-[19px] font-bold">
          {expiring.length} message{expiring.length > 1 ? 's' : ''} will expire
        </h2>
        <p className="mt-1 text-[13.5px] text-ink-2">Ignoring is a decision too, and people notice. Unanswered, these will play out on their own:</p>
        <ul className="mt-3 space-y-1.5">
          {expiring.map((id) => (
            <li key={id} className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-semibold text-bad-ink">
              {fill(getEvent(id).title, g)}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button onClick={close}>Back to inbox</Button>
          <Button variant="danger" onClick={proceed}>
            End day anyway
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function ConfirmQuitModal() {
  const quit = useGame((s) => s.quit)
  const go = useGame((s) => s.go)
  const close = () => useGame.getState().setModal(null)
  return (
    <Modal label="Leave the program?" onClose={close} size="sm">
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-[19px] font-bold">Take a break?</h2>
        <p className="mt-1 text-[13.5px] text-ink-2">Your progress saves automatically after every move. You can continue from the title screen.</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="danger" onClick={quit}>
            Abandon program
          </Button>
          <Button
            onClick={() => {
              close()
              go('title')
            }}
          >
            Save & exit
          </Button>
          <Button variant="primary" onClick={close}>
            Keep playing
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function RiskModal({ id }: { id: string }) {
  const g = useRun()
  const sc = useScenario()
  const act = useGame((s) => s.act)
  const close = () => useGame.getState().setModal(null)
  const r = sc.risks.find((x) => x.id === id)!
  const st = g.risks[id]
  const exposure = r.likelihood * r.impact
  const av = availability(g, 'mitigate', id)
  return (
    <Modal label={r.title} onClose={close} size="md">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-md px-2 py-0.5 text-[11px] font-bold text-ink" style={{ background: band(exposure).bg }}>
            {band(exposure).label} · {r.likelihood}×{r.impact} = {exposure}
          </span>
          <span className="text-[12px] font-semibold text-muted uppercase">{st}</span>
        </div>
        <h2 className="mt-2 font-display text-[19px] font-bold">{r.title}</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{fill(r.description, g)}</p>
        <div className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
          <Avatar c={sc.cast[r.owner]} size={22} /> Owner: {sc.cast[r.owner].name}
          {r.ws && <span>· {wsDef(sc, r.ws).name}</span>}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-4">
          <p className="eyebrow">Mitigation</p>
          <p className="mt-1 text-[14px] font-semibold">{r.mitigation.label}</p>
          <p className="mt-1 text-[12.5px] text-ink-2">
            Mitigating cuts the odds of this firing by about 75%. You can also accept a low-exposure risk and spend your focus elsewhere.
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={close}>Close</Button>
          {st === 'open' && (
            <Button variant="primary" disabled={!av.ok} title={av.reason} onClick={() => act('mitigate', id)}>
              🛡️ Mitigate <CostPips cost={av.cost} className="[&_svg]:fill-accent-ink" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export function PersonModal({ role }: { role: Role }) {
  const g = useRun()
  const sc = useScenario()
  const act = useGame((s) => s.act)
  const close = () => useGame.getState().setModal(null)
  const c = sc.cast[role]
  const v = g.rel[role]
  const tone = relTone(v)
  const av = availability(g, 'kopi', role)
  const owns = sc.workstreams.filter((w) => w.owner === role)
  return (
    <Modal label={c.name} onClose={close} size="sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar c={c} size={56} ring={tone.ring} />
          <div>
            <h2 className="font-display text-[18px] leading-tight font-bold">{c.name}</h2>
            <p className="text-[12.5px] text-muted">
              {c.title} · {c.location}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{c.bio}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ['Power', `${c.power}/5`],
            ['Interest', `${c.interest}/5`],
            ['Relationship', `${tone.mood} ${Math.round(v)}`],
          ].map(([k, val]) => (
            <div key={k} className="rounded-xl bg-surface-2 p-2">
              <dt className="text-[10.5px] font-semibold text-muted uppercase">{k}</dt>
              <dd className="font-mono text-[13px] font-semibold">{val}</dd>
            </div>
          ))}
        </dl>
        {owns.length > 0 && <p className="mt-3 text-[12.5px] text-muted">Owns: {owns.map((w) => `${w.icon} ${w.name}`).join(', ')}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={close}>Close</Button>
          <Button variant="primary" disabled={!av.ok} title={av.reason} onClick={() => act('kopi', role)}>
            ☕ Kopi chat <CostPips cost={av.cost} className="[&_svg]:fill-accent-ink" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
