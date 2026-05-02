import { useState, type Dispatch, type FocusEvent, type ReactNode, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  Eye,
  Info,
  MapPin,
  Menu,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type BuilderScreen =
  | 'template'
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

type TourStep = 'progress' | 'tips' | 'suggestions' | null
type ImproveMode = 'closed' | 'menu' | 'synonyms' | 'rewrite'

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
  firstName: 'John',
  lastName: 'Doe',
  title: 'Position',
  email: 'myemail@gmail.com',
  phone: '123-456-7890',
  city: 'Company, Location',
  portfolio: 'www.myportfolio.com',
  linkedin: 'John Doe',
  summary: 'Product manager with experience creating practical, user-focused products and coordinating cross-functional teams.',
  experienceBullets:
    'Dolor rutrum diam pulvinar pharetra dignissim id duis parturient.\nVulputate sollicitudin in accumsan at. Mauris enim tortor ut condimentum montes malesuada proin.\nMi aenean fringilla. Fermentum integer senectus.',
  education: 'Qualification',
  school: 'Location, School',
  certificate: 'Award Name',
  certificateDate: 'Issue Date',
  skills: 'Program Management, Agile Project Management, Relationship Building, Project Planning, Scrum Master, Management, Project Management, Microsoft Project, Data Analysis, Talent Management',
  languages: 'English, French, Yoruba',
}

function updateResumeField(
  setResume: Dispatch<SetStateAction<ResumeData>>,
  field: keyof ResumeData,
  value: string,
) {
  setResume((resume) => ({ ...resume, [field]: value }))
}

const sections = [
  'Professional Summary',
  'Work Experience',
  'Education',
  'Skills',
  'Contact Information',
]

const extraSections = ['Language', 'Projects', 'Awards', 'Referee']

const suggestions = [
  'Diligent Senior Product Manager offering [Number] years of success in product roadmap development, market research and data analysis. Highly skilled in identifying opportunities to maximize revenue. Driven and strategic with proven history of superior market penetration and product launch.',
  'Experienced with product development, market analysis, and lifecycle management. Utilizes cross-functional collaboration to drive product success and adaptability to changing market needs.',
  'Motivated professional with extensive experience in product sales and distribution. Possesses unmatched leadership and strategy skills to maximize company revenue.',
]

const skillOptions = ['Figma', 'Graphic Design', 'Photoshop', 'Miro', 'Prototyping', 'Research']
const languageOptions = ['English', 'French', 'Spanish']

function BuilderHeader({ title, right }: { title: string; right?: ReactNode }) {
  const navigate = useNavigate()
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <button
        onClick={() => navigate('/documents')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
      >
        <ArrowLeft className="h-5 w-5 text-slate-600" />
        {title}
      </button>
      {right}
    </header>
  )
}

function PrimaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-[#149cf2] px-5 text-sm font-semibold text-white transition hover:bg-[#0d8dde]',
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
        'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50',
        className,
      )}
    >
      {children}
    </button>
  )
}

function ProgressBadge({ label = 'Your Progress', sub = 'Start creating your resume' }: { label?: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[conic-gradient(#149cf2_40%,#e5e7eb_0)]">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-bold text-slate-700">40%</div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-950">{label}</p>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
    </div>
  )
}

function PreviewRail({ health = false }: { health?: boolean }) {
  return (
    <aside className="hidden w-[330px] shrink-0 space-y-4 xl:block">
      <ProgressBadge label={health ? 'Resume Health' : 'Your Progress'} sub={health ? 'Almost there!' : 'Start creating your resume'} />
      <div className="relative mx-auto h-[520px] w-[300px] overflow-hidden rounded-sm bg-white shadow-xl">
        <div className="h-14 bg-slate-300 text-center text-xs font-bold leading-[3.5rem] text-white">Andrew Bolton</div>
        <div className="space-y-4 p-8 opacity-25">
          {Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="h-2 rounded-full bg-slate-400" style={{ width: `${45 + (index % 4) * 12}%` }} />
          ))}
        </div>
        <button className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-base font-medium text-slate-900 shadow">
          <Search className="h-6 w-6" />
          Preview
        </button>
      </div>
    </aside>
  )
}

