import { useState, type Dispatch, type FocusEvent, type ReactNode, type SetStateAction } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Highlighter,
  Info,
  LayoutTemplate,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  Target,
  Trash2,
  X,
  Upload,
  Wand2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type BuilderScreen =
  | 'upload'
  | 'template'
  | 'jobTitle'
  | 'summary'
  | 'experienceList'
  | 'experienceForm'
  | 'educationList'
  | 'educationForm'
  | 'skills'
  | 'contact'
  | 'language'
  | 'canvas'
  | 'ats'
  | 'preview'

const TEMPLATES = [
  { id: 't01', name: 'Classic Blue', src: '/templates/t01.png' },
  { id: 't02', name: 'Centered', src: '/templates/t02.png' },
  { id: 't03', name: 'Minimal', src: '/templates/t03.png' },
  { id: 't04', name: 'Teal Summary', src: '/templates/t04.png' },
  { id: 't05', name: 'Clean Serif', src: '/templates/t05.png' },
  { id: 't06', name: 'Professional', src: '/templates/t06.png' },
  { id: 't07', name: 'Green Accent', src: '/templates/t07.png' },
  { id: 't08', name: 'Executive', src: '/templates/t08.png' },
  { id: 't09', name: 'Burgundy', src: '/templates/t09.png' },
  { id: 't10', name: 'Bold Blue', src: '/templates/t10.png' },
  { id: 't11', name: 'Simple', src: '/templates/t11.png' },
  { id: 't12', name: 'Slate', src: '/templates/t12.png' },
  { id: 't13', name: 'Monogram', src: '/templates/t13.png' },
  { id: 't14', name: 'Teal Highlight', src: '/templates/t14.png' },
  { id: 't15', name: 'Traditional', src: '/templates/t15.png' },
  { id: 't16', name: 'Three Column', src: '/templates/t16.png' },
  { id: 't17', name: 'Founder', src: '/templates/t17.png' },
  { id: 't18', name: 'Marketing Pro', src: '/templates/t18.png' },
  { id: 't19', name: 'Creative', src: '/templates/t19.png' },
  { id: 't20', name: 'Executive Pro', src: '/templates/t20.png' },
]

type ImproveMode = 'closed' | 'menu' | 'synonyms' | 'rewrite'
type SidebarTab = 'chat' | 'create' | 'templates'
type ChatMessage = {
  id: number
  role: 'ai' | 'user'
  text: string
}

type ResumeData = {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  city: string
  portfolio: string
  linkedin: string
  summary: string
  experienceBullets: string
  education: string
  school: string
  certificate: string
  certificateDate: string
  skills: string
  languages: string
}

const initialResumeData: ResumeData = {
  firstName: 'Adedamola',
  lastName: 'Adewale',
  title: 'Product Manager',
  email: 'adedamolamoses@gmail.com',
  phone: '123-456-7890',
  city: 'Lagos',
  portfolio: 'mo-ski.com',
  linkedin: 'linkedin.com/in/adedamola',
  summary: 'Dynamic Product Designer and Strategist with a robust background in product management and design engineering. Adept in aligning user needs with business goals through innovative design solutions and strategic product development.',
  experienceBullets:
    'Led end-to-end development of AI resume, cover letter, interview prep, and copilot products from concept to launch.\nBuilt an ATS-compliant resume builder that rewrites resumes from pasted job descriptions using AI.\nShipped a real-time interview assistant that surfaces suggested answers during live interview calls.\nGrew platform usage by improving onboarding, retention, and product activation across core workflows.',
  education: 'B.Sc. Agriculture',
  school: 'University of Ilorin',
  certificate: 'Product Management Certificate',
  certificateDate: '2025',
  skills: 'Product Strategy, Roadmap Planning, User Research, AI Product Development, Agile Delivery, Data Analysis, Stakeholder Management, Growth Experiments',
  languages: 'English, French, Yoruba',
}

const initialJobDescription =
  'Coordinate internal resources and third parties/vendors for the flawless execution of projects.\nEnsure that all projects are delivered on-time, within scope and within budget.\nDevelop project scopes, objectives, and measurable success criteria.'

function updateResumeField(
  setResume: Dispatch<SetStateAction<ResumeData>>,
  field: keyof ResumeData,
  value: string,
) {
  setResume((resume) => ({ ...resume, [field]: value }))
}

const suggestions = [
  'Diligent Senior Product Manager offering [Number] years of success in product roadmap development, market research and data analysis. Highly skilled in identifying opportunities to maximize revenue. Driven and strategic with proven history of superior market penetration and product launch.',
  'Experienced with product development, market analysis, and lifecycle management. Utilizes cross-functional collaboration to drive product success and adaptability to changing market needs.',
  'Motivated professional with extensive experience in product sales and distribution. Possesses unmatched leadership and strategy skills to maximize company revenue.',
]

const skillOptions = ['Figma', 'Graphic Design', 'Photoshop', 'Miro', 'Prototyping', 'Research']
const languageOptions = ['English', 'French', 'Spanish', 'Yoruba', 'Arabic', 'Mandarin']

function getATSInsights(resume: ResumeData, jobDescription: string) {
  const resumeText = Object.values(resume).join(' ').toLowerCase()
  const jdWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4)
  const uniqueJdWords = Array.from(new Set(jdWords))
  const matchedKeywords = uniqueJdWords.filter((word) => resumeText.includes(word)).slice(0, 8)
  const missingKeywords = uniqueJdWords.filter((word) => !resumeText.includes(word)).slice(0, 6)
  const hasMetrics = /\d|%|\$|revenue|growth|reduced|increased|launched|saved/i.test(resume.experienceBullets)
  const hasContact = Boolean(resume.email.trim() && resume.phone.trim() && resume.city.trim())
  const hasSummary = resume.summary.trim().split(/\s+/).length >= 18
  const hasSkills = resume.skills.split(',').filter((skill) => skill.trim()).length >= 6
  const jdScore = uniqueJdWords.length ? Math.round((matchedKeywords.length / Math.min(uniqueJdWords.length, 8)) * 28) : 14
  const score = Math.min(98, 36 + jdScore + (hasMetrics ? 12 : 0) + (hasContact ? 8 : 0) + (hasSummary ? 8 : 0) + (hasSkills ? 8 : 0))

  return {
    score,
    matchedKeywords,
    missingKeywords,
    checks: [
      { label: 'Contact details are complete', done: hasContact },
      { label: 'Summary has enough context', done: hasSummary },
      { label: 'Experience includes measurable impact', done: hasMetrics },
      { label: 'Skills section has 6+ relevant skills', done: hasSkills },
      { label: 'Resume mirrors job keywords', done: matchedKeywords.length >= 4 },
    ],
    scores: [
      ['Headline Match', resume.title.trim().length > 2 ? 82 : 48],
      ['Skill Match', Math.min(96, 52 + matchedKeywords.length * 7)],
      ['Impact Score', hasMetrics ? 88 : 54],
      ['Experience Score', resume.experienceBullets.split('\n').filter(Boolean).length >= 3 ? 86 : 58],
      ['Style Score', resume.summary.length < 420 ? 84 : 66],
    ] as const,
  }
}

function tailorResumeFromJobDescription(resume: ResumeData, jobDescription: string): ResumeData {
  const words = Array.from(new Set(jobDescription.match(/\b[A-Za-z][A-Za-z-]{4,}\b/g) ?? [])).slice(0, 8)
  const keywordLine = words.length ? ` Core strengths include ${words.slice(0, 5).join(', ')}.` : ''
  return {
    ...resume,
    summary: `Results-driven ${resume.title || 'professional'} with experience delivering measurable outcomes across product strategy, execution, stakeholder alignment, and operational improvement.${keywordLine}`,
    experienceBullets: `${resume.experienceBullets}\nTailored resume language to match role requirements, emphasizing ${words.slice(0, 4).join(', ') || 'high-priority responsibilities'} and measurable business impact.`,
    skills: Array.from(new Set([...resume.skills.split(',').map((skill) => skill.trim()).filter(Boolean), ...words.slice(0, 6)])).join(', '),
  }
}

