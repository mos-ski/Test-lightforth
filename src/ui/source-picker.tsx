import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import { Upload, ChevronDown } from 'lucide-react'

import { cn } from './cn'

export type SourcePickerOption = {
  readonly label: string
  readonly href: string
  readonly icon?: React.ReactNode
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

export const SourcePicker = forwardRef<HTMLDivElement, SourcePickerProps>(
  function SourcePicker({ title, actionLabel, idleText, meta, options, className, historyLink }, ref) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const menuId = useId()

    const close = useCallback(() => setIsOpen(false), [])

    useEffect(() => {
      if (!isOpen) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          close()
          triggerRef.current?.focus()
        }
      }
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
          close()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, close])

    return (
      <div ref={ref} data-slot="source-picker" className={cn('flex min-h-[48rem] flex-col items-center justify-center', className)}>
        <h1 className="text-lg font-semibold leading-7 text-ink">{title}</h1>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((current) => !current)}
          className={cn(
            'mt-4 w-full max-w-lg rounded-lg border bg-surface px-6 py-4 text-center shadow-control transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            isOpen ? 'border-focus' : 'border-input hover:border-focus',
          )}
        >
          <span className="mx-auto grid size-10 place-items-center rounded-lg border border-border bg-surface-raised shadow-control">
            <Upload aria-hidden="true" className="size-4 text-ink-muted" />
          </span>
          <span className="mt-3 block text-sm text-ink-muted">
            <span className="font-semibold text-accent-text">{actionLabel}</span> {idleText}
          </span>
          <span className="mt-1 block text-xs text-ink-muted">{meta}</span>
        </button>

        {isOpen ? (
          <div ref={menuRef} id={menuId} role="menu" className="mt-px w-60 overflow-hidden rounded-soft border border-focus bg-surface shadow-popover [border-width:0.5px]">
            {options.map((option) => (
              <a
                key={option.label}
                href={option.href}
                role="menuitem"
                className={cn(
                  'flex min-h-11 items-center gap-3 px-3 py-2.5 text-sm leading-5 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset',
                  option.emphasis === 'strong' ? 'font-semibold' : 'font-medium',
                )}
              >
                {option.icon ? (
                  <span className="size-6 shrink-0 [&>svg]:size-6">{option.icon}</span>
                ) : null}
                {option.label}
              </a>
            ))}
          </div>
        ) : null}

        {historyLink ? (
          <a href={historyLink.href} className="mt-6 text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {historyLink.label}
          </a>
        ) : null}
      </div>
    )
  },
)