function BuilderShell({ screen, setScreen, children, showTour, tour: externalTour, setTour: externalSetTour }: {
  screen: BuilderScreen
  setScreen: (screen: BuilderScreen) => void
  children: ReactNode
  showTour?: boolean
  tour?: TourStep
  setTour?: (step: TourStep) => void
}) {
  const [localTour, setLocalTour] = useState<TourStep>(showTour ? 'progress' : null)
  const activeTour = externalTour ?? localTour
  const updateTour = externalSetTour ?? setLocalTour
  return (
    <div className="min-h-screen bg-white font-sans text-slate-950">
      <BuilderHeader
        title="Adedamola_Adewale_Product Manager Resume"
        right={<OutlineButton onClick={() => setScreen('ats')}>Check ATS Score <Target className="h-5 w-5" /></OutlineButton>}
      />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-[250px_minmax(0,620px)_280px] gap-6 px-6 py-10">
        <BuilderNav screen={screen} setScreen={setScreen} tour={activeTour} setTour={updateTour} />
        <section className="relative min-h-[560px] bg-white px-6">{children}</section>
        <PreviewRail health={screen === 'summary'} />
      </main>
    </div>
  )
}

function BuilderNav({ screen, setScreen, tour, setTour }: {
  screen: BuilderScreen
  setScreen: (screen: BuilderScreen) => void
  tour: TourStep
  setTour: (step: TourStep) => void
}) {
  const sectionMap: Record<string, BuilderScreen> = {
    'Professional Summary': 'summary',
    'Work Experience': 'experienceList',
    Education: 'educationList',
    Skills: 'skills',
    'Contact Information': 'contact',
  }
  return (
    <aside className="space-y-4 pt-4">
      <nav className="space-y-5">
        {sections.map((section) => {
          const active = sectionMap[section] === screen
          return (
            <button
              key={section}
              onClick={() => setScreen(sectionMap[section])}
              className={cn('block text-left text-base font-semibold text-slate-600', active && 'text-[#149cf2]')}
            >
              {section}
            </button>
          )
        })}
      </nav>

      <div className="relative">
        <button className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-base font-semibold text-slate-500">
          <span>+ Add section</span>
          <ChevronDown className="h-5 w-5" />
        </button>
        {screen === 'language' && (
          <div className="mt-3 space-y-3 pl-3 text-base font-medium text-slate-600">
            {extraSections.map((item) => (
              <button key={item} className="block text-left">
                <span className={item === 'Language' ? 'text-[#149cf2]' : ''}>{item === 'Language' ? '✓ ' : ''}{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {screen === 'summary' && (
        <div className="relative mt-4 rounded-md border border-pink-100 bg-white p-4 text-base">
          <p className="text-sm font-medium text-blue-500">Get resume <span className="text-lg text-purple-400">10x</span> <span className="text-pink-400">Faster</span></p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Just paste the job description and we will generate a resume for you.</p>
          {tour === 'progress' && (
            <TourBubble
              className="left-[320px] top-3 w-[360px]"
              title="Your Resume completion progress"
              step="Next 1/3"
              onNext={() => setTour('tips')}
              onClose={() => setTour(null)}
            />
          )}
        </div>
      )}
    </aside>
  )
}

function TourBubble({ title, step, onNext, onClose, className, back }: {
  title: string
  step: string
  onNext: () => void
  onClose: () => void
  className?: string
  back?: () => void
}) {
  return (
    <div className={cn('absolute z-40 rounded-sm bg-[#0d326b] p-4 text-white shadow-2xl', className)}>
      <span className="absolute -top-2 left-3 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-[#0d326b]" />
      <div className="flex items-start justify-between gap-4">
        <p className="text-base font-bold">{title}</p>
        <button onClick={onClose} className="text-white/75 hover:text-white"><X className="h-5 w-5" /></button>
      </div>
      <p className="mt-5 text-base leading-7 text-blue-100">Learn how to use Lightforth to land job faster by learning the tools you need.</p>
      <div className="mt-6 flex items-center justify-between">
        <button onClick={onClose} className="text-sm font-semibold text-[#149cf2]">Skip</button>
        <div className="flex items-center gap-4">
          {back && <button onClick={back} className="text-sm font-semibold">Back</button>}
          <button onClick={onNext} className="rounded-md bg-[#149cf2] px-3 py-2 text-sm font-bold">{step}</button>
        </div>
      </div>
    </div>
  )
}

function TipsLink({ tour, setTour }: { tour?: TourStep; setTour?: (step: TourStep) => void }) {
  return (
    <button onClick={() => setTour?.('tips')} className="relative inline-flex items-center gap-2 text-base font-semibold text-[#149cf2]">
      <Info className="h-5 w-5" />
      Tips
      {tour === 'tips' && (
        <TourBubble
          className="right-[-20px] top-10 w-[380px]"
          title="Get Free ATS tips along the way"
          step="Next 2/3"
          onNext={() => setTour?.('suggestions')}
          onClose={() => setTour?.(null)}
          back={() => setTour?.('progress')}
        />
      )}
    </button>
  )
}

function SummaryStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  const [tour, setTour] = useState<TourStep>('progress')
  return (
    <BuilderShell screen="summary" setScreen={setScreen} showTour tour={tour} setTour={setTour}>
      <StepBack />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Professional summary</h1>
        <TipsLink tour={tour} setTour={setTour} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" placeholder="Surname First" />
        <Field label="Job Title" placeholder="Product Manager" />
      </div>
      <label className="mt-5 block text-sm text-slate-600">Choose from our pre-written examples below or write your own.</label>
      <textarea className="lf-input mt-2 h-40 w-full resize-none p-4 text-sm" placeholder="Enter job role" />
      <div className="relative mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">AI Suggestions for <b className="text-slate-950">Product Manager</b></p>
          <button onClick={() => setTour('suggestions')} className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-[#149cf2]" /> Suggest more
          </button>
        </div>
        <SuggestionList />
        {tour === 'suggestions' && (
          <TourBubble
            className="left-[230px] top-9 w-[360px]"
            title="Use AI to get recommendations"
            step="Finish 3/3"
            onNext={() => setTour(null)}
            onClose={() => setTour(null)}
          />
        )}
      </div>
      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-6 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function Field({ label, placeholder, wide }: { label: string; placeholder: string; wide?: boolean }) {
  return (
    <label className={cn('block', wide && 'col-span-2')}>
      <span className="mb-2 block text-base font-medium text-slate-600">{label}</span>
      <input className="lf-input h-10 w-full px-3 text-sm" placeholder={placeholder} />
    </label>
  )
}

function StepBack() {
  return (
    <button className="mb-8 inline-flex items-center gap-3 text-base font-semibold text-slate-600">
      <ArrowLeft className="h-5 w-5" />
      Back
    </button>
  )
}

function SuggestionList() {
  return (
    <div className="space-y-3">
      {suggestions.map((item, index) => (
        <div key={item} className={cn('flex gap-3 rounded-lg bg-white p-4 text-sm leading-6 text-slate-500 shadow-sm', index === 0 && 'text-[#149cf2]')}>
          <button className="text-xl text-slate-500">+</button>
          <p>{item}</p>
        </div>
      ))}
    </div>
  )
}

function ExperienceList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="experienceList" setScreen={setScreen}>
      <StepBack />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience</h1>
        <TipsLink />
      </div>
      {['Product Design, Lightforth', 'Product Design, Lightforth', 'Product Design, Lightforth'].map((item, index) => (
        <div key={index} className="flex h-14 items-center justify-between border-b border-slate-200 text-base font-bold text-slate-600">
          <button onClick={() => setScreen('experienceForm')} className="inline-flex items-center gap-4">
            <span className="text-slate-500">✥</span>
            {item}
          </button>
          <div className="flex items-center gap-5">
            <ChevronDown className="h-5 w-5" />
            {index === 1 && <Trash2 className="h-5 w-5 text-slate-300" />}
          </div>
        </div>
      ))}
      <button onClick={() => setScreen('experienceForm')} className="mt-6 inline-flex items-center gap-2 text-base font-medium text-[#149cf2]">
        <Plus className="h-6 w-6" />
        Add new employment
      </button>
      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-8 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function ExperienceForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="experienceList" setScreen={setScreen}>
      <StepBack />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Design, Lightforth</h1>
        <TipsLink />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" placeholder="Sales Manager" />
        <Field label="Employer" placeholder="Google" />
        <DateSelect label="Start Date" />
        <DateSelect label="End Date" />
        <label className="col-span-2 flex items-center gap-3 text-base font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#149cf2] text-white"><Check className="h-4 w-4" /></span>
          I'm still working here
        </label>
        <Field label="Location" placeholder="London, United States" wide />
        <label className="col-span-2 flex items-center gap-3 text-base font-semibold">
          <span className="h-6 w-6 rounded-md border border-slate-300" />
          Remote
        </label>
      </div>
      <label className="mt-4 block text-base font-medium text-slate-600">Achievements</label>
      <textarea className="lf-input mt-2 h-24 w-full resize-none p-4 text-sm" placeholder="Enter job role" />
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">AI Suggestions for <b className="text-slate-950">Product Manager</b></p>
        <button className="inline-flex items-center gap-2 text-base font-semibold"><Sparkles className="h-5 w-5 text-[#149cf2]" /> Suggest more</button>
      </div>
      <SuggestionList />
      <PrimaryButton onClick={() => setScreen('experienceList')} className="mt-5 w-full">Save</PrimaryButton>
    </BuilderShell>
  )
}

function DateSelect({ label }: { label: string }) {
  return (
    <label>
      <span className="mb-2 block text-base font-medium text-slate-600">{label}</span>
      <div className="grid grid-cols-2 gap-3">
        <button className="lf-select h-10 justify-between px-3 text-sm text-slate-400">Month <ChevronDown className="h-4 w-4" /></button>
        <button className="lf-select h-10 justify-between px-3 text-sm text-slate-400">Year <ChevronDown className="h-4 w-4" /></button>
      </div>
    </label>
  )
}

function EducationList({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="educationList" setScreen={setScreen}>
      <StepBack />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <TipsLink />
      </div>
      <button onClick={() => setScreen('educationForm')} className="flex h-14 w-full items-center justify-between border-b border-slate-200 text-base font-bold text-slate-600">
        <span className="inline-flex items-center gap-4"><span>✥</span>Bsc. Agriculture, Ilorin</span>
        <ChevronDown className="h-5 w-5" />
      </button>
      <button onClick={() => setScreen('educationForm')} className="mt-6 inline-flex items-center gap-2 text-base font-medium text-[#149cf2]">
        <Plus className="h-6 w-6" />
        Add new education
      </button>
      <PrimaryButton onClick={() => setScreen('skills')} className="mt-8 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function EducationForm({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="educationList" setScreen={setScreen}>
      <StepBack />
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bsc. Agriculture, Ilorin</h1>
        <TipsLink />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution" placeholder="University of Dallas" />
        <Field label="Location" placeholder="London" />
        <Field label="Degree" placeholder="Master of Science" />
        <Field label="Course" placeholder="B.Sc Agriculture" />
        <DateSelect label="Start Date" />
        <DateSelect label="End Date/Expected Date" />
        <Field label="CGPA" placeholder="Optional" />
        <Field label="Other Achievements" placeholder="List anything notable" />
      </div>
      <PrimaryButton onClick={() => setScreen('educationList')} className="mt-5 w-full">Save</PrimaryButton>
    </BuilderShell>
  )
}

function SkillsStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="skills" setScreen={setScreen}>
      <StepBack />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
        <TipsLink />
      </div>
      <SearchBox placeholder="Search Skills" />
      <ChipList items={skillOptions} selected="Figma" />
      <PrimaryButton onClick={() => setScreen('contact')} className="mt-5 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function ContactStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="contact" setScreen={setScreen}>
      <StepBack />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Information</h1>
        <TipsLink />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" placeholder="Adewale" />
        <Field label="Last name" placeholder="Adedamola" />
        <Field label="Email address" placeholder="adedamola.moses@gmail.com" />
        <Field label="Phone number" placeholder="NG (+234) 8103 674 006" />
        <Field label="Gender" placeholder="Male" />
        <Field label="Birthday" placeholder="Sep 8, 2099" />
        <Field label="City" placeholder="Lagos, Nigeria" />
        <Field label="Postal Code" placeholder="100216" />
        <label className="col-span-2 block">
          <span className="mb-2 block text-base font-medium text-slate-600">Location</span>
          <div className="relative">
            <input className="lf-input h-10 w-full px-3 pr-10 text-sm" placeholder="Lagos, Nigeria" />
            <MapPin className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </label>
      </div>
      <PrimaryButton onClick={() => setScreen('language')} className="mt-5 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function LanguageStep({ setScreen }: { setScreen: (screen: BuilderScreen) => void }) {
  return (
    <BuilderShell screen="language" setScreen={setScreen}>
      <StepBack />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Language</h1>
        <TipsLink />
      </div>
      <p className="mb-3 text-base text-slate-600">Select Language</p>
      <SearchBox placeholder="Ex. Adobe" />
      <ChipList items={languageOptions} selected="English" />
      <PrimaryButton onClick={() => setScreen('canvas')} className="mt-5 w-full">Next</PrimaryButton>
    </BuilderShell>
  )
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-5 top-1/2 h-7 w-7 -translate-y-1/2 text-slate-500" />
      <input className="lf-input h-12 w-full pl-12 pr-4 text-base" placeholder={placeholder} />
    </div>
  )
}

function ChipList({ items, selected }: { items: string[]; selected: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm',
            item === selected && 'border-[#149cf2] bg-blue-50',
          )}
        >
          {item}
          {item === selected ? <Check className="h-5 w-5 text-[#149cf2]" /> : <Plus className="h-5 w-5 text-slate-500" />}
        </button>
      ))}
    </div>
  )
}

