import { Check, ChevronDown, FileText, HelpCircle, Image as ImageIcon, LockKeyhole, Pause, Plus, ScanLine, Sparkles, Timer } from 'lucide-react'
import LightforthLogo from '@/components/shared/LightforthLogo'

const platforms = ['Remote proctoring', 'Browser exams', 'Desktop tests']

const workflowBullets = [
  'Auto-captures questions as they appear, with a manual capture button when you want control.',
  'Returns the answer, reasoning, and key steps fast enough to keep pace with timed exams.',
  'Runs as a private desktop layer, invisible to screen recordings and screen-share capture.',
]

const steps = [
  { icon: LockKeyhole, title: 'Buy once' },
  { icon: ScanLine, title: 'Capture the question' },
  { icon: Sparkles, title: 'Get the worked answer' },
  { icon: Check, title: 'Move to the next one' },
]

const useCases = [
  { title: 'Certification exams', image: '/figma-my-notes/consulting.png' },
  { title: 'Licensing tests', image: '/figma-my-notes/sales.png' },
  { title: 'Timed assessments', image: '/figma-my-notes/educators.png' },
]

const faqs = [
  'Can my proctor see Exam Ghost?',
  'How fast does it answer a captured question?',
  'Is this a subscription?',
  'What happens after I pay?',
  'Does it work for math, science, language, and licensing exams?',
  'Can I manually capture a question if auto-capture misses it?',
  'Do I need to pick a use case after purchase?',
  'Does it work with remote exam software?',
]

const footerColumns = [
  ['Product', 'Exam Ghost', 'Screenshot canvas', 'Auto capture', 'Manual capture', 'Invisible overlay'],
  ['Use cases', 'Certification', 'Licensing', 'Timed tests', 'Professional exams', 'Practice sessions'],
  ['Account', 'Download', 'Sign in', 'Checkout', 'Support', 'Privacy'],
  ['Lightforth', 'Copilot', 'Exam Ghost', 'Sales Closer AI', 'Desktop app', 'Contact'],
]

function ExamButton({ children, href = '/copilot/exam' }: { children: React.ReactNode; href?: string }) {
  return (
    <a href={href} className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-500 px-6 text-sm font-bold text-white shadow-sm hover:bg-amber-600">
      {children}
    </a>
  )
}

