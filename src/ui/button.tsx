import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-input bg-surface text-ink hover:bg-surface-subtle',
  ghost: 'text-accent-text hover:bg-accent-subtle',
}

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 py-2.5 text-base leading-6',
  lg: 'min-h-11 px-5 py-2.5 text-base leading-6',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly leadingIcon?: ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={type}
      className={cn(
        'inline-flex w-full items-center justify-center gap-3 rounded-lg font-semibold shadow-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  )
}
