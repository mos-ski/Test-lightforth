import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BG, INPUT_BG, INPUT_BD, BLUE } from './shared'
import { getAccount, setAccount } from './mockAccounts'
import { findMemberByEmail } from '@/pages/sales/mockOrg'

type SignInMode = 'signup' | 'signin' | 'enterprise' | 'exam-signup'

export type SignInTrack = 'regular-signup' | 'regular-signin' | 'exam-signup' | 'enterprise-invite'

export interface SignInResult {
  email: string
  track: SignInTrack
  /** Set when signing in with an email the mock account store already recognizes. */
  existingAccount?: ReturnType<typeof getAccount>
}

export function SignInScreen({
  onBack,
  onContinue,
  prefillEmail,
}: {
  onBack: () => void
  onContinue: (result: SignInResult) => void
  /** Carried over from the website checkout — prefills the email but still requires a real login. */
  prefillEmail?: string
}) {
  const [mode, setMode] = useState<SignInMode>(prefillEmail ? 'signin' : 'signup')
  const [email, setEmail] = useState(prefillEmail ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const

  const canContinue =
    mode === 'enterprise' ? inviteCode.trim().length > 0 && email.trim().length > 0 && password.length > 0 && password === confirmPassword :
    mode === 'signup' || mode === 'exam-signup' ? email.trim().length > 0 && password.length > 0 && password === confirmPassword :
    email.trim().length > 0 && password.length > 0

  const heading =
    mode === 'enterprise' ? 'Activate your seat' :
    mode === 'exam-signup' ? 'Sign up for Exam Copilot' :
    mode === 'signup' ? 'Create your account' :
    'Welcome back'

  function handleContinue() {
    if (!canContinue) return
    setError('')
    if (mode === 'enterprise') {
      const found = findMemberByEmail(email)
      if (!found) {
        setError("We couldn't find that email on a team — ask your admin to add you first.")
        return
      }
      if (found.member.inviteCode.toUpperCase() !== inviteCode.trim().toUpperCase()) {
        setError("That invite code doesn't match this email.")
        return
      }
      if (!found.member.seatPaid) {
        setError('Your seat has not been activated yet — ask your admin to activate it.')
        return
      }
      setAccount(email, {
        accountType: found.member.role === 'admin' ? 'enterprise-admin' : 'enterprise-member',
        orgName: found.org.orgName,
      })
      onContinue({ email, track: 'enterprise-invite' })
    } else if (mode === 'exam-signup') {
      onContinue({ email, track: 'exam-signup' })
    } else if (mode === 'signin') {
      onContinue({ email, track: 'regular-signin', existingAccount: getAccount(email) })
    } else {
      onContinue({ email, track: 'regular-signup' })
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
          : mode === 'exam-signup'
          ? 'Create an account to purchase Exam Copilot — a $500 one-time purchase that takes you straight to the exam interface.'
          : 'Sign in or create an account to continue to Lightforth Copilot.'}
      </p>

      <div className="w-full max-w-sm space-y-4">
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

        {(mode === 'signup' || mode === 'exam-signup' || mode === 'enterprise') && (
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

        {(mode === 'signup' || mode === 'signin') && (
          <>
            <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="font-semibold text-blue-400 hover:underline"
              >
                {mode === 'signup' ? 'Sign in' : 'Create one'}
              </button>
            </p>
            <p className="text-center text-sm">
              <button onClick={() => setMode('enterprise')} className="font-semibold text-blue-400 hover:underline">
                I have an invite code
              </button>
            </p>
            <p className="text-center text-sm">
              <button onClick={() => setMode('exam-signup')} className="font-semibold text-blue-400 hover:underline">
                Buy Exam Copilot ($500 one-time)
              </button>
            </p>
          </>
        )}

        {mode === 'exam-signup' && (
          <p className="text-center text-sm">
            <button onClick={() => setMode('signup')} className="font-semibold text-blue-400 hover:underline">
              ← Back to regular sign up
            </button>
          </p>
        )}

        {mode === 'enterprise' && (
          <p className="text-center text-sm">
            <button onClick={() => setMode('signin')} className="font-semibold text-blue-400 hover:underline">
              ← Use regular sign in instead
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
