import { Bell, ChevronDown, CircleHelp, CreditCard, Download, Home, MessageCircle, Monitor, Play, Settings } from 'lucide-react'

import type { DashboardAction, DashboardInstallPrompt, DashboardNavItem } from '@/contracts/dashboard.draft'
import type { UserIdentity } from '@/contracts/identity'
import { cn, Divider } from '@/ui'

export type DashboardViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly DashboardNavItem[]
  readonly actions: readonly DashboardAction[]
  readonly installPrompt: DashboardInstallPrompt
  readonly creditBalance: number
}

const navIconClass = 'size-4 shrink-0'

function NavIcon({ item }: { readonly item: DashboardNavItem }) {
  if (item.iconSrc) {
    return <img aria-hidden="true" src={item.iconSrc} alt="" className={navIconClass} />
  }

  if (item.label === 'Dashboard') return <Home aria-hidden="true" className={navIconClass} />
  if (item.label === 'Interview Prep') return <CircleHelp aria-hidden="true" className={navIconClass} />
  if (item.label === 'Interview Co-Pilot') return <MessageCircle aria-hidden="true" className={navIconClass} />
  if (item.label === 'Download Apps') return <Download aria-hidden="true" className={navIconClass} />
  if (item.label === 'Billing & subscription') return <CreditCard aria-hidden="true" className={navIconClass} />
  return <Settings aria-hidden="true" className={navIconClass} />
}

function DashboardSidebar({ navItems }: { readonly navItems: readonly DashboardNavItem[] }) {
  return (
    <aside className="hidden w-56 shrink-0 border-e border-border bg-surface lg:block">
      <nav aria-label="Primary" className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-1 px-4 py-5 text-sm">
        {navItems.map((item, index) => (
          <div key={item.label}>
            {index === 5 ? <Divider className="my-7" /> : null}
            <a
              href={item.href}
              className={cn(
                'flex min-h-9 items-center gap-3 rounded-soft px-2 text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                item.active ? 'font-semibold text-accent-text' : 'font-medium',
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <NavIcon item={item} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.hasChildren ? <ChevronDown aria-hidden="true" className="size-3 shrink-0" /> : null}
            </a>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function DashboardHeader({ user, creditBalance }: { readonly user: UserIdentity; readonly creditBalance: number }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-5">
      <a href="/v3" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label="Lightforth UI Studio home">
        <img src="/v3-assets/dashboard-logo.svg" alt="Lightforth" className="h-7 w-auto" />
      </a>
      <div className="flex items-center gap-4">
        <a href="/v3/billing" aria-label={`${creditBalance} credits`} className="relative grid size-11 place-items-center rounded-soft text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <CreditCard aria-hidden="true" className="size-6" />
          <span className="absolute -start-0.5 top-1 grid min-w-4 place-items-center rounded-pill bg-danger px-1 text-xs font-semibold text-on-danger">{creditBalance}</span>
        </a>
        <a href="/v3/help" aria-label="Help" className="grid size-11 place-items-center rounded-soft text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <CircleHelp aria-hidden="true" className="size-6" />
        </a>
        <button type="button" aria-label={`Open profile menu for ${user.name}`} className="grid size-11 place-items-center rounded-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <img src="/v3-assets/dashboard-avatar.png" alt="" className="size-9 rounded-pill object-cover" />
        </button>
      </div>
    </header>
  )
}

function ActionCard({ action }: { readonly action: DashboardAction }) {
  return (
    <a
      href={action.href}
      className={cn(
        'group flex min-h-32 flex-col gap-3 rounded-lg border bg-surface px-5 py-4 shadow-control transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        action.featured ? 'border-accent bg-accent-subtle' : 'border-border',
      )}
      aria-label={`${action.title}. ${action.description}`}
    >
      <img aria-hidden="true" src={action.iconSrc} alt="" className="size-4" />
      <div className="grid gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className={cn('text-sm font-bold tracking-normal', action.featured ? 'text-accent' : 'text-ink')}>
            {action.title} <span aria-hidden="true">-&gt;</span>
          </h2>
          {action.badge ? (
            <span className="rounded-soft bg-positive-surface px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-positive">{action.badge}</span>
          ) : null}
        </div>
        <p className="text-xs font-medium leading-5 text-ink-muted">{action.description}</p>
      </div>
    </a>
  )
}

function InstallPrompt({ installPrompt }: { readonly installPrompt: DashboardInstallPrompt }) {
  return (
    <section className="rounded-panel bg-accent-subtle p-3 lg:absolute lg:bottom-14 lg:end-8" aria-label="Install apps">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img src={installPrompt.qrSrc} alt="QR code to install Lightforth apps" className="size-28 rounded-soft object-cover" />
        <div className="grid gap-3">
          <p className="text-base font-medium text-accent">{installPrompt.title}</p>
          <div className="flex flex-wrap gap-2">
            <a href={installPrompt.desktopHref} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Monitor aria-hidden="true" className="size-4" />
              Install Desktop
            </a>
            <a href={installPrompt.mobileHref} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-4" />
              Install Mobile
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DashboardView({ user, navItems, actions, installPrompt, creditBalance }: DashboardViewProps) {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <DashboardHeader user={user} creditBalance={creditBalance} />
      <div className="flex">
        <DashboardSidebar navItems={navItems} />
        <section className="relative min-h-[calc(100vh-3.5rem)] flex-1 px-6 py-12 lg:px-16 lg:py-36">
          <div className="mx-auto w-full max-w-3xl">
            <h1 className="text-2xl font-semibold leading-tight text-ink">Welcome, what would you like to do today?</h1>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {actions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 w-full max-w-3xl lg:max-w-none">
            <InstallPrompt installPrompt={installPrompt} />
          </div>
          <div className="fixed bottom-4 end-4 lg:hidden">
            <button type="button" aria-label="Notifications" className="grid size-11 place-items-center rounded-pill bg-surface text-accent shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Bell aria-hidden="true" className="size-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