// ─── Shared UI primitives ───────────────────────────────────────────────────

function PrimaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90',
        className,
      )}
    >
      {children}
    </button>
  )
}

function OutlineButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-muted',
        className,
      )}
    >
      {children}
    </button>
  )
}

function ProgressBadge({ label = 'Your Progress', sub = 'Start creating your resume' }: { label?: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[conic-gradient(#2563eb_40%,#e5e7eb_0)]">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-bold text-slate-700">40%</div>
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function Field({ label, placeholder, wide, type = 'text' }: { label: string; placeholder?: string; wide?: boolean; type?: string }) {
  return (
    <label className={cn('block', wide && 'col-span-2')}>
      <span className="lf-label mb-1.5 block">{label}</span>
      <input type={type} className="lf-input" placeholder={placeholder} />
    </label>
  )
}

function DateSelect({ label }: { label: string }) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = Array.from({ length: 15 }, (_, i) => 2025 - i)
  return (
    <label className="block">
      <span className="lf-label mb-1.5 block">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <select className="lf-select">
          <option value="">Month</option>
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select className="lf-select">
          <option value="">Year</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
    </label>
  )
}

function SuggestionList() {
  return (
    <div className="space-y-2.5">
      {suggestions.map((item, index) => (
        <button
          key={index}
          className={cn(
            'flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition',
            index === 0
              ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/50',
          )}
        >
          <Plus className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{item}</p>
        </button>
      ))}
    </div>
  )
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input className="lf-input pl-9" placeholder={placeholder} />
    </div>
  )
}

function ChipList({ items, selected }: { items: string[]; selected: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition',
            item === selected
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-white text-foreground hover:border-primary/50',
          )}
        >
          {item}
          {item === selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
        </button>
      ))}
    </div>
  )
}

// ─── Create-resume flow layout ──────────────────────────────────────────────

type CreateResumeStepId =
  | 'template'
  | 'jobTitle'
  | 'summary'
  | 'experienceList'
  | 'educationList'
  | 'skills'
  | 'contact'
  | 'language'

const STEP_LIST: [CreateResumeStepId, string][] = [
  ['template', 'Choose Template'],
  ['jobTitle', 'Job Title'],
  ['summary', 'Summary'],
  ['experienceList', 'Work Experience'],
  ['educationList', 'Education'],
  ['skills', 'Skills'],
  ['contact', 'Contact Info'],
  ['language', 'Languages'],
]

function CreateResumeTopbar({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Create Resume
      </button>
      <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </header>
  )
}

function CreateResumeSteps({ active }: { active: CreateResumeStepId }) {
  const activeIndex = STEP_LIST.findIndex(([id]) => id === active)
  return (
    <aside className="shrink-0 border-r border-border bg-white px-6 py-8">
      <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Steps</p>
      <nav className="space-y-5">
        {STEP_LIST.map(([id, label], index) => {
          const isDone = index < activeIndex
          const isActive = id === active
          return (
            <div key={id} className="flex items-center gap-3">
              <div
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors',
                  isActive && 'bg-primary text-white',
                  isDone && 'bg-emerald-500 text-white',
                  !isActive && !isDone && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <p
                className={cn(
                  'text-sm font-semibold transition-colors',
                  isActive && 'text-primary',
                  isDone && 'text-foreground',
                  !isActive && !isDone && 'text-muted-foreground',
                )}
              >
                {label}
              </p>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function CreateResumeFooter() {
  return (
    <footer className="fixed bottom-5 left-6 space-y-0.5 text-xs text-muted-foreground">
      <p>© Lightforth AI 2026</p>
      <p>support@lightforth.org</p>
    </footer>
  )
}

function BuildStep({
  step,
  onBack,
  children,
}: {
  step: CreateResumeStepId
  onBack: () => void
  children: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={onBack} onClose={() => navigate('/documents')} />
      <main className="grid flex-1 grid-cols-[220px_minmax(0,1fr)] overflow-hidden">
        <CreateResumeSteps active={step} />
        <section className="overflow-y-auto px-8 py-10">
          <div className="mx-auto max-w-xl pb-16">{children}</div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Scratch-build steps ─────────────────────────────────────────────────────

function SummaryStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="summary" onBack={() => setScreen('jobTitle')}>
      <h1 className="lf-page-title">Professional Summary</h1>
      <p className="lf-body mt-2">Write a brief summary that captures who you are and what you bring to the table.</p>

      <div className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" placeholder="Adedamola Adewale" />
          <Field label="Job Title" placeholder="Product Manager" />
        </div>

        <div>
          <span className="lf-label mb-1.5 block">Professional Summary</span>
          <p className="lf-body mb-2">Choose from our pre-written examples below or write your own.</p>
          <textarea
            className="lf-input h-32 w-full resize-none p-3 text-sm"
            placeholder="I am a results-driven professional with experience in..."
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">AI Suggestions</p>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Sparkles className="h-3.5 w-3.5" /> Suggest more
            </button>
          </div>
          <SuggestionList />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-8 w-full">
        Next — Work Experience
      </PrimaryButton>
    </BuildStep>
  )
}

function ExperienceList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  const items = [
    { title: 'Product Manager', company: 'Lightforth', period: 'Nov 2021 – Present' },
    { title: 'Product Designer', company: 'Freelance', period: 'Jan 2019 – Oct 2021' },
    { title: 'UI/UX Designer', company: 'StartupCo', period: 'Jun 2017 – Dec 2018' },
  ]
  return (
    <BuildStep step="experienceList" onBack={() => setScreen('summary')}>
      <h1 className="lf-page-title">Work Experience</h1>
      <p className="lf-body mt-2">Add your work history, starting with the most recent position.</p>

      <div className="mt-8 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="lf-panel flex items-center justify-between p-4">
            <button
              onClick={() => setScreen('experienceForm')}
              className="flex items-center gap-3 text-left"
            >
              <span className="text-lg text-slate-300">⠿</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.company} · {item.period}</p>
              </div>
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setScreen('experienceForm')}
                className="rounded-md p-1.5 transition hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {i > 0 && (
                <button className="rounded-md p-1.5 transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setScreen('experienceForm')}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Add another experience
      </button>

      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-8 w-full">
        Next — Education
      </PrimaryButton>
    </BuildStep>
  )
}

function ExperienceForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="experienceList" onBack={() => setScreen('experienceList')}>
      <h1 className="lf-page-title">Work Experience</h1>
      <p className="lf-body mt-2">Fill in the details for this position.</p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Title" placeholder="Product Manager" />
          <Field label="Company / Employer" placeholder="Google" />
          <DateSelect label="Start Date" />
          <DateSelect label="End Date" />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-primary bg-primary text-white">
            <Check className="h-3 w-3" />
          </span>
          I currently work here
        </label>

        <Field label="Location" placeholder="Lagos, Nigeria" wide />

        <div>
          <span className="lf-label mb-1.5 block">Key Achievements</span>
          <p className="lf-body mb-2">Describe what you accomplished. Start each point with an action verb.</p>
          <textarea
            className="lf-input h-32 w-full resize-none p-3 text-sm"
            placeholder="Led the development of..."
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">AI Suggestions</p>
            <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Sparkles className="h-3.5 w-3.5" /> Suggest more
            </button>
          </div>
          <SuggestionList />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-8 w-full">
        Save Experience
      </PrimaryButton>
    </BuildStep>
  )
}

function EducationList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="educationList" onBack={() => setScreen('experienceList')}>
      <h1 className="lf-page-title">Education</h1>
      <p className="lf-body mt-2">Add your educational background, starting with the most recent.</p>

      <div className="mt-8 space-y-3">
        <div className="lf-panel flex items-center justify-between p-4">
          <button onClick={() => setScreen('educationForm')} className="flex items-center gap-3 text-left">
            <span className="text-lg text-slate-300">⠿</span>
            <div>
              <p className="text-sm font-semibold text-foreground">B.Sc. Agriculture</p>
              <p className="text-xs text-muted-foreground">University of Ilorin · 2016 – 2020</p>
            </div>
          </button>
          <button
            onClick={() => setScreen('educationForm')}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setScreen('educationForm')}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> Add another education
      </button>

      <PrimaryButton onClick={() => setScreen('skills')} className="mt-8 w-full">
        Next — Skills
      </PrimaryButton>
    </BuildStep>
  )
}

function EducationForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="educationList" onBack={() => setScreen('educationList')}>
      <h1 className="lf-page-title">Education</h1>
      <p className="lf-body mt-2">Fill in your educational details.</p>

      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Institution" placeholder="University of Lagos" />
          <Field label="Location" placeholder="Lagos, Nigeria" />
          <Field label="Degree" placeholder="Bachelor of Science" />
          <Field label="Course / Major" placeholder="Computer Science" />
          <DateSelect label="Start Date" />
          <DateSelect label="End / Expected Date" />
        </div>
        <Field label="CGPA (optional)" placeholder="4.5 / 5.0" />
        <div>
          <span className="lf-label mb-1.5 block">Notable Achievements (optional)</span>
          <textarea
            className="lf-input h-24 w-full resize-none p-3 text-sm"
            placeholder="Dean's List, Best Graduating Student..."
          />
        </div>
      </div>

      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-8 w-full">
        Save Education
      </PrimaryButton>
    </BuildStep>
  )
}

function SkillsStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="skills" onBack={() => setScreen('educationList')}>
      <h1 className="lf-page-title">Skills</h1>
      <p className="lf-body mt-2">Add skills relevant to the role you're targeting. Pick from suggestions or type your own.</p>

      <div className="mt-8">
        <SearchBox placeholder="Search skills..." />
        <ChipList items={skillOptions} selected="Figma" />
      </div>

      <PrimaryButton onClick={() => setScreen('contact')} className="mt-8 w-full">
        Next — Contact Info
      </PrimaryButton>
    </BuildStep>
  )
}

function ContactStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="contact" onBack={() => setScreen('skills')}>
      <h1 className="lf-page-title">Contact Information</h1>
      <p className="lf-body mt-2">This appears at the top of your resume. Keep it professional and current.</p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Field label="First Name" placeholder="Adedamola" />
        <Field label="Last Name" placeholder="Adewale" />
        <Field label="Email Address" placeholder="adedamola@gmail.com" type="email" />
        <Field label="Phone Number" placeholder="+234 810 367 4006" type="tel" />
        <Field label="City" placeholder="Lagos, Nigeria" />
        <Field label="Postal Code" placeholder="100216" />
        <label className="col-span-2 block">
          <span className="lf-label mb-1.5 block">Website / Portfolio (optional)</span>
          <input className="lf-input" placeholder="mo-ski.com" />
        </label>
        <label className="col-span-2 block">
          <span className="lf-label mb-1.5 block">LinkedIn (optional)</span>
          <input className="lf-input" placeholder="linkedin.com/in/adedamola" />
        </label>
      </div>

      <PrimaryButton onClick={() => setScreen('language')} className="mt-8 w-full">
        Next — Languages
      </PrimaryButton>
    </BuildStep>
  )
}

function LanguageStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuildStep step="language" onBack={() => setScreen('contact')}>
      <h1 className="lf-page-title">Languages</h1>
      <p className="lf-body mt-2">Add languages you speak. Multi-lingual skills stand out to global employers.</p>

      <div className="mt-8">
        <SearchBox placeholder="Search languages..." />
        <ChipList items={languageOptions} selected="English" />
      </div>

      <PrimaryButton onClick={() => setScreen('canvas')} className="mt-10 w-full">
        Start Building
      </PrimaryButton>
    </BuildStep>
  )
}

// ─── Resume document renderer ────────────────────────────────────────────────

function ResumePaper({
  editable = false,
  resume,
  setResume,
  fitViewport = false,
  templateId = 't01',
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  fitViewport?: boolean
  templateId?: string
}) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || 'John Doe'
  const bulletItems = resume.experienceBullets
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const skills = resume.skills.split(',').map((item) => item.trim()).filter(Boolean)
  const languages = resume.languages.split(',').map((item) => item.trim()).filter(Boolean)
  const accent = templateId === 't07' || templateId === 't14' ? '#0f766e' : templateId === 't09' ? '#9f1239' : templateId === 't12' ? '#334155' : '#143763'
  const centered = templateId === 't02' || templateId === 't13'
  const serif = templateId === 't05' || templateId === 't15'

  function editableText(field: keyof ResumeData, className: string, fallback?: string) {
    return {
      contentEditable: editable,
      suppressContentEditableWarning: true,
      className,
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (setResume) updateResumeField(setResume, field, event.currentTarget.textContent?.trim() || fallback || '')
      },
    }
  }

  return (
    <article
      className={cn(
        'mx-auto rounded-lg border border-slate-200 bg-white shadow-sm',
        serif && 'font-serif',
        fitViewport
          ? 'h-full max-h-[calc(100vh-9.5rem)] aspect-[8.5/11] min-h-0 w-auto overflow-hidden px-10 py-8 text-[13px] leading-5 ring-1 ring-slate-100'
          : 'min-h-[1056px] w-[816px] px-16 py-12',
      )}
    >
      <header className={cn('flex justify-between gap-6', centered && 'flex-col items-center text-center', fitViewport ? 'mb-6' : 'mb-8')}>
        <div>
          <h1
            contentEditable={editable}
            suppressContentEditableWarning
            className={cn('font-bold uppercase tracking-normal', fitViewport ? 'text-xl' : 'text-2xl')}
            style={{ color: accent }}
            onBlur={(event) => {
              if (!setResume) return
              const [firstName, ...rest] = (event.currentTarget.textContent?.trim() || fullName).split(/\s+/)
              setResume((current) => ({ ...current, firstName: firstName || current.firstName, lastName: rest.join(' ') || current.lastName }))
            }}
          >
            {fullName}
          </h1>
          <p {...editableText('title', cn('mt-1', fitViewport ? 'text-sm' : 'text-base'), 'Position')}>{resume.title}</p>
        </div>
        <div className={cn('text-right', centered && 'text-center', fitViewport ? 'text-xs leading-5' : 'text-sm leading-6')}>
          <p {...editableText('phone', '', '123-456-7890')}>{resume.phone}</p>
          <p {...editableText('email', 'text-[#149cf2]', 'myemail@gmail.com')}>{resume.email}</p>
          <p {...editableText('portfolio', '', 'www.myportfolio.com')}>{resume.portfolio}</p>
          <p>Linkedin: <span {...editableText('linkedin', 'text-[#149cf2] underline', 'John Doe')}>{resume.linkedin}</span></p>
        </div>
      </header>
      <ResumeSection title="Experience" editable={editable} active resume={resume} setResume={setResume} bulletItems={bulletItems} fitViewport={fitViewport} accent={accent} />
      <ResumeSection title="Education" editable={editable} resume={resume} setResume={setResume} fitViewport={fitViewport} accent={accent} />
      <ResumeSection title="Certificates" editable={editable} resume={resume} setResume={setResume} fitViewport={fitViewport} accent={accent} />
      <section className={cn(fitViewport ? 'mt-5' : 'mt-8')}>
        <h2 className={cn('border-b-2 pb-1 uppercase', fitViewport ? 'text-sm' : 'text-base')} style={{ borderColor: accent }}>Skills</h2>
        <div className={cn('mt-3 grid grid-cols-2 gap-2', fitViewport ? 'text-xs leading-5' : 'text-sm leading-6')}>
          {skills.map((skill, index) => (
            <p
              key={`${skill}-${index}`}
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!setResume) return
                const next = [...skills]
                next[index] = event.currentTarget.textContent?.trim() || ''
                updateResumeField(setResume, 'skills', next.filter(Boolean).join(', '))
              }}
            >
              {skill}
            </p>
          ))}
        </div>
      </section>
      <section className={cn(fitViewport ? 'mt-5' : 'mt-8')}>
        <h2 className={cn('border-b-2 pb-1 uppercase', fitViewport ? 'text-sm' : 'text-base')} style={{ borderColor: accent }}>Languages</h2>
        <div className={cn('mt-3', fitViewport ? 'text-xs leading-5' : 'text-sm leading-6')}>
          {languages.map((item, index) => (
            <p
              key={`${item}-${index}`}
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!setResume) return
                const next = [...languages]
                next[index] = event.currentTarget.textContent?.trim() || ''
                updateResumeField(setResume, 'languages', next.filter(Boolean).join(', '))
              }}
            >
              {item}
            </p>
          ))}
        </div>
      </section>
    </article>
  )
}

