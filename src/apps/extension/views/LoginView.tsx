import { useState } from 'react'

interface LoginViewProps {
  onLogin: (email: string, password: string) => void
  onGoogleLogin: () => void
}

export function LoginView({ onLogin, onGoogleLogin }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) {
      onLogin(email, password)
    }
  }

  return (
    <div className="px-6 pt-2 pb-8">
      <h1 className="text-[28px] font-bold text-ink leading-tight mb-1.5">Welcome</h1>
      <p className="text-sm text-ext-muted leading-snug mb-7">
        Relax and watch AutoApply handle your job<br />applications.
      </p>

      {/* Google sign-in */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full h-11 flex items-center justify-center gap-3 border border-ext-input rounded-lg bg-white hover:bg-gray-50 transition-colors mb-5"
      >
        <GoogleIcon />
        <span className="text-sm font-medium text-ink">Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-ext-border" />
        <span className="text-xs text-ext-muted">or</span>
        <div className="flex-1 h-px bg-ext-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ext-muted hover:text-ink transition-colors"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary mt-2">
          Continue
        </button>
      </form>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 3.75C5.25 3.75 2.085 6.06 0.75 9c1.335 2.94 4.5 5.25 8.25 5.25s6.915-2.31 8.25-5.25C15.915 6.06 12.75 3.75 9 3.75z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2.25 2.25l13.5 13.5M7.425 7.515A2.25 2.25 0 0011.25 9a2.25 2.25 0 00-.765-1.68M5.07 5.175C3.42 6.12 2.1 7.425 1.5 9c1.335 2.94 4.5 5.25 8.25 5.25 1.575 0 3.045-.45 4.305-1.185M9.75 3.795A7.73 7.73 0 019 3.75c-3.75 0-6.915 2.31-8.25 5.25.585 1.29 1.5 2.43 2.64 3.315"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
