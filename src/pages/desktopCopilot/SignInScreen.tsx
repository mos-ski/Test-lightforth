import { useState } from 'react'
import { BG, INPUT_BG, INPUT_BD, BLUE } from './shared'

type SignInMode = 'signup' | 'signin' | 'enterprise'

export interface SignInResult {
  hasInviteCode: boolean
}

export function SignInScreen({ onContinue }: { onContinue: (result: SignInResult) => void }) {
  const [mode, setMode] = useState<SignInMode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const

  const canContinue =
    mode === 'enterprise' ? inviteCode.trim().length > 0 && email.trim().length > 0 && password.length > 0 :
    mode === 'signup' ? email.trim().length > 0 && password.length > 0 && password === confirmPassword :
    email.trim().length > 0 && password.length > 0

  const heading =
    mode === 'enterprise' ? 'Enterprise Sign In' :
    mode === 'signup' ? 'Create your account' :
    'Welcome back'

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">{heading}</h1>
      <p className="mb-8 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {mode === 'enterprise'
          ? 'Sign in with the invite code and credentials provided by your organization admin.'
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
          <label className="mb-2 block text-sm font-semibold text-white">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
            style={inputStyle}
          />
        </div>

        {mode === 'signup' && (
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

        <button
          onClick={() => { if (canContinue) onContinue({ hasInviteCode: mode === 'enterprise' }) }}
          className="h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
          style={{ background: BLUE, opacity: canContinue ? 1 : 0.45 }}
        >
          Continue
        </button>

        {mode !== 'enterprise' && (
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
          </>
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
