import { motion, type HTMLMotionProps } from 'motion/react'
import { cx } from '../../lib/cx'
import { play, type Sfx } from '../../lib/sfx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink shadow-[var(--shadow-card)] hover:brightness-110',
  secondary: 'bg-surface text-ink border border-line-strong hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-ink-2 hover:bg-surface-3 hover:text-ink',
  danger: 'bg-bad text-white hover:brightness-110',
  good: 'bg-good text-white hover:brightness-110',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-2xl',
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  size?: Size
  sound?: Sfx | null
}

export function Button({ variant = 'secondary', size = 'md', sound = 'click', className, onClick, disabled, children, ...rest }: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      disabled={disabled}
      onClick={(e) => {
        if (sound) play(sound)
        onClick?.(e)
      }}
      className={cx(
        'inline-flex shrink-0 select-none items-center justify-center font-semibold transition-[filter,border-color,color,background-color] disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
