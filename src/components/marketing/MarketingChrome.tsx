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

const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Products',
    links: [
      { label: 'Interview & Coding', to: '/copilot' },
      { label: 'Exam Ghost', to: '/copilot/exam' },
      { label: 'Sales Closer AI', to: '/copilot/enterprise' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/copilot' },
      { label: 'Careers', to: '/copilot' },
      { label: 'Contact', to: '/copilot' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How it works', to: '/copilot' },
      { label: 'FAQ', to: '/copilot' },
      { label: 'Support', to: '/copilot' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/copilot' },
      { label: 'Terms', to: '/copilot' },
    ],
  },
]

export function MarketingFooter({ active = 'individuals' }: { active?: ActiveProduct }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div>
            <LightforthLogo to="/copilot" />
            <p className="mt-4 max-w-[220px] text-sm leading-6 text-slate-500">
              A stealth AI copilot for interviews, exams, and sales calls.
            </p>
          </div>
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <p className="text-sm font-bold text-slate-900">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 hover:text-slate-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Lightforth. All rights reserved.</p>
          <Link to={signInPathFor(active)} className="text-sm font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  )
}
