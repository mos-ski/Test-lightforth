import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Check, ChevronDown, RefreshCw, Pencil, Download,
  Sparkles, Info, Zap, User, AlignLeft, Briefcase, GraduationCap,
  FolderGit2, Code2, Languages, Award, Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type BuilderStep = 'template' | 'title' | 'build'
type BuilderView = 'editor' | 'diff' | 'ats' | 'preview'

const TEMPLATES = [
  { name: 'Professional', desc: 'Clean, crisp design with Libre Baskerville serif font. Traditional and...' },
  { name: 'Lora Modern', desc: 'Modern design with Lora font. Perfect for creative professionals.' },
  { name: 'Garamond Classic', desc: 'Elegant Garamond typeface for a timeless, professional look.' },
  { name: 'Calibri Clean', desc: 'Clean and readable Calibri design for modern workplaces.' },
]

const ACCORDION_SECTIONS = [
  { label: 'Personal Information', icon: User },
  { label: 'Professional Summary', icon: AlignLeft },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Projects', icon: FolderGit2 },
  { label: 'Skills', icon: Code2 },
  { label: 'Language', icon: Languages },
  { label: 'Certificate', icon: Award },
  { label: 'Website and Social Links', icon: Globe },
]

function LightforthLogo() {
  return (
    <div className="flex items-center gap-2">
      <Zap className="h-5 w-5 fill-primary text-primary" />
      <span className="text-sm font-bold text-primary">Lightforth</span>
    </div>
  )
}