function ResumeSection({
  title,
  editable,
  active,
  resume,
  setResume,
  bulletItems = [],
  fitViewport = false,
  accent = '#143763',
}: {
  title: string
  editable?: boolean
  active?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  bulletItems?: string[]
  fitViewport?: boolean
  accent?: string
}) {
  return (
    <section className={cn(fitViewport ? 'mt-5' : 'mt-8')}>
      <h2 className={cn('border-b-2 pb-1 uppercase', fitViewport ? 'text-sm' : 'text-base')} style={{ borderColor: accent }}>{title}</h2>
      <div className="mt-3">
        <div className="mb-2 flex justify-between">
          <div>
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!setResume) return
                updateResumeField(setResume, title === 'Education' ? 'education' : title === 'Certificates' ? 'certificate' : 'title', event.currentTarget.textContent?.replace(/\s+$/, '') || '')
              }}
              className={cn('font-bold', fitViewport && 'text-xs')}
            >
              {title === 'Education' ? resume.education : title === 'Certificates' ? resume.certificate : 'Position'} <Pencil className="ml-1 inline h-3 w-3" />
            </p>
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (setResume && title === 'Education') updateResumeField(setResume, 'school', event.currentTarget.textContent?.trim() || '')
              }}
              className={cn('text-slate-500', fitViewport && 'text-xs')}
            >
              {title === 'Education' ? resume.school : title === 'Certificates' ? '' : resume.city}
            </p>
          </div>
          <p
            contentEditable={editable && title === 'Certificates'}
            suppressContentEditableWarning
            onBlur={(event) => {
              if (setResume && title === 'Certificates') updateResumeField(setResume, 'certificateDate', event.currentTarget.textContent?.trim() || '')
            }}
            className={cn('text-slate-500', fitViewport && 'text-xs')}
          >
            {title === 'Education' ? 'End Date' : title === 'Certificates' ? resume.certificateDate : 'Start Date - End Date'}
          </p>
        </div>
        {title === 'Experience' && (
          <div
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(event) => {
              if (!setResume) return
              const lines = Array.from(event.currentTarget.querySelectorAll('li'))
                .map((li) => li.textContent?.trim() || '')
                .filter(Boolean)
              updateResumeField(setResume, 'experienceBullets', lines.join('\n'))
            }}
            className={cn('rounded-md p-3 outline-none', fitViewport ? 'text-xs leading-5' : 'text-sm leading-6', active && 'border border-sky-300')}
          >
            <ul className="list-disc pl-5">
              {bulletItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Canvas screen (full editor) ─────────────────────────────────────────────

function CanvasScreen({
  setScreen,
  resume,
  setResume,
  templateId,
  setTemplateId,
  jobDescription,
  setJobDescription,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
  templateId: string
  setTemplateId: (id: string) => void
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
}) {
  const [improveMode, setImproveMode] = useState<ImproveMode>('closed')
  const [expanded, setExpanded] = useState('')
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('chat')
  const [resumeName, setResumeName] = useState("Adedamola's CV")
  const [isEditingName, setIsEditingName] = useState(false)
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState(['Personal Information', 'Professional Summary', 'Experience', 'Education', 'Skills', 'Language', 'Certificates', 'Website and Social Links'])
  const [zoom, setZoom] = useState(0.9)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const navigate = useNavigate()
  const selectedTemplate = TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0]
  const zoomPercent = Math.round(zoom * 100)
  const quickPrompts = ['Make summary more formal', 'Shorten experience bullets', 'Add stronger metrics']
  const availableSections = ['Projects', 'Awards', 'Volunteer Work', 'Publications'].filter((item) => !visibleSections.includes(item))

  function handleTailor() {
    if (!jobDescription.trim()) return
    setResume((current) => tailorResumeFromJobDescription(current, jobDescription))
    setChatMessages((messages) => [
      ...messages,
      { id: Date.now(), role: 'user', text: 'Rewrite my resume for this job description.' },
      { id: Date.now() + 1, role: 'ai', text: 'Done. I rewrote the summary, added role keywords to skills, and added a tailored impact bullet. Keep editing here and I will keep the canvas updated.' },
    ])
  }

  function sendChat(message = chatDraft) {
    const trimmed = message.trim()
    const normalized = trimmed.toLowerCase()
    if (!normalized) return
    let aiText = 'I updated the resume canvas with that direction. You can ask for tone, length, stronger metrics, or a more ATS-focused rewrite next.'
    if (normalized.includes('short')) {
      updateResumeField(setResume, 'summary', resume.summary.split('.').slice(0, 2).join('.').trim())
      aiText = 'I shortened the professional summary while keeping the main positioning intact.'
    } else if (normalized.includes('formal') || normalized.includes('professional')) {
      updateResumeField(setResume, 'summary', resume.summary.replace('Dynamic', 'Accomplished').replace('robust', 'comprehensive'))
      aiText = 'I made the summary sound more formal and executive without making it stiff.'
    } else if (normalized.includes('job description') || normalized.includes('rewrite') || normalized.includes('tailor')) {
      handleTailor()
      setChatDraft('')
      return
    } else if (normalized.includes('metric') || normalized.includes('impact')) {
      updateResumeField(setResume, 'experienceBullets', `${resume.experienceBullets}\nImproved product activation and delivery quality by aligning roadmap decisions with measurable user and business outcomes.`)
      aiText = 'I added a stronger impact-focused bullet. Add exact numbers later and the ATS score will respond even better.'
    }
    setChatMessages((messages) => [
      ...messages,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'ai', text: aiText },
    ])
    setChatDraft('')
  }

  function addSection(section: string) {
    setVisibleSections((current) => [...current, section])
    setExpanded(section)
    setAddSectionOpen(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f6f8] font-sans text-slate-950">
      <FullscreenTopbar
        left={(
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/documents')} aria-label="Close resume builder" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              {isEditingName ? (
                <input
                  value={resumeName}
                  autoFocus
                  onChange={(event) => setResumeName(event.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setIsEditingName(false)
                  }}
                  className="h-8 w-52 rounded-md border border-slate-200 px-2 text-sm font-bold outline-none focus:border-[#149cf2]"
                />
              ) : (
                <button onClick={() => setIsEditingName(true)} className="flex max-w-56 items-center gap-1 text-left text-sm font-bold text-slate-950">
                  <span className="truncate">{resumeName || 'Untitled resume'}</span>
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
              <p className="text-xs text-slate-500">Resume canvas</p>
            </div>
          </div>
        )}
        right={(
          <>
            <span className="mr-2 hidden items-center gap-1.5 text-sm font-semibold text-green-600 lg:inline-flex">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
            <OutlineButton onClick={() => setScreen('preview')} className="h-9">Preview <Eye className="h-4 w-4" /></OutlineButton>
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              alignRight
              button={<PrimaryButton className="h-9">Download <Download className="ml-2 h-4 w-4" /></PrimaryButton>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
          </>
        )}
      />
      <main className="grid min-h-0 flex-1 grid-cols-[250px_minmax(0,1fr)_260px] gap-3 px-4 py-3">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-5 flex shrink-0 items-center gap-3 text-sm font-bold">
            <Menu className="h-5 w-5 text-[#123667]" />
            Resume content
            <Pencil className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mb-5 grid shrink-0 grid-cols-3 rounded-md border border-slate-200 bg-slate-50 p-1 text-center text-xs font-semibold">
            {[
              ['chat', MessageSquare, 'Chat'],
              ['create', FileText, 'Create'],
              ['templates', LayoutTemplate, 'Templates'],
            ].map(([id, Icon, label]) => (
              <button
                key={id as string}
                onClick={() => setSidebarTab(id as SidebarTab)}
                className={cn('flex items-center justify-center gap-1 rounded-md py-2 transition-colors', sidebarTab === id ? 'bg-white shadow-sm' : 'text-slate-500')}
              >
                <Icon className="h-3.5 w-3.5" />
                {label as string}
              </button>
            ))}
          </div>
          {sidebarTab === 'chat' ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 space-y-4 overflow-hidden pr-1">
                {chatMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="text-lg font-bold text-slate-900">Paste your job description</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">I can rewrite your resume for the role, then we can refine it together.</p>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className={cn('flex items-start gap-2', message.role === 'user' && 'justify-end')}>
                      <div className={cn(
                        'max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6',
                        message.role === 'user' ? 'rounded-tr-sm bg-[#149cf2] text-white' : 'rounded-tl-sm bg-slate-100 text-slate-700',
                      )}>
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 shrink-0 space-y-3 border-t border-slate-200 pt-3">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendChat(prompt)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#149cf2] hover:text-[#149cf2]">
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2">
                  <textarea
                    value={chatDraft}
                    onChange={(event) => setChatDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        sendChat()
                      }
                    }}
                    rows={2}
                    className="min-w-0 flex-1 resize-none text-sm leading-5 outline-none"
                    placeholder="Message Lightforth AI..."
                  />
                  <button onClick={() => sendChat()} aria-label="Send chat message" className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#149cf2] text-white">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : sidebarTab === 'templates' ? (
            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="mb-4 rounded-md border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-900">{selectedTemplate.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">The main canvas is editable and updates as you switch templates.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 overflow-hidden">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplateId(tmpl.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-md border-2 transition-all',
                      templateId === tmpl.id ? 'border-[#149cf2] shadow-md' : 'border-slate-200 hover:border-slate-400',
                    )}
                  >
                    <img src={tmpl.src} alt={tmpl.name} className="w-full object-cover" />
                    {templateId === tmpl.id && (
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#149cf2]">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <p className="bg-white py-1.5 text-center text-xs font-medium text-slate-600">{tmpl.name}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden">
              <ProgressBadge />
              <div className="mt-5 divide-y divide-slate-200 overflow-hidden">
                {visibleSections.map((item) => (
                  <div key={item} className="py-4">
                    <button onClick={() => setExpanded(expanded === item ? '' : item)} className="flex w-full items-center justify-between text-sm font-semibold text-slate-700 transition hover:text-slate-950">
                      {item}
                      <span>{expanded === item ? '−' : '+'}</span>
                    </button>
                    {expanded === item && (
                      <div className="mt-4 space-y-2.5">
                        {item === 'Personal Information' && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <SidebarInput label="First Name" value={resume.firstName} onChange={(value) => updateResumeField(setResume, 'firstName', value)} />
                              <SidebarInput label="Last Name" value={resume.lastName} onChange={(value) => updateResumeField(setResume, 'lastName', value)} />
                            </div>
                            <SidebarInput label="Job Title" value={resume.title} onChange={(value) => updateResumeField(setResume, 'title', value)} />
                            <SidebarInput label="Email" value={resume.email} onChange={(value) => updateResumeField(setResume, 'email', value)} type="email" />
                            <div className="grid grid-cols-2 gap-2">
                              <SidebarInput label="Phone" value={resume.phone} onChange={(value) => updateResumeField(setResume, 'phone', value)} />
                              <SidebarInput label="City" value={resume.city} onChange={(value) => updateResumeField(setResume, 'city', value)} />
                            </div>
                          </>
                        )}
                        {item === 'Professional Summary' && (
                          <>
                            <div className="mb-3 grid grid-cols-3 gap-1.5">
                              {[
                                ['Suggest', Wand2],
                                ['Synonyms', Highlighter],
                                ['Rewrite', Sparkles],
                              ].map(([label, Icon]) => (
                                <button key={label as string} onClick={() => setImproveMode(label === 'Synonyms' ? 'synonyms' : 'menu')} className="flex h-8 items-center justify-center gap-1 rounded-md border border-slate-200 text-[11px] font-semibold text-slate-600 hover:border-[#149cf2] hover:text-[#149cf2]">
                                  <Icon className="h-3.5 w-3.5" />
                                  {label as string}
                                </button>
                              ))}
                            </div>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Summary</span>
                              <textarea
                                rows={4}
                                className="lf-input h-auto w-full resize-none py-2 text-sm"
                                value={resume.summary}
                                onChange={(event) => updateResumeField(setResume, 'summary', event.target.value)}
                                placeholder="Describe yourself in 2-4 sentences..."
                              />
                            </label>
                            <button className="flex items-center gap-1 text-xs font-semibold text-[#149cf2]">
                              <Sparkles className="h-3.5 w-3.5" /> AI Suggestions
                            </button>
                          </>
                        )}
                        {item === 'Experience' && (
                          <>
                            <div className="mb-3 flex gap-4 text-slate-400">
                              <b>B</b><i>I</i><b>H</b><span>"</span><span>🔗</span><AlignLeft className="h-5 w-5" />
                            </div>
                            <div className="rounded-md border border-sky-300 p-4">
                              <textarea
                                rows={5}
                                className="w-full resize-none rounded-md border-0 bg-transparent text-base leading-6 outline-none"
                                value={resume.experienceBullets}
                                onChange={(event) => updateResumeField(setResume, 'experienceBullets', event.target.value)}
                              />
                              <div className="mt-10 flex items-center justify-between border-t pt-4">
                                <Info className="h-5 w-5 text-orange-400" />
                                <button onClick={() => setImproveMode('menu')} className="rounded-md border border-emerald-500 px-4 py-2 text-sm font-bold text-emerald-600">
                                  <Pencil className="mr-2 inline h-4 w-4" /> Improve
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {item === 'Education' && (
                          <>
                            <SidebarInput label="Degree / Qualification" value={resume.education} onChange={(value) => updateResumeField(setResume, 'education', value)} />
                            <SidebarInput label="School / Institution" value={resume.school} onChange={(value) => updateResumeField(setResume, 'school', value)} />
                            <div className="grid grid-cols-2 gap-2">
                              <SidebarInput label="Start Year" placeholder="2014" />
                              <SidebarInput label="End Year" placeholder="2018" />
                            </div>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Description (optional)</span>
                              <textarea rows={2} className="lf-input h-auto w-full resize-none py-2 text-sm" placeholder="Relevant coursework, honours..." />
                            </label>
                          </>
                        )}
                        {item === 'Skills' && (
                          <>
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Add skills</span>
                              <textarea
                                rows={2}
                                className="lf-input h-auto w-full resize-none py-2 text-sm"
                                value={resume.skills}
                                onChange={(event) => updateResumeField(setResume, 'skills', event.target.value)}
                                placeholder="e.g. Figma, TypeScript, Agile, SQL..."
                              />
                            </label>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {['Figma', 'TypeScript', 'Agile', 'SQL', 'React', 'Leadership'].map((s) => (
                                <button key={s} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-[#149cf2] hover:text-[#149cf2] transition-colors">
                                  {s}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                        {item === 'Language' && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <SidebarInput label="Language" value={resume.languages.split(',')[0] ?? ''} onChange={(value) => {
                                const [, ...rest] = resume.languages.split(',').map((language) => language.trim())
                                updateResumeField(setResume, 'languages', [value, ...rest].filter(Boolean).join(', '))
                              }} />
                              <label className="block">
                                <span className="mb-1 block text-xs text-slate-500">Proficiency</span>
                                <select className="lf-input w-full pr-3 text-sm">
                                  {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map((l) => (
                                    <option key={l}>{l}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <button className="flex items-center gap-1 text-xs font-semibold text-[#149cf2]">
                              <Plus className="h-3.5 w-3.5" /> Add another language
                            </button>
                          </>
                        )}
                        {item === 'Certificates' && (
                          <>
                            <SidebarInput label="Certificate Name" value={resume.certificate} onChange={(value) => updateResumeField(setResume, 'certificate', value)} />
                            <div className="grid grid-cols-2 gap-2">
                              <SidebarInput label="Issuing Organisation" placeholder="Amazon Web Services" />
                              <SidebarInput label="Issue Date" value={resume.certificateDate} onChange={(value) => updateResumeField(setResume, 'certificateDate', value)} />
                            </div>
                          </>
                        )}
                        {item === 'Website and Social Links' && (
                          <>
                            <SidebarInput label="LinkedIn" value={resume.linkedin} onChange={(value) => updateResumeField(setResume, 'linkedin', value)} type="url" />
                            <SidebarInput label="Portfolio" value={resume.portfolio} onChange={(value) => updateResumeField(setResume, 'portfolio', value)} type="url" />
                          </>
                        )}
                        {['Projects', 'Awards', 'Volunteer Work', 'Publications'].includes(item) && (
                          <>
                            <SidebarInput label={`${item} title`} placeholder={`Add ${item.toLowerCase()} title`} />
                            <label className="block">
                              <span className="mb-1 block text-xs text-slate-500">Details</span>
                              <textarea rows={3} className="lf-input h-auto w-full resize-none py-2 text-sm" placeholder="Add the details you want to show on the resume." />
                            </label>
                          </>
                        )}
                        {item !== 'Experience' && (
                          <button className="mt-1 w-full rounded-md bg-[#149cf2]/10 py-2 text-sm font-semibold text-[#149cf2] hover:bg-[#149cf2]/20 transition-colors">
                            Save
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="relative py-3">
                  <button onClick={() => setAddSectionOpen((open) => !open)} className="flex h-10 w-full items-center justify-between text-left text-sm font-semibold text-[#149cf2]">
                    + Add section
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {addSectionOpen && (
                    <div className="absolute bottom-14 left-0 right-0 z-20 rounded-md border border-slate-200 bg-white p-1 shadow-xl">
                      {availableSections.length ? availableSections.map((section) => (
                        <button key={section} onClick={() => addSection(section)} className="flex h-9 w-full items-center rounded px-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          {section}
                        </button>
                      )) : (
                        <p className="px-3 py-2 text-sm text-slate-500">All sections are already added.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        <section className="relative flex min-h-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-[#eef1f5] shadow-inner">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Canvas</p>
            <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 text-slate-500">
              <button onClick={() => setZoom((value) => Math.max(0.55, Number((value - 0.08).toFixed(2))))} className="grid h-7 w-7 place-items-center rounded hover:bg-slate-50" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
              <button onClick={() => setZoom(0.9)} className="px-2 text-xs font-semibold text-slate-700">{zoomPercent}%</button>
              <button onClick={() => setZoom((value) => Math.min(1.25, Number((value + 0.08).toFixed(2))))} className="grid h-7 w-7 place-items-center rounded hover:bg-slate-50" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="relative min-h-0 flex-1 overflow-auto px-5 py-4">
            <div className="mx-auto" style={{ width: 816 * zoom, height: 1056 * zoom }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                <ResumePaper editable resume={resume} setResume={setResume} templateId={templateId} />
              </div>
            </div>
          </div>
          <ImprovePopover mode={improveMode} setMode={setImproveMode} />
        </section>

        <CanvasRightPanel resume={resume} jobDescription={jobDescription} />
      </main>
    </div>
  )
}

// ─── Sidebar input for canvas ─────────────────────────────────────────────────

function SidebarInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="lf-input w-full text-sm"
      />
    </label>
  )
}

function FullscreenTopbar({ left, title, right }: { left?: ReactNode; title?: string; right?: ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="min-w-0">{left ?? <span className="text-base font-semibold">{title}</span>}</div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}

function ActionMenu({
  button,
  items,
  open,
  setOpen,
  alignRight,
  icon = 'download',
}: {
  button: ReactNode
  items: string[]
  open: boolean
  setOpen: (open: boolean) => void
  alignRight?: boolean
  icon?: 'download' | 'save'
}) {
  const Icon = icon === 'save' ? Save : Download
  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{button}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className={cn('absolute top-11 z-30 w-48 rounded-lg border border-primary/30 bg-white p-1.5 shadow-xl', alignRight ? 'right-0' : 'left-0')}>
            {items.map((item) => (
              <button
                key={item}
                onClick={() => setOpen(false)}
                className="flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {item}
                <Icon className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ImprovePopover({ mode, setMode }: { mode: ImproveMode; setMode: (mode: ImproveMode) => void }) {
  if (mode === 'closed') return null
  return (
    <div className="absolute left-4 top-4 z-30 w-[360px] overflow-hidden rounded-md border-2 border-[#123667] bg-white shadow-2xl">
      <div className="flex h-10 items-center justify-between bg-[#123667] px-3 text-white">
        <span className="font-semibold">✦ Improve</span>
        <button onClick={() => setMode('closed')}><X className="h-5 w-5" /></button>
      </div>
      {mode === 'synonyms' && (
        <div className="p-3">
          <p className="mb-3 text-sm">Synonyms for newsletter</p>
          <div className="flex flex-wrap gap-3">
            {['Mailings', 'Paperwork', 'Writeups', 'Summary'].map((item) => (
              <button key={item} className="rounded-md border border-sky-300 px-4 py-3 text-sm">{item}</button>
            ))}
          </div>
        </div>
      )}
      {mode === 'rewrite' && (
        <div className="p-3">
          <button onClick={() => setMode('menu')} className="mb-4 rounded-md border px-4 py-2 text-sm"><ArrowLeft className="mr-2 inline h-4 w-4" /> Back</button>
          <p className="text-sm leading-6">Developed numerous marketing programs (logos, brochures, newsletters, infographics, presentations) and guaranteed that they exceeded the expectations of our clients</p>
        </div>
      )}
      {mode === 'menu' && (
        <div className="max-h-[410px] overflow-auto p-3">
          <div className="flex flex-wrap gap-3">
            {['😊 Casual', '👋 Engaging', '✍️ Outline', '🗣️ Persuasive', '👊 Assertive', '💪 Confident', '🫶 Constructive', '🤝 Diplomatic', '☝️ Friendly', '📷 Descriptive', '💦 Detailed', '📏 Shorter', '🪜 Longer', '💃 Simplify', '🔁 Paraphrase', '🛠 Fix any mistake', '🧑‍💼 More Professional', '⚡ Rewrite'].map((item) => (
              <button
                key={item}
                onClick={() => item.includes('Rewrite') || item.includes('mistake') ? setMode('rewrite') : undefined}
                className={cn(
                  'rounded-full border border-sky-300 px-4 py-2 text-sm font-semibold',
                  item.includes('mistake') && 'bg-[#149cf2] text-white',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="mt-4 rounded-md border px-4 py-2 text-sm">↻ Generate Text</button>
        </div>
      )}
    </div>
  )
}

function CanvasRightPanel({
  resume,
  jobDescription,
}: {
  resume: ResumeData
  jobDescription: string
}) {
  const insights = getATSInsights(resume, jobDescription)
  return (
    <aside className="min-h-0 space-y-4 overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <section className="rounded-md border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#16a34a ${insights.score}%, #e5e7eb 0)` }}>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-bold text-slate-700">{insights.score}%</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live ATS score</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Updates as you edit the resume and the chat job prompt.</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {insights.scores.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500"><span>{label}</span><span>{value}%</span></div>
              <div className="h-1.5 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-md border border-slate-200 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><Info className="h-4 w-4" /> Live ATS tips</h3>
        <div className="space-y-2.5">
          {insights.checks.map((check) => (
            <p key={check.label} className="flex items-start gap-2 text-sm leading-5 text-slate-600">
              <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white', check.done ? 'bg-emerald-500' : 'bg-amber-500')}>
                {check.done ? '✓' : '!'}
              </span>
              {check.label}
            </p>
          ))}
        </div>
        {insights.missingKeywords.length > 0 && (
          <div className="mt-4 rounded-md bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-800">Recommended keywords</p>
            <p className="mt-1 text-xs leading-5 text-amber-700">{insights.missingKeywords.join(', ')}</p>
          </div>
        )}
        {insights.matchedKeywords.length > 0 && (
          <div className="mt-3 rounded-md bg-emerald-50 p-3">
            <p className="text-xs font-bold text-emerald-800">Already matched</p>
            <p className="mt-1 text-xs leading-5 text-emerald-700">{insights.matchedKeywords.join(', ')}</p>
          </div>
        )}
      </section>
    </aside>
  )
}

// ─── ATS screen ───────────────────────────────────────────────────────────────

function ATSScreen({
  setScreen,
  resume,
  setResume,
  jobDescription,
  setJobDescription,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
}) {
  const navigate = useNavigate()
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f6f8] font-sans">
      <FullscreenTopbar
        left={<button onClick={() => setScreen('canvas')} className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Back to canvas</button>}
        right={(
          <>
            <OutlineButton onClick={() => setScreen('preview')} className="h-9">Preview <Eye className="h-4 w-4" /></OutlineButton>
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              button={<OutlineButton className="h-9">Download <Download className="h-4 w-4" /></OutlineButton>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
            <ActionMenu
              open={saveOpen}
              setOpen={setSaveOpen}
              alignRight
              button={<PrimaryButton className="h-9">Save <Save className="ml-2 h-4 w-4" /></PrimaryButton>}
              items={['Save changes', 'Save as draft']}
              icon="save"
            />
            <button onClick={() => navigate('/documents')} aria-label="Close ATS view" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      />
      <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_460px] gap-4 px-5 py-4">
        <section className="flex min-h-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-[#eef1f5] p-4 shadow-inner">
          <ResumePaper editable resume={resume} setResume={setResume} fitViewport />
        </section>
        <ATSOverviewPanel jobDescription={jobDescription} setJobDescription={setJobDescription} />
      </main>
    </div>
  )
}

function ATSOverviewPanel({
  jobDescription,
  setJobDescription,
}: {
  jobDescription: string
  setJobDescription: Dispatch<SetStateAction<string>>
}) {
  const scores = [
    ['Headline Match Score', 80, 'bg-emerald-500'],
    ['Skill Match Score', 90, 'bg-emerald-500'],
    ['Style Score', 80, 'bg-emerald-500'],
    ['Impact Score', 90, 'bg-emerald-500'],
    ['Experience Score', 90, 'bg-emerald-500'],
    ['Total Score', 86, 'bg-emerald-500'],
  ] as const
  return (
    <aside className="min-h-0 overflow-y-auto rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="rounded-lg border border-slate-200 p-5">
        <div className="flex items-center gap-5">
          <div className="relative grid h-16 w-16 place-items-center rounded-full bg-[conic-gradient(#16a34a_86%,#e5e7eb_0)]">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-xs font-bold text-slate-600">86%</div>
          </div>
          <div>
            <h2 className="text-base font-bold">ATS Optimization Overview</h2>
            <p className="text-sm text-slate-500">Adedamola's CV</p>
          </div>
        </div>
        <h3 className="mt-6 text-sm font-bold">Job Description</h3>
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          className="lf-input mt-3 h-28 w-full resize-none bg-white p-3 text-sm leading-6"
        />
        <div className="my-6 border-t border-slate-200" />
        <div className="space-y-5 text-base font-semibold text-slate-600">
          {['Contact Information', 'Professional Summary', 'Experience and Work History', 'Education', 'Skills'].map((item, index) => (
            <p key={item} className="flex items-center gap-5">
              <span className={cn('grid h-6 w-6 place-items-center rounded-full text-white', index === 0 || index === 3 ? 'bg-red-500' : 'bg-emerald-500')}>
                {index === 0 || index === 3 ? '!' : '✓'}
              </span>
              {item}
            </p>
          ))}
        </div>
        <div className="my-8 border-t border-slate-200" />
        <div className="space-y-5">
          {scores.map(([label, value, color]) => (
            <div key={label}>
              <div className="mb-2 flex justify-between text-sm text-slate-500"><span>{label}</span><span>{value}%</span></div>
              <div className="h-1 rounded-full bg-slate-200"><div className={cn('h-1 rounded-full', color)} style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ─── Preview screen ───────────────────────────────────────────────────────────

function PreviewScreen({
  setScreen,
  resume,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
}) {
  const navigate = useNavigate()
  const [downloadOpen, setDownloadOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f6f8] font-sans">
      <FullscreenTopbar
        left={(
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('canvas')} aria-label="Back to editor" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-950">Preview</p>
              <p className="text-xs text-slate-500">Scroll to review every page</p>
            </div>
          </div>
        )}
        right={(
          <>
            <OutlineButton onClick={() => setScreen('canvas')} className="h-9">Edit <Pencil className="h-4 w-4" /></OutlineButton>
            <ActionMenu
              open={downloadOpen}
              setOpen={setDownloadOpen}
              alignRight
              button={<PrimaryButton className="h-9">Download <Download className="ml-2 h-4 w-4" /></PrimaryButton>}
              items={['Export as PDF', 'Export as DOCX', 'Export as Text']}
            />
            <button onClick={() => navigate('/documents')} aria-label="Close preview" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      />
      <main className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex w-fit flex-col gap-8">
          <ResumePaper resume={resume} />
          <ResumePaper resume={{ ...resume, firstName: '', lastName: 'Additional Experience' }} />
        </div>
      </main>
    </div>
  )
}

// ─── Upload resume screen ─────────────────────────────────────────────────────

function UploadResumeScreen({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(f: File) {
    const ok = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type)
    if (ok && f.size <= 5 * 1024 * 1024) setFile(f)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={() => navigate('/documents')} onClose={() => navigate('/documents')} />
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-lg">
          <h1 className="lf-page-title text-center">Upload your resume</h1>
          <p className="lf-body mt-2 text-center">
            Upload your existing resume and we'll parse it for you, then let you pick a new template.
          </p>

          <label
            className={cn(
              'mt-10 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className={cn('grid h-16 w-16 place-items-center rounded-2xl', file ? 'bg-emerald-100' : 'bg-primary/10')}>
              {file
                ? <Check className="h-8 w-8 text-emerald-600" />
                : <Upload className="h-8 w-8 text-primary" />
              }
            </div>

            {file ? (
              <>
                <p className="text-base font-bold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · ready to import</p>
                <button
                  onClick={(e) => { e.preventDefault(); setFile(null) }}
                  className="text-sm font-semibold text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-base font-semibold text-foreground">Drag & drop your resume here</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <p className="text-xs text-muted-foreground">PDF or DOCX · Max 5 MB</p>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </label>

          <PrimaryButton
            onClick={() => file && setScreen('template')}
            className={cn('mt-8 w-full', !file && 'cursor-not-allowed bg-primary/35 hover:bg-primary/35')}
          >
            Continue — Choose Template
          </PrimaryButton>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Your resume is parsed locally and never stored without your permission.
          </p>
        </div>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Template selection screen ────────────────────────────────────────────────

function TemplateSelectScreen({
  setScreen,
  templateId,
  setTemplateId,
  nextScreen,
}: {
  setScreen: (screen: BuilderScreen) => void
  templateId: string
  setTemplateId: (id: string) => void
  nextScreen: BuilderScreen
}) {
  const navigate = useNavigate()
  const selectedTemplate = TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0]
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={() => navigate(-1)} onClose={() => navigate('/documents')} />
      <main className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,560px)_1fr] bg-white">
        <CreateResumeSteps active="template" />
        <section className="min-h-0 overflow-y-auto border-r border-border px-6 py-8">
          <h1 className="text-xl font-bold text-foreground">Choose a resume template</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Select a professionally designed template. All templates are ATS-optimized.</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {TEMPLATES.slice(0, 8).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplateId(tmpl.id)}
                className={cn(
                  'group overflow-hidden rounded-lg border bg-white text-left transition hover:border-primary/70',
                  templateId === tmpl.id ? 'border-primary ring-2 ring-primary/15' : 'border-border',
                )}
              >
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img src={tmpl.src} alt={tmpl.name} className="h-full w-full object-cover object-top" />
                  {templateId === tmpl.id && (
                    <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-green-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className={cn('text-sm font-bold', templateId === tmpl.id ? 'text-primary' : 'text-foreground')}>{tmpl.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">Clean ATS-friendly resume layout for professional applications.</p>
                </div>
              </button>
            ))}
          </div>
          <div className="sticky bottom-0 mt-6 border-t border-border bg-white pt-4">
            <p className="mb-2 text-center text-xs text-muted-foreground"><b className="text-foreground">{selectedTemplate.name}</b> selected</p>
            <PrimaryButton onClick={() => setScreen(nextScreen)} className="w-full">
              {nextScreen === 'canvas' ? 'Open Editor' : 'Proceed'}
            </PrimaryButton>
          </div>
        </section>
        <section className="flex min-h-0 flex-col bg-slate-50">
          <div className="border-b border-border bg-white px-6 py-4">
            <h2 className="text-base font-bold text-foreground">Template Preview</h2>
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-hidden p-8">
            <div className="h-full max-h-[calc(100vh-10rem)] w-[560px] rounded-md bg-white p-4 shadow-lg">
              <img src={selectedTemplate.src} alt={`${selectedTemplate.name} preview`} className="h-full w-full object-contain object-top" />
            </div>
          </div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Job title screen ─────────────────────────────────────────────────────────

function JobTitleScreen({
  setScreen,
  resume,
  setResume,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
}) {
  const navigate = useNavigate()
  const popularTitles = ['Software Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'Marketing Manager']
  const canStart = resume.title.trim().length > 0 && resume.title !== 'Position'

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950">
      <CreateResumeTopbar onBack={() => setScreen('template')} onClose={() => navigate('/documents')} />
      <main className="grid flex-1 grid-cols-[220px_minmax(0,1fr)] bg-white">
        <CreateResumeSteps active="jobTitle" />
        <section className="px-6 py-14">
          <div className="mx-auto max-w-xl">
            <h1 className="text-2xl font-bold text-foreground">What position are you applying for?</h1>
            <p className="mt-4 text-sm leading-6 text-foreground">
              Enter the job title you're targeting. This will be used to personalize your resume and help you stand out to employers.
              <span className="font-semibold text-primary"> This field is required.</span>
            </p>
            <div className="mt-8 rounded-lg bg-muted p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Job Title</span>
                <input
                  value={resume.title === 'Position' ? '' : resume.title}
                  onChange={(event) => updateResumeField(setResume, 'title', event.target.value)}
                  placeholder="Ex. Product Designer, Software Engineer"
                  className="lf-input h-11 bg-white"
                />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Popular titles:</span>
                {popularTitles.map((title) => (
                  <button
                    key={title}
                    onClick={() => updateResumeField(setResume, 'title', title)}
                    className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>
            <PrimaryButton
              onClick={() => canStart && setScreen('summary')}
              className={cn('mt-8 w-full', !canStart && 'cursor-not-allowed bg-primary/35 hover:bg-primary/35')}
            >
              Start Building
            </PrimaryButton>
          </div>
        </section>
      </main>
      <CreateResumeFooter />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') ?? 'scratch'
  // resume: upload → template → canvas
  // tailor: template → canvas (dashboard already has an uploaded resume)
  // scratch: template → jobTitle → summary → … → canvas
  const [screen, setScreen] = useState<BuilderScreen>(mode === 'resume' ? 'upload' : 'template')
  const [resume, setResume] = useState<ResumeData>(initialResumeData)
  const [templateId, setTemplateId] = useState<string>('t01')
  const [jobDescription, setJobDescription] = useState(initialJobDescription)

  const nextScreenAfterTemplate: BuilderScreen = mode === 'resume' || mode === 'tailor' ? 'canvas' : 'jobTitle'

  if (screen === 'upload') return <UploadResumeScreen setScreen={setScreen} />
  if (screen === 'template') return <TemplateSelectScreen setScreen={setScreen} templateId={templateId} setTemplateId={setTemplateId} nextScreen={nextScreenAfterTemplate} />
  if (screen === 'jobTitle') return <JobTitleScreen setScreen={setScreen} resume={resume} setResume={setResume} />
  if (screen === 'canvas') return <CanvasScreen setScreen={setScreen} resume={resume} setResume={setResume} templateId={templateId} setTemplateId={setTemplateId} jobDescription={jobDescription} setJobDescription={setJobDescription} />
  if (screen === 'ats') return <ATSScreen setScreen={setScreen} resume={resume} setResume={setResume} jobDescription={jobDescription} setJobDescription={setJobDescription} />
  if (screen === 'preview') return <PreviewScreen setScreen={setScreen} resume={resume} />
  if (screen === 'experienceList') return <ExperienceList setScreen={setScreen} />
  if (screen === 'experienceForm') return <ExperienceForm setScreen={setScreen} />
  if (screen === 'educationList') return <EducationList setScreen={setScreen} />
  if (screen === 'educationForm') return <EducationForm setScreen={setScreen} />
  if (screen === 'skills') return <SkillsStep setScreen={setScreen} />
  if (screen === 'contact') return <ContactStep setScreen={setScreen} />
  if (screen === 'language') return <LanguageStep setScreen={setScreen} />
  return <SummaryStep setScreen={setScreen} />
}
