import { useMemo } from 'react'
import { getScenario } from '../../game/content'
import { projectionOf } from '../../game/state'
import type { GameState, ScenarioDef, WorkstreamDef, WsRole } from '../../game/types'
import { useGame } from '../../store/game'

/** The running game. Only call inside the game screen, where a game always exists. */
export function useRun(): GameState {
  return useGame((s) => s.game!)
}

export function useScenario(): ScenarioDef {
  const id = useGame((s) => s.game!.scenarioId)
  return getScenario(id)
}

export function useProjection(game: GameState) {
  return useMemo(() => projectionOf(game), [game])
}

export function wsDef(sc: ScenarioDef, role: WsRole): WorkstreamDef {
  return sc.workstreams.find((w) => w.role === role)!
}

export const WS_ORDER: WsRole[] = ['core', 'client', 'platform', 'data', 'review']
