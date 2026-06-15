import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Upload, ChevronRight, Check, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'

// ─── Job Category Data ────────────────────────────────────────────────────────

const JOB_CATEGORIES: Record<string, string[]> = {
  'Software/Internet/AI': [
    'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer',
    'AI/ML Engineer', 'Data Scientist', 'Data Engineer',
    'DevOps/Platform Engineer', 'Security Engineer', 'Mobile Developer',
  ],
  'Consulting': [
    'Management Consultant', 'Business Analyst', 'Strategy Consultant',
    'IT Consultant', 'Operations Consultant',
  ],
  'Marketing': [
    'Marketing Manager', 'Growth Manager', 'Content Strategist',
    'Brand Manager', 'Product Marketing Manager', 'SEO Specialist',
  ],
  'Finance': [
    'Financial Analyst', 'Investment Banker', 'Portfolio Manager',
    'Risk Analyst', 'Controller', 'Accounting Manager',
  ],
  'Product': [
    'Product Manager', 'Product Analyst', 'Technical Product Manager',
    'AI Product Manager', 'Product Manager, B2B/SaaS',
    'Product Manager, Consumer Software',
  ],
  'Healthcare': [
    'Healthcare Data Analyst', 'Healthcare Data Scientist',
    'Healthcare IT Specialist', 'Clinical Operations Manager',
    'Healthcare Quality Improvement Specialist',
  ],
  'Electrical Engineering': [
    'Electrical Engineer', 'Hardware Engineer',
    'Embedded Systems Engineer', 'Power Systems Engineer',
  ],
  'Human Resource': [
    'HR Manager', 'Recruiter', 'Talent Acquisition Specialist',
    'HR Business Partner', 'Compensation Analyst',
  ],
  'Sales': [
    'Account Executive', 'Sales Manager',
    'Business Development Manager', 'Enterprise Sales',
  ],
  'Design': [
    'UX Designer', 'Product Designer', 'UI Designer',
    'Graphic Designer', 'Design Manager',
  ],
}

const EXPERIENCE_LEVELS = [
  { label: 'Intern/New Grad', desc: '' },
  { label: 'Entry Level', desc: '1-3 years' },
  { label: 'Mid Level', desc: '2-5 years' },
  { label: 'Senior Level', desc: '5+ years, project leader' },
  { label: 'Lead/Staff', desc: 'Cross-team leader/Domain expert' },
  { label: 'Director/Executive', desc: 'Director/VP/CXO' },
]

const FEATURE_CARDS = [
  {
    title: 'Auto-Apply to Hundreds of Jobs',
    desc: 'AI applies while you focus on what matters.',
  },
  {
    title: 'Generate Custom Resume For Each Job',
    desc: 'Every application gets a tailored, ATS-optimized resume.',
  },
  {
    title: 'Match Score for Every Role',
    desc: 'Know your fit before you apply.',
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  jobFunctions: string[]
  jobTypes: string[]
  location: string
  openToRemote: boolean
  h1bSponsorship: boolean
  resumeFile: File | null
  experienceLevels: string[]
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function NextButton({ onClick, disabled, label = 'Next' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl px-8 py-3 text-sm font-semibold text-white transition-colors',
        disabled ? 'cursor-not-allowed bg-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800',
      )}
    >
      {label}
    </button>
  )
}

// ─── Mascot Avatar ────────────────────────────────────────────────────────────

function MascotAvatar() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white shadow-md">
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
        <circle cx="24" cy="24" r="24" fill="#EEF2FF" />
        <circle cx="24" cy="20" r="10" fill="#6366F1" />
        <circle cx="20" cy="18" r="2" fill="white" />
        <circle cx="28" cy="18" r="2" fill="white" />
        <path d="M19 24 Q24 28 29 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="36" r="9" fill="#818CF8" />
        <rect x="17" y="34" width="14" height="4" rx="2" fill="white" />
      </svg>
      <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
    </div>
  )
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({ headline, sub }: { headline: React.ReactNode; sub?: string }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col bg-[#f0fdf8] px-12 py-10">
      <LightforthLogo linked={false} />
      <div className="flex flex-1 flex-col justify-center">
        <MascotAvatar />
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-emerald-600">Lightforth AI</p>
        <h1 className="mt-3 text-3xl font-bold leading-snug text-neutral-900">{headline}</h1>
        {sub && <p className="mt-3 text-sm text-neutral-500">{sub}</p>}
      </div>
      <p className="text-xs text-neutral-400">© {new Date().getFullYear()} Lightforth. All rights reserved.</p>
    </div>
  )
}

