import { useState } from 'react'

interface LoginViewProps {
  onLogin: (email: string, password: string) => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email && password) {
      onLogin(email, password)
    }
  }

  return (
    <div className="px-8 pt-9 pb-8">
      <h1 className="mb-3 text-[38px] font-bold leading-tight text-ink">Welcome</h1>
      <p className="mb-12 text-[19px] leading-snug text-ext-muted">
        Relax and watch AutoApply handle your job<br />applications.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <label className="text-[18px] font-medium text-ink">Email</label>
          <input
            type="email"
            className="input-field h-16 rounded-xl px-6 text-[18px]"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[18px] font-medium text-ink">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field h-16 rounded-xl px-6 pr-14 text-[18px]"
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

        <button type="submit" className="btn-primary mt-3 h-16 rounded-xl text-[20px]">
          Continue
        </button>
      </form>
    </div>
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
