import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { getOrgByAdminEmail, setActiveAdminEmail, createOrg, demoSeedOrg, emailDomain } from './mockOrg'

export default function SalesSignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [password, setPassword] = useState('')

  const canContinue = email.trim().length > 0 && firstName.trim().length > 0 && password.length > 0

  function handleContinue() {
    let org = getOrgByAdminEmail(email)
    if (!org) {
      const domain = emailDomain(email)
      const orgName = domain ? domain.split('.')[0].replace(/^\w/, c => c.toUpperCase()) + ' Team' : 'My Team'
      org = demoSeedOrg(email, firstName.trim(), orgName)
      createOrg(email, org)
    }
    setActiveAdminEmail(email)
    navigate('/sales/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <LightforthLogo to="/copilot" />
          <button onClick={() => navigate('/copilot/enterprise')} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Sign in to your dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">For Enterprise admins. First time? We'll set up your team automatically.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Your first name"
                className="lf-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="lf-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="lf-input"
              />
            </div>
          </div>

          <Button size="lg" className="mt-7 w-full" disabled={!canContinue} onClick={handleContinue}>
            Sign in / Activate
          </Button>
        </div>
      </div>
    </div>
  )
}