// ─── Step 1: Job Function ─────────────────────────────────────────────────────

function StepJobFunction({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[]
  onToggle: (role: string) => void
  onNext: () => void
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>('Software/Internet/AI')
  const categories = Object.keys(JOB_CATEGORIES)

  return (
    <div className="flex w-full flex-col justify-between lg:w-1/2">
      {/* Mobile logo */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 lg:hidden">
        <LightforthLogo linked={false} />
      </div>

      <div className="flex flex-1 flex-col px-6 py-8 lg:px-10 lg:py-12 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Step 1 of 3</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-900 lg:hidden">
            To get started, <strong>what type of role</strong> are you looking for?
          </h2>
        </div>

        {/* Job Function label */}
        <p className="mb-1.5 text-sm font-semibold text-neutral-800">
          <span className="mr-1 text-red-500">*</span>Job Function
        </p>

        {/* Selected tags */}
        {selected.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selected.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {role}
                <button
                  onClick={() => onToggle(role)}
                  className="ml-0.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Placeholder input */}
        <div className="mb-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-400">
          Please select/enter your expected job function
        </div>

        {/* Two-column picker */}
        <div className="flex rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm" style={{ height: '280px' }}>
          {/* Category list */}
          <div className="w-48 flex-shrink-0 overflow-y-auto border-r border-neutral-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onMouseEnter={() => setHoveredCategory(cat)}
                onClick={() => setHoveredCategory(cat)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors',
                  hoveredCategory === cat
                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                    : 'text-neutral-600 hover:bg-neutral-50',
                )}
              >
                {cat}
                <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
              </button>
            ))}
          </div>

          {/* Sub-roles */}
          <div className="flex-1 overflow-y-auto p-3">
            {hoveredCategory && (
              <>
                <p className="mb-2 text-xs font-bold text-neutral-700">{hoveredCategory}</p>
                <div className="flex flex-wrap gap-1.5">
                  {JOB_CATEGORIES[hoveredCategory]?.map((role) => (
                    <button
                      key={role}
                      onClick={() => onToggle(role)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                        selected.includes(role)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400',
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-neutral-100 px-6 py-4 lg:px-10">
        <NextButton onClick={onNext} disabled={selected.length === 0} />
      </div>
    </div>
  )
}

// ─── Step 2: Job Preferences ──────────────────────────────────────────────────

const JOB_TYPES = ['Full-time', 'Contract', 'Part-time', 'Internship']

function StepJobPreferences({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: Pick<OnboardingData, 'jobTypes' | 'location' | 'openToRemote' | 'h1bSponsorship'>
  onChange: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const toggleType = (t: string) => {
    const updated = data.jobTypes.includes(t)
      ? data.jobTypes.filter((x) => x !== t)
      : [...data.jobTypes, t]
    onChange({ jobTypes: updated })
  }

  return (
    <div className="flex w-full flex-col justify-between lg:w-1/2">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 lg:hidden">
        <LightforthLogo linked={false} />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8 lg:px-10 lg:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Step 2 of 3</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-900 lg:hidden">
            What kind of <strong>opportunity</strong> are you after?
          </h2>
        </div>

        {/* Job Type */}
        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-800">
            <span className="mr-1 text-red-500">*</span>Job Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                  data.jobTypes.includes(t)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border',
                    data.jobTypes.includes(t) ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300',
                  )}
                >
                  {data.jobTypes.includes(t) && <Check className="h-3 w-3 text-white" />}
                </span>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-800">
            <span className="mr-1 text-red-500">*</span>Location
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={data.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="Anywhere in the US"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <span
                onClick={() => onChange({ openToRemote: !data.openToRemote })}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                  data.openToRemote ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 bg-white',
                )}
              >
                {data.openToRemote && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span className="text-sm text-neutral-700">Open to Remote</span>
            </label>
          </div>
        </div>

        {/* Work Authorization */}
        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-800">Work Authorization</p>
          <label className="flex cursor-pointer items-center gap-2.5">
            <span
              onClick={() => onChange({ h1bSponsorship: !data.h1bSponsorship })}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                data.h1bSponsorship ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300 bg-white',
              )}
            >
              {data.h1bSponsorship && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            <span className="text-sm text-neutral-700">H1B sponsorship</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 lg:px-10">
        <button onClick={onBack} className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Back
        </button>
        <NextButton onClick={onNext} disabled={data.jobTypes.length === 0 || !data.location.trim()} />
      </div>
    </div>
  )
}

// ─── Step 3: Resume Upload ─────────────────────────────────────────────────────

function StepResumeUpload({
  file,
  onFileChange,
  onNext,
  onBack,
  onSkip,
}: {
  file: File | null
  onFileChange: (f: File | null) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f: File) => {
    const ok = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (ok && f.size <= 10 * 1024 * 1024) onFileChange(f)
  }

  return (
    <div className="flex w-full flex-col justify-between lg:w-1/2">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 lg:hidden">
        <LightforthLogo linked={false} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8 lg:px-10 lg:py-12">
        <div className="w-full text-center lg:hidden mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Step 3 of 3</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-900">
            One last step, let's level up your search.
          </h2>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          className={cn(
            'flex h-36 w-full max-w-sm flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors',
            dragging ? 'border-emerald-400 bg-emerald-50' : 'border-neutral-200 bg-neutral-50',
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Upload className="h-6 w-6 text-neutral-500" />
          </div>
          {file ? (
            <p className="mt-2 text-sm font-medium text-emerald-600">{file.name}</p>
          ) : (
            <p className="mt-2 text-sm text-neutral-400">Drag & drop your resume here</p>
          )}
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-sm rounded-xl border border-emerald-500 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          Upload Your Resume
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        <p className="text-xs text-neutral-400">
          Files should be in <strong className="text-neutral-600">PDF</strong> or <strong className="text-neutral-600">Word</strong> format and must not exceed 10MB.
        </p>

        <div className="w-full max-w-sm rounded-xl bg-neutral-50 p-4 text-center text-xs text-neutral-500">
          Data privacy is the top priority at Lightforth. Your resume will only be used for job matching and will never be shared with third parties.
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 lg:px-10">
        <button onClick={onBack} className="text-sm text-neutral-500 hover:text-neutral-700">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onSkip} className="text-sm text-neutral-400 hover:text-neutral-600">
            Skip
          </button>
          <NextButton onClick={onNext} label="Start Matching" disabled={!file} />
        </div>
      </div>
    </div>
  )
}

// ─── Step 4: Matching Screen ──────────────────────────────────────────────────

function StepMatching({ onComplete }: { onComplete: () => void }) {
  const [cardIndex, setCardIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2))
    }, 60)
    const cardTimer = setInterval(() => {
      setCardIndex((i) => (i + 1) % FEATURE_CARDS.length)
    }, 1800)
    const doneTimer = setTimeout(onComplete, 3500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(cardTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  const messages = [
    'Identifying your job preferences — industry, role, and location.',
    'Scanning thousands of matching opportunities...',
    'Calculating your match scores...',
  ]
  const [msgIndex, setMsgIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6">
      <LightforthLogo linked={false} className="mb-12" />

      {/* Resume icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
        <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
          <rect x="6" y="4" width="28" height="32" rx="3" fill="#e5e7eb" />
          <rect x="10" y="9" width="20" height="2" rx="1" fill="#9ca3af" />
          <rect x="10" y="14" width="16" height="2" rx="1" fill="#9ca3af" />
          <rect x="10" y="19" width="18" height="2" rx="1" fill="#9ca3af" />
          <rect x="10" y="24" width="12" height="2" rx="1" fill="#9ca3af" />
          <circle cx="30" cy="30" r="8" fill="#10b981" />
          <path d="M26 30l2.5 2.5L34 27" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-1 w-64 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-12 text-sm text-neutral-500 transition-all">{messages[msgIndex]}</p>

      {/* Feature card carousel */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-6 shadow-sm">
        <div className="mb-4 inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
          Feature Highlights
        </div>
        <h3 className="text-lg font-bold text-neutral-900">{FEATURE_CARDS[cardIndex].title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{FEATURE_CARDS[cardIndex].desc}</p>
        <div className="mt-4 flex justify-center gap-1.5">
          {FEATURE_CARDS.map((_, i) => (
            <span
              key={i}
              className={cn('h-1.5 rounded-full transition-all', i === cardIndex ? 'w-4 bg-emerald-500' : 'w-1.5 bg-neutral-300')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Welcome Modal ─────────────────────────────────────────────────────

function WelcomeModal({
  jobFunctions,
  onConfirm,
}: {
  jobFunctions: string[]
  onConfirm: (levels: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(['Senior Level', 'Lead/Staff'])

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        {/* Mascot */}
        <div className="mb-4 flex justify-center">
          <MascotAvatar />
        </div>

        <h2 className="text-center text-xl font-bold text-neutral-900">
          👋 Welcome! We found{' '}
          <span className="text-emerald-600">8,777 roles</span> that fit you best.
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Take a moment to review — just making sure everything looks right for you.
        </p>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700">
            🎯 Recommended Experience Levels
          </p>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVELS.map(({ label, desc }) => (
              <button
                key={label}
                onClick={() => toggle(label)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors',
                  selected.includes(label)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border',
                    selected.includes(label) ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300',
                  )}
                >
                  {selected.includes(label) && <Check className="h-3 w-3 text-white" />}
                </span>
                <span>
                  <span className="font-semibold text-neutral-800">{label}</span>
                  {desc && <span className="ml-1 text-neutral-400">{desc}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        {jobFunctions.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
              🎯 Additional Job Functions Matching Your Background
            </p>
            <div className="flex flex-wrap gap-1.5">
              {jobFunctions.slice(0, 3).map((fn) => (
                <span
                  key={fn}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                >
                  <Check className="h-3 w-3" /> {fn}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onConfirm(selected)}
          className="mt-6 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Confirm & See Jobs
        </button>
      </div>
    </div>
  )
}

// ─── Main OnboardingFlow ──────────────────────────────────────────────────────

type Step = 'jobFunction' | 'preferences' | 'resume' | 'matching' | 'welcome'

const LEFT_CONTENT: Record<string, { headline: React.ReactNode; sub: string }> = {
  jobFunction: {
    headline: <>To get started, <span className="text-emerald-600">what type of role</span> are you looking for?</>,
    sub: 'Pick one or more job functions that match your target.',
  },
  preferences: {
    headline: <>What kind of <span className="text-emerald-600">opportunity</span> are you after?</>,
    sub: 'Tell us your preferred work type, location, and visa needs.',
  },
  resume: {
    headline: <>One last step, let's <span className="text-emerald-600">level up</span> your search by uploading your resume.</>,
    sub: 'Your resume helps us find roles that truly match your background.',
  },
}

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('jobFunction')
  const [data, setData] = useState<OnboardingData>({
    jobFunctions: [],
    jobTypes: ['Full-time'],
    location: 'Anywhere in the US',
    openToRemote: true,
    h1bSponsorship: false,
    resumeFile: null,
    experienceLevels: [],
  })

  const update = (updates: Partial<OnboardingData>) => setData((d) => ({ ...d, ...updates }))

  const toggleJobFunction = (role: string) => {
    update({
      jobFunctions: data.jobFunctions.includes(role)
        ? data.jobFunctions.filter((r) => r !== role)
        : [...data.jobFunctions, role],
    })
  }

  const handleConfirm = (levels: string[]) => {
    update({ experienceLevels: levels })
    navigate('/')
  }

  if (step === 'matching') {
    return <StepMatching onComplete={() => setStep('welcome')} />
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <WelcomeModal jobFunctions={data.jobFunctions} onConfirm={handleConfirm} />
      </div>
    )
  }

  const leftContent = LEFT_CONTENT[step]

  return (
    <div className="flex min-h-screen">
      <LeftPanel headline={leftContent.headline} sub={leftContent.sub} />

      {step === 'jobFunction' && (
        <StepJobFunction
          selected={data.jobFunctions}
          onToggle={toggleJobFunction}
          onNext={() => setStep('preferences')}
        />
      )}

      {step === 'preferences' && (
        <StepJobPreferences
          data={data}
          onChange={update}
          onNext={() => setStep('resume')}
          onBack={() => setStep('jobFunction')}
        />
      )}

      {step === 'resume' && (
        <StepResumeUpload
          file={data.resumeFile}
          onFileChange={(f) => update({ resumeFile: f })}
          onNext={() => setStep('matching')}
          onBack={() => setStep('preferences')}
          onSkip={() => setStep('matching')}
        />
      )}
    </div>
  )
}
