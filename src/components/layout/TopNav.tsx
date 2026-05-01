import {
  Bell,
  ChevronRight,
  ExternalLink,
  Gift,
  HelpCircle,
  LogOut,
  Mail,
  MessageCircle,
  Settings,
  User,
  X,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const planCredits = user?.plan === 'premium' ? 100 : user?.plan === 'pro' ? 50 : user?.plan === 'starter' ? 15 : 34
  const remainingCredits = user?.credits ?? 31
  const totalCredits = Math.max(planCredits, remainingCredits + (user?.creditsUsed ?? 0))
  const usedCredits = Math.max(0, totalCredits - remainingCredits)
  const creditPercent = totalCredits ? Math.max(0, Math.min(100, Math.round((remainingCredits / totalCredits) * 100))) : 0

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U'

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-end gap-2 border-b border-border bg-white px-6">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative rounded-full p-2 transition-colors hover:bg-muted"
          aria-label="Open credit counter"
        >
          <Zap className="h-5 w-5 text-primary" />
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {remainingCredits}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-72 rounded-xl bg-white p-4 shadow-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-foreground">Credits</p>
            <Link
              to="/billing"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-9 rounded-lg px-3 text-sm font-semibold text-slate-600',
              )}
            >
              Upgrade {'->'}
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Remaining Credits</span>
              <span className="font-semibold text-foreground">{remainingCredits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Total Allocated</span>
              <span className="font-semibold text-foreground">{totalCredits}</span>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-primary" style={{ width: `${creditPercent}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-500">Used: {usedCredits}</span>
            <span className="font-medium text-foreground">{creditPercent}% remaining</span>
          </div>
          <Button className="mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-sm font-bold shadow-sm">
            <Gift className="h-5 w-5" />
            Get Free credits
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <button className="relative rounded-full p-2 transition-colors hover:bg-muted" aria-label="Notifications">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-2 transition-colors hover:bg-muted" aria-label="Open help">
          <HelpCircle className="h-5 w-5 text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-80 overflow-hidden rounded-xl bg-white p-0 shadow-xl">
          <div className="flex items-center justify-between bg-emerald-50 px-4 py-3">
            <p className="text-base font-bold text-emerald-600">Whats new? *</p>
            <button
              className="text-sm text-slate-500 hover:text-foreground"
              onClick={() => window.open('https://help.lightforth.ai/updates', '_blank')}
            >
              See Latest Updates {'>'}
            </button>
          </div>
          <div className="divide-y">
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Supported Browsers</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Chrome (Best Compatibility), Edge, Opera, Brave, Chromium.
              </p>
            </section>
            <button
              className="block w-full px-4 py-3 text-left hover:bg-muted/50"
              onClick={() => window.open('https://help.lightforth.ai', '_blank')}
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                Search on help center
                <ExternalLink className="h-3.5 w-3.5" />
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Find answers to frequently asked questions from our written articles.
              </p>
            </button>
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Give feedback?</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                <a className="text-primary underline-offset-2 hover:underline" href="https://help.lightforth.ai/feedback" target="_blank" rel="noreferrer">
                  Fill this form
                </a>{' '}
                or Join Discord for support and community interaction or send us an email to{' '}
                <a className="text-primary hover:underline" href="mailto:support@lightforth.org">
                  support@lightforth.org
                </a>
              </p>
            </section>
            <section className="px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Support Hours:</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Mon - Fri: 9 AM - 6 PM CST
                <br />
                Sat - Sun: Limited Support
              </p>
            </section>
          </div>
          <button
            className="flex h-12 w-full items-center justify-center gap-3 border-t bg-white text-sm font-medium text-primary hover:bg-blue-50"
            onClick={() => window.location.href = 'mailto:support@lightforth.org'}
          >
            <Mail className="h-5 w-5" />
            Send us an email
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-b-xl bg-[#1298ee] text-sm font-medium text-white hover:bg-[#0b8add]"
            onClick={() => window.open('https://discord.gg/lightforth', '_blank')}
          >
            <MessageCircle className="h-5 w-5" />
            Join community
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted" aria-label="Open account menu">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-foreground">
              {initials}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={14} className="w-72 overflow-hidden rounded-xl bg-white p-0 shadow-xl">
          <div className="flex items-center gap-3 rounded-t-xl bg-blue-100 px-4 py-4">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-slate-200">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-black text-foreground">
                  USER
                </span>
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-blue-100 bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-foreground">{user?.name ?? 'Adedamola Adewale'}</p>
              <p className="truncate text-sm text-slate-500">{user?.email ?? 'adewaledamola52@yahoo.com'}</p>
            </div>
            <X className="h-5 w-5 flex-shrink-0 text-slate-600" />
          </div>
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-none px-5 text-base font-semibold text-slate-700" onClick={() => navigate('/settings')}>
            <User className="h-5 w-5 text-slate-500" />
            <span className="flex-1">Account</span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-none px-5 text-base font-semibold text-slate-700" onClick={() => navigate('/settings?tab=security')}>
            <Settings className="h-5 w-5 text-slate-500" />
            <span className="flex-1">Security</span>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center gap-4 rounded-b-xl px-5 text-base font-semibold text-red-600" onClick={logout}>
            <LogOut className="h-5 w-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
