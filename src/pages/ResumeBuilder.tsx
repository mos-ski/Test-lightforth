import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'
import {
  ArrowLeft, X, Check, ChevronDown, RefreshCw, Pencil, Download, Share,
  Sparkles, Info, User, AlignLeft, Briefcase, GraduationCap,
  FolderGit2, Code2, Languages, Award, Globe, Save,
} from 'lucide-react'

type BuilderStep = 'template' | 'title' | 'build'
type BuilderView = 'editor' | 'diff' | 'ats' | 'preview'

const TEMPLATES = [
  {
    name: 'Professional',
    desc: 'Clean, crisp design with Libre Baskerville serif font. Traditional and ATS-friendly.',
    font: 'font-serif',
    headerStyle: 'uppercase tracking-widest',
  },
  {
    name: 'Lora Modern',
    desc: 'Modern design with Lora font. Perfect for creative professionals.',
    font: 'font-serif',
    headerStyle: 'tracking-wide',
  },
  {
    name: 'Garamond Classic',
    desc: 'Elegant Garamond typeface for a timeless, professional look.',
    font: 'font-serif',
    headerStyle: 'uppercase',
  },
  {
    name: 'Calibri Clean',
    desc: 'Clean and readable Calibri design for modern workplaces.',
    font: 'font-sans',
    headerStyle: 'uppercase tracking-wider',
  },
]

