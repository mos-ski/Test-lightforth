import { Bell, HelpCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function TopNav() {
  const { user } = useAuth()

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-end gap-2 border-b border-border bg-white px-6">
      {/* Notification bell */}
      <button className="relative rounded-full p-2 hover:bg-muted transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          20
        </span>
      </button>

      {/* Help */}
      <button className="rounded-full p-2 hover:bg-muted transition-colors">
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Avatar */}
      <button className="h-8 w-8 overflow-hidden rounded-full bg-muted flex-shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </span>
        )}
      </button>
    </header>
  )
}
