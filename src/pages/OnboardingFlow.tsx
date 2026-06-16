import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Upload, FileText, Search, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'

// ─── Data ─────────────────────────────────────────────────────────────────────

const JOB_CATEGORIES: Record<string, string[]> = {
  'Software / AI': [
    'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer',
    'AI / ML Engineer', 'Data Scientist', 'Data Engineer',
    'DevOps Engineer', 'Security Engineer', 'Mobile Developer',
  ],
  'Product': [
    'Product Manager', 'Technical Product Manager', 'AI Product Manager',
    'Product Analyst', 'Product Manager, B2B/SaaS',
  ],
  'Design': [
    'UX Designer', 'Product Designer', 'UI Designer',
    'Design Manager', 'Graphic Designer',
  ],
  'Marketing': [
    'Marketing Manager', 'Growth Manager', 'Product Marketing Manager',
    'Content Strategist', 'SEO Specialist',
  ],
  'Finance': [
    'Financial Analyst', 'Investment Banker', 'Portfolio Manager',
    'Risk Analyst', 'Controller',
  ],
  'Consulting': [
    'Management Consultant', 'Business Analyst', 'Strategy Consultant',
    'IT Consultant', 'Operations Consultant',
  ],
  'Sales': [
    'Account Executive', 'Sales Manager', 'Business Development Manager',
    'Enterprise Sales',
  ],
  'Healthcare': [
    'Healthcare Data Analyst', 'Healthcare IT Specialist',
    'Clinical Operations Manager',
  ],
  'Human Resource': [
    'HR Manager', 'Recruiter', 'Talent Acquisition Specialist',
    'HR Business Partner',
  ],
}

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']

