import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  FileText,
  Link as LinkIcon,
  Mic,
  MoreVertical,
  Play,
  Plus,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PrepView = 'home' | 'setup' | 'voice' | 'instructions' | 'live' | 'complete' | 'report'
type ReportTab = 'focus' | 'feedback'

const applications = [
  { role: 'UI/UX Designer', company: 'Lightforth INC.' },
  { role: 'UI/UX Designer', company: 'Lightforth INC.' },
]

const metrics = [
  ['80%', 'General', '1.50% better', 'green'],
  ['72%', 'Technical', '6% less', 'green'],
  ['68%', 'Culture fit', '16% less', 'orange'],
  ['32%', 'Average Core', '1.50% better', 'red'],
]

const interviews = [
  { state: 'completed', score: '58%' },
  { state: 'completed', score: '58%' },
  { state: 'analyzing', score: null },
]

const voices = [
  ['Erik', '👨‍💼', 'bg-lime-400'],
  ['Carole', '👩🏻‍💼', 'bg-sky-200'],
  ['Lauren', '👩‍💻', 'bg-pink-300'],
  ['Mike', '👨🏽‍💼', 'bg-yellow-300'],
  ['Ben', '👨🏻‍💼', 'bg-red-300'],
  ['Marie', '👩🏼‍💼', 'bg-green-400'],
]

const questions = ['38m', '1m 12s', '1h 12m', '22m', '3m 50s']

function OverlayHeader({
  title = 'Interview Prep',
  dark,
  onBack,
  onClose,
}: {
  title?: string
  dark?: boolean
  onBack: () => void
  onClose: () => void
}) {
  return (
    <header className={cn('flex min-h-[64px] items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 lg:px-16', dark ? 'border-white/10 bg-[#0f3266] text-white' : 'bg-white text-foreground')}>
      <button onClick={onBack} className="flex items-center gap-3 text-sm font-bold">
        <ArrowLeft className="h-4 w-4" />
        {title}
      </button>
      <button onClick={onClose} aria-label="Close">
        <X className="h-5 w-5 opacity-70" />
      </button>
    </header>
  )
}

function InterviewPortal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return <>{children}</>

  return createPortal(children, document.body)
}

function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md border bg-white">
      <span className="text-lg font-black text-[#123B68]">L</span>
      <span className="-ml-1 text-lg font-black text-orange-500">F</span>
    </span>
  )
}

function Donut({ value, color }: { value: string; color: string }) {
  const numericValue = Number.parseInt(value, 10)
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (numericValue / 100) * circumference
  const stroke =
    color === 'green' ? '#16a34a' :
    color === 'orange' ? '#fb923c' :
    '#dc2626'

  return (
    <div className="relative h-[72px] w-[72px] shrink-0">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="5"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-bold">{value}</span>
    </div>
  )
}