function ResumePaper({
  editable = false,
  resume,
  setResume,
}: {
  editable?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
}) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || 'John Doe'
  const bulletItems = resume.experienceBullets
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const skills = resume.skills.split(',').map((item) => item.trim()).filter(Boolean)
  const languages = resume.languages.split(',').map((item) => item.trim()).filter(Boolean)

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
    <article className="mx-auto min-h-[920px] w-[680px] rounded-lg border border-slate-200 bg-white px-12 py-10 shadow-sm">
      <header className="mb-8 flex justify-between gap-6">
        <div>
          <h1
            contentEditable={editable}
            suppressContentEditableWarning
            className="text-2xl font-bold uppercase tracking-normal text-[#143763]"
            onBlur={(event) => {
              if (!setResume) return
              const [firstName, ...rest] = (event.currentTarget.textContent?.trim() || fullName).split(/\s+/)
              setResume((current) => ({ ...current, firstName: firstName || current.firstName, lastName: rest.join(' ') || current.lastName }))
            }}
          >
            {fullName}
          </h1>
          <p {...editableText('title', 'mt-1 text-base', 'Position')}>{resume.title}</p>
        </div>
        <div className="text-right text-sm leading-6">
          <p {...editableText('phone', '', '123-456-7890')}>{resume.phone}</p>
          <p {...editableText('email', 'text-[#149cf2]', 'myemail@gmail.com')}>{resume.email}</p>
          <p {...editableText('portfolio', '', 'www.myportfolio.com')}>{resume.portfolio}</p>
          <p>Linkedin: <span {...editableText('linkedin', 'text-[#149cf2] underline', 'John Doe')}>{resume.linkedin}</span></p>
        </div>
      </header>
      <ResumeSection title="Experience" editable={editable} active resume={resume} setResume={setResume} bulletItems={bulletItems} />
      <ResumeSection title="Education" editable={editable} resume={resume} setResume={setResume} />
      <ResumeSection title="Certificates" editable={editable} resume={resume} setResume={setResume} />
      <section className="mt-8">
        <h2 className="border-b-2 border-slate-900 pb-1 text-base uppercase">Skills</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm leading-6">
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
      <section className="mt-8">
        <h2 className="border-b-2 border-slate-900 pb-1 text-base uppercase">Languages</h2>
        <div className="mt-3 text-sm leading-6">
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
}: {
  title: string
  editable?: boolean
  active?: boolean
  resume: ResumeData
  setResume?: Dispatch<SetStateAction<ResumeData>>
  bulletItems?: string[]
}) {
  return (
    <section className="mt-8">
      <h2 className="border-b-2 border-slate-900 pb-1 text-base uppercase">{title}</h2>
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
              className="font-bold"
            >
              {title === 'Education' ? resume.education : title === 'Certificates' ? resume.certificate : 'Position'} <Pencil className="ml-1 inline h-3 w-3" />
            </p>
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (setResume && title === 'Education') updateResumeField(setResume, 'school', event.currentTarget.textContent?.trim() || '')
              }}
              className="text-slate-500"
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
            className="text-slate-500"
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
            className={cn('rounded-md p-3 text-sm leading-6 outline-none', active && 'border border-sky-300')}
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

