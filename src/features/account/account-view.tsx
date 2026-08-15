import { Apple, Check, Copy, EyeOff, Gift, Monitor, Upload } from 'lucide-react'
import type { ReactNode } from 'react'

import type { BillingPlanCard, CreditUsageRow, DownloadItem, ReferralRow, SettingsProfile } from '@/contracts/account.draft'
import { Button, cn, DataTable, ShellBar } from '@/ui'

export type DownloadsViewProps = {
  readonly homeHref: string
  readonly downloads: readonly DownloadItem[]
}

export type BillingViewProps = {
  readonly homeHref: string
  readonly plans: readonly BillingPlanCard[]
  readonly usageRows: readonly CreditUsageRow[]
}

export type SettingsTab = 'profile' | 'security' | 'referral'

export type SettingsViewProps = {
  readonly homeHref: string
  readonly activeTab: SettingsTab
  readonly profile: SettingsProfile
  readonly referrals: readonly ReferralRow[]
}

function AppWorkspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function ContentShell({ children }: { readonly children: ReactNode }) {
  return <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">{children}</section>
}

function DownloadIcon({ id }: { readonly id: DownloadItem['id'] }) {
  if (id === 'windows') {
    return <Monitor aria-hidden="true" className="size-5" />
  }

  return <Apple aria-hidden="true" className="size-5" />
}

export function DownloadsView({ homeHref, downloads }: DownloadsViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Download Apps" closeHref={homeHref} closeLabel="Close downloads" />
      <ContentShell>
        <article className="mx-auto max-w-5xl rounded-panel border border-accent bg-surface p-6 shadow-panel sm:p-10 lg:p-16">
          <header className="mb-8 sm:mb-12">
            <h1 className="text-lg font-semibold leading-8 text-ink">Download Lightforth Copilot</h1>
          </header>

          <div className="grid gap-3 lg:grid-cols-3">
            {downloads.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3 text-ink shadow-control transition duration-200 hover:-translate-y-0.5 hover:border-focus hover:shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="block h-[171px] w-full overflow-hidden bg-accent-subtle">
                  <img src={item.imageSrc} alt="" className="size-full object-cover" />
                </span>
                <span className="flex w-full flex-col gap-3">
                  <span className="text-base font-medium leading-6">{item.title}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap text-base leading-none text-ink-muted">
                    <DownloadIcon id={item.id} />
                    <span>{item.platform}</span>
                    <span className="size-1 rounded-pill bg-current opacity-60" aria-hidden="true" />
                    <span>{item.extension}</span>
                  </span>
                  <span className="inline-flex min-h-9 w-full items-center justify-center rounded-md border border-accent bg-accent px-3 text-sm font-semibold leading-6 text-on-accent transition duration-200 group-hover:bg-accent-hover">
                    {item.cta}
                  </span>
                  <span className="min-h-5 text-sm leading-5 text-ink-muted">{item.support}</span>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-xs leading-5 text-ink sm:mt-14">
            By downloading a Lightforth application, you agree that our Terms of Service apply to your use of that application. If you have entered a different agreement with Lightforth that covers our applications, that agreement will apply instead.
          </p>
        </article>
      </ContentShell>
    </AppWorkspace>
  )
}

function PlanCard({ plan }: { readonly plan: BillingPlanCard }) {
  return (
    <article className={cn('flex min-h-[29rem] flex-col rounded-panel border bg-surface p-6 shadow-control', plan.popular ? 'border-accent bg-accent-subtle' : 'border-border')}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        {plan.popular ? <span className="rounded-pill bg-accent px-3 py-1 text-xs font-bold text-on-accent">Popular</span> : null}
      </div>
      <p className="mt-6 text-2xl font-black">
        {plan.price} <span className="text-sm font-medium text-ink-muted">{plan.cadence}</span>
      </p>
      <p className="mt-6 font-bold">{plan.credits}</p>
      <p className="mt-4 min-h-14 text-sm leading-6 text-ink-muted">{plan.description}</p>
      <a href="/v3/billing" className={cn('mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-base font-semibold shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', plan.popular ? 'bg-accent text-on-accent hover:bg-accent-hover' : 'border border-input bg-surface text-ink hover:bg-surface-subtle')}>
        Upgrade
      </a>
      <ul className="mt-6 grid gap-3 border-b border-border pb-6 text-sm text-ink-muted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <Check aria-hidden="true" className="size-4 text-muted" />
            {feature}
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-5 text-sm font-medium italic text-accent-text">{plan.note}</p>
    </article>
  )
}