function Home({ onStart, onReport }: { onStart: () => void; onReport: () => void }) {
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Interview Prep</h1>
      </div>

      <section>
        <h2 className="lf-section-title mb-5">Simulate Interview of your recent applications</h2>
        <div className="grid max-w-[760px] gap-4 md:grid-cols-2">
          {applications.map((app, index) => (
            <article key={`${app.role}-${index}`} className="lf-panel p-4">
              <h3 className="lf-card-title">{app.role}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{app.company}</p>
              <div className="mt-5 flex items-center justify-between">
                <LogoMark />
                <Button variant="outline" className="h-11 border-slate-300 px-4 text-primary" onClick={onStart}>
                  Simulate Interview
                </Button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 h-1.5 max-w-[470px] rounded-full bg-slate-200" />
      </section>

      <hr className="my-8" />

      <section>
        <h2 className="lf-section-title">Interview focus</h2>
        <p className="lf-body mt-2">See how you performed based on your interview focus</p>
        <div className="mt-8 grid gap-8 md:grid-cols-4">
          {metrics.map(([value, label, sub, color]) => (
            <div key={label} className="flex items-center gap-4">
              <Donut value={value} color={color} />
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className={cn('mt-1 text-xs', sub.includes('less') ? 'text-red-500' : 'text-green-600')}>
                  {sub.includes('less') ? '↙' : '↗'} {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="lf-section-title">Past Interviews</h2>
            <p className="lf-body mt-5">Recommended jobs based on your career profile</p>
          </div>
          <Button onClick={onStart}>
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>
        <div className="lf-tabs mt-7">
          <button className="lf-tab lf-tab-active">Your Interviews</button>
          <button className="lf-tab">By Others</button>
        </div>
        <div className="relative mt-3 grid gap-5 md:grid-cols-3">
          <div className="absolute -top-2 left-[-10px] z-10 w-52 rounded bg-[#0b3470] p-2 text-xs font-bold leading-5 text-white shadow-lg">
            <button className="absolute right-2 top-2"><X className="h-4 w-4" /></button>
            Review interview your set for others
          </div>
          {interviews.map((item, index) => (
            <button key={index} onClick={onReport} className="text-left">
              <div className="relative aspect-[2.2] rounded-md bg-gradient-to-br from-blue-200 to-pink-300">
                <div className="absolute inset-0 flex items-center justify-center text-white/90">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30">
                    <Play className="h-7 w-7 fill-white text-white" />
                  </span>
                </div>
                <div className="absolute left-4 top-8 text-white">
                  <p className="text-sm">Part 1</p>
                  <p className="mt-2 text-base font-semibold">How to get star...</p>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">Interview-prep for Lightforth</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />24th June, 2025</span>
                    <span className="flex items-center gap-1"><Clock3 className="h-4 w-4 text-orange-500" />44 : 39</span>
                  </div>
                  <div className="mt-3 flex gap-2 text-sm">
                    {item.state === 'completed' ? (
                      <>
                        <span className="rounded border bg-green-50 px-2 py-1 text-green-600">● Completed</span>
                        <span className="rounded bg-primary px-2 py-1 text-white">You scored {item.score}</span>
                      </>
                    ) : (
                      <span className="rounded border bg-white px-2 py-1 text-muted-foreground">Analyzing</span>
                    )}
                  </div>
                </div>
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function Setup({ onBack, onClose, onNext }: { onBack: () => void; onClose: () => void; onNext: () => void }) {
  const [modal, setModal] = useState(false)

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-background">
      <OverlayHeader onBack={onBack} onClose={onClose} />
      <main className="flex h-[calc(100vh-64px)] items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="lf-panel w-full max-w-[620px] p-4 sm:p-8">
        <h1 className="lf-overlay-title">Set up your interview prep</h1>
        <p className="lf-body mt-3">
          Practice with an AI interviewer using your target role, resume, and optional job description.
        </p>
        <div className="mt-7 space-y-5">
          <label className="block">
            <span className="lf-label mb-2 block">Job title</span>
            <input className="lf-input h-11" placeholder="Enter job role" />
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">Suggestions:</span>
              <button className="text-primary hover:underline">Product Designer</button>
              <button className="text-primary hover:underline">Product Manager</button>
            </div>
          </label>
          <div>
            <p className="lf-label mb-2">Choose resume</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="h-11">
                <Upload className="h-4 w-4" />
                Upload a new resume
              </Button>
              <Button variant="outline" className="relative h-11 border-primary bg-primary/5 text-primary">
                <span className="absolute -top-4 rounded-full border border-primary bg-white px-2 py-0.5 text-[9px] font-bold text-primary">RECOMMENDED</span>
                <Sparkles className="h-4 w-4" />
                Use Lightforth Resume
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 fill-red-500 text-red-500" />
              <span>adewale_damola_PM_resume.pdf</span>
              <button aria-label="Remove resume"><X className="h-3.5 w-3.5 hover:text-destructive" /></button>
            </div>
          </div>
          <label className="block">
            <span className="lf-label mb-2 block">Job description <span className="text-xs text-muted-foreground">(optional)</span></span>
            <div className="relative">
              <textarea className="lf-input h-32 resize-none py-3" placeholder="Write or paste here..." />
              <button className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-primary hover:underline">
                <Sparkles className="h-3 w-3" />
                Suggest for me
              </button>
            </div>
          </label>
          <Button className="h-11 w-full" onClick={() => setModal(true)}>Continue</Button>
        </div>
      </div>
      </main>
      {modal && <PreferenceModal onClose={() => setModal(false)} onNext={onNext} />}
    </div>
  )
}

function PreferenceModal({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [stage, setStage] = useState('General/Introductory')
  const [difficulty, setDifficulty] = useState('Easy')
  const [responseStyle, setResponseStyle] = useState('Default')

  const styleDescriptions: Record<string, string> = {
    Default: 'A full, natural-sounding answer you can read out directly.',
    Headlines: 'Structured bullet points (STAR format) to hit every key point.',
    Coaching: 'Brief tips and pointers to guide your own answer.',
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/35 p-4">
      <div className="lf-panel max-h-[calc(100vh-2rem)] w-[min(540px,calc(100vw-32px))] overflow-y-auto p-4 shadow-xl sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="lf-section-title">Interview Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <PreferenceGroup title="Interview Stage" options={['General/Introductory', 'Technical', 'Culture Fit']} selected={stage} onChange={setStage} />
        <PreferenceGroup title="Level of Difficulty" options={['Easy', 'Medium', 'Strict']} selected={difficulty} onChange={setDifficulty} />
        <div>
          <div className="mb-5 flex items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Response Style</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Matches Copilot</span>
          </div>
          <PreferenceGroup title="" options={['Default', 'Headlines', 'Coaching']} selected={responseStyle} onChange={setResponseStyle} />
          <p className="-mt-4 mb-8 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground leading-relaxed">
            {styleDescriptions[responseStyle]}
          </p>
        </div>
        <Button className="mt-7 h-11 w-full" onClick={onNext}>Next</Button>
        <Button variant="outline" className="mt-3 h-11 w-full">
          <LinkIcon className="h-4 w-4" />
          Share as Link
        </Button>
      </div>
    </div>
  )
}

function PreferenceGroup({ title, options, selected, onChange }: { title: string; options: string[]; selected: string; onChange?: (v: string) => void }) {
  return (
    <div className="mb-8">
      <p className="mb-5 text-sm font-medium text-slate-700">{title}</p>
      <div className="space-y-3">
        {options.map((option) => (
          <button key={option} onClick={() => onChange?.(option)} className={cn('flex h-12 w-full items-center gap-4 rounded-md border px-4 text-left text-base font-medium', option === selected ? 'border-primary' : 'border-slate-200')}>
            <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', option === selected ? 'border-primary' : 'border-slate-300')}>
              {option === selected && <span className="h-3 w-3 rounded-full bg-primary" />}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Waveform() {
  return (
    <div className="relative mx-auto h-56 w-full max-w-[760px] sm:h-72">
      <div className="absolute left-[4%] right-[4%] top-1/2 h-px bg-white/50" />
      <div className="absolute left-[13%] right-[13%] top-1/2 h-20 -translate-y-1/2 rounded-[50%] bg-blue-300/25 blur-sm" />
      <div className="absolute left-[22%] right-[22%] top-1/2 h-12 -translate-y-1/2 rounded-[50%] bg-white/25" />
      <div className="absolute left-[28%] right-[28%] top-1/2 flex h-8 -translate-y-1/2 items-center justify-center gap-0.5 overflow-hidden">
        {Array.from({ length: 80 }).map((_, index) => (
          <span
            key={index}
            className="w-0.5 rounded-full bg-white"
            style={{ height: `${8 + Math.abs(Math.sin(index * 1.7)) * 30}px`, opacity: 0.55 + Math.abs(Math.cos(index)) * 0.45 }}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[#80b2ff] shadow-2xl">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-[#2147e8] bg-[#9cc3ff]/40">
            <span className="absolute h-20 w-20 rounded-full border-[10px] border-[#7137f4]" />
            <span className="h-12 w-12 rounded-full bg-white" />
            {Array.from({ length: 6 }).map((_, index) => (
              <span
                key={index}
                className="absolute h-8 w-5 rounded-full bg-[#2147e8]"
                style={{ transform: `rotate(${index * 60}deg) translateY(-54px)` }}
              />
            ))}
          </div>
        </div>
      </div>
      <Mic className="absolute left-0 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white p-2 text-violet-600" />
    </div>
  )
}

function VideoPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300', compact ? 'h-full w-full' : 'aspect-video')}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.45),transparent_35%)]" />
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/65 text-white shadow-sm">
        <Play className="ml-1 h-6 w-6 fill-white text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-black/35 px-4 py-3 text-white">
        <Play className="h-4 w-4 fill-white" />
        {!compact && <span className="text-sm">00:34 / 06:23</span>}
        <div className="h-1 flex-1 rounded bg-white/70" />
      </div>
    </div>
  )
}

function Voice({ onBack, onClose, onNext }: { onBack: () => void; onClose: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState('Erik')

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#123466] text-white">
      <OverlayHeader dark onBack={onBack} onClose={onClose} />
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-8 sm:px-6 sm:pb-12">
        <h1 className="mb-10 max-w-xl text-center text-2xl font-bold leading-tight md:text-3xl">Choose your preferred<br />interviewer voice</h1>
        <Waveform />
        <div className="mt-5 grid w-full max-w-[800px] gap-4 md:grid-cols-2">
          {voices.map(([name, avatar, color]) => (
            <button key={name} onClick={() => setSelected(name)} className="flex h-20 items-center gap-5 rounded-xl bg-[#0f3060] px-6 text-left text-base font-medium">
              <span className={cn('flex h-12 w-12 items-center justify-center rounded-full text-xl', color)}>{avatar}</span>
              <span className="flex-1">{name}</span>
              {selected === name && <Check className="h-6 w-6" />}
            </button>
          ))}
        </div>
        <Button className="mt-12 h-12 w-full max-w-md bg-white text-base font-bold text-violet-500 hover:bg-white/90" onClick={onNext}>Start Interview</Button>
      </div>
    </div>
  )
}

function Instructions({ onBack, onClose, onNext }: { onBack: () => void; onClose: () => void; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#123466] text-white">
      <OverlayHeader dark onBack={onBack} onClose={onClose} />
      <div className="mx-auto flex flex-1 max-w-2xl flex-col justify-center px-6">
        <span className="mb-5 w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-green-600">Interview Instructions</span>
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Before you Start</h1>
        <div className="space-y-5 text-base leading-7">
          <p><strong className="underline">Find a Quiet Space:</strong><br />Choose a location free from distractions, such as a home office, quiet room, or even a secluded corner in a library.</p>
          <p><strong className="underline">Ensure Proper Lighting:</strong><br />Sit in a well-lit area where your face is clearly visible. Natural light is ideal, but a lamp works too.</p>
          <p><strong className="underline">Check Your Tech Setup:</strong><br /><span className="text-lime-300 font-bold">Camera:</span> Position your camera at eye level.<br /><span className="text-lime-300 font-bold">Microphone:</span> Test your microphone.<br /><span className="text-lime-300 font-bold">Internet Connection:</span> Use a stable connection.</p>
          <p><strong className="underline">Minimize Distractions:</strong><br />Turn off notifications on your phone and computer.</p>
        </div>
        <Button className="mt-10 h-12 bg-white text-base font-bold text-violet-500 hover:bg-white/90" onClick={onNext}>Ok, I’m good!</Button>
      </div>
    </div>
  )
}

function Live({ onBack, onEnd }: { onBack: () => void; onEnd: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#123466] text-white">
      <header className="flex min-h-[72px] flex-col items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:h-[84px] lg:px-24">
        <button onClick={onBack} className="flex min-w-0 items-center gap-3 text-sm font-bold sm:text-base"><ArrowLeft className="h-5 w-5 shrink-0" /><span className="truncate">Interview for Product Designer</span></button>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
          <span className="flex items-center gap-3 rounded-2xl bg-[#082856] px-4 py-3 text-base font-bold"><span className="h-4 w-4 rounded-full border-4 border-white bg-red-500" />03:22</span>
          <Button className="h-11 bg-red-500 px-6 text-sm font-bold hover:bg-red-600" onClick={onEnd}>End Interview</Button>
        </div>
      </header>
      <main className="grid flex-1 gap-4 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[2fr_1fr] lg:overflow-hidden lg:p-8">
        <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden rounded bg-[#06172e] lg:min-h-0">
          <Waveform />
          <p className="absolute bottom-4 left-4 right-4 max-h-44 overflow-y-auto rounded bg-[#061224]/90 p-4 text-sm font-bold leading-6 sm:bottom-12 sm:left-10 sm:right-10 sm:p-5 sm:text-lg sm:leading-7">
            Hi, Jame, hope you’re having a great day! Welcome, I’m Erik, and I’ll be conducting your interview for the Data Analyst role at Your Favorite Company. Thank you for taking the time to speak with me. This is an opportunity for you to showcase your skills and experiences in your own voice. Please ensure you're in a quiet, well-lit place and can dedicate up to 20 minutes to this. Can we get started?
          </p>
        </section>
        <aside className="min-h-[420px] overflow-hidden rounded bg-[#213f77] p-4 lg:min-h-0">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(255,255,255,0.55),transparent_36%)]" />
            <div className="absolute bottom-4 left-4 flex h-10 w-16 items-center justify-center rounded-full bg-black/25">
              <span className="h-1.5 w-1 rounded-full bg-white" />
              <span className="mx-1 h-3 w-1 rounded-full bg-white" />
              <span className="h-2 w-1 rounded-full bg-white" />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-4">
              <Camera className="h-7 w-7" />
              <Mic className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-5 h-[calc(100%-260px)] space-y-4 overflow-y-auto pr-1">
            {['Interviewer', 'You', 'Interviewer', 'You', 'Interviewer'].map((speaker, index) => (
              <div key={index} className="rounded-xl bg-[#102f67] p-4 text-sm leading-6">
                <span className="mb-2 inline-block rounded bg-blue-50 px-2 py-1 text-sm font-medium text-primary">{speaker}</span>
                <p>I prioritize by understanding the users’ needs, aligning with business objectives, and collaborating with developers to ensure the features are feasible and impactful.</p>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}

function Complete({ onHome, onReport, onCopilot }: { onHome: () => void; onReport: () => void; onCopilot: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      <OverlayHeader onBack={onHome} onClose={onHome} />
      <main className="flex h-[calc(100vh-64px)] items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="lf-panel w-full max-w-[620px] p-4 sm:p-8">
        <h1 className="lf-overlay-title">Your Interview is complete!</h1>
        <p className="lf-body mt-5">Thank you for completing your AI interview with Your Favorite Company.</p>
        <p className="lf-body mt-8">Your responses have been recorded and will be evaluated by our Lightforth AI. Based on predefined criteria set by the hiring manager, Lightforth will provide an unbiased assessment for the role.</p>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <Button variant="outline" className="h-11 font-bold" onClick={onHome}>Go Home</Button>
          <Button className="h-11 font-bold" onClick={onReport}>See Report</Button>
        </div>
        <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Ready for the real thing?</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Use Interview Copilot in your actual interview — it listens in real time and puts the right answers on your screen before you even have to think.
              </p>
              <Button className="mt-4 h-10 w-full text-sm" onClick={onCopilot}>
                <Sparkles className="h-4 w-4" />
                Try Interview Copilot
              </Button>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}

function Report({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ReportTab>('focus')

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#f4f4f4]">
      <OverlayHeader title="Product designer interview at Lightforth" onBack={onBack} onClose={onBack} />
      <main className="mx-auto grid max-w-[1580px] gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_1fr] lg:gap-7 lg:p-8">
        <section className="space-y-7">
          <VideoPreview />
          <div className="rounded-md border bg-white">
            <h2 className="border-b py-6 text-center text-lg font-bold">Interview Questions</h2>
            {questions.map((time, index) => (
              <div key={time} className={cn('flex gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5', index === 0 && 'bg-blue-50')}>
                <div className="h-14 w-24 flex-shrink-0 overflow-hidden rounded">
                  <VideoPreview compact />
                </div>
                <div>
                  <p className="font-bold text-[#082856]">Question {index + 1} <span className="ml-3 rounded bg-blue-100 px-3 py-1 font-medium">{time}</span></p>
                  <p className="mt-2 text-sm">What professional skills do you have for Sales Executive positions?</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border bg-white">
          <div className="border-b p-6">
            <div className="grid rounded-md bg-muted p-1 md:grid-cols-2">
              <button onClick={() => setTab('focus')} className={cn('rounded py-3 text-sm font-bold', tab === 'focus' ? 'bg-white shadow' : 'text-muted-foreground')}>Interview Focus</button>
              <button onClick={() => setTab('feedback')} className={cn('rounded py-3 text-sm font-bold', tab === 'feedback' ? 'bg-white shadow' : 'text-muted-foreground')}>Performance Feedback</button>
            </div>
          </div>
          {tab === 'focus' ? <FocusReport /> : <FeedbackReport />}
        </section>
      </main>
    </div>
  )
}

function ScoreArc({ value }: { value: string }) {
  const numericValue = Number.parseInt(value, 10)
  const radius = 108
  const circumference = Math.PI * radius
  const dash = (numericValue / 100) * circumference

  return (
    <div className="relative mx-auto flex h-48 w-full max-w-[420px] items-center justify-center overflow-hidden rounded-md border border-blue-300 bg-blue-50">
      <svg viewBox="0 0 280 170" className="absolute bottom-[-26px] h-[220px] w-[360px]">
        <path
          d="M 32 142 A 108 108 0 0 1 248 142"
          fill="none"
          stroke="#bde3ff"
          strokeLinecap="round"
          strokeWidth="20"
        />
        <path
          d="M 32 142 A 108 108 0 0 1 248 142"
          fill="none"
          stroke="#1298ee"
          strokeLinecap="round"
          strokeWidth="20"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <p className="absolute top-9 text-center text-muted-foreground">Overall Score</p>
      <p className="absolute top-[92px] text-center text-3xl font-black">{value}</p>
    </div>
  )
}

function FocusReport() {
  return (
    <div className="p-4 sm:p-8">
      <ScoreArc value="63%" />
      <h2 className="lf-section-title mt-8">Good job! Here’s how you performed.</h2>
      {[
        ['Technical skills', '20%', 'bg-indigo-100 text-indigo-700'],
        ['Situational Judgment', '79%', 'bg-green-100 text-green-700'],
        ['Culture Fit', '85%', 'bg-orange-100 text-orange-700'],
      ].map(([title, score, cls]) => (
        <div key={title} className="mt-8">
          <span className={cn('inline-flex items-center gap-5 rounded-md px-6 py-3 font-bold', cls)}>
            {title}
            <strong className="rounded-full bg-current/20 px-3">{score}</strong>
          </span>
          <p className="mt-5 text-sm leading-6">The candidate's response was somewhat unclear and needs more detailed examples. Focus on outcomes, methods used, and stronger links between actions and business impact.</p>
          <ul className="mt-4 list-disc space-y-2 pl-8 text-base text-muted-foreground">
            <li>Provide specific examples of projects you’ve worked on.</li>
            <li>Use technical language relevant to product design.</li>
            <li>Focus on outcomes and skills learned from past experiences.</li>
          </ul>
        </div>
      ))}
    </div>
  )
}

function FeedbackReport() {
  return (
    <div className="p-4 sm:p-8">
      <div className="rounded-md border-4 border-primary bg-white shadow-xl">
        <h2 className="bg-[#123466] px-6 py-4 text-base font-bold text-white">Your strong suite</h2>
        <p className="p-7 text-sm leading-6">Elit fames accumsan lorem nunc sem ante. Nullam accumsan suscipit augue sed. Mattis enim elementum eget et sed vulputate morbi pellentesque.</p>
      </div>
      <h2 className="lf-section-title mt-10">What you need to work on:</h2>
      {['Non-Verbal Communication', 'Verbal Communication', 'Facial Expression', 'Body Posture and gestures', 'Confidence and Presence'].map((title) => (
        <div key={title} className="mt-8">
          <h3 className="text-base font-bold">{title}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-7 text-sm leading-6 text-muted-foreground">
            <li>Enhance your body language and presentation habits.</li>
            <li>Improve your clarity and confidence with interviewers.</li>
            <li>Practice concise responses with concrete examples.</li>
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function InterviewPrep() {
  const navigate = useNavigate()
  const [view, setView] = useState<PrepView>('home')

  if (view === 'setup') return <InterviewPortal><Setup onBack={() => setView('home')} onClose={() => setView('home')} onNext={() => setView('voice')} /></InterviewPortal>
  if (view === 'voice') return <InterviewPortal><Voice onBack={() => setView('setup')} onClose={() => setView('home')} onNext={() => setView('instructions')} /></InterviewPortal>
  if (view === 'instructions') return <InterviewPortal><Instructions onBack={() => setView('voice')} onClose={() => setView('home')} onNext={() => setView('live')} /></InterviewPortal>
  if (view === 'live') return <InterviewPortal><Live onBack={() => setView('instructions')} onEnd={() => setView('complete')} /></InterviewPortal>
  if (view === 'complete') return <InterviewPortal><Complete onHome={() => setView('home')} onReport={() => setView('report')} onCopilot={() => navigate('/interview-copilot')} /></InterviewPortal>
  if (view === 'report') return <InterviewPortal><Report onBack={() => setView('home')} /></InterviewPortal>

  return <Home onStart={() => setView('setup')} onReport={() => setView('report')} />
}
