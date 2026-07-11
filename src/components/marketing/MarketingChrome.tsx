import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

export function MarketingNav() {
  const navigate = useNavigate()
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <LightforthLogo to="/" />
        <Button variant="outline" onClick={() => navigate('/desktop-copilot-preview')}>
          Sign in
        </Button>
      </div>
    </header>
  )
}

const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How it works', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Support', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/' },
      { label: 'Terms', to: '/' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <LightforthLogo to="/" />
            <p className="mt-4 max-w-[220px] text-sm leading-6 text-slate-500">
              A stealth AI copilot for your job search and interviews.
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
          <Link to="/desktop-copilot-preview" className="text-sm font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  )
}
