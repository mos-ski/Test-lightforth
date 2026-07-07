import { useState } from 'react'
import { Bell, Check, ChevronDown, ClipboardList, FileText, HelpCircle, Laptop, Mic, Sparkles, SlidersHorizontal, Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ACCENT = '#0494fc'
const NAVY = '#061a3a'

type TabId = 'answers' | 'customization' | 'desktop' | 'report'

const TABS: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: 'answers', label: 'Tailored AI Answers', icon: Sparkles },
  { id: 'customization', label: 'Customization', icon: SlidersHorizontal },
  { id: 'desktop', label: 'Desktop App', icon: Laptop },
  { id: 'report', label: 'Interview Report', icon: ClipboardList },
]

/** Small reusable "traffic light" row used at the top of every reconstructed app-window mockup below. */
function WindowDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </div>
  )
}

/** Tab 1 — a real, looping recording of Copilot answering live, playing autoplay/muted/inline like cluely.com's hero demo. */
function AnswersPanel() {
  return (
    <div className="relative h-full">
      <video
        className="h-full w-full object-cover"
        src="/Sales%20Copilot.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-5">
        <WindowDots />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-6 gap-y-2 bg-gradient-to-t from-black/60 to-transparent p-5 text-xs font-semibold text-white/70">
        <span>~2s to first word</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Timed so it never looks read</span>
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span>Invisible on your share</span>
      </div>
    </div>
  )
}

/** Tab 2 — the actual setup step where a candidate tailors Copilot to a specific role, resume, and job description. */
function CustomizationPanel() {
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <WindowDots />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Setup · Interview</span>
      </div>

      <div className="mt-6 flex-1 space-y-4 overflow-hidden">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-2 text-sm font-semibold text-white">Position</p>
          <div className="rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white">
            Senior Product Manager
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-white/40">Suggestions:</span>
            <span className="font-semibold" style={{ color: ACCENT }}>Product Manager</span>
            <span className="font-semibold text-white/50">Product Designer</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-2 text-sm font-semibold text-white">
            Job description <span className="font-normal text-white/40">(optional)</span>
          </p>
          <div className="relative rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-white/60">
            Own the roadmap for a cross-functional team shipping consumer-facing product at scale...
            <span className="absolute bottom-2 right-2.5 flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/70">
              <Sparkle className="h-3 w-3" /> Suggest for me
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <FileText className="h-4 w-4 flex-shrink-0 text-rose-400" />
          <span className="truncate text-sm text-white/70">darnell_smith_PM_resume.pdf</span>
          <Check className="ml-auto h-4 w-4 flex-shrink-0 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}

/** Tab 3 — the real desktop-app chrome (dark navy window, traffic lights, top bar) that ships in Lightforth Copilot today. */
function DesktopAppPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <WindowDots />
          <span className="ml-1 text-sm font-bold text-white">Lightforth</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/70">Upgrade</span>
          <Bell className="h-3.5 w-3.5 text-white/40" />
          <HelpCircle className="h-3.5 w-3.5 text-white/40" />
          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between gap-6 px-6 py-6 sm:px-10">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/35">Runs as its own window</p>
          <p className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl">
            One floating overlay, always on top — compatible with Zoom, Teams, and Google Meet.
          </p>
          <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white/70">
            <Mic className="h-4 w-4 text-white/40" />
            System audio connected
            <ChevronDown className="ml-auto h-4 w-4 text-white/40" />
          </div>
        </div>
        <div className="hidden flex-shrink-0 flex-col gap-2.5 sm:flex">
          {['Stealth Mode', 'Always on top', 'Auto-respond'].map((label, i) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/60">
              <span
                className={cn('relative flex h-4 w-7 items-center rounded-full px-0.5', i !== 2 ? 'bg-emerald-500' : 'bg-white/20')}
              >
                <span className={cn('h-3 w-3 rounded-full bg-white shadow', i !== 2 ? 'translate-x-3' : 'translate-x-0')} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Tab 4 — a sample of the post-interview report Copilot generates after a session ends. */
function ReportPanel() {
  const covered = ['Tell me about yourself', 'Greatest strength', 'A conflict you navigated', 'Why this role']
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Sample report</p>
          <p className="mt-1 text-lg font-bold text-white">Session summary · 34 min</p>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/60">Illustrative</span>
      </div>

      <div className="mt-6 grid flex-1 gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">What went well</p>
          <ul className="mt-3 space-y-2.5 text-sm text-white/70">
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />Clear structure on behavioral answers</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />Confident, unrushed delivery</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Focus for next time</p>
          <ul className="mt-3 space-y-2.5 text-sm text-white/70">
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: ACCENT }} />Add a quantified result to your strengths answer</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: ACCENT }} />Tighten the close on "why this role"</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/35">Questions covered</p>
        <div className="flex flex-wrap gap-2">
          {covered.map(q => (
            <span key={q} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">{q}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const PANELS: Record<TabId, () => JSX.Element> = {
  answers: AnswersPanel,
  customization: CustomizationPanel,
  desktop: DesktopAppPanel,
  report: ReportPanel,
}

export function HeroSection({ isWaitlist, onPrimaryCta }: { isWaitlist: boolean; onPrimaryCta: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('answers')
  const ActivePanel = PANELS[activeTab]

  return (
    <>
      {/* HERO — headline, subhead, CTA on the dotted dark-navy background already established for this page */}
      <section
        className="relative overflow-hidden bg-[#061a3a] text-white"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center lg:pt-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
            {isWaitlist ? (
              'Early access waitlist open'
            ) : (
              <>
                <span className="font-black">~2s</span> average response time in live interviews
              </>
            )}
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl">
            Walk into every interview
            <br />
            <span style={{ color: ACCENT }}>with the answer already loaded</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/70">
            {isWaitlist
              ? 'Join the early access list for the invisible overlay that reads the conversation and hands you a tailored answer in real time.'
              : "An invisible overlay reads the conversation and hands you a tailored answer in real time — undetectable on Zoom, Teams, and Google Meet, so it never looks like you're reading."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-[#061a3a] hover:bg-sky-50" onClick={onPrimaryCta}>
              {isWaitlist ? 'Join the waitlist' : 'See plans'}
            </Button>
          </div>
        </div>
      </section>

      {/* DEMO STRIP — tabbed feature highlights above a large panel showing that tab's reconstructed product demo */}
      <section className="relative overflow-hidden bg-[#061a3a] pb-20 pt-4 sm:pb-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors',
                    active ? 'bg-white text-[#061a3a] shadow' : 'text-white/60 hover:text-white',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1530] shadow-2xl shadow-black/40">
            <div className="h-[420px] sm:h-[480px]">
              <ActivePanel />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