function CanvasScreen({
  setScreen,
  resume,
  setResume,
  templateId,
  setTemplateId,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
  templateId: string
  setTemplateId: (id: string) => void
}) {
  const [improveMode, setImproveMode] = useState<ImproveMode>('closed')
  const [expanded, setExpanded] = useState('Experience')
  const [sidebarTab, setSidebarTab] = useState<'create' | 'template'>('create')
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f3f3f3] font-sans text-slate-950">
      <FullscreenTopbar
        left={<button onClick={() => navigate('/documents')} aria-label="Close resume builder" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"><X className="h-5 w-5" /></button>}
        right={(
          <>
            <OutlineButton onClick={() => setScreen('ats')}>Check ATS Score <Target className="h-5 w-5" /></OutlineButton>
            <OutlineButton>Preview <Eye className="h-5 w-5" /></OutlineButton>
            <OutlineButton>Download <Download className="h-5 w-5" /></OutlineButton>
            <PrimaryButton>Save <Save className="ml-2 h-5 w-5" /></PrimaryButton>
          </>
        )}
      />
      <main className="grid grid-cols-[320px_minmax(700px,1fr)_340px] gap-6 px-6 py-6">
        <aside className="rounded-md bg-white p-6">
          <div className="mb-6 flex items-center gap-4 text-base font-bold">
            <Menu className="h-6 w-6 text-[#123667]" />
            Adedamola's CV
            <Pencil className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mb-7 grid grid-cols-2 rounded-md border border-slate-200 text-center text-sm font-semibold">
            <button
              onClick={() => setSidebarTab('create')}
              className={cn('rounded-md py-3 transition-colors', sidebarTab === 'create' ? 'bg-white shadow-sm' : 'text-slate-500')}
            >
              Create
            </button>
            <button
              onClick={() => setSidebarTab('template')}
              className={cn('rounded-md py-3 transition-colors', sidebarTab === 'template' ? 'bg-white shadow-sm' : 'text-slate-500')}
            >
              Template
            </button>
          </div>
          {sidebarTab === 'template' ? (
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
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
            <>
          <ProgressBadge />
          <div className="mt-9 divide-y divide-slate-200">
            {['Personal Information', 'Professional Summary', 'Experience', 'Education', 'Skills', 'Language', 'Certificates', 'Website and Social Links'].map((item) => (
              <div key={item} className="py-5">
                <button onClick={() => setExpanded(expanded === item ? '' : item)} className="flex w-full items-center justify-between text-sm font-semibold text-slate-700">
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
                    {item !== 'Experience' && (
                      <button className="mt-1 w-full rounded-md bg-[#149cf2]/10 py-2 text-sm font-semibold text-[#149cf2] hover:bg-[#149cf2]/20 transition-colors">
                        Save
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button className="flex h-10 w-full items-center justify-between text-left text-sm font-semibold text-[#149cf2]">
              + Add section
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
            </>
          )}
        </aside>

        <section className="relative rounded-md bg-white px-8 py-8">
          <ResumePaper editable resume={resume} setResume={setResume} />
          <ImprovePopover mode={improveMode} setMode={setImproveMode} />
        </section>

        <CanvasRightPanel />
      </main>
    </div>
  )
}

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
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="min-w-0">{left ?? <span className="text-base font-semibold">{title}</span>}</div>
      <div className="flex items-center gap-3">{right}</div>
    </header>
  )
}

function ImprovePopover({ mode, setMode }: { mode: ImproveMode; setMode: (mode: ImproveMode) => void }) {
  if (mode === 'closed') return null
  return (
    <div className="absolute left-[-32px] top-[440px] z-30 w-[360px] overflow-hidden rounded-md border-2 border-[#123667] bg-white shadow-2xl">
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

function CanvasRightPanel() {
  return (
    <aside className="space-y-6 rounded-md bg-white p-6">
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><Info className="h-4 w-4" /> ATS Tips</h3>
        <p className="text-sm leading-6 text-slate-600">The gatekeeper sorting resumes that come in is not always the direct hiring manager, so keep your resume language at a middle school level.</p>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-6 text-slate-600">
          <li>Highlight 6-8 skills that are most relevant to your desired job.</li>
          <li>Use short bulleted phrases - 3 words or less.</li>
          <li>Emphasize the skills that are required in the job description.</li>
        </ul>
      </section>
      <section>
        <h3 className="mb-3 text-base font-bold">Job Description</h3>
        <div className="rounded-md border border-slate-200 p-5 text-base leading-8 text-slate-600">
          <ul className="list-disc pl-5">
            <li>Coordinate internal resources and third parties/vendors for the flawless execution of projects</li>
            <li>Ensure that all projects are delivered on-time, within scope and within budget</li>
            <li>Developing project scopes and objectives</li>
          </ul>
        </div>
        <button className="mt-4 rounded-md bg-[#149cf2] px-4 py-3 text-base font-bold text-white"><Sparkles className="mr-2 inline h-5 w-5" />Tailor my Resume</button>
        <div className="mt-4 bg-sky-100 p-5 text-base leading-7 text-blue-700">Our AI will generate a Resume for you base on this Job Description</div>
      </section>
    </aside>
  )
}

function ATSScreen({
  setScreen,
  resume,
  setResume,
}: {
  setScreen: (screen: BuilderScreen) => void
  resume: ResumeData
  setResume: Dispatch<SetStateAction<ResumeData>>
}) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f3f3f3] font-sans">
      <FullscreenTopbar
        left={<button onClick={() => setScreen('canvas')} className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="h-4 w-4" /> Go back to Edit</button>}
        right={(
          <>
            <OutlineButton>Download <Download className="h-5 w-5" /></OutlineButton>
            <PrimaryButton>Save <Save className="ml-2 h-5 w-5" /></PrimaryButton>
            <button onClick={() => navigate('/documents')} aria-label="Close ATS view" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
              <X className="h-5 w-5" />
            </button>
          </>
        )}
      />
      <main className="mx-auto grid max-w-6xl grid-cols-[minmax(680px,1fr)_420px] gap-6 px-6 py-6">
        <section className="rounded-md bg-white p-10">
          <ResumePaper editable resume={resume} setResume={setResume} />
        </section>
        <ATSOverviewPanel />
      </main>
    </div>
  )
}

function ATSOverviewPanel() {
  const scores = [
    ['Headline Match Score', 50, 'bg-orange-500'],
    ['Skill Match Score', 90, 'bg-emerald-500'],
    ['Style Score', 20, 'bg-red-500'],
    ['Impact Score', 50, 'bg-orange-500'],
    ['Experience Score', 90, 'bg-emerald-500'],
    ['Total Score', 20, 'bg-red-500'],
  ] as const
  return (
    <aside className="rounded-md bg-white p-6">
      <div className="rounded-lg border border-slate-200 p-7">
        <div className="flex items-center gap-5">
          <div className="relative grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(#16a34a_60%,#e5e7eb_0)]">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-sm font-bold text-slate-600">60%</div>
          </div>
          <div>
            <h2 className="text-lg font-bold">ATS Optimization Overview</h2>
            <p className="text-sm text-slate-500">Adedamola's CV</p>
          </div>
        </div>
        <h3 className="mt-6 text-base font-bold">Job Description</h3>
        <p className="mt-4 text-base leading-7 text-slate-600">Vulputate sollicitudin in accumsan at. Mauris enim tortor ut condimentum montes malesuada proin. Nibh non molestie nec proin proin ullamcorper.</p>
        <OutlineButton className="mt-6">Edit Job Description <Pencil className="h-4 w-4" /></OutlineButton>
        <div className="my-8 border-t border-slate-200" />
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

function TemplateSelectScreen({
  setScreen,
  templateId,
  setTemplateId,
}: {
  setScreen: (screen: BuilderScreen) => void
  templateId: string
  setTemplateId: (id: string) => void
}) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f3f3f3] font-sans text-slate-950">
      <FullscreenTopbar
        left={
          <button
            onClick={() => navigate('/documents')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        }
        right={
          <PrimaryButton onClick={() => setScreen('summary')}>
            Use this template <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </PrimaryButton>
        }
      />
      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-950">Choose a template</h1>
          <p className="mt-1 text-sm text-slate-500">Pick a design to get started. You can change it anytime from the editor.</p>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplateId(tmpl.id)}
              className={cn(
                'group relative overflow-hidden rounded-lg border-2 bg-white shadow-sm transition-all hover:shadow-md',
                templateId === tmpl.id ? 'border-[#149cf2] shadow-[0_0_0_3px_rgba(20,156,242,0.15)]' : 'border-slate-200 hover:border-slate-400',
              )}
            >
              <img src={tmpl.src} alt={tmpl.name} className="w-full object-cover" />
              {templateId === tmpl.id && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#149cf2] shadow">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="border-t border-slate-100 py-2 text-center text-xs font-medium text-slate-600">{tmpl.name}</div>
            </button>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <PrimaryButton onClick={() => setScreen('summary')} className="px-10">
            Continue with this template
          </PrimaryButton>
        </div>
      </main>
    </div>
  )
}

export default function ResumeBuilder() {
  const [screen, setScreen] = useState<BuilderScreen>('template')
  const [resume, setResume] = useState<ResumeData>(initialResumeData)
  const [templateId, setTemplateId] = useState<string>('t01')

  if (screen === 'template') return <TemplateSelectScreen setScreen={setScreen} templateId={templateId} setTemplateId={setTemplateId} />
  if (screen === 'canvas') return <CanvasScreen setScreen={setScreen} resume={resume} setResume={setResume} templateId={templateId} setTemplateId={setTemplateId} />
  if (screen === 'ats') return <ATSScreen setScreen={setScreen} resume={resume} setResume={setResume} />
  if (screen === 'experienceList') return <ExperienceList setScreen={setScreen} />
  if (screen === 'experienceForm') return <ExperienceForm setScreen={setScreen} />
  if (screen === 'educationList') return <EducationList setScreen={setScreen} />
  if (screen === 'educationForm') return <EducationForm setScreen={setScreen} />
  if (screen === 'skills') return <SkillsStep setScreen={setScreen} />
  if (screen === 'contact') return <ContactStep setScreen={setScreen} />
  if (screen === 'language') return <LanguageStep setScreen={setScreen} />
  return <SummaryStep setScreen={setScreen} />
}
