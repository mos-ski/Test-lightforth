import { Check, FileText, Globe, Mic } from 'lucide-react'
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'

const ACCENT = '#0494fc'
const CARD_NAVY = '#0b1530'

const PLATFORMS = ['Google Meet', 'Zoom', 'Microsoft Teams', 'LeetCode', 'HackerRank', 'CodeSignal', 'CoderPad', 'CodePen', '+ More']

const REPORT_TAGS: { label: string; color: string }[] = [
  { label: 'Answer structure', color: '#0494fc' },
  { label: 'Speech pace', color: '#7c3aed' },
  { label: 'Filler words', color: '#0ea5e9' },
  { label: 'Confidence', color: '#16a34a' },
]

const GREETINGS = ['Hello!', '¡Hola!', 'Bonjour', '你好!', 'こんにちは', 'Ciao!', 'Olá', '안녕하세요', 'Merhaba', 'Namaste', 'Guten Tag!', 'привет!']

/** A single rounded platform-name pill — generic label, no brand marks. */
function PlatformChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      {label}
    </span>
  )
}

/** Dark-card mockup: a caught-off-guard question resolving into a highlighted best answer among alternates. */
function AnswerPressureVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 p-5 shadow-2xl shadow-slate-900/30" style={{ background: CARD_NAVY }}>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">
          <Mic className="h-3 w-3" /> Listening
        </span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Interviewer</p>
      <p className="mt-1.5 text-sm leading-relaxed text-white/65">"Why should we pick you over other candidates?"</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/40">Answer 1</span>
        <span
          className="rounded-full px-3.5 py-1.5 text-xs font-bold text-white"
          style={{ background: ACCENT, boxShadow: `0 8px 20px ${ACCENT}55` }}
        >
          Best Answer
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/40">Answer 3</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white">
        "I've shipped three products end-to-end in roles just like this one — I don't just have the skills, I've already used them under the same pressure you're hiring for."
      </p>
    </div>
  )
}

/** Session-report style tag list, one colored pill per feedback dimension. */
function GetBetterVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Your session report</p>
      {REPORT_TAGS.map(tag => (
        <span
          key={tag.label}
          className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm"
          style={{ background: tag.color }}
        >
          <Check className="h-3.5 w-3.5" /> {tag.label}
        </span>
      ))}
    </div>
  )
}

/** Accent-colored globe badge plus the three call platforms Copilot actually supports. */
function PlatformIconVisual() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: ACCENT }}>
        <Globe className="h-9 w-9 text-white" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['Zoom', 'Teams', 'Google Meet'].map(p => (
          <span key={p} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Resume + job description feeding into a personalized answer sample. */
function PersonalizedVisual() {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          <FileText className="h-3.5 w-3.5 text-primary" /> Your resume
        </span>
        <span className="text-slate-300">+</span>
        <span className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          <FileText className="h-3.5 w-3.5 text-primary" /> Job description
        </span>
      </div>
      <div className="h-4 w-px bg-slate-200" />
      <p className="max-w-xs rounded-xl bg-primary/5 px-4 py-3 text-center text-xs font-medium leading-5 text-slate-700">
        "In my last PM role I cut onboarding time 40% by owning the full lifecycle — that's the same gap I'd close here."
      </p>
    </div>
  )
}

/** Two rows of greeting chips drifting sideways — decorative, not brand-specific. */
function LanguageMarquee() {
  const rowA = [...GREETINGS, ...GREETINGS]
  const rowB = [...GREETINGS.slice().reverse(), ...GREETINGS.slice().reverse()]
  return (
    <div className="space-y-3 overflow-hidden py-6">
      <style>{`
        @keyframes fsMarqueeLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fsMarqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div className="flex w-max gap-3" style={{ animation: 'fsMarqueeLeft 26s linear infinite' }}>
        {rowA.map((g, i) => (
          <span key={i} className="whitespace-nowrap rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            {g}
          </span>
        ))}
      </div>
      <div className="flex w-max gap-3" style={{ animation: 'fsMarqueeRight 26s linear infinite' }}>
        {rowB.map((g, i) => (
          <span key={i} className="whitespace-nowrap rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            {g}
          </span>
        ))}
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  return (
    <>
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* Intro tagline */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your Personal AI Copilot for <span className="text-primary">Every Interview</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              Real-time answers while you talk, an honest debrief after you hang up, and responses shaped by your own
              background — Lightforth Copilot is built for every stage of your interview, not just the live moment.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#stealth"
                className="rounded-full border px-5 py-2 text-sm font-semibold"
                style={{ background: `${ACCENT}0d`, borderColor: `${ACCENT}33`, color: ACCENT }}
              >
                Invisible Overlay →
              </a>
              <a href="#pricing" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
                See Plans →
              </a>
              <a href="#stealth" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
                Why It's Undetectable →
              </a>
            </div>
          </div>

          {/* Feature 1 — 100% Invisible & Undetectable */}
          <div className="mt-16 rounded-3xl border border-slate-100 bg-slate-50/60 p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 sm:text-[32px] sm:leading-tight">100% Invisible &amp; Undetectable</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Interview Copilot runs quietly in the background during live interviews — even while you're screen
                  sharing. No pop-ups, no visible interface, nothing the interviewer can see. The interview just feels
                  normal, because to everyone else on the call, it is.
                </p>
                <p className="mt-6 text-[13px] font-semibold text-slate-900">Invisible while you use it on:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <PlatformChip key={p} label={p} />
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <LiveTranscriptCard
                  accent={ACCENT}
                  badge="Stealth Mode: on"
                  lines={[
                    { speaker: 'Your screen share', text: 'Shows only your camera and slides.' },
                    { speaker: 'Your display', text: 'Shows the overlay — invisible to everyone else on the call.', isAnswer: true },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Feature row 2 — Answer Clearly Under Pressure + Get Better After Every Interview */}
          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8 lg:col-span-3">
              <h3 className="text-2xl font-bold text-slate-900">Answer Clearly Under Pressure</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                When a question catches you off guard, Copilot listens, understands the context, and delivers a
                structured answer within seconds — so you're never left staring at the ceiling mid-interview.
              </p>
              <div className="mt-8 flex justify-center">
                <AnswerPressureVisual />
              </div>
            </div>
            <div className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50/60 p-8 lg:col-span-2">
              <h3 className="text-2xl font-bold text-slate-900">Get Better After Every Interview</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                After each session, see exactly what was asked, how you responded, and what to improve before the
                next round — a personal debrief instead of guessing what went wrong.
              </p>
              <div className="mt-6 flex-1">
                <GetBetterVisual />
              </div>
            </div>
          </div>

          {/* Feature row 3 — Works on Any Platform / Answers That Sound Like You / Multi-Language Support */}
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8">
              <h3 className="text-xl font-bold text-slate-900">Works on Any Platform</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No matter where your interview happens, Copilot runs in real time — it's a separate window on your
                desktop, not a plugin tied to one site, so it works across video calls and coding platforms alike.
              </p>
              <PlatformIconVisual />
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8">
              <h3 className="text-xl font-bold text-slate-900">Answers That Sound Like You</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Responses are shaped by your resume and the job description you give Copilot, so what comes back
                sounds specific and credible — like you actually did the work, because you did.
              </p>
              <PersonalizedVisual />
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8">
              <h3 className="text-xl font-bold text-slate-900">Multi-Language Support</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Copilot follows along in multiple languages for real-time transcription and response — including
                English, Spanish, French, Mandarin, and more.
              </p>
              <LanguageMarquee />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
