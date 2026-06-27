import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { getOrgByAdminEmail, setActiveAdminEmail } from './mockOrg'

export default function SalesSignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const canContinue = email.trim().length > 0 && password.length > 0

  function handleContinue() {
    const org = getOrgByAdminEmail(email)
    if (!org) {
      setError("We couldn't find an Enterprise account for that email.")
      return
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
          <p className="mt-1 text-sm text-slate-500">For Enterprise admins.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
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

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <Button size="lg" className="mt-7 w-full" disabled={!canContinue} onClick={handleContinue}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
}