function MiniResumeMockup({ template }: { template: string }) {
  const isBold = template === 'Professional' || template === 'Garamond Classic'
  return (
    <div className="w-full h-full p-2 bg-white text-[4px]">
      <p className={`text-center font-bold mb-1 ${isBold ? 'uppercase tracking-wider' : ''}`}>
        ANTHONY WILLIAM
      </p>
      <p className="text-center text-gray-400 mb-1">email@email.com | San Francisco, CA</p>
      <div className="border-t border-gray-300 mb-1" />
      <p className="font-bold uppercase text-[3.5px] mb-0.5">PROFESSIONAL SUMMARY</p>
      <div className="space-y-0.5">
        {[100, 90, 95, 85].map((w, i) => (
          <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>
      <p className="font-bold uppercase text-[3.5px] mt-1 mb-0.5">EXPERIENCE</p>
      <div className="space-y-0.5">
        {[70, 100, 80, 90, 75].map((w, i) => (
          <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

function LargeResumeMockup() {
  return (
    <div className="bg-white p-4 text-[6px] font-serif min-h-[320px]">
      <p className="text-center font-bold text-[9px] uppercase tracking-widest mb-0.5">
        ANTHONY WILLIAMS
      </p>
      <p className="text-center text-gray-400 mb-1 text-[6px]">
        +1 (555) 123-4567 | anthony.williams@email.com | San Francisco, CA
      </p>
      <div className="border-t border-gray-400 mb-1" />
      <p className="font-bold uppercase text-[6.5px] mb-0.5">PROFESSIONAL SUMMARY</p>
      <p className="text-gray-600 mb-1 leading-relaxed">
        Results-driven Senior Product Manager with 8+ years of experience leading cross-functional
        teams to deliver innovative digital products. Proven track record of increasing user
        engagement by 45% and driving $2M+ in annual revenue growth.
      </p>
      <p className="font-bold uppercase text-[6.5px] mb-0.5">EXPERIENCE</p>
      <div className="border-t border-gray-300 mb-1" />
      <div className="flex justify-between">
        <p className="font-bold text-[6px]">Lightforth</p>
        <p className="text-gray-400">Jan 2022 – Present</p>
      </div>
      <p className="italic text-gray-500 mb-0.5">Senior Product Manager</p>
      <ul className="list-disc list-inside space-y-0.5 text-gray-600">
        <li>Led development and launch of AI-powered resume builder</li>
        <li>Managed cross-functional team of 12 engineers</li>
      </ul>
    </div>
  )
}

function ResumeDoc({ showDiff = false }: { showDiff?: boolean }) {
  return (
    <div className="w-[680px] min-h-[960px] bg-white shadow-lg rounded-sm p-12 font-serif">
      <h1 className="text-center text-2xl font-bold tracking-widest text-foreground uppercase mb-1">
        Darnell Smith
      </h1>
      <p className="text-center text-xs text-muted-foreground mb-4">
        demo@lightforth.ai | New York, NY | lightforth.ai
      </p>
      <hr className="border-foreground/30 mb-4" />

      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">
        Professional Summary
      </h2>
      {showDiff ? (
        <p className="text-xs leading-relaxed mb-4">
          <span className="line-through text-red-500">
            Product & design leader with 7+ years building AI-powered SaaS products.{' '}
          </span>
          <span className="text-green-700">
            Dynamic Product Designer & Strategist with a robust background in product management
            and design engineering. Adept in aligning user needs with business goals through
            innovative design solutions.{' '}
          </span>
        </p>
      ) : (
        <p className="text-xs leading-relaxed mb-4 italic">
          Product & design leader with 7+ years building AI-powered SaaS products. Track record
          of shipping 0-to-1 features that drive user growth and revenue.
        </p>
      )}

      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">
        Experience
      </h2>
      <hr className="border-foreground/20 mb-3" />

      <div className="mb-4">
        <div className="flex justify-between mb-0.5">
          <div>
            {showDiff ? (
              <p className="text-xs font-bold">
                <span className="line-through text-red-500">Lightforth</span>{' '}
                <span className="text-green-700">NovaTech Solutions</span>
              </p>
            ) : (
              <p className="text-xs font-bold">Lightforth</p>
            )}
            <p className="text-xs italic text-muted-foreground">Product Lead</p>
          </div>
          <p className="text-xs text-muted-foreground">Jan 2024 – Present</p>
        </div>
        <ul className="mt-1 space-y-1 text-xs leading-relaxed list-disc list-inside text-foreground/80">
          <li>Led development of AI resume builder, interview prep simulator, and copilot</li>
          <li>Grew platform to 15,000+ users within 4 months of launch</li>
        </ul>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-0.5">
          <div>
            <p className="text-xs font-bold">Nova Labs</p>
            <p className="text-xs italic text-muted-foreground">Product Manager</p>
          </div>
          <p className="text-xs text-muted-foreground">Mar 2022 – Dec 2023</p>
        </div>
        <ul className="mt-1 space-y-1 text-xs leading-relaxed list-disc list-inside text-foreground/80">
          <li>Managed roadmap for B2B analytics suite serving 200+ enterprise clients</li>
          <li>Drove 40% improvement in user satisfaction through iterative UX research</li>
        </ul>
      </div>

      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">
        Education
      </h2>
      <hr className="border-foreground/20 mb-3" />
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-xs font-bold">University of Lagos</p>
          <p className="text-xs italic text-muted-foreground">B.Sc. Computer Science</p>
        </div>
        <p className="text-xs text-muted-foreground">2015 – 2019</p>
      </div>

      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-2">Skills</h2>
      <hr className="border-foreground/20 mb-3" />
      <p className="text-xs leading-relaxed text-foreground/80">
        Product Strategy · User Research · AI/ML Products · Figma · React · TypeScript · Agile
      </p>
    </div>
  )
}

function AccordionItem({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 transition-colors">
      <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  )
}

function ATSOverviewPanel({ jobTitle }: { jobTitle: string }) {
  const score = 86
  const circumference = 2 * Math.PI * 45
  const bars = [
    { label: 'Headline Match score', score: 80 },
    { label: 'Impact score', score: 90 },
    { label: 'Skill Match Score', score: 90 },
    { label: 'Experience Score', score: 90 },
    { label: 'Style Score', score: 80 },
    { label: 'Total Score', score: 86 },
  ]
  return (
    <div className="w-80 border-l border-border bg-white overflow-y-auto p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none" stroke="#16A34A" strokeWidth="8"
              strokeDasharray={`${circumference * score / 100} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {score}%
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">ATS Optimization Overview</p>
          <p className="text-xs text-muted-foreground">Darnell Smith's CV</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-1">Job Description</p>
        <p className="text-xs text-muted-foreground">{jobTitle || 'Designer'}</p>
        <button className="mt-1.5 flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted">
          <Pencil className="h-3 w-3" /> Edit Job Description
        </button>
      </div>

      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground flex items-center gap-1">
                {bar.label}
                <Info className="h-3 w-3 text-muted-foreground" />
              </span>
              <span className="text-xs font-medium text-foreground">{bar.score}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${bar.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResumeBuilder() {
  const navigate = useNavigate()
  const [step, setStep] = useState<BuilderStep>('template')
  const [view, setView] = useState<BuilderView>('editor')
  const [selectedTemplate, setSelectedTemplate] = useState('Professional')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  function renderTopBar() {
    if (step !== 'build') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-6 bg-white">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Create Resume
          </button>
          <button onClick={() => navigate('/')}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      )
    }

    if (view === 'editor') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border px-4 bg-white">
          <LightforthLogo />
          <span className="text-sm font-medium text-foreground">Darnell Smith's CV</span>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex-1" />
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
          <button
            onClick={() => setView('ats')}
            className="rounded-lg border border-green-500 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50"
          >
            ATS
          </button>
          <button
            onClick={() => setView('preview')}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Preview
          </button>
          <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
            Save
          </button>
        </div>
      )
    }

    if (view === 'diff') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border px-6 bg-white">
          <LightforthLogo />
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            <X className="h-3.5 w-3.5" /> Reject
          </button>
          <button
            onClick={() => setView('ats')}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5" /> Accept
          </button>
        </div>
      )
    }

    if (view === 'ats') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border px-6 bg-white">
          <LightforthLogo />
          <div className="flex-1" />
          <button
            onClick={() => setView('preview')}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Preview
          </button>
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      )
    }

    return (
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border px-6 bg-white">
        <LightforthLogo />
        <div className="flex-1" />
        <button
          onClick={() => setView('ats')}
          className="rounded-lg border border-green-500 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50"
        >
          ATS
        </button>
        <button
          onClick={() => setView('editor')}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu((m) => !m)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          {showDownloadMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-white shadow-lg z-10">
              {['Export as PDF', 'Export as DOCX', 'Export as Text'].map((opt) => (
                <button
                  key={opt}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderBody() {
    if (step === 'template') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 flex-shrink-0 border-r border-border px-6 pt-8 bg-white">
            {['Select a Job Profile', 'Choose Template', 'Job Title', 'Build'].map((s, i) => (
              <p
                key={s}
                className={cn('mb-3 text-sm font-medium', i === 1 ? 'text-primary' : 'text-foreground/50')}
              >
                {s}
              </p>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <h2 className="text-xl font-semibold text-foreground mb-1">Choose a resume template</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select a professionally designed template. All templates are ATS-optimized.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTemplate(t.name)}
                  className={cn(
                    'rounded-xl border-2 p-3 text-left transition-all',
                    selectedTemplate === t.name
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white hover:border-primary/40',
                  )}
                >
                  <div className="relative mb-3 h-36 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
                    {selectedTemplate === t.name && (
                      <div className="absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <MiniResumeMockup template={t.name} />
                  </div>
                  <p className={cn('text-xs font-semibold mb-0.5', selectedTemplate === t.name ? 'text-primary' : 'text-foreground')}>
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedTemplate} <span className="font-medium text-foreground">selected</span>
              </span>
              <button
                onClick={() => setStep('title')}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
              >
                Proceed
              </button>
            </div>
          </div>

          <div className="w-72 flex-shrink-0 border-l border-border p-4 overflow-y-auto bg-white">
            <h3 className="text-sm font-semibold text-foreground mb-3">Template Preview</h3>
            <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
              <LargeResumeMockup />
            </div>
          </div>
        </div>
      )
    }

    if (step === 'title') {
      return (
        <div className="flex flex-1 overflow-hidden bg-white">
          <div className="w-56 flex-shrink-0 border-r border-border px-6 pt-8">
            {['Select a Job Profile', 'Choose Template', 'Job Title', 'Build'].map((s, i) => (
              <p
                key={s}
                className={cn('mb-3 text-sm font-medium', i === 2 ? 'text-primary' : 'text-foreground/50')}
              >
                {s}
              </p>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <div className="w-full max-w-lg px-8 py-12">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What position are you applying for?
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                Enter the job title you're targeting. This will be used to personalize your resume
                and help you stand out to employers.{' '}
                {!jobTitle && <span className="text-primary font-medium">This field is required.</span>}
              </p>
              <div className="mt-6 rounded-xl border border-border bg-white p-5">
                <label className="block text-xs font-semibold text-foreground mb-2">Job Title</label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ex. Product Designer, Software Engineer"
                  className="w-full rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground mr-1 self-center">Popular titles:</span>
                  {['Software Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'Marketing Manager'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setJobTitle(t)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => jobTitle && setStep('build')}
                disabled={!jobTitle}
                className={cn(
                  'mt-6 w-full rounded-lg py-3 text-sm font-medium transition-colors',
                  jobTitle ? 'bg-primary text-white hover:bg-primary/90' : 'bg-primary/30 text-white cursor-not-allowed',
                )}
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (view === 'editor') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex-shrink-0 border-r border-border overflow-y-auto bg-white">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Darnell Smith's CV</h3>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 rounded-md bg-primary/10 text-primary text-xs font-medium py-1.5">Create</button>
                <button className="flex-1 rounded-md border border-border text-foreground text-xs font-medium py-1.5">Template</button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="22" fill="none" stroke="#2563EB" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 22 * 0.86} ${2 * Math.PI * 22}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    86%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Your Progress</p>
                  <p className="text-[11px] text-muted-foreground">Start creating your resume</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              {ACCORDION_SECTIONS.map((s) => (
                <AccordionItem key={s.label} label={s.label} icon={s.icon} />
              ))}
            </div>
          </div>

          <div className="flex-1 bg-gray-50 overflow-y-auto flex justify-center py-8">
            <ResumeDoc />
          </div>

          <div className="w-72 flex-shrink-0 border-l border-border bg-white overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">ATS Tips</h3>
            <div className="rounded-lg border border-border p-3 mb-4">
              <p className="text-xs text-muted-foreground">Your profile is 86% complete.</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '86%' }} />
              </div>
            </div>
            <label className="block text-xs font-semibold text-foreground mb-2">Job Description</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Write or paste the job description here"
              className="w-full h-32 rounded-lg border border-input px-3 py-2.5 text-xs outline-none focus:border-primary resize-none"
            />
            <div className="mt-2 flex items-center justify-between mb-3">
              <Info className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                <Sparkles className="h-3.5 w-3.5" /> Suggest for me
              </button>
            </div>
            <button
              onClick={() => setView('diff')}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" /> Tailor my Resume
            </button>
            <p className="mt-3 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground leading-relaxed">
              Our AI will generate a Resume for you base on this Job Description
            </p>
          </div>
        </div>
      )
    }

    if (view === 'diff') {
      return (
        <div className="flex-1 bg-gray-50 overflow-y-auto flex justify-center py-10">
          <ResumeDoc showDiff />
        </div>
      )
    }

    if (view === 'ats') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-gray-50 overflow-y-auto flex justify-center py-8">
            <ResumeDoc />
          </div>
          <ATSOverviewPanel jobTitle={jobTitle} />
        </div>
      )
    }

    return (
      <div
        className="flex-1 bg-gray-50 overflow-y-auto flex justify-center py-8"
        onClick={() => setShowDownloadMenu(false)}
      >
        <ResumeDoc />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {renderTopBar()}
      {renderBody()}
    </div>
  )
}
