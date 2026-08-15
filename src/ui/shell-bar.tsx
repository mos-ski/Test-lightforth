import type { ReactNode } from 'react'

import { cn } from './cn'

const figmaAssetBase = '/v3-assets/figma'

export type ShellBarAction = {
  readonly label: string
  readonly href: string
  readonly iconSrc?: string
}

export type ShellBarProps = {
  readonly homeHref: string
  readonly current: string
  readonly closeHref?: string
  readonly closeLabel?: string
  readonly action?: ShellBarAction
  readonly secondaryAction?: ShellBarAction
  readonly className?: string
  readonly children?: ReactNode
}

function BarIcon({ src, alt = '' }: { readonly src: string; readonly alt?: string }) {
  return <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
}

export function ShellBar({ homeHref, current, closeHref, closeLabel = 'Close', action, secondaryAction, className, children }: ShellBarProps) {
  return (
    <header
      data-slot="shell-bar"
      className={cn('flex min-h-14 items-center justify-between overflow-hidden border-b border-border bg-surface px-[18px] py-[9px] text-sm', className)}
    >
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-3">
        <a href={homeHref} className="inline-flex min-h-[38px] shrink-0 items-center gap-3 rounded-soft text-base font-semibold leading-[38px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <span className="grid size-5 place-items-center">
            <BarIcon src={`${figmaAssetBase}/topnav-home.svg`} />
          </span>
          Go Home
        </a>
        <span className="grid size-4 shrink-0 place-items-center opacity-70" aria-hidden="true">
          <BarIcon src={`${figmaAssetBase}/topnav-chevron.svg`} />
        </span>
        <span className="truncate text-base font-semibold leading-[38px] text-ink" aria-current="page">
          {current}
        </span>
      </nav>

      <div className="flex min-h-9 shrink-0 items-center gap-8">
        {children}
        {secondaryAction ? (
          <a href={secondaryAction.href} className="hidden min-h-[38px] items-center gap-3 rounded-soft px-2 text-base font-semibold leading-[38px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
            {secondaryAction.iconSrc ? (
              <span className="grid size-5 place-items-center">
                <BarIcon src={secondaryAction.iconSrc} />
              </span>
            ) : null}
            {secondaryAction.label}
          </a>
        ) : null}
        {action ? (
          <a
            href={action.href}
            className="inline-flex min-h-[38px] w-[150px] items-center justify-center gap-3 rounded-lg bg-accent px-4 py-[7px] text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span className="grid size-6 place-items-center">
              <BarIcon src={action.iconSrc ?? `${figmaAssetBase}/topnav-download.svg`} />
            </span>
            {action.label}
          </a>
        ) : closeHref ? (
          <a href={closeHref} aria-label={closeLabel} className="grid size-9 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <span className="grid size-4 place-items-center">
              <BarIcon src={`${figmaAssetBase}/topnav-close.svg`} />
            </span>
          </a>
        ) : null}
      </div>
    </header>
  )
}
