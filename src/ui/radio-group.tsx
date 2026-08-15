import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'
import { Radio } from '@base-ui-components/react/radio'

import { cn } from './cn'

type RadioGroupContextValue = {
  readonly value?: string
  readonly onValueChange?: (value: string) => void
  readonly name: string
}

const RadioGroupContext = createContext<RadioGroupContextValue>({ name: '' })

export type RadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  readonly value?: string
  readonly onValueChange?: (value: string) => void
  readonly label?: string
  readonly name?: string
  readonly children: ReactNode
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ value, onValueChange, label, name, className, children, ...props }, ref) {
    const groupName = name || 'radio-group'
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name: groupName }}>
        <div ref={ref} data-slot="radio-group" role="radiogroup" className={cn('grid gap-2', className)} {...props}>
          {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

export type RadioGroupItemProps = HTMLAttributes<HTMLButtonElement> & {
  readonly value: string
  readonly itemLabel?: string
}

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, itemLabel, className, ...props }, ref) {
    const ctx = useContext(RadioGroupContext)
    const checked = ctx.value === value

    const radioEl = (
      <Radio.Root
        ref={ref}
        value={value}
        checked={checked}
        onCheckedChange={() => ctx.onValueChange?.(value)}
        name={ctx.name}
        data-slot="radio-group-item"
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded-full border border-input bg-surface transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[checked]:border-accent disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <Radio.Indicator className="flex items-center justify-center">
          <span className="size-2 rounded-full bg-accent" />
        </Radio.Indicator>
      </Radio.Root>
    )

    if (itemLabel) {
      return (
        <label className="inline-flex items-center gap-2">
          {radioEl}
          <span className="text-sm font-medium text-ink">{itemLabel}</span>
        </label>
      )
    }

    return radioEl
  },
)
