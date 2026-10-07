import { cx } from '../../lib/cx'
import { useMeta, type ThemePref } from '../../store/meta'

const THEMES: { id: ThemePref; label: string; icon: string }[] = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'system', label: 'Auto', icon: '🖥️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
]

/** Sound + theme switches, compact enough for a top bar. */
export function SettingsControls({ compact = false }: { compact?: boolean }) {
  const settings = useMeta((s) => s.settings)
  const setSettings = useMeta((s) => s.setSettings)
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setSettings({ sound: !settings.sound })}
        className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-[15px] transition-colors hover:border-accent"
        aria-label={settings.sound ? 'Mute sound effects' : 'Turn sound effects on'}
        title={settings.sound ? 'Sound on' : 'Sound off'}
      >
        {settings.sound ? '🔊' : '🔇'}
      </button>
      <div role="radiogroup" aria-label="Theme" className="flex h-9 items-center rounded-xl border border-line bg-surface p-0.5">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={settings.theme === t.id}
            onClick={() => setSettings({ theme: t.id })}
            title={`${t.label} theme`}
            className={cx(
              'grid h-full place-items-center rounded-[9px] px-2 text-[13px] transition-colors',
              settings.theme === t.id ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink',
            )}
          >
            <span aria-hidden>{t.icon}</span>
            {!compact && <span className="sr-only">{t.label}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
