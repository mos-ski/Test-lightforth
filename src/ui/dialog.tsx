import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { X } from 'lucide-react'

import { cn } from './cn'

export type DialogProps = {
  readonly open?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly children: ReactNode
}

export function Dialog({ children, ...props }: DialogProps) {
  return <BaseDialog.Root {...props}>{children}</BaseDialog.Root>
}

export const DialogTrigger = BaseDialog.Trigger

export type DialogPortalProps = {
  readonly children: ReactNode
}

export function DialogPortal({ children }: DialogPortalProps) {
  return <BaseDialog.Portal>{children}</BaseDialog.Portal>
}

export type DialogBackdropProps = HTMLAttributes<HTMLDivElement>

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseDialog.Backdrop
        ref={ref}
        className={cn(
          'fixed inset-0 z-modal bg-overlay opacity-100 backdrop-blur-sm transition-opacity duration-normal ease-default data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none',
          className,
        )}
        {...props}
      />
    )
  },
)

export type DialogPopupPlacement = 'center' | 'start'

export type DialogPopupProps = HTMLAttributes<HTMLDivElement> & {
  readonly placement?: DialogPopupPlacement
}

const popupPlacements: Record<DialogPopupPlacement, string> = {
  center:
    'fixed left-1/2 top-1/2 z-modal w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-panel border border-border bg-surface p-6 shadow-xl transition-[opacity,transform] duration-normal ease-default focus-visible:outline-none data-[ending-style]:-translate-y-[calc(50%-0.5rem)] data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-[calc(50%-0.5rem)] data-[starting-style]:opacity-0 motion-reduce:transition-none',
  start:
    '-translate-x-full fixed inset-y-0 start-0 z-modal h-full w-72 max-w-[85vw] overflow-y-auto border-e border-border bg-surface shadow-xl transition-transform duration-normal ease-default focus-visible:outline-none data-[open]:translate-x-0 rtl:translate-x-full rtl:data-[open]:translate-x-0 motion-reduce:transition-none',
}

export const DialogPopup = forwardRef<HTMLDivElement, DialogPopupProps>(
  function DialogPopup({ className, children, placement = 'center', ...props }, ref) {
    return (
      <BaseDialog.Portal>
        <DialogBackdrop />
        <BaseDialog.Popup ref={ref} className={cn(popupPlacements[placement], className)} {...props}>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    )
  },
)

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className, ...props }, ref) {
    return (
      <BaseDialog.Title
        ref={ref}
        className={cn('text-lg font-semibold text-ink', className)}
        {...props}
      />
    )
  },
)

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <BaseDialog.Description
        ref={ref}
        className={cn('mt-1 text-sm text-ink-muted', className)}
        {...props}
      />
    )
  },
)

export type DialogCloseProps = HTMLAttributes<HTMLButtonElement>

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ className, ...props }, ref) {
    return (
      <BaseDialog.Close
        ref={ref}
        className={cn('absolute end-4 top-4 grid size-8 place-items-center rounded-soft text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
        {...props}
      >
        <X aria-hidden="true" className="size-4" />
      </BaseDialog.Close>
    )
  },
)