export default function FigmaMyNotesLanding() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-foreground">
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-amber-500 text-white">
        <header className="mx-auto flex h-[78px] max-w-[1680px] items-center justify-between px-6 sm:px-14">
          <LightforthLogo to="/copilot/exam" className="h-8 brightness-0 invert" />
          <span className="hidden sm:inline-flex"><ExamButton>Get Exam Ghost</ExamButton></span>
        </header>

        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-2 lg:pb-20 lg:pt-14">
          <div className="max-w-[342px] sm:max-w-[660px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-100">
              <Sparkles className="h-4 w-4" />
              Exam Ghost
            </div>
            <h1 className="mt-5 text-[38px] font-bold leading-[1.08] tracking-normal sm:text-6xl">
              The proctor sees a calm test-taker. You see every answer.
            </h1>
            <p className="mt-7 max-w-[342px] text-base leading-7 text-amber-50 sm:max-w-xl">
              Screenshot the question, get the worked answer back in seconds, and keep the help invisible to recordings and remote proctoring.
            </p>

            <div className="mt-9 max-w-[342px] rounded-xl border border-white/30 bg-white p-4 text-slate-900 shadow-2xl shadow-slate-950/20 sm:max-w-[475px] sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-600">One-time access</p>
                <p className="mt-2 text-2xl font-bold">$500 <span className="text-sm font-medium text-slate-600">lifetime</span></p>
              </div>
              <ExamButton href="/copilot/exam">Buy once</ExamButton>
            </div>
          </div>

          <div className="relative max-w-[342px] overflow-hidden rounded-xl bg-amber-500 p-3 shadow-2xl shadow-slate-950/30 sm:max-w-none">
            <div className="rounded-lg bg-white p-5 text-slate-900">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <p className="text-sm font-bold">Question captured</p>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">2.1s</span>
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                A projectile is launched at 30m/s at a 45 degree angle. What is the maximum height?
              </div>
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-slate-800">
                Use v²sin²θ / 2g. With v=30, θ=45°, g=9.8, height ≈ 22.96m.
              </div>
            </div>
            <button aria-label="Pause capture" className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
              <Pause className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <h2 className="text-lg font-bold text-slate-900">Built for the test window you already use:</h2>
          {platforms.map((platform, index) => (
            <div key={platform} className="flex min-w-[180px] items-center justify-center gap-2 font-bold text-slate-900">
              <span className={`h-4 w-4 rounded ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-900' : 'bg-primary'}`} />
              {platform}
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1220px] px-6 text-left sm:text-center">
          <h2 className="max-w-[300px] text-[25px] font-bold leading-tight tracking-normal sm:mx-auto sm:max-w-4xl sm:text-5xl">
            Exam help should be fast, focused, and out of sight
          </h2>
          <p className="mt-5 max-w-[300px] text-base leading-7 text-slate-600 sm:mx-auto sm:max-w-3xl">
            Exam Ghost is not a study dashboard. It is one tool for one moment: capture what is on screen and get the answer before time runs out.
          </p>

          <div className="mt-9 grid w-full max-w-[342px] grid-cols-3 rounded-full bg-slate-100 p-1 text-xs font-semibold sm:mx-auto sm:inline-flex sm:w-auto sm:max-w-none sm:text-sm">
            {['Before exam', 'During exam', 'After purchase'].map((tab, index) => (
              <button key={tab} className={`min-w-0 rounded-full px-2 py-2 sm:px-4 ${index === 1 ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}>{tab}</button>
            ))}
          </div>

          <div className="mt-14 grid items-center gap-12 text-left lg:grid-cols-2">
            <div className="max-w-[342px] sm:max-w-none">
              <h3 className="text-2xl font-bold">Capture, answer, keep moving</h3>
              <ul className="mt-5 space-y-4 text-base leading-7 text-slate-600">
                {workflowBullets.map(item => <li key={item} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-amber-500" />{item}</li>)}
              </ul>
            </div>
            <div className="mx-auto w-full max-w-[342px] rounded-xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10 sm:max-w-xl">
              <ImageIcon className="h-8 w-8 text-amber-500" />
              <h4 className="mt-5 text-xl font-bold text-slate-900">Screenshot canvas</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">Auto-capture watches for new questions, while manual capture lets you force a re-read anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1154px] px-6 text-center">
          <h2 className="text-4xl font-bold tracking-normal sm:text-5xl">How Exam Ghost works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(step => (
              <article key={step.title} className="flex flex-col items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <step.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 max-w-[210px] text-xl font-bold">{step.title}</h3>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-9 max-w-5xl text-xs leading-5 text-slate-500">
            After purchase, you land straight in the exam canvas. No use-case picker, no subscription plan, no unrelated setup.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1400px] px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600">
            <Sparkles className="h-4 w-4" />
            One exam assistant for high-pressure questions
          </div>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            Use it when the question is on screen and the clock is running
          </h2>
          <div className="mt-14 grid gap-8 text-left md:grid-cols-3">
            {useCases.map(item => (
              <a key={item.title} href="/copilot/exam" className="group block rounded-lg border border-border bg-white p-5 shadow-sm">
                <img src={item.image} alt="" className="aspect-square w-full rounded-lg object-cover opacity-80 grayscale" />
                <h3 className="mt-5 text-xl font-bold group-hover:text-amber-600">{item.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>
          <h2 className="mx-auto mt-4 max-w-xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
            One payment. Lifetime access.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">
            Exam Ghost is $500 once. No monthly plan, no recurring billing, no extra use cases mixed in.
          </p>
          <article className="mx-auto mt-10 max-w-xl rounded-xl border border-amber-200 bg-white p-8 text-left shadow-lg shadow-amber-900/5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-900">Exam Ghost</h3>
              <p className="text-3xl font-bold text-slate-900">$500 <span className="text-sm font-medium text-slate-500">once</span></p>
            </div>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
              {['Invisible screenshot-to-answer canvas', 'Auto-capture and manual capture', 'Any subject or exam format', 'Immediate access after checkout'].map(item => (
                <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{item}</li>
              ))}
            </ul>
            <div className="mt-8">
              <ExamButton href="/copilot/exam">Get Exam Ghost</ExamButton>
            </div>
          </article>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </div>
          <h2 className="mt-4 text-center text-4xl font-bold tracking-normal">Before exam day</h2>
          <div className="mt-10 divide-y divide-slate-200">
            {faqs.map(question => (
              <button key={question} className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-slate-900">
                {question}
                <Plus className="h-5 w-5 shrink-0 text-amber-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="trial" className="py-16 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="text-4xl font-bold tracking-normal">Get Exam Ghost</h2>
          <div className="mt-7 flex justify-center gap-3">
            <ExamButton href="/copilot/exam">Buy once</ExamButton>
            <a href="/copilot/exam" className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-bold text-slate-700">Learn more</a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_3fr]">
            <div>
              <LightforthLogo to="/copilot/exam" className="h-8 brightness-0 invert" />
              <div className="mt-8 rounded bg-white/10 p-4">
                <p className="text-sm font-bold">Exam Ghost</p>
                <p className="mt-1 text-xs text-white/60">One-time access for high-stakes tests.</p>
              </div>
              <button className="mt-8 flex h-11 w-full items-center justify-between rounded bg-white/10 px-4 text-sm text-white/80">
                $500 one-time
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {footerColumns.map(([title, ...links]) => (
                <div key={title}>
                  <h3 className="text-base font-bold">{title}</h3>
                  <ul className="mt-5 space-y-3 text-sm text-white/70">
                    {links.map(link => <li key={link}><a href="/copilot/exam" className="hover:text-white">{link}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/10 pt-8 text-xs text-white/60 sm:flex-row">
            <p>© 2026 Lightforth. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              {['Terms', 'Privacy', 'Support', 'Contact'].map(link => <a key={link} href="/copilot/exam">{link}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
