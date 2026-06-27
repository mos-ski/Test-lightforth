import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { cn } from '@/lib/utils'

type ActiveProduct = 'individuals' | 'exam' | 'enterprise'

const NAV_LINKS: { key: ActiveProduct; label: string; to: string }[] = [
  { key: 'individuals', label: 'Individuals', to: '/copilot' },
  { key: 'exam', label: 'Exams', to: '/copilot/exam' },
  { key: 'enterprise', label: 'For Teams', to: '/copilot/enterprise' },
]

// Enterprise admins sign back in to their dashboard; everyone else signs
// back in through the desktop app itself, which already recognizes
// returning accounts via the mock account store.
function signInPathFor(active: ActiveProduct) {
  return active === 'enterprise' ? '/sales/sign-in' : '/desktop-copilot-preview'
}

export function MarketingNav({ active }: { active: ActiveProduct }) {
  const navigate = useNavigate()
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <LightforthLogo to="/copilot" />
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map(link => (
            <Link
              key={link.key}
              to={link.to}
              className={cn(
                'transition-colors',
                active === link.key ? 'text-primary' : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" onClick={() => navigate(signInPathFor(active))}>
          Sign in
        </Button>
      </div>
    </header>
  )
}

export function MarketingFooter({ active = 'individuals' }: { active?: ActiveProduct }) {
  return (
    <footer className="border-t border-slate-200 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <LightforthLogo to="/copilot" />
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Lightforth. All rights reserved.</p>
        <Link to={signInPathFor(active)} className="text-sm font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </footer>
  )
}
