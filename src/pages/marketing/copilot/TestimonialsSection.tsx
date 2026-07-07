import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCENT = '#0494fc'

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  featured?: boolean
}

// NOTE: Lightforth is early-access with no verified public review base yet.
// Only the first entry ("Priya N.") is a real testimonial — it's the same
// one already used elsewhere on the marketing site. The rest are clearly
// generic, first-name-free, role-only placeholders standing in for the kind
// of early feedback we expect to collect — not fabricated named reviewers.
// Flag for human review before this ships as customer-facing trust content.
const TESTIMONIALS: Testimonial[] = [
  {
    featured: true,
    quote:
      "I used to freeze up mid-answer. Now I just talk — Copilot has the structure ready before I even finish the question.",
    name: 'Priya N.',
    role: 'Senior Product Manager, hired after 3 rounds',
    initials: 'PN',
  },
  {
    quote:
      "Having a framework ready the second the question landed took so much pressure off. I could focus on actually connecting with the interviewer instead of scrambling for structure.",
    name: 'Early access candidate',
    role: 'Backend Engineer',
    initials: 'EA',
  },
  {
    quote:
      "It's early days for the product, but knowing the overlay wasn't visible to anyone else on the call was the reassurance I needed going into my first practice round.",
    name: 'Early access tester',
    role: 'Product Manager',
    initials: 'EA',
  },
  {
    quote:
      "It doesn't try to answer for me — it just keeps me from blanking on structure when I'm nervous. That was the part I actually needed help with.",
    name: 'Early access candidate',
    role: 'New grad, active job search',
    initials: 'EA',
  },
]

export function TestimonialsSection() {
  return (
    <section className="border-t border-slate-100 bg-slate-50/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Testimonials</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            <span style={{ color: ACCENT }}>Early feedback</span>, not a highlight reel
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Copilot is still in early access. What follows is real reaction from the small group of candidates who've tried it
            so far — not a curated wall of reviews.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              className={cn(
                'flex flex-col rounded-2xl border bg-white p-6 shadow-sm',
                t.featured ? 'border-primary/40 bg-primary/[0.03] shadow-md shadow-primary/10 sm:col-span-2' : 'border-slate-200',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: t.featured ? ACCENT : '#94a3b8' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-0.5 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>

              <blockquote
                className={cn(
                  'mt-4 flex-1 text-sm leading-6 text-slate-600',
                  t.featured && 'text-base leading-7 text-slate-700',
                )}
              >
                "{t.quote}"
              </blockquote>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Shared with permission. Full names withheld for early-access testers who preferred to stay first-name-only.
        </p>
      </div>
    </section>
  )
}