type FieldDef = { label: string; placeholder?: string; wide?: boolean; type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' }

const ACCORDION_SECTIONS: { label: string; icon: React.ElementType; fields: FieldDef[] }[] = [
  {
    label: 'Personal Information', icon: User,
    fields: [
      { label: 'First Name', placeholder: 'Darnell' },
      { label: 'Last Name', placeholder: 'Smith' },
      { label: 'Email', placeholder: 'demo@lightforth.ai', type: 'email', wide: true },
      { label: 'Phone', placeholder: '+1 234 567 8901', type: 'tel' },
      { label: 'City / Location', placeholder: 'New York, NY' },
      { label: 'Website', placeholder: 'https://yoursite.com', type: 'url', wide: true },
    ],
  },
  {
    label: 'Professional Summary', icon: AlignLeft,
    fields: [
      { label: 'Summary', placeholder: 'Write a short professional summary…', type: 'textarea', wide: true },
    ],
  },
  {
    label: 'Experience', icon: Briefcase,
    fields: [
      { label: 'Job Title', placeholder: 'Product Manager' },
      { label: 'Company', placeholder: 'Lightforth' },
      { label: 'Start Date', placeholder: 'Jan 2022', type: 'text' },
      { label: 'End Date', placeholder: 'Present' },
      { label: 'Location', placeholder: 'Lagos, Nigeria', wide: true },
      { label: 'Description', placeholder: 'Describe your responsibilities and achievements…', type: 'textarea', wide: true },
    ],
  },
  {
    label: 'Education', icon: GraduationCap,
    fields: [
      { label: 'Degree', placeholder: 'B.Sc. Computer Science' },
      { label: 'School', placeholder: 'University of Lagos' },
      { label: 'Start Year', placeholder: '2014' },
      { label: 'End Year', placeholder: '2018' },
      { label: 'Description', placeholder: 'Relevant coursework, achievements…', type: 'textarea', wide: true },
    ],
  },
  {
    label: 'Projects', icon: FolderGit2,
    fields: [
      { label: 'Project Name', placeholder: 'AI Resume Builder', wide: true },
      { label: 'URL', placeholder: 'https://github.com/...', type: 'url', wide: true },
      { label: 'Description', placeholder: 'What did you build and what impact did it have?', type: 'textarea', wide: true },
    ],
  },
  {
    label: 'Skills', icon: Code2,
    fields: [
      { label: 'Skills', placeholder: 'e.g. React, TypeScript, Figma, Agile…', type: 'textarea', wide: true },
    ],
  },
  {
    label: 'Language', icon: Languages,
    fields: [
      { label: 'Language', placeholder: 'English' },
      { label: 'Proficiency', placeholder: 'Native / Fluent / Intermediate' },
    ],
  },
  {
    label: 'Certificate', icon: Award,
    fields: [
      { label: 'Certificate Name', placeholder: 'AWS Solutions Architect', wide: true },
      { label: 'Issuing Organisation', placeholder: 'Amazon Web Services' },
      { label: 'Issue Date', placeholder: 'Mar 2023' },
    ],
  },
  {
    label: 'Website and Social Links', icon: Globe,
    fields: [
      { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname', type: 'url', wide: true },
      { label: 'GitHub', placeholder: 'https://github.com/yourname', type: 'url', wide: true },
      { label: 'Portfolio', placeholder: 'https://yourportfolio.com', type: 'url', wide: true },
      { label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle', type: 'url', wide: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// MiniResumeMockup — tiny thumbnail using scaled real resume content
// ---------------------------------------------------------------------------
function MiniResumeMockup({ template }: { template: string }) {
  const isSans = template === 'Calibri Clean'
  return (
    <div className="h-full w-full overflow-hidden">
      <div
        className={cn(
          'w-[530px] origin-top-left p-6 leading-snug',
          isSans ? 'font-sans' : 'font-serif',
        )}
        style={{ transform: 'scale(0.37)' }}
      >
        <p className="text-center text-lg font-bold uppercase tracking-widest mb-0.5">ANTHONY WILLIAM</p>
        <p className="text-center text-[11px] text-gray-500 mb-2">
          +1 (555) 123-4567 | anthony@email.com | San Francisco, CA | linkedin.com/in/anthonyw
        </p>
        <div className="border-t border-gray-400 mb-2" />
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1">PROFESSIONAL SUMMARY</p>
        <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
          Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 45%.
        </p>
        <div className="border-t border-gray-300 mb-2" />
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1">EXPERIENCE</p>
        <div className="mb-2">
          <div className="flex justify-between">
            <p className="text-[11px] font-bold">Lightforth</p>
            <p className="text-[10px] text-gray-500">Jan 2022 – Present</p>
          </div>
          <p className="text-[10px] italic text-gray-500 mb-0.5">Senior Product Manager, San Francisco, CA</p>
          <ul className="text-[10px] text-gray-600 space-y-0.5">
            <li>• Led development and launch of AI-powered resume builder, increasing user acquisition by 150%</li>
            <li>• Managed cross-functional team of 12 engineers, designers, and data scientists</li>
            <li>• Implemented A/B testing framework improving conversion rates by 23%</li>
          </ul>
        </div>
        <div className="mb-2">
          <div className="flex justify-between">
            <p className="text-[11px] font-bold">TechCorp Solutions</p>
            <p className="text-[10px] text-gray-500">Mar 2019 – Dec 2021</p>
          </div>
          <p className="text-[10px] italic text-gray-500 mb-0.5">Product Manager, Austin, TX</p>
          <ul className="text-[10px] text-gray-600 space-y-0.5">
            <li>• Spearheaded redesign of flagship SaaS platform improving satisfaction 40%</li>
            <li>• Conducted user research and competitive analysis identifying opportunities worth $5M+</li>
          </ul>
        </div>
        <div className="border-t border-gray-300 mb-2" />
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1">EDUCATION</p>
        <div className="flex justify-between mb-1">
          <div>
            <p className="text-[11px] font-bold">University of California, Berkeley</p>
            <p className="text-[10px] italic text-gray-500">Bachelor of Science, Computer Science</p>
          </div>
          <p className="text-[10px] text-gray-500">2015 – 2019</p>
        </div>
        <div className="border-t border-gray-300 mb-2" />
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1">SKILLS</p>
        <p className="text-[10px] text-gray-600">
          Product Strategy · User Research · Agile/Scrum · A/B Testing · SQL · Figma · JIRA · React
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LargeResumeMockup — right preview panel on template step
// ---------------------------------------------------------------------------
function LargeResumeMockup() {
  return (
    <div className="overflow-hidden rounded-sm bg-white shadow">
      <div className="font-serif p-8 text-[9px] leading-snug">
        <p className="text-center text-base font-bold uppercase tracking-widest mb-0.5">ANTHONY WILLIAMS</p>
        <p className="text-center text-gray-500 mb-2">
          +1 (555) 123-4567 · anthony.williams@email.com · San Francisco, CA · linkedin.com/in/anthonywilliams · anthonywilliams.dev
        </p>
        <div className="border-t-2 border-gray-800 mb-2" />
        <p className="font-bold uppercase tracking-wider mb-1">PROFESSIONAL SUMMARY</p>
        <p className="text-gray-600 mb-2 italic leading-relaxed">
          Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative digital products. Proven track record of increasing user engagement by 45% and driving $2M+ in annual revenue growth. Expertise in agile methodologies, data-driven decision making, and stakeholder management. Passionate about creating user-centric solutions.
        </p>
        <p className="font-bold uppercase tracking-wider mb-1">EXPERIENCE</p>
        <div className="border-t border-gray-400 mb-1" />
        <div className="mb-2">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">Lightforth</p>
              <p className="text-[8px] italic text-gray-500">Senior Product Manager, San Francisco, CA</p>
            </div>
            <p className="text-gray-500">Jan 2022 – Present</p>
          </div>
          <ul className="mt-1 space-y-0.5 text-gray-600">
            <li>• Led the development and launch of AI-powered resume builder, increasing user acquisition by 150% within 6 months</li>
            <li>• Managed a cross-functional team of 12 engineers, designers, and data scientists to deliver product roadmap on schedule</li>
            <li>• Implemented data-driven A/B testing framework that improved conversion rates by 23%</li>
            <li>• Collaborated with C-suite executives to align product strategy with company vision and quarterly OKRs</li>
            <li>• Reduced customer churn by 25% through implementation of personalized onboarding experience</li>
          </ul>
        </div>
        <div className="mb-2">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">TechCorp Solutions</p>
              <p className="text-[8px] italic text-gray-500">Product Manager, Austin, TX</p>
            </div>
            <p className="text-gray-500">Mar 2019 – Dec 2021</p>
          </div>
          <ul className="mt-1 space-y-0.5 text-gray-600">
            <li>• Spearheaded the redesign of flagship SaaS platform, resulting in 40% improvement in user satisfaction scores</li>
            <li>• Conducted extensive user research and competitive analysis to identify opportunities worth $5M+</li>
            <li>• Defined and prioritized product backlog for 3 agile development teams across multiple time zones</li>
          </ul>
        </div>
        <p className="font-bold uppercase tracking-wider mb-1">EDUCATION</p>
        <div className="border-t border-gray-400 mb-1" />
        <div className="flex justify-between mb-2">
          <div>
            <p className="font-bold">University of California, Berkeley</p>
            <p className="italic text-gray-500">Bachelor of Science, Computer Science</p>
          </div>
          <p className="text-gray-500">2015 – 2019</p>
        </div>
        <p className="font-bold uppercase tracking-wider mb-1">SKILLS</p>
        <div className="border-t border-gray-400 mb-1" />
        <p className="text-gray-600">
          Product Strategy · User Research · Agile/Scrum · A/B Testing · SQL · Figma · JIRA · React · TypeScript · Data Analysis
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ResumeDoc — live resume preview in center panel
// ---------------------------------------------------------------------------
function ResumeDoc({
  showDiff = false,
  userName = 'Darnell Smith',
}: {
  showDiff?: boolean
  userName?: string
}) {
  const nameParts = userName.split(' ')
  const firstName = nameParts[0] ?? 'Darnell'
  const lastName = nameParts[1] ?? 'Smith'
  const fullNameUpper = userName.toUpperCase()

  return (
    <div className="w-full max-w-[750px] bg-white shadow-md font-serif text-[13px] leading-relaxed text-gray-900">
      {/* Header */}
      <div className="px-12 pt-10 pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase mb-1">{fullNameUpper}</h1>
        <p className="text-sm text-gray-600">
          demo@lightforth.ai | Lagos | linkedin.com/in/{firstName.toLowerCase()}-{lastName.toLowerCase()} | lightforth.ai
        </p>
      </div>

      <div className="px-12 pb-10">
        {/* Professional Summary */}
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider mb-0.5">Professional Summary</h2>
          <div className="border-t-[1.5px] border-gray-800 mb-2" />
          {showDiff ? (
            <p className="text-[13px] italic leading-relaxed">
              <span className="line-through text-red-500">
                8 years building and shipping fintech, AI, and crypto products across Africa. Portfolio of 12 live apps spanning payment infrastructure, wealth management, and AI tools. Uniquely positioned as a Product manager and Design engineer who also designs and builds, reducing time-to-market for lean teams and owning the full product lifecycle from strategy to working product.
              </span>
              <span className="text-green-700">
                {' '}Dynamic Product Designer & Strategist with a robust background in product management and design engineering. Adept in aligning user needs with business goals through innovative design solutions and strategic product development. Proven expertise in leading cross-functional teams, conducting user research, and implementing data-driven design strategies to enhance product usability and market reach. Passionate about leveraging cutting-edge technologies, including AI-assisted development, to deliver impactful and user-centric products for fintech and crypto industries.
              </span>
            </p>
          ) : (
            <p className="text-[13px] italic leading-relaxed text-gray-700">
              8 years building and shipping fintech, AI, and crypto products across Africa. Portfolio of 12 live apps spanning payment infrastructure, wealth management, and AI tools. Uniquely positioned as a Product manager and Design engineer who also designs and builds, reducing time-to-market for lean teams and owning the full product lifecycle from strategy to working product.
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider mb-0.5">Experience</h2>
          <div className="border-t-[1.5px] border-gray-800 mb-3" />

          {/* Job 1 */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-0.5">
              <div>
                {showDiff ? (
                  <p className="font-bold text-[13px]">
                    <span className="line-through text-red-500">Lightforth</span>
                    <span className="text-green-700"> DecXoptions</span>
                  </p>
                ) : (
                  <p className="font-bold text-[13px]">Lightforth</p>
                )}
                {showDiff ? (
                  <p className="italic text-gray-600 text-[12px]">
                    <span className="line-through text-red-500">Product Manager</span>
                    <span className="text-green-700"> Head of Product</span>
                  </p>
                ) : (
                  <p className="italic text-gray-600 text-[12px]">Product Manager</p>
                )}
              </div>
              <p className="text-[12px] text-gray-500 whitespace-nowrap">Jan 2022 – Present</p>
            </div>
            <ul className="mt-1 space-y-1 text-[12px] text-gray-700">
              {showDiff ? (
                <>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Led the redesign and go-to-market strategy for a fintech solution, enhancing user experience and increasing user engagement by 40% through strategic design principles.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Spearheaded cross-functional teams in agile environments to deliver product enhancements aligned with user feedback and market demands.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Implemented a robust product roadmap that supported scalable design solutions and accelerated feature deployment timelines by 25%.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Orchestrated comprehensive user testing and A/B testing protocols to ensure product designs met customer needs and improved retention rates.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-2">
                    •{' '}Led end-to-end development of 5 core products AI Resume Builder, AI Cover Letter Builder, Interview Prep Simulator, Copilot (live interview AI assistant), and Partnership Dashboard launching MVP in 5 months with 95 feature completion rate.
                  </li>
                  <li className="flex gap-2">
                    •{' '}Built an ATS-compliant resume builder that rewrites an entire resume from a pasted job description using AI, significantly improving application match rates for users.
                  </li>
                  <li className="flex gap-2">
                    •{' '}Shipped Copilot a real-time AI assistant that surfaces suggested answers during live interview calls, a first-of-its-kind feature on the platform.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Job 2 */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-0.5">
              <div>
                {showDiff ? (
                  <p className="font-bold text-[13px]">
                    <span className="line-through text-red-500">Syarpa</span>
                    <span className="text-green-700"> Lightforth</span>
                  </p>
                ) : (
                  <p className="font-bold text-[13px]">Syarpa</p>
                )}
                <p className="italic text-gray-600 text-[12px]">Product Manager</p>
              </div>
              <p className="text-[12px] text-gray-500 whitespace-nowrap">Mar 2019 – Dec 2021</p>
            </div>
            <ul className="mt-1 space-y-1 text-[12px] text-gray-700">
              {showDiff ? (
                <>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Architected innovative product features that aligned with user insights and stakeholder objectives, resulting in a 30% improvement in customer satisfaction.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Managed end-to-end product lifecycle from strategy to execution, collaborating with design and engineering teams to launch market-ready products.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    ••{' '}
                    <span className="text-green-700">
                      Developed and refined product design strategies incorporating user research and data analysis to enhance UI/UX across multiple platforms.
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-2">
                    •{' '}Led product development for Bloomvest a goal-based savings and Ajo (group thrift) app shipping KYC tiering, automated deposits, and savings goal flows that boosted weekly active users 45.
                  </li>
                  <li className="flex gap-2">
                    •{' '}Built and launched Rebble, a crypto trading app enabling users to buy and sell crypto via the app and directly through a WhatsApp chatbot driving approximately 20,000,000 in transaction volume.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Job 3 */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-0.5">
              <div>
                {showDiff ? (
                  <p className="font-bold text-[13px]">
                    <span className="line-through text-red-500">Cwito</span>
                    <span className="text-green-700"> Celler (Tampay)</span>
                  </p>
                ) : (
                  <p className="font-bold text-[13px]">Celler (Tampay)</p>
                )}
                <p className="italic text-gray-600 text-[12px]">Product Manager</p>
              </div>
              <p className="text-[12px] text-gray-500 whitespace-nowrap">Jun 2017 – Feb 2019</p>
            </div>
            <ul className="mt-1 space-y-1 text-[12px] text-gray-700">
              <li className="flex gap-2">
                •{' '}Led product design initiatives for a crypto-focused application, coordinating with UI/UX designers to craft intuitive interfaces that improved user onboarding by 25%.
              </li>
              <li className="flex gap-2">
                •{' '}Devised and executed design strategies that streamlined product features, resulting in a 20% reduction in user drop-offs.
              </li>
            </ul>
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider mb-0.5">Education</h2>
          <div className="border-t-[1.5px] border-gray-800 mb-3" />
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[13px]">University of Lagos</p>
              <p className="italic text-gray-600 text-[12px]">Bachelor of Science, Computer Science</p>
            </div>
            <p className="text-[12px] text-gray-500">2014 – 2018</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider mb-0.5">Skills</h2>
          <div className="border-t-[1.5px] border-gray-800 mb-2" />
          <p className="text-[12px] text-gray-700 leading-relaxed">
            Product Strategy · User Research · AI/ML Product Development · Agile/Scrum · Figma · React · TypeScript · Data Analysis · Cross-functional Leadership · OKR Framework
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AccordionItem — expandable with form fields
// ---------------------------------------------------------------------------
function AccordionItem({
  label,
  icon: Icon,
  fields,
}: {
  label: string
  icon: React.ElementType
  fields: FieldDef[]
}) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const set = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }))

  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className="flex-1 text-sm text-foreground">{label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="bg-muted/20 px-4 pb-4 pt-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {fields.map(f => (
              <div key={f.label} className={f.wide ? 'col-span-2' : 'col-span-1'}>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={values[f.label] ?? ''}
                    onChange={e => set(f.label, e.target.value)}
                    placeholder={f.placeholder}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-input bg-white px-2.5 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    type={f.type ?? 'text'}
                    value={values[f.label] ?? ''}
                    onChange={e => set(f.label, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-input bg-white px-2.5 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                )}
              </div>
            ))}
          </div>
          <button className="mt-3 w-full rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
            Save {label}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ATSOverviewPanel
// ---------------------------------------------------------------------------
function ATSOverviewPanel({ jobTitle }: { jobTitle: string }) {
  const score = 86
  const r = 45
  const circ = 2 * Math.PI * r
  const bars = [
    { label: 'Headline Match score', score: 80 },
    { label: 'Impact score', score: 90 },
    { label: 'Skill Match Score', score: 90 },
    { label: 'Experience Score', score: 90 },
    { label: 'Style Score', score: 80 },
    { label: 'Total Score', score: 86 },
  ]
  return (
    <div className="w-[340px] flex-shrink-0 overflow-y-auto border-l border-border bg-white p-6">
      {/* Score circle + title */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#16A34A"
              strokeWidth="8"
              strokeDasharray={`${(circ * score) / 100} ${circ}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {score}%
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">ATS Optimization Overview</p>
          <p className="text-xs text-muted-foreground">Darnell Smith's CV</p>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-5 pb-5 border-b border-border">
        <p className="text-xs font-semibold text-foreground mb-1">Job Description</p>
        <p className="text-sm text-muted-foreground mb-2">{jobTitle || 'Designer'}</p>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
          <Pencil className="h-3 w-3" /> Edit Job Description
        </button>
      </div>

      {/* Score bars */}
      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground flex items-center gap-1">
                {bar.label}
                <Info className="h-3 w-3 text-muted-foreground" />
              </span>
              <span className="text-xs font-semibold text-foreground">{bar.score}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-green-500 transition-all"
                style={{ width: `${bar.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step sidebar used on template + title steps
// ---------------------------------------------------------------------------
const STEP_LABELS = ['Select a Job Profile', 'Choose Template', 'Job Title', 'Build']

function StepSidebar({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="w-52 flex-shrink-0 border-r border-border bg-white px-6 py-8">
      <div className="space-y-4">
        {STEP_LABELS.map((label, i) => (
          <p
            key={label}
            className={cn(
              'text-sm font-medium transition-colors',
              i === activeIdx ? 'text-primary' : 'text-foreground/50',
            )}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ResumeBuilder() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState<BuilderStep>('template')
  const [view, setView] = useState<BuilderView>('editor')
  const [selectedTemplate, setSelectedTemplate] = useState('Professional')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  const userName = user?.name ?? 'Darnell Smith'
  const cvName = `${userName}'s CV`

  // -------------------------------------------------------------------------
  // Top navigation bar — varies by step + view
  // -------------------------------------------------------------------------
  function renderTopBar() {
    // Setup steps (template / title)
    if (step !== 'build') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-white px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Create Resume
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )
    }

    // Build / editor
    if (view === 'editor') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-border bg-white px-5">
          {/* Logo */}
          <div className="flex items-center gap-1.5 mr-2">
            <LightforthLogo className="h-[22px]" linked={false} />
          </div>
          {/* CV name */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">{cvName}</span>
            <button>
              <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="flex-1" />
          {/* Actions */}
          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
          <button
            onClick={() => setView('ats')}
            className="flex items-center gap-1.5 rounded-lg border border-green-500 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
          >
            <div className="h-2 w-2 rounded-full bg-green-500" /> ATS
          </button>
          <button
            onClick={() => setView('preview')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Preview
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      )
    }

    // Build / diff
    if (view === 'diff') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-white px-6">
          <div className="flex items-center gap-1.5">
            <LightforthLogo className="h-[22px]" linked={false} />
          </div>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <RefreshCw className="h-4 w-4" /> Regenerate
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => setView('ats')}
            className="flex items-center gap-1.5 rounded-lg border border-green-500 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
          >
            <Check className="h-4 w-4" /> Accept
          </button>
        </div>
      )
    }

    // Build / ats
    if (view === 'ats') {
      return (
        <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-white px-6">
          <div className="flex items-center gap-1.5">
            <LightforthLogo className="h-[22px]" linked={false} />
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setView('preview')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Preview
          </button>
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>
      )
    }

    // Build / preview
    return (
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-white px-6">
        <div className="flex items-center gap-1.5">
          <img src="/logo-B1uc6Mmo.svg" alt="Lightforth" className="h-[22px] w-auto" />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setView('ats')}
          className="flex items-center gap-1.5 rounded-lg border border-green-500 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
        >
          <div className="h-2 w-2 rounded-full bg-green-500" /> ATS
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
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          {showDownloadMenu && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
              {['Export as PDF', 'Export as DOCX', 'Export as Text'].map((opt) => (
                <button
                  key={opt}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-muted"
                >
                  {opt}
                  <Share className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Body layout — varies by step + view
  // -------------------------------------------------------------------------
  function renderBody() {
    // ---- Template step ----
    if (step === 'template') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <StepSidebar activeIdx={1} />

          {/* Center — template grid */}
          <div className="flex-1 overflow-y-auto bg-white px-10 py-8">
            <h2 className="text-xl font-semibold text-foreground mb-1">Choose a resume template</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Select a professionally designed template. All templates are ATS-optimized.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-[500px]">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTemplate(t.name)}
                  className={cn(
                    'rounded-xl border-2 p-3 text-left transition-all hover:shadow-sm',
                    selectedTemplate === t.name
                      ? 'border-primary bg-primary/[0.03]'
                      : 'border-border bg-white hover:border-primary/30',
                  )}
                >
                  {/* Thumbnail — portrait A4 ratio */}
                  <div className="relative mb-3 h-56 w-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
                    {selectedTemplate === t.name && (
                      <div className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <MiniResumeMockup template={t.name} />
                  </div>
                  <p
                    className={cn(
                      'text-xs font-bold mb-0.5',
                      selectedTemplate === t.name ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {t.name}
                  </p>
                  <p className="text-[11px] italic text-muted-foreground leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Bottom action */}
            <div className="mt-8 border-t border-border pt-5 flex items-center justify-between max-w-[500px]">
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{selectedTemplate}</span>{' '}
                <span className="text-muted-foreground">selected</span>
              </span>
              <button
                onClick={() => setStep('title')}
                className="rounded-lg bg-primary px-10 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>

          {/* Right — preview panel */}
          <div className="w-[340px] flex-shrink-0 border-l border-border bg-gray-50">
            <div className="sticky top-0 px-5 pt-5 pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Template Preview
              </h3>
            </div>
            <div className="px-5 pb-5">
              <div className="relative overflow-hidden rounded-sm bg-white shadow-md" style={{ height: '600px' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '750px',
                    transform: 'scale(0.4)',
                    transformOrigin: 'top left',
                  }}
                >
                  <ResumeDoc />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ---- Title step ----
    if (step === 'title') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <StepSidebar activeIdx={2} />

          <div className="flex flex-1 items-center justify-center bg-white overflow-y-auto">
            <div className="w-full max-w-[520px] px-6 py-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                What position are you applying for?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the job title you're targeting. This will be used to personalize your resume and help
                you stand out to employers.{' '}
                {!jobTitle && (
                  <span className="font-medium text-primary">This field is required.</span>
                )}
              </p>

              <div className="mb-4 rounded-xl border border-border bg-gray-50 p-5">
                <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Job Title
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ex. Product Designer, Software Engineer"
                  className="w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Popular titles:</span>
                  {[
                    'Software Engineer',
                    'Product Manager',
                    'UI/UX Designer',
                    'Data Scientist',
                    'Marketing Manager',
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => setJobTitle(t)}
                      className="rounded-full border border-border bg-white px-3 py-1 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (jobTitle) setStep('build')
                }}
                disabled={!jobTitle}
                className={cn(
                  'w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors',
                  jobTitle ? 'bg-primary hover:bg-primary/90' : 'bg-primary/30 cursor-not-allowed',
                )}
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      )
    }

    // ---- Build step — Editor ----
    if (view === 'editor') {
      return (
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-[260px] flex-shrink-0 overflow-y-auto border-r border-border bg-white">
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-bold text-foreground flex-1">{cvName}</p>
                <button>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex overflow-hidden rounded-lg border border-border text-xs font-medium">
                <button className="flex-1 bg-white py-1.5 text-primary border-r border-border">
                  Create
                </button>
                <button className="flex-1 py-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  Template
                </button>
              </div>
              {/* Progress ring */}
              <div className="mt-4 rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 22 * 0.86} ${2 * Math.PI * 22}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    86%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Your Progress</p>
                  <p className="text-[11px] text-muted-foreground">Start creating your resume</p>
                </div>
              </div>
            </div>
            {/* Accordion */}
            <div>
              {ACCORDION_SECTIONS.map((s) => (
                <AccordionItem key={s.label} label={s.label} icon={s.icon} />
              ))}
            </div>
          </div>

          {/* Center — resume document */}
          <div className="flex-1 overflow-y-auto bg-[#F5F5F5] flex justify-center py-8 px-4">
            <ResumeDoc userName={userName} />
          </div>

          {/* Right — ATS tips + job description */}
          <div className="w-[300px] flex-shrink-0 overflow-y-auto border-l border-border bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-foreground">ATS Tips</h3>
            <div className="mb-4 rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Your profile is 86% complete.</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[86%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="mb-1 text-xs font-semibold text-foreground">Job Description</div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Write or paste the job description here"
              className="mb-3 h-32 w-full resize-none rounded-lg border border-input px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <div className="mb-3 flex items-center justify-between">
              <Info className="h-4 w-4 text-amber-500" />
              <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <Sparkles className="h-3 w-3" /> Suggest for me
              </button>
            </div>
            <button
              onClick={() => setView('diff')}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" /> Tailor my Resume
            </button>
            <div className="rounded-lg bg-primary/5 p-3 text-xs text-primary leading-relaxed">
              Our AI will generate a Resume for you base on this Job Description
            </div>
          </div>
        </div>
      )
    }

    // ---- Build step — Diff ----
    if (view === 'diff') {
      return (
        <div className="flex-1 overflow-y-auto bg-[#F5F5F5] flex justify-center py-8 px-4">
          <ResumeDoc showDiff userName={userName} />
        </div>
      )
    }

    // ---- Build step — ATS ----
    if (view === 'ats') {
      return (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-[#F5F5F5] flex justify-center py-8 px-4">
            <ResumeDoc userName={userName} />
          </div>
          <ATSOverviewPanel jobTitle={jobTitle} />
        </div>
      )
    }

    // ---- Build step — Preview ----
    return (
      <div
        className="flex-1 overflow-y-auto bg-[#F5F5F5] flex justify-center py-8 px-4"
        onClick={() => setShowDownloadMenu(false)}
      >
        <ResumeDoc userName={userName} />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {renderTopBar()}
      <div className="flex flex-1 overflow-hidden">{renderBody()}</div>
    </div>
  )
}
