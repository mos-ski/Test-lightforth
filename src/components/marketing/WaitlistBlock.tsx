import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WaitlistBlockProps {
  product: string
  accent?: string
  accentFg?: string
}

export default function WaitlistBlock({ product, accent = '#061a3a', accentFg = '#fff' }: WaitlistBlockProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const canSubmit = name.trim().length > 0 && email.includes('@')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    // prototype — log only, no backend
    console.log('Waitlist submission:', { product, name, email, ts: new Date().toISOString() })
    setDone(true)
  }

  return (
    <section id="waitlist" className="border-t border-slate-200 bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        {done ? (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: accent }}>
              <Check className="h-7 w-7" style={{ color: accentFg }} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">You're on the list!</h2>
            <p className="mt-3 text-slate-500">
              We'll email you at <span className="font-semibold text-slate-700">{email}</span> as soon as{' '}
              {product} is open for signups.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Early access</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Join the waitlist</h2>
            <p className="mt-3 text-slate-500">
              Be first in line when {product} opens up. Drop your email and we'll reach out directly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">First name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  placeholder="you@example.com"
                  className="lf-input"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full"
                style={{ background: accent, color: accentFg }}
                disabled={!canSubmit}
              >
                Join the waitlist →
              </Button>
              <p className="text-center text-xs text-slate-400">No spam. We'll only email you when it's ready.</p>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
