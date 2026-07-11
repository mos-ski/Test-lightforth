import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

const RESOURCES = [
  { label: 'FAQ', to: '#pricing' },
  { label: 'Privacy & Terms', to: '/privacy-policy' },
]

const SUPPORT = [
  { label: 'Help Center', href: 'https://help.lightforth.org/' },
  { label: 'Contact Support', href: 'mailto:support@lightforth.org' },
]

export function Footer() {
  return (
    <footer className="bg-[#0A2A60] py-12 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <Link to="/" className="inline-block">
              <img src="/lightforth-home/images/lightforth-logo-white.svg" alt="Lightforth" className="h-8 w-auto" />
            </Link>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  14160 Dallas Parkway, Dallas
                  <br />
                  Texas 75254
                </span>
              </div>
              <a href="mailto:support@lightforth.org" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4 shrink-0" /> support@lightforth.org
              </a>
              <a href="tel:+19018884689" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 shrink-0" /> +1 (901) 888 4689
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-base">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a href={r.to} className="hover:text-primary transition-colors">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-base">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {SUPPORT.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-primary transition-colors" target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-base">Sign in</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/desktop-copilot-preview" className="hover:text-primary transition-colors">
                  Desktop Copilot
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">
                  Web App
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-xs sm:text-sm text-gray-400">© {new Date().getFullYear()} Lightforth, Inc.</p>
      </div>
    </footer>
  )
}
