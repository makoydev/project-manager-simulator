import { getScenario } from './content'
import type { GameState, Role, ScenarioDef, WsRole } from './types'

const TOKEN = /\{([a-z]+)(?:\.([a-z]+))?\}/g

/** Replace {pm}, {pm.full}, {pm.title}, {ws.core}, {company}, {player}, {target}… with scenario values. */
export function fillText(text: string, sc: ScenarioDef, ctx: { player: string; targetDay: number; day: number }): string {
  return text.replace(TOKEN, (whole, head: string, tail?: string) => {
    if (head === 'ws' && tail) return sc.workstreams.find((w) => w.role === (tail as WsRole))?.name ?? whole
    const c = sc.cast[head as Role]
    if (c) return tail === 'full' ? c.name : tail === 'title' ? c.title : c.short
    switch (head) {
      case 'company':
        return sc.company
      case 'program':
        return sc.program
      case 'product':
        return sc.product
      case 'player':
        return ctx.player
      case 'target':
        return `Day ${ctx.targetDay}`
      case 'day':
        return `Day ${ctx.day}`
      default:
        return whole
    }
  })
}

export function fill(text: string, s: GameState): string {
  return fillText(text, getScenario(s.scenarioId), { player: s.playerName, targetDay: s.targetDay, day: s.day })
}
