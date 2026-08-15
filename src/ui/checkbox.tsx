import { forwardRef } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox'
import { Check } from 'lucide-react'

import { cn } from './cn'

export type CheckboxProps = {
  readonly checked?: boolean
  readonly onCheckedChange?: (checked: boolean) => void
  readonly label?: string
  readonly disabled?: boolean
  readonly className?: string
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ checked, onCheckedChange, label, disabled, className }, ref) {
    const checkboxEl = (
      <BaseCheckbox.Root
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        data-slot="checkbox"
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded border border-input bg-surface transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:text-on-accent disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <BaseCheckbox.Indicator>
          <Check aria-hidden="true" className="size-3" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-2">
          {checkboxEl}
          <span className="text-sm font-medium text-ink">{label}</span>
        </label>
      )
    }

    return checkboxEl
  },
)
