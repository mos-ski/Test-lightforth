import { useId, useState } from 'react'
import { cn } from './cn'

export type SourcePickerOption = {
  readonly label: string
  readonly href: string
  readonly iconSrc: string
  readonly emphasis?: 'default' | 'strong'
}

export type SourcePickerProps = {
  readonly title: string
  readonly actionLabel: string
  readonly idleText: string
  readonly meta: string
  readonly options: readonly SourcePickerOption[]
  readonly className?: string
  readonly historyLink?: {
    readonly label: string
    readonly href: string
  }
}

export function SourcePicker({ title, actionLabel, idleText, meta, options, className, historyLink }: SourcePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  return (
    <div data-slot="source-picker" className={cn('flex min-h-[48rem] flex-col items-center justify-center', className)}>
      <h1 className="text-lg font-semibold leading-7 text-ink">{title}</h1>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          'mt-4 w-full max-w-lg rounded-lg border bg-surface px-6 py-4 text-center shadow-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          isOpen ? 'border-focus' : 'border-input hover:border-focus',
        )}
      >
        <span className="mx-auto grid size-10 place-items-center rounded-lg border border-border bg-surface-raised shadow-control">
          <img aria-hidden="true" src="/v3-assets/figma/upload-option-upload.svg" alt="" className="max-h-[18px] max-w-[18px] object-contain" />
        </span>
        <span className="mt-3 block text-sm text-ink-muted">
          <span className="font-semibold text-accent-text">{actionLabel}</span> {idleText}
        </span>
        <span className="mt-1 block text-xs text-ink-muted">{meta}</span>
      </button>

      {isOpen ? (
        <div id={menuId} className="mt-px w-[15.125rem] overflow-hidden rounded-soft border border-focus bg-surface shadow-popover [border-width:0.5px]">
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              className={cn(
                'flex min-h-11 items-center gap-3 px-3 py-2.5 text-sm leading-[22px] text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                option.emphasis === 'strong' ? 'font-semibold' : 'font-medium',
              )}
            >
              <span className="grid size-6 shrink-0 place-items-center">
                <img aria-hidden="true" src={option.iconSrc} alt="" className="max-h-[18px] max-w-[18px] object-contain" />
              </span>
              {option.label}
            </a>
          ))}
        </div>
      ) : null}

      {historyLink ? (
        <a href={historyLink.href} className="mt-6 text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {historyLink.label}
        </a>
      ) : null}
    </div>
  )
}
