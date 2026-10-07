export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

export const wsVar = (role: string) => `var(--ws-${role})`

/** A soft avatar/background tint that adapts to the theme surface. */
export const hueBg = (hue: number, strength = 24) => `color-mix(in oklch, hsl(${hue} 75% 52%) ${strength}%, var(--surface))`
export const hueInk = (hue: number) => `color-mix(in oklch, hsl(${hue} 80% 40%) 70%, var(--ink))`
