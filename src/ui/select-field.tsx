import { forwardRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Select } from '@base-ui-components/react/select'

import { cn } from './cn'

export type SelectFieldOption = {
  readonly label: string
  readonly value: string
}

export type SelectFieldProps = {
  readonly id: string
  readonly label: string
  readonly options: readonly SelectFieldOption[]
  readonly error?: string
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly placeholder?: string
  readonly disabled?: boolean
  readonly required?: boolean
  readonly name?: string
  readonly className?: string
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(
    { id, label, options, error, value, defaultValue, onValueChange, placeholder = 'Select', disabled, required, name, className },
    ref,
  ) {
    const errorId = `${id}-error`

    return (
      <div data-slot="select-field" className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <Select.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next) => onValueChange?.(next as string)}
          disabled={disabled}
          required={required}
          name={name}
        >
          <Select.Trigger
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-surface py-2.5 ps-3 pe-3 text-start text-sm leading-6 text-ink shadow-control outline-none transition-colors duration-normal ease-default focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:border-focus',
              error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
              className,
            )}
          >
            <Select.Value className="truncate">
              {(selected: string | null) => {
                const match = options.find((option) => option.value === selected)
                return match ? match.label : placeholder
              }}
            </Select.Value>
            <Select.Icon className="shrink-0 text-ink-muted">
              <ChevronDown aria-hidden="true" className="size-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner className="z-tooltip outline-none" sideOffset={4}>
              <Select.Popup className="max-h-64 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-popover outline-none">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="flex min-h-9 cursor-pointer items-center justify-between gap-2 px-3 text-sm text-ink outline-none data-[highlighted]:bg-surface-subtle data-[selected]:font-semibold"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="text-accent">
                      <Check aria-hidden="true" className="size-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)
