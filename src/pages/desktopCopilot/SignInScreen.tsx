import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { BG, INPUT_BG, INPUT_BD, BLUE } from './shared'
import { getAccount, setAccount } from './mockAccounts'
import { findMemberByEmail } from '@/pages/sales/mockOrg'

type SignInMode = 'welcome' | 'signin' | 'enterprise'

export type SignInTrack = 'regular-signin' | 'enterprise-invite'

export interface SignInResult {
  email: string
  track: SignInTrack
  /** Set when signing in with an email the mock account store already recognizes. */
  existingAccount?: ReturnType<typeof getAccount>
}

export function SignInScreen({
  onBack,
  onContinue,
  onSignUp,
  prefillEmail,
}: {
  onBack: () => void
  onContinue: (result: SignInResult) => void
  /** Account creation now happens entirely on the website — this sends the user there. When omitted, the welcome buttons switch to sign-in mode instead. */
  onSignUp?: () => void
  /** Carried over from the website checkout — prefills the email but still requires a real login. */
  prefillEmail?: string
}) {
  const [mode, setMode] = useState<SignInMode>(prefillEmail ? 'signin' : 'welcome')
  const [email, setEmail] = useState(prefillEmail ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const

  const canContinue =
    mode === 'enterprise' ? inviteCode.trim().length > 0 && email.trim().length > 0 && password.length > 0 && password === confirmPassword :
    mode === 'signin' ? email.trim().length > 0 && password.length > 0 :
    false

  const heading =
    mode === 'enterprise' ? 'Activate your seat' :
    mode === 'signin' ? 'Welcome back' :
    'Welcome to Lightforth Copilot'

  function handleContinue() {
    if (!canContinue) return
    if (mode === 'enterprise') {
      const found = findMemberByEmail(email)
      const orgName = found?.org.orgName ?? 'Your Team'
      setAccount(email, { accountType: 'enterprise-member', orgName })
      onContinue({ email, track: 'enterprise-invite' })
    } else {
      const existingAccount = getAccount(email) ?? { accountType: 'regular' as const }
      onContinue({ email, track: 'regular-signin', existingAccount })
    }
  }

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <div className="mb-6 flex w-full max-w-sm items-center">
        <button onClick={onBack} className="rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors" title="Back">
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">{heading}</h1>
      <p className="mb-8 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {mode === 'enterprise'
          ? "Enter the organizational email and invite code your admin gave you, then create a password. You'll just sign in with email and password after this."
          : mode === 'signin'
          ? 'Sign in with the email and password you created on lightforth.com.'
          : 'Sign up on the web to get started, or sign in below if you already have an account.'}
      </p>

      <div className="w-full max-w-sm space-y-4">
        {mode === 'welcome' && (
          <>
            <button
              onClick={onSignUp ?? (() => setMode('signin'))}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              <Mail className="h-4 w-4" /> Continue with Email
            </button>
            <button
              onClick={onSignUp ?? (() => setMode('signin'))}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-bold text-white/90 transition-colors hover:bg-white/10"
              style={inputStyle}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-900">G</span>
              Continue with Google
            </button>
            <button
              onClick={onSignUp ?? (() => setMode('signin'))}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-bold text-white/90 transition-colors hover:bg-white/10"
              style={inputStyle}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0A66C2] text-[10px] font-black text-white">in</span>
              Continue with LinkedIn
            </button>

            <p className="pt-2 text-center text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="font-semibold text-blue-400 hover:underline">
                Sign in
              </button>
            </p>
            <p className="text-center text-sm">
              <button onClick={() => setMode('enterprise')} className="font-semibold text-blue-400 hover:underline">
                I have an invite code
              </button>
            </p>
          </>
        )}

        {mode === 'enterprise' && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Invite code</label>
            <input
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="Enter your invite code"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
        )}

        {(mode === 'signin' || mode === 'enterprise') && (
          <>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">
                {mode === 'enterprise' ? 'Organizational email' : 'Email'}
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">{mode === 'enterprise' ? 'Create a password' : 'Password'}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>

            {mode === 'enterprise' && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleContinue}
              className="h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
              style={{ background: BLUE, opacity: canContinue ? 1 : 0.45 }}
            >
              {mode === 'enterprise' ? 'Activate & sign in' : 'Continue'}
            </button>

            <p className="text-center text-sm">
              <button onClick={() => setMode('welcome')} className="font-semibold text-blue-400 hover:underline">
                ← Back
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
