/**
 * Lightweight canvas confetti. Colours come from the live theme tokens so the
 * burst matches the workstream lines in both light and dark mode.
 */
interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  w: number
  h: number
  color: string
  life: number
}

export function confetti(opts: { x?: number; y?: number; count?: number; spread?: number } = {}) {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const css = getComputedStyle(document.documentElement)
  const colors = ['--ws-core', '--ws-client', '--ws-platform', '--ws-data', '--ws-review', '--accent', '--warn'].map(
    (v) => css.getPropertyValue(v).trim() || '#9900aa',
  )
  const canvas = document.createElement('canvas')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '80' })
  document.body.appendChild(canvas)
  const g = canvas.getContext('2d')
  if (!g) return canvas.remove()
  g.scale(dpr, dpr)

  const ox = opts.x ?? window.innerWidth / 2
  const oy = opts.y ?? window.innerHeight / 3
  const spread = opts.spread ?? 1
  const pieces: Piece[] = Array.from({ length: opts.count ?? 120 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1 * spread
    const speed = 6 + Math.random() * 9
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    }
  })

  let last = performance.now()
  const step = (now: number) => {
    const dt = Math.min(2, (now - last) / 16.7)
    last = now
    g.clearRect(0, 0, window.innerWidth, window.innerHeight)
    let alive = 0
    for (const p of pieces) {
      p.vy += 0.28 * dt
      p.vx *= 0.99
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt
      p.life -= 0.006 * dt
      if (p.life <= 0 || p.y > window.innerHeight + 40) continue
      alive++
      g.save()
      g.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5))
      g.translate(p.x, p.y)
      g.rotate(p.rot)
      g.fillStyle = p.color
      g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      g.restore()
    }
    if (alive) requestAnimationFrame(step)
    else canvas.remove()
  }
  requestAnimationFrame(step)
}
