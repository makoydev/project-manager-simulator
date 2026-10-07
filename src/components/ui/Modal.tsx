import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

const WIDTHS = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-3xl',
  xl: 'sm:max-w-5xl',
}

/**
 * Dialog shell: a bottom sheet on phones, a centred card on larger screens.
 * Render inside <AnimatePresence> so it can animate out.
 */
export function Modal({
  onClose,
  children,
  size = 'md',
  label,
  className,
}: {
  onClose?: () => void
  children: ReactNode
  size?: keyof typeof WIDTHS
  label: string
  className?: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    // Move focus into the dialog for keyboard and screen-reader users.
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[3px]" onClick={onClose} aria-hidden />
      <motion.div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, scale: 0.98, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className={cx(
          'relative flex max-h-[94%] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-[var(--shadow-pop)] outline-none sm:max-h-[min(92%,920px)] sm:rounded-3xl',
          WIDTHS[size],
          className,
        )}
      >
        <div className="scroll-y min-h-0 flex-1 pb-[env(safe-area-inset-bottom,0px)]">{children}</div>
      </motion.div>
    </motion.div>
  )
}