const FEATURE_HIGHLIGHTS = [
  { title: 'Auto-Apply to Hundreds of Jobs', desc: 'AI applies while you focus on what matters most.' },
  { title: 'Custom Resume Per Job', desc: 'Every application gets a tailored, ATS-optimised resume.' },
  { title: 'Match Score for Every Role', desc: 'See exactly how well you fit before applying.' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingStep = 'roles' | 'location' | 'resume' | 'matching' | 'welcome'

interface OnboardingData {
  jobFunctions: string[]
  employmentTypes: string[]
  experienceLevel: string
  locationTypes: string[]
  location: string
  openToRelocate: boolean
  needsSponsorship: boolean
  resumeFile: File | null
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEP_LABELS = ['Target Role', 'Location', 'Resume']
const STEP_KEYS: OnboardingStep[] = ['roles', 'location', 'resume']

function StepIndicator({ current }: { current: OnboardingStep }) {
  const idx = STEP_KEYS.indexOf(current)
  if (idx === -1) return null
  return (
    <div className="flex items-start overflow-x-auto pb-1">
      {STEP_LABELS.map((label, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                done || active ? 'bg-primary text-white' : 'border-2 border-border text-muted-foreground'
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'mt-1 text-xs font-medium whitespace-nowrap',
                active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn('mx-2 mb-4 h-0.5 w-8 flex-shrink-0 sm:mx-3 sm:w-16', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Target Role ──────────────────────────────────────────────────────

function StepRoles({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData
  onChange: (u: Partial<OnboardingData>) => void
  onNext: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categories = Object.keys(JOB_CATEGORIES)

  const filteredCategories = query
    ? categories.filter((cat) =>
        JOB_CATEGORIES[cat].some((r) => r.toLowerCase().includes(query.toLowerCase()))
      )
    : categories

  const visibleRoles = activeCategory
    ? (query
        ? JOB_CATEGORIES[activeCategory]?.filter((r) => r.toLowerCase().includes(query.toLowerCase()))
        : JOB_CATEGORIES[activeCategory]) ?? []
    : query
    ? Object.values(JOB_CATEGORIES).flat().filter((r) => r.toLowerCase().includes(query.toLowerCase()))
    : []

  const toggleRole = (role: string) => {
    const updated = data.jobFunctions.includes(role)
      ? data.jobFunctions.filter((r) => r !== role)
      : [...data.jobFunctions, role]
    onChange({ jobFunctions: updated })
  }

  const toggleType = (list: 'employmentTypes', val: string) => {
    const updated = data[list].includes(val)
      ? data[list].filter((v) => v !== val)
      : [...data[list], val]
    onChange({ [list]: updated })
  }

  return (
    <div className="lf-panel p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">What type of role are you targeting?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Pick one or more roles that match your goals</p>
      </div>

      {/* Selected role tags */}
      {data.jobFunctions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.jobFunctions.map((role) => (
            <span key={role} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {role}
              <button onClick={() => toggleRole(role)} className="ml-0.5 hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div>
        <label className="lf-label">Job Function <span className="text-red-500 ml-0.5">*</span></label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveCategory(null) }}
            placeholder="Search roles…"
            className="lf-input pl-9"
          />
        </div>
      </div>

      {/* Category + role picker */}
      <div className="flex rounded-lg border border-border overflow-hidden" style={{ height: '220px' }}>
        {/* Left: categories */}
        <div className="w-44 flex-shrink-0 overflow-y-auto border-r border-border bg-muted/20">
          {filteredCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors',
                activeCategory === cat
                  ? 'bg-primary/5 font-semibold text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <span>{cat}</span>
              <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-40" />
            </button>
          ))}
        </div>

        {/* Right: roles */}
        <div className="flex-1 overflow-y-auto p-3">
          {(activeCategory || query) ? (
            <>
              {activeCategory && !query && (
                <p className="mb-2 text-xs font-semibold text-foreground">{activeCategory}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {visibleRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      data.jobFunctions.includes(role)
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-foreground hover:border-primary/40'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">Select a category to browse roles</p>
          )}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <label className="lf-label">Employment Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMPLOYMENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleType('employmentTypes', t)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.employmentTypes.includes(t)
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="lf-label">Experience Level</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXPERIENCE_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => onChange({ experienceLevel: l })}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.experienceLevel === l
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={data.jobFunctions.length === 0}
          className={cn(
            'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
            data.jobFunctions.length > 0 ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────

function StepLocation({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData
  onChange: (u: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const toggleLocType = (val: string) => {
    const updated = data.locationTypes.includes(val)
      ? data.locationTypes.filter((v) => v !== val)
      : [...data.locationTypes, val]
    onChange({ locationTypes: updated })
  }

  return (
    <div className="lf-panel p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Where do you want to work?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Set your location and work preferences</p>
      </div>

      {/* Preferred Location */}
      <div>
        <label className="lf-label">Preferred Location <span className="text-red-500 ml-0.5">*</span></label>
        <input
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. United States, New York, Remote"
          className="lf-input mt-1"
        />
      </div>

      {/* Location Type */}
      <div>
        <label className="lf-label">Job Location Type</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleLocType(t)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                data.locationTypes.includes(t)
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border text-foreground hover:border-primary/40'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Open to Relocate */}
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={data.openToRelocate}
          onChange={(e) => onChange({ openToRelocate: e.target.checked })}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
        />
        <span className="text-sm text-foreground">I am open to relocating</span>
      </label>

      {/* Sponsorship */}
      <div>
        <label className="lf-label">Work Authorization</label>
        <label className="mt-2 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={data.needsSponsorship}
            onChange={(e) => onChange({ needsSponsorship: e.target.checked })}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-primary"
          />
          <span className="text-sm text-foreground">I require H1B sponsorship</span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.location.trim()}
          className={cn(
            'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
            data.location.trim() ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Resume Upload ────────────────────────────────────────────────────

function StepResume({
  file,
  onFile,
  onNext,
  onBack,
  onSkip,
}: {
  file: File | null
  onFile: (f: File | null) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f: File) => {
    const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (valid && f.size <= 10 * 1024 * 1024) onFile(f)
  }

  return (
    <div className="lf-panel p-4 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Upload your resume</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Lightforth uses your resume to find matches and tailor every application
        </p>
      </div>

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3">
          <FileText className="h-8 w-8 flex-shrink-0 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB — Ready</p>
          </div>
          <Check className="h-5 w-5 flex-shrink-0 rounded-full bg-primary p-0.5 text-white" />
          <button onClick={() => onFile(null)}>
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors',
            dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
          )}
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Drag & drop your resume</p>
          <p className="mt-0.5 text-xs text-muted-foreground">PDF or Word · Max 10MB</p>
        </div>
      )}

      <button
        onClick={() => inputRef.current?.click()}
        className="upload-cta-pulse w-full rounded-lg border border-primary py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        {file ? 'Change resume' : 'Browse file'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <p className="text-xs text-muted-foreground text-center">
        Your resume is only used for job matching and will never be shared with third parties.
      </p>

      <div className="flex items-center justify-between pt-1">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Skip for now
          </button>
          <button
            onClick={onNext}
            disabled={!file}
            className={cn(
              'rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors',
              file ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
            )}
          >
            Start Matching
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Matching Screen ──────────────────────────────────────────────────────────

function MatchingScreen({ onComplete }: { onComplete: () => void }) {
  const [cardIdx, setCardIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const prog = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 60)
    const card = setInterval(() => setCardIdx((i) => (i + 1) % FEATURE_HIGHLIGHTS.length), 1800)
    const done = setTimeout(onComplete, 3500)
    return () => { clearInterval(prog); clearInterval(card); clearTimeout(done) }
  }, [onComplete])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <LightforthLogo linked={false} className="mb-10" />

      <div className="w-full max-w-sm">
        {/* Resume icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Finding roles that match your profile…
        </p>

        {/* Feature card */}
        <div className="rounded-2xl bg-[#EEF4FF] p-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            Feature Highlights
          </span>
          <h3 className="text-base font-bold text-foreground">{FEATURE_HIGHLIGHTS[cardIdx].title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{FEATURE_HIGHLIGHTS[cardIdx].desc}</p>
          <div className="mt-4 flex justify-center gap-1.5">
            {FEATURE_HIGHLIGHTS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === cardIdx ? 'w-4 bg-primary' : 'w-1.5 bg-border'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Welcome Modal ────────────────────────────────────────────────────────────

const EXP_LEVELS = [
  { label: 'Intern / New Grad', sub: '' },
  { label: 'Entry Level', sub: '1–3 years' },
  { label: 'Mid Level', sub: '2–5 years' },
  { label: 'Senior Level', sub: '5+ years' },
  { label: 'Lead / Staff', sub: 'Cross-team leader' },
  { label: 'Director / Executive', sub: 'Director / VP / CXO' },
]

function WelcomeModal({ jobFunctions, onConfirm }: { jobFunctions: string[]; onConfirm: () => void }) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['Senior Level', 'Lead / Staff'])

  const toggle = (label: string) =>
    setSelectedLevels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="p-6 sm:p-8">
          <h2 className="lf-overlay-title text-center">
            We found <span className="text-primary">8,777 roles</span> that fit you best.
          </h2>
          <p className="lf-body mt-2 text-center">
            Take a moment to confirm your experience level — this helps us rank the best matches first.
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-foreground mb-3">Recommended Experience Levels</p>
            <div className="grid grid-cols-2 gap-2">
              {EXP_LEVELS.map(({ label, sub }) => (
                <button
                  key={label}
                  onClick={() => toggle(label)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors',
                    selectedLevels.includes(label)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedLevels.includes(label)}
                    className="h-4 w-4 flex-shrink-0 accent-primary pointer-events-none"
                  />
                  <span>
                    <span className="font-semibold text-foreground">{label}</span>
                    {sub && <span className="ml-1 text-muted-foreground">{sub}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {jobFunctions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Additional Matching Functions</p>
              <div className="flex flex-wrap gap-1.5">
                {jobFunctions.slice(0, 4).map((fn) => (
                  <span key={fn} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Check className="h-3 w-3" /> {fn}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onConfirm}
            className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Confirm & See Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('roles')
  const [data, setData] = useState<OnboardingData>({
    jobFunctions: [],
    employmentTypes: ['Full-Time'],
    experienceLevel: 'Senior',
    locationTypes: ['Remote'],
    location: '',
    openToRelocate: false,
    needsSponsorship: false,
    resumeFile: null,
  })

  const update = (u: Partial<OnboardingData>) => setData((d) => ({ ...d, ...u }))

  if (step === 'matching') return <MatchingScreen onComplete={() => setStep('welcome')} />

  if (step === 'welcome') {
    return (
      <WelcomeModal
        jobFunctions={data.jobFunctions}
        onConfirm={() => navigate('/')}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 items-center border-b border-border bg-white px-6">
        <LightforthLogo linked={false} />
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-xl space-y-6">
          {/* Step indicator */}
          <StepIndicator current={step} />

          {/* Step content */}
          {step === 'roles' && (
            <StepRoles data={data} onChange={update} onNext={() => setStep('location')} />
          )}
          {step === 'location' && (
            <StepLocation
              data={data}
              onChange={update}
              onNext={() => setStep('resume')}
              onBack={() => setStep('roles')}
            />
          )}
          {step === 'resume' && (
            <StepResume
              file={data.resumeFile}
              onFile={(f) => update({ resumeFile: f })}
              onNext={() => setStep('matching')}
              onBack={() => setStep('location')}
              onSkip={() => setStep('matching')}
            />
          )}
        </div>
      </main>
    </div>
  )
}
