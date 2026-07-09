// src/pages/cosella/CosellaSignIn.tsx
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { findMemberByEmail, setActiveAdminEmail } from './cosellaOrgStore'
import { getCosellaAccount, setCosellaAccount, setActiveMemberEmail } from './cosellaAccounts'

export default function CosellaSignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'sign-in' | 'invite-code'>('sign-in')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSignIn() {
    setError(null)
    const account = getCosellaAccount(email)
    if (!account) {
      setError('No Cosella account found for this email.')
      return
    }
    if (account.accountType === 'cosella-admin') {
      setActiveAdminEmail(email)
      navigate('/cosella/dashboard')
    } else {
      setActiveMemberEmail(email)
      navigate('/cosella/app')
    }
  }

  function handleActivate() {
    setError(null)
    const found = findMemberByEmail(email)
    if (!found) {
      setError("We couldn't find a teammate with that email.")
      return
    }
    if (found.member.inviteCode !== inviteCode.trim().toUpperCase()) {
      setError("That invite code doesn't match this email.")
      return
    }
    setCosellaAccount(email, { accountType: 'cosella-member', orgName: found.org.orgName })
    setActiveMemberEmail(email)
    navigate('/cosella/app')
  }

  const signInValid = email.trim().length > 0 && password.length > 0
  const activateValid = email.trim().length > 0 && inviteCode.trim().length > 0 && password.length > 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8"><LightforthLogo to="/cosella" /></div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">{mode === 'sign-in' ? 'Sign in to Cosella' : 'Activate your seat'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'sign-in' ? 'Owners and activated closers sign in here.' : "First time on your team's Cosella? Enter the invite code from your admin."}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="lf-input" />
            </div>
            {mode === 'invite-code' && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Invite code</label>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Invite code" className="lf-input font-mono uppercase" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{mode === 'sign-in' ? 'Password' : 'Create a password'}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'sign-in' ? '••••••••' : 'Create a password'} className="lf-input" />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {mode === 'sign-in' ? (
            <Button size="lg" className="mt-7 w-full bg-rose-600 hover:bg-rose-700" disabled={!signInValid} onClick={handleSignIn}>
              Sign in
            </Button>
          ) : (
            <Button size="lg" className="mt-7 w-full bg-rose-600 hover:bg-rose-700" disabled={!activateValid} onClick={handleActivate}>
              Activate seat
            </Button>
          )}

          <button
            onClick={() => { setMode(m => (m === 'sign-in' ? 'invite-code' : 'sign-in')); setError(null) }}
            className="mt-4 w-full text-center text-sm font-medium text-rose-700 hover:underline"
          >
            {mode === 'sign-in' ? 'I have an invite code' : 'Back to sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
