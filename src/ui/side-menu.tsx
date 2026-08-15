import { forwardRef, type ReactNode } from 'react'

import { cn } from './cn'
import { Divider } from './divider'

export type SideMenuItem = {
  readonly label: string
  readonly href: string
  readonly icon: ReactNode
  readonly active?: boolean
  readonly dividerBefore?: boolean
}

export type SideMenuProps = {
  readonly items: readonly SideMenuItem[]
  readonly className?: string
  readonly children?: ReactNode
  readonly width?: number
}

export const SideMenu = forwardRef<HTMLElement, SideMenuProps>(
  function SideMenu({ items, className, children, width = 224, ...props }, ref) {
    return (
      <aside
        ref={ref}
        data-slot="side-menu"
        className={cn('hidden shrink-0 bg-surface lg:block', className)}
        style={{ width }}
        {...props}
      >
        <nav aria-label="Primary" className="flex min-h-[calc(100vh-3.5rem)] flex-col pt-3 text-sm">
          {items.map((item) => (
            <div key={item.label}>
              {item.dividerBefore ? (
                <div className="flex w-full items-center justify-center p-6">
                  <Divider />
                </div>
              ) : null}
              <a
                href={item.href}
                className="flex min-h-9 w-full items-center gap-3 overflow-hidden rounded px-6 py-1.5 font-medium leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                aria-current={item.active ? 'page' : undefined}
              >
                <span
                  className={cn('size-5 shrink-0 [&>svg]:size-5 [&>img]:size-5', item.active ? 'text-accent' : 'text-ink')}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className={cn('min-w-0 flex-1 truncate text-sm', item.active ? 'text-accent' : 'text-ink')}>{item.label}</span>
              </a>
            </div>
          ))}
          {children}
        </nav>
      </aside>
    )
  },
)
