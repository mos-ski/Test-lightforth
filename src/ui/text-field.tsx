import type { InputHTMLAttributes } from 'react'

import { cn } from './cn'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export function TextField({ className, id, label, error, ...props }: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div data-slot="text-field" className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-11 rounded-lg border border-input bg-surface px-3 py-2 text-base text-ink shadow-control outline-none transition-colors placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus sm:text-sm',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
