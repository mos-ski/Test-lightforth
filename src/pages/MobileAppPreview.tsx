import { useState } from 'react'
import { Bell, Briefcase, Home, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhoneFrame } from './mobile-preview/PhoneFrame'
import { HomeScreen } from './mobile-preview/HomeScreen'
import { AutoApplyModule } from './mobile-preview/AutoApplyModule'
import { CopilotModule } from './mobile-preview/CopilotModule'
import { NotificationsModule } from './mobile-preview/NotificationsModule'
import { MOCK_NOTIFICATIONS, type MockNotification } from './mobile-preview/mockData'

export type ActiveTab = 'home' | 'jobs' | 'copilot' | 'notifications'

const TABS: { id: ActiveTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'copilot', label: 'Copilot', icon: Sparkles },
  { id: 'notifications', label: 'Alerts', icon: Bell },
]

export default function MobileAppPreview() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
          {activeTab === 'jobs' && <AutoApplyModule />}
          {activeTab === 'copilot' && <CopilotModule />}
          {activeTab === 'notifications' && <NotificationsModule notifications={notifications} onNotificationsChange={setNotifications} />}
        </div>
        <nav className="flex flex-shrink-0 items-center justify-around border-t border-neutral-200 bg-white py-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'relative flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors',
                activeTab === id ? 'text-[#2563EB]' : 'text-neutral-400'
              )}
            >
              <Icon size={20} />
              {id === 'notifications' && unreadCount > 0 && (
                <span className="absolute right-1 top-0 h-4 w-4 rounded-full bg-red-500 text-center text-[9px] leading-4 text-white">
                  {unreadCount}
                </span>
              )}
              {label}
            </button>
          ))}
        </nav>
      </div>
    </PhoneFrame>
  )
}
