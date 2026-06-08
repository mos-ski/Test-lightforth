import { useState } from 'react'
import { ArrowLeft, Bell, Briefcase, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_NOTIFICATIONS, type MockNotification, type NotificationCategory } from './mockData'

type NotificationsView = { name: 'centre' } | { name: 'preferences' }

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: typeof Bell }> = {
  applications: { label: 'Application Updates', icon: Briefcase },
  matches: { label: 'Job Matches', icon: Bell },
  account: { label: 'Account & Credits', icon: CreditCard },
}

export function NotificationsModule() {
  const [view, setView] = useState<NotificationsView>({ name: 'centre' })
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS)

  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))

  if (view.name === 'preferences') return <PreferencesScreen onBack={() => setView({ name: 'centre' })} />

  const groups = (Object.keys(CATEGORY_META) as NotificationCategory[]).map((cat) => ({
    cat,
    items: notifications.filter((n) => n.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
        <button onClick={() => setView({ name: 'preferences' })}><Settings size={18} className="text-neutral-400" /></button>
      </header>
      <div className="flex items-center justify-between px-5 pb-2">
        <span className="text-xs text-neutral-400">{notifications.filter((n) => !n.read).length} unread</span>
        <button onClick={markAllRead} className="text-xs font-medium text-[#2563EB]">Mark all as read</button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        {groups.map(({ cat, items }) => {
          const Icon = CATEGORY_META[cat].icon
          return (
            <div key={cat}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                <Icon size={12} />{CATEGORY_META[cat].label}
              </div>
              <div className="space-y-2">
                {items.map((n) => (
                  <button key={n.id} onClick={() => markRead(n.id)} className={cn('block w-full rounded-xl border p-3 text-left', n.read ? 'border-neutral-200 bg-white' : 'border-[#2563EB]/30 bg-[#2563EB]/5')}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                      {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#2563EB]" />}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-neutral-400">{n.timestamp}</p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PreferencesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Notification settings</h1>
      </header>
      <div className="flex-1 px-5 pb-4 text-sm text-neutral-400">Preferences coming soon.</div>
    </div>
  )
}
