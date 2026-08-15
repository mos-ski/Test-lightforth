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
        className={cn('fixed inset-0 z-modal bg-overlay backdrop-blur-sm', className)}
        {...props}
      />
    )
  },
)

export type DialogPopupProps = HTMLAttributes<HTMLDivElement>

export const DialogPopup = forwardRef<HTMLDivElement, DialogPopupProps>(
  function DialogPopup({ className, children, ...props }, ref) {
    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-modal bg-overlay backdrop-blur-sm" />
        <BaseDialog.Popup
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-modal w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-panel border border-border bg-surface p-6 shadow-xl focus-visible:outline-none',
            className,
          )}
          {...props}
        >
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
