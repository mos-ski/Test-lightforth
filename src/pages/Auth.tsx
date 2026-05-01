import { useNavigate, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Auth() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const handleDemoLogin = async () => {
    await login('demo-token')
    navigate(from, { replace: true })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 fill-primary text-primary" />
          <span className="text-lg font-bold text-primary">Lightforth</span>
        </div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to your account to continue</p>
        <button
          onClick={handleDemoLogin}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Sign In (Demo)
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Full auth UI coming in Sign Up flow
        </p>
      </div>
    </div>
  )
}
