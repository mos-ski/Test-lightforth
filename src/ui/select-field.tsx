import type { SelectHTMLAttributes } from 'react'

import { cn } from './cn'

export type SelectFieldOption = {
  readonly label: string
  readonly value: string
}

export type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly options: readonly SelectFieldOption[]
  readonly error?: string
}

export function SelectField({ className, id, label, options, error, ...props }: SelectFieldProps) {
  const errorId = `${id}-error`

  return (
    <div data-slot="select-field" className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-11 w-full appearance-none rounded-lg border border-input bg-surface py-2.5 pe-10 ps-3 text-sm leading-6 text-ink shadow-control outline-none transition-colors focus:border-focus focus:ring-2 focus:ring-focus',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img aria-hidden="true" src="/v3-assets/figma/form-chevron-down.svg" alt="" className="pointer-events-none absolute end-3 top-1/2 h-1.5 w-2.5 -translate-y-1/2" />
      </div>
      {error ? (
        <p id={errorId} aria-live="polite" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
