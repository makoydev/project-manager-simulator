/**
 * localStorage that never throws: private windows, sandboxed frames and blocked
 * site data all degrade to "nothing saved" instead of crashing the game.
 */
export function load<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — keep playing in memory */
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