export function BillingView({ homeHref, plans, usageRows }: BillingViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Billing & subscription" closeHref={homeHref} closeLabel="Close billing" />
      <ContentShell>
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-tight">Billing & Subscription</h1>
        </header>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-panel border border-border bg-surface p-6 shadow-control">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <strong className="text-lg font-bold">You're on Starter plan</strong>
                <span className="rounded-pill border border-border px-3 py-1 text-xs font-medium">Monthly</span>
              </div>
              <p className="text-4xl font-black">$25 <span className="text-sm font-normal text-ink-muted">per month</span></p>
            </div>
            <p className="mb-6 mt-1 text-sm text-ink-muted">Renews Sep 1, 2026</p>
            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary">Manage Plan</Button>
              <a href="/v3/billing/payment" className="text-sm font-semibold text-accent-text underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:underline">
                Manage Payment Method
              </a>
            </div>
          </section>
          <section className="rounded-panel border border-border bg-surface p-6 shadow-control">
            <div className="flex items-start justify-between">
              <h2 className="font-bold">Credits</h2>
              <a href="/v3/billing/usage" className="text-sm font-semibold text-accent-text underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:underline">
                View usage details
              </a>
            </div>
            <p className="text-sm text-ink-muted">Resets on May 31, 2026</p>
            <p className="mt-5 text-3xl font-black">31 <span className="text-base font-medium text-ink-muted">of 34 Left</span></p>
            <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-subtle">
              <div className="h-full w-[91%] rounded-pill bg-accent" />
            </div>
            <a href="/v3/billing/bonus" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Gift aria-hidden="true" className="size-4" />
              Get bonus credits
            </a>
          </section>
        </div>
        <section className="mt-6 rounded-panel border border-border bg-surface p-6 shadow-control">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold">Update plan</h2>
            <span className="rounded-pill bg-positive-surface px-3 py-1 text-xs font-bold text-positive">Annual saves 20%</span>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="mt-6 rounded-lg bg-warning-surface px-4 py-3 text-sm text-warning">Every feature uses 1 credit. Use your credits however you like.</p>
        </section>
        <section className="mt-6">
          <DataTable
            title="How credits works"
            rows={usageRows}
            itemLabel={(row) => row.feature}
            minTableWidthClassName="min-w-[54rem]"
            columns={[
              { key: 'feature', label: 'Feature', className: 'w-[16rem]', render: (row) => <span className="font-semibold">{row.feature}</span> },
              { key: 'trigger', label: 'Trigger Event', className: 'w-[28rem]', render: (row) => row.trigger },
              { key: 'deducted', label: 'Deducted', className: 'w-[10rem] text-end', render: (row) => <span className={cn('font-semibold', row.free ? 'text-positive' : undefined)}>{row.deducted}</span> },
            ]}
          />
        </section>
      </ContentShell>
    </AppWorkspace>
  )
}

function SettingsField({ label, value, wide, disabled }: { readonly label: string; readonly value: string; readonly wide?: boolean; readonly disabled?: boolean }) {
  return (
    <label className={cn('grid gap-1.5', wide ? 'md:col-span-2' : undefined)}>
      <span className="text-sm font-medium">{label}</span>
      <input className="min-h-10 rounded-lg border border-input bg-surface px-3 text-sm font-medium text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:bg-surface-subtle disabled:text-ink-muted" value={value} disabled={disabled} readOnly />
    </label>
  )
}

function SettingsTabs({ activeTab }: { readonly activeTab: SettingsTab }) {
  const tabs: readonly { label: string; value: SettingsTab; href: string }[] = [
    { label: 'Profile', value: 'profile', href: '/v3/settings' },
    { label: 'Security', value: 'security', href: '/v3/settings?tab=security' },
    { label: 'Referral', value: 'referral', href: '/v3/settings?tab=referral' },
  ]

  return (
    <nav aria-label="Settings tabs" className="flex gap-6 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <a key={tab.value} href={tab.href} aria-current={activeTab === tab.value ? 'page' : undefined} className={cn('shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', activeTab === tab.value ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted')}>
          {tab.label}
        </a>
      ))}
    </nav>
  )
}

function ProfileSettings({ profile }: { readonly profile: SettingsProfile }) {
  return (
    <section className="rounded-panel border border-border bg-surface p-6 shadow-control sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Profile</h2>
        <Button>Update</Button>
      </div>
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="grid size-14 place-items-center rounded-pill bg-surface-subtle text-sm font-black">PROFI</div>
        <div>
          <Button variant="secondary">
            <Upload aria-hidden="true" className="size-4" />
            Upload Photo
          </Button>
          <p className="mt-2 text-xs text-ink-muted">JPG, PNG, GIF or WebP. Max 5MB.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SettingsField label="First Name" value={profile.firstName} />
        <SettingsField label="Last Name" value={profile.lastName} />
        <SettingsField label="Email" value={profile.email} />
        <SettingsField label="Phone Number" value={profile.phone} />
        <SettingsField label="Country" value={profile.country} wide disabled />
        <SettingsField label="City" value={profile.city} />
        <SettingsField label="Postal Code" value={profile.postalCode} />
      </div>
    </section>
  )
}

