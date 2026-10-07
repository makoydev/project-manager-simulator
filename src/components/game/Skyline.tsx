// Static geometry, computed once.
const cbd = [
  { x: 690, w: 42, top: 92 },
  { x: 738, w: 30, top: 70 },
  { x: 774, w: 52, top: 110 },
  { x: 832, w: 36, top: 58 },
  { x: 874, w: 46, top: 96 },
  { x: 926, w: 32, top: 124 },
  { x: 964, w: 40, top: 84 },
]
const hdb = [
  { x: 1018, w: 56, top: 170 },
  { x: 1080, w: 64, top: 156 },
  { x: 1150, w: 50, top: 178 },
]
const windows = (() => {
  const out: { x: number; y: number; d: number }[] = []
  let seed = 7
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  for (const b of [...cbd, ...hdb]) {
    for (let y = b.top + 10; y < 252; y += 12)
      for (let x = b.x + 6; x < b.x + b.w - 6; x += 10) if (rnd() > 0.55) out.push({ x, y, d: rnd() * 3 })
  }
  return out
})()

/**
 * Stylised Singapore skyline silhouette: Supertrees, the Flyer, Marina Bay Sands,
 * ArtScience Museum, CBD towers and HDB blocks. Windows twinkle at night.
 */
export function Skyline({ night = true, className }: { night?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <g fill="var(--skyline)">
        {/* Supertrees */}
        {[48, 96, 140].map((x, i) => (
          <g key={x}>
            <rect x={x - 3} y={150 + i * 8} width={6} height={110} />
            <path d={`M ${x - 30} ${146 + i * 8} L ${x + 30} ${146 + i * 8} L ${x + 6} ${176 + i * 8} L ${x - 6} ${176 + i * 8} Z`} />
          </g>
        ))}
        {/* Singapore Flyer */}
        <circle cx={250} cy={150} r={66} fill="none" stroke="var(--skyline)" strokeWidth={5} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return <line key={i} x1={250} y1={150} x2={250 + 66 * Math.cos(a)} y2={150 + 66 * Math.sin(a)} stroke="var(--skyline)" strokeWidth={1.5} />
        })}
        <path d="M 236 260 L 250 150 L 264 260 Z" />
        <rect x={190} y={236} width={120} height={24} />
        {/* Marina Bay Sands */}
        {[392, 442, 492].map((x) => (
          <path key={x} d={`M ${x} 260 L ${x + 4} 100 L ${x + 30} 100 L ${x + 34} 260 Z`} />
        ))}
        <path d="M 378 92 L 548 88 L 566 92 L 566 99 L 378 101 Z" />
        {/* ArtScience Museum lotus */}
        <path d="M 600 260 Q 604 214 622 196 Q 628 230 636 260 Z" />
        <path d="M 626 260 Q 632 200 652 182 Q 656 226 662 260 Z" />
        <path d="M 652 260 Q 662 208 684 198 Q 682 234 684 260 Z" />
        {/* CBD */}
        {cbd.map((b) => (
          <rect key={b.x} x={b.x} y={b.top} width={b.w} height={260 - b.top} />
        ))}
        <rect x={850} y={34} width={2} height={26} />
        {/* HDB blocks */}
        {hdb.map((b) => (
          <rect key={b.x} x={b.x} y={b.top} width={b.w} height={260 - b.top} />
        ))}
      </g>
      {night &&
        windows.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={4} height={5} fill="var(--window)" className="twinkle" style={{ animationDelay: `${w.d}s` }} />
        ))}
    </svg>
  )
}
