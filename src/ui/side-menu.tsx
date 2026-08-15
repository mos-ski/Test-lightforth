import type { ReactNode } from 'react'

import { cn } from './cn'
import { Divider } from './divider'

export type SideMenuItem = {
  readonly label: string
  readonly href: string
  readonly iconSrc: string
  readonly active?: boolean
  readonly hasChildren?: boolean
}

export type SideMenuProps = {
  readonly items: readonly SideMenuItem[]
  readonly className?: string
  readonly children?: ReactNode
}

export function SideMenu({ items, className, children }: SideMenuProps) {
  return (
    <aside data-slot="side-menu" className={cn('hidden w-[223px] shrink-0 bg-surface lg:block', className)}>
      <nav aria-label="Primary" className="flex min-h-[calc(100vh-3.5rem)] flex-col pt-3 text-sm">
        {items.map((item, index) => (
          <div key={item.label}>
            {item.label === 'Manage Context' ? (
              <div className="flex w-full items-center justify-center p-6">
                <Divider />
              </div>
            ) : null}
            <a
              href={item.href}
              className="flex min-h-9 w-full items-center gap-1 overflow-hidden rounded px-6 py-1.5 font-medium leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-current={item.active ? 'page' : undefined}
            >
              <span className={cn('flex min-w-0 items-center gap-3', item.hasChildren ? 'flex-none' : 'flex-1')}>
                <img aria-hidden="true" src={item.iconSrc} alt="" className="size-5 shrink-0 object-contain" />
                <span className={cn('min-w-0 text-sm', item.hasChildren ? 'shrink-0 whitespace-nowrap' : 'flex-1 truncate', item.active ? 'text-accent-text' : 'text-ink')}>
                  {item.label}
                </span>
              </span>
              {item.hasChildren ? <img aria-hidden="true" src="/v3-assets/figma/sidebar-chevron-down.svg" alt="" className="h-1.5 w-3 shrink-0" /> : null}
            </a>
          </div>
        ))}
        {children}
      </nav>
    </aside>
  )
}