function SecuritySettings() {
  return (
    <div className="grid gap-6">
      <section className="rounded-panel border border-border bg-surface p-6 shadow-control sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Password</h2>
          <Button>Update</Button>
        </div>
        <div className="grid gap-6">
          {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
            <label key={label} className="grid gap-1.5">
              <span className="text-sm font-medium">{label}</span>
              <span className="flex min-h-10 items-center rounded-lg border border-input bg-surface px-3 text-sm shadow-control">
                <input className="min-w-0 flex-1 bg-transparent outline-none" type="password" value="passwordpassword" readOnly />
                <EyeOff aria-hidden="true" className="size-4 text-muted" />
              </span>
            </label>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-start justify-between gap-4 rounded-panel border border-border bg-surface p-6 shadow-control sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold">Two-step verification</h2>
          <p className="text-sm text-ink-muted">We recommend 2FA for better security.</p>
        </div>
        <span className="h-7 w-12 rounded-pill bg-surface-subtle p-1">
          <span className="block size-5 rounded-pill bg-surface shadow-control" />
        </span>
      </section>
      <section className="flex flex-col items-start justify-between gap-4 rounded-panel border border-border bg-surface p-6 shadow-control sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold">Delete Account</h2>
          <p className="text-sm text-ink-muted">Permanently delete your Lightforth account.</p>
        </div>
        <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-danger bg-surface px-4 py-2.5 text-base font-semibold text-danger shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          Delete Account
        </button>
      </section>
    </div>
  )
}

function ReferralSettings({ referrals }: { readonly referrals: readonly ReferralRow[] }) {
  return (
    <div className="grid gap-8">
      <section className="rounded-panel border border-border bg-surface p-6 shadow-control sm:p-8">
        <h2 className="text-xl font-bold">Referral</h2>
        <div className="mt-8 rounded-panel bg-accent-subtle p-6">
          <h3 className="text-2xl font-black leading-tight">Earn 5 bonus credits</h3>
          <p className="mt-4 text-sm text-ink-muted">You get 5 bonus credits when your invite signs up and subscribes.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['https://lightforth.app/ref/adedamola', 'Adedamolaios'].map((value, index) => (
              <div key={value} className="min-w-0 rounded-lg border border-accent bg-surface px-4 py-3">
                <p className="text-xs text-ink-muted">{index === 0 ? 'Referral Link' : 'Referral Code'}</p>
                <div className="flex items-center gap-3">
                  <p className="truncate text-sm font-bold text-accent-text">{value}</p>
                  <Copy aria-hidden="true" className="size-4 text-accent-text" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <DataTable
        title="Previous Referrals"
        searchLabel="Search referrals"
        rows={referrals}
        itemLabel={(row) => row.name}
        columns={[
          { key: 'id', label: 'S/N', className: 'w-[6rem]', render: (row) => row.id },
          { key: 'name', label: 'Name', className: 'w-[14rem]', render: (row) => <span className="font-semibold">{row.name}</span> },
          { key: 'email', label: 'Email', className: 'w-[20rem]', render: (row) => row.email },
          { key: 'date', label: 'Date & Time', className: 'w-[14rem]', render: (row) => row.dateTime },
          { key: 'status', label: 'Status', className: 'w-[11rem]', render: (row) => <span className="rounded-pill bg-danger-surface px-3 py-1 text-xs font-semibold text-danger">{row.status}</span> },
        ]}
      />
    </div>
  )
}

export function SettingsView({ homeHref, activeTab, profile, referrals }: SettingsViewProps) {
  return (
    <AppWorkspace>
      <ShellBar homeHref={homeHref} current="Settings" closeHref={homeHref} closeLabel="Close settings" />
      <ContentShell>
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-tight">Settings</h1>
        </header>
        <SettingsTabs activeTab={activeTab} />
        <div className="mt-7">
          {activeTab === 'profile' ? <ProfileSettings profile={profile} /> : null}
          {activeTab === 'security' ? <SecuritySettings /> : null}
          {activeTab === 'referral' ? <ReferralSettings referrals={referrals} /> : null}
        </div>
      </ContentShell>
    </AppWorkspace>
  )
}
