import { useState, useEffect, useRef } from 'react'
import { Bell, Check, ChevronDown, ExternalLink, FileText, HelpCircle, Mic, Play, Settings, Sparkles, Upload, Video, X, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const BG        = '#0c1d48'
const CARD      = 'rgba(255,255,255,0.07)'
const BORDER    = 'rgba(255,255,255,0.12)'
const INPUT_BG  = 'rgba(255,255,255,0.08)'
const INPUT_BD  = 'rgba(255,255,255,0.15)'
const BLUE      = '#1a7aff'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_QA = [
  { q: "Can you tell me a little bit about yourself and your background?", a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people." },
  { q: "What would you say is your greatest professional strength?", a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products." },
  { q: "What are some areas where you feel you could still improve?", a: "Earlier in my career I focused heavily on execution without always ensuring long-term strategy and scalability were equally prioritized. I've since adopted frameworks like RICE and MoSCoW to balance short-term wins with long-term vision. I've also been intentional about improving how I communicate across larger cross-functional teams as they scale." },
  { q: "Why are you interested in this role and our company specifically?", a: "I've been following your company's trajectory closely. The focus on emerging markets and user-centric innovation aligns deeply with the work I've been doing in Africa's fintech ecosystem. What drew me most is the mission — building products that matter in markets often underserved by traditional tech. I believe my background positions me to contribute meaningfully from day one." },
  { q: "Can you walk me through how you approach a brand new product or feature?", a: "I start with the problem, not the solution. I run discovery sessions — user interviews, competitive analysis, data review — to understand the pain point deeply. From there I map out user journeys, define success metrics, and ideate collaboratively with engineering and design. I prototype early, test with real users, and iterate before any major development investment. The key is keeping the user at the centre at every stage." },
  { q: "Tell me about a time you had a conflict with a stakeholder. How did you handle it?", a: "On one project a senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I prepared a data brief showing the risk alongside two alternative approaches that met their business goal differently. We aligned on a smaller version of the feature with a 30-day review gate. It shipped, performed well, and actually strengthened the relationship." },
  { q: "How do you prioritize features when you have limited time and resources?", a: "I use a combination of RICE scoring and stakeholder alignment sessions. RICE helps me quantify reach, impact, confidence, and effort objectively. But I pair that with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently. It removes a lot of the politics from prioritization." },
  { q: "How do you measure the success of a product or feature after it launches?", a: "Success starts with defining the right metrics before launch — not after. I work with the team to agree on a north star metric and two to three supporting KPIs tied directly to the problem we set out to solve. Post-launch I review these weekly for the first month, then monthly. I also run qualitative follow-ups with users to catch anything the numbers don't show." },
  { q: "Where do you see yourself professionally in the next three to five years?", a: "I see myself leading product strategy at a company building something with genuine societal impact — either as a VP of Product or a founder. I'm deeply interested in how AI can be layered into product experiences to make them smarter and more personalised. I'm also passionate about building and mentoring strong product teams, not just shipping great products myself." },
  { q: "Do you have any questions for us about the role or the team?", a: "Yes, a few. First — what does success look like for this role in the first 90 days? Second — how does the product team collaborate with engineering and design today, and where do you see room to improve that? And third — what's the biggest unsolved problem the product team is wrestling with right now? That last one tells me a lot about where I'd be spending my energy." },
]

const MOCK_RESUMES = [
  { name: 'Darnell Smith', role: 'Product Manager', date: '1st Jun, 2026' },
  { name: 'Darnell Smith', role: 'UI/UX Designer', date: '15th Apr, 2026' },
  { name: 'Darnell Smith', role: 'Software Engineer', date: '3rd Jan, 2026' },
]

type DesktopView = 'splash' | 'onboarding' | 'setup' | 'live' | 'complete'
type CopilotStatus = 'listening' | 'processing' | 'answering'

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Lightforth lightning logo
// ---------------------------------------------------------------------------
function LightningLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M19 3L7 18H16L13 29L25 14H16L19 3Z" fill="#60a5fa" />
      <path d="M19 3L16 14H25L19 3Z" fill="#1a7aff" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Mac Window Frame (2 traffic lights only, as in Figma)
// ---------------------------------------------------------------------------
function MacWindow({ children, blendBar }: { children: React.ReactNode; blendBar?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#0a1628' }}>
      <div className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-2xl shadow-2xl" style={{ background: BG, height: 700 }}>
        {/* Title bar */}
        <div
          className="flex h-10 flex-shrink-0 items-center px-4"
          style={{ background: blendBar ? BG : 'rgba(0,0,0,0.15)' }}
        >
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-green-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Screen 0: Splash
// ---------------------------------------------------------------------------
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="flex min-h-[560px] items-center justify-center" style={{ background: BG }}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <LightningLogo size={42} />
          <span className="text-3xl font-bold text-white tracking-tight">Lightforth</span>
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Connecting...</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 1: Onboarding
// ---------------------------------------------------------------------------
function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  const [grants, setGrants] = useState({ screen: false, audio: false, mic: false })

  const permissions = [
    { key: 'screen' as const, label: 'Screen Recording', desc: 'Allows Copilot to overlay on your screen during the interview' },
    { key: 'audio' as const, label: 'System Audio', desc: 'Allows Copilot to hear the conversation happening on your device' },
    { key: 'mic' as const, label: 'Microphone', desc: 'Allows Copilot to pick up your voice during the session' },
  ]

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">Welcome to Lightforth Co-Pilot</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Copilot listens to your interview in real time and quietly displays the right answer on your screen — invisible to your interviewer, even during a full screen share.
      </p>

      <div className="w-full max-w-[700px]">
        <p className="mb-4 text-sm font-semibold text-white">Required Permissions</p>
        <div className="mb-6 space-y-3">
          {permissions.map(p => (
            <div key={p.key} className="flex items-center justify-between rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div>
                <p className="text-sm font-semibold text-white">{p.label}</p>
                <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.desc}</p>
              </div>
              {grants[p.key] ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
                  <Check className="h-4 w-4" /> Granted
                </span>
              ) : (
                <button
                  onClick={() => setGrants(g => ({ ...g, [p.key]: true }))}
                  className="rounded-lg bg-white px-5 py-2 text-xs font-bold text-gray-900 hover:bg-white/90"
                >
                  Grant Access
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mb-8 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          If Lightforth Copilot doesn't appear in your system permissions list, click "+" and select it from your Applications folder. The app will restart automatically once permissions are granted — your audio will connect correctly after restart.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button className="flex h-11 items-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10">
            <Play className="h-4 w-4" /> Tutorial
          </button>
          <button onClick={onContinue} className="h-11 rounded-xl px-8 text-sm font-semibold text-white hover:opacity-90" style={{ background: BLUE }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Resume Import Modal
// ---------------------------------------------------------------------------
function ResumeModal({ onClose, onSelect }: { onClose: () => void; onSelect: (name: string) => void }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-8 shadow-2xl" style={{ background: '#0e2155', border: `1px solid ${BORDER}` }}>
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-white">Select resume to import</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        <div className="mb-6 space-y-3">
          {MOCK_RESUMES.map((r, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors"
              style={{
                background: selected === i ? 'rgba(26,122,255,0.15)' : CARD,
                border: `1px solid ${selected === i ? BLUE : BORDER}`,
              }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(26,122,255,0.2)' }}>
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.role} · {r.date}</p>
              </div>
              <div className={cn('h-5 w-5 rounded-full border-2 flex items-center justify-center', selected === i ? 'border-blue-400' : 'border-white/30')}>
                {selected === i && <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect(MOCK_RESUMES[selected].name)}
          className="h-12 w-full rounded-xl text-sm font-bold text-white hover:opacity-90"
          style={{ background: BLUE }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------
type ResponseStyle = 'Default' | 'Headlines' | 'Coaching'

function PreferenceModal({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<ResponseStyle>('Headlines')

  const previews: Record<ResponseStyle, string> = {
    Default: '"I redesigned a vehicle maintenance app that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalised dashboard. Engagement increased by 30% in 3 months, and customer satisfaction improved significantly."',
    Headlines: '"Absolutely! I\'d love to share my experience.\n• Situation: Our vehicle maintenance app had low engagement.\n• Task: I led a cross-functional team to redesign the app.\n• Action: User interviews → Redesigned UI → Simplified navigation.\n• Result: Engagement increased by 30% in 3 months."',
    Coaching: '"Start by setting the context — mention the project and its challenges. Then highlight your leadership role and actions. Be sure to emphasise impact. Keep it conversational and confident."',
  }

  const notes: Record<ResponseStyle, string> = {
    Default: 'Best for candidates who want a direct, no-frills answer.',
    Headlines: 'Best for candidates who want structured responses that hit all key points.',
    Coaching: 'Best for candidates who prefer brief coaching instead of a full answer.',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl" style={{ background: '#111827', border: `1px solid rgba(255,255,255,0.1)` }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-white/50 hover:text-white" /></button>
        </div>

        <p className="mb-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Select Response Type</p>

        <div className="mb-4 flex gap-2">
          {(['Default', 'Headlines', 'Coaching'] as ResponseStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
              style={{
                background: selected === s ? 'rgba(26,122,255,0.15)' : 'transparent',
                border: `1.5px solid ${selected === s ? BLUE : 'rgba(255,255,255,0.15)'}`,
                color: selected === s ? '#60a5fa' : 'rgba(255,255,255,0.6)',
              }}
            >
              <div className={cn('h-3.5 w-3.5 rounded-full border flex items-center justify-center flex-shrink-0', selected === s ? 'border-blue-400' : 'border-white/30')}>
                {selected === s && <div className="h-2 w-2 rounded-full bg-blue-400" />}
              </div>
              {s}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-xl p-4 text-xs leading-relaxed text-white whitespace-pre-line" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {previews[selected]}
        </div>

        <div className="mb-5 flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{notes[selected]}</p>
        </div>

        <button onClick={onNext} className="h-11 w-full rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
          Confirm
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 2: Setup
// ---------------------------------------------------------------------------
function SetupScreen({ onContinue }: { onContinue: (title: string) => void }) {
  const [tab, setTab] = useState<'live' | 'coding'>('live')
  const [jobTitle, setJobTitle] = useState('')
  const [selectedResume, setSelectedResume] = useState<string | null>('adewale_damola_PM_resume.pdf')
  const [jobDesc, setJobDesc] = useState('')
  const [audioConnected, setAudioConnected] = useState(true)
  const [dontAskAgain, setDontAskAgain] = useState(true)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showPreference, setShowPreference] = useState(false)

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' }

  return (
    <div style={{ background: BG }}>
      {/* Top nav */}
      <div className="flex h-14 items-center justify-between border-b px-6" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <LightningLogo size={24} />
          <span className="text-base font-bold text-white">Lightforth</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10" style={{ borderColor: BORDER }}>
            <LightningLogo size={12} /> Upgrade
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <Bell className="h-4 w-4 text-white/60" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
            <HelpCircle className="h-4 w-4 text-white/60" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto px-6 py-8" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        <div className="mx-auto max-w-[600px]">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">👋 Hola, Welcome to Interview Co-Pilot</h1>

          {/* Mode tabs */}
          <div className="mb-6 flex justify-center">
            <div className="flex gap-1 rounded-xl p-1" style={{ background: INPUT_BG }}>
              <button
                onClick={() => setTab('live')}
                className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors', tab === 'live' ? 'text-white' : 'text-white/50 hover:text-white/80')}
                style={{ background: tab === 'live' ? BLUE : 'transparent' }}
              >
                <Video className="h-4 w-4" /> Live Interview
              </button>
              <button
                onClick={() => setTab('coding')}
                className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors', tab === 'coding' ? 'text-white' : 'text-white/50 hover:text-white/80')}
                style={{ background: tab === 'coding' ? BLUE : 'transparent' }}
              >
                <Code2 className="h-4 w-4" /> Coding
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Position */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="mb-3 text-sm font-semibold text-white">Position</p>
              <input
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="Enter job role"
                className="w-full rounded-xl px-4 py-3 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Suggestions:</span>
                {['Product Designer', 'Product Manager'].map(s => (
                  <button key={s} onClick={() => setJobTitle(s)} className="font-semibold text-blue-400 hover:underline">{s}</button>
                ))}
              </div>
            </div>

            {/* Resume */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="mb-3 text-sm font-semibold text-white">Choose Resume</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors" style={{ border: `1px solid ${BORDER}` }}>
                  <Upload className="h-4 w-4" /> Upload a Resume
                </button>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="relative flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: 'rgba(26,122,255,0.15)', border: `1px solid ${BLUE}`, color: '#60a5fa' }}
                >
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold text-blue-400" style={{ background: BG, border: `1px solid ${BLUE}` }}>RECOMMENDED</span>
                  <LightningLogo size={14} /> Use Lightforth Resume
                </button>
              </div>
              {selectedResume && (
                <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <FileText className="h-4 w-4 fill-red-400 text-red-400" />
                  <span>{selectedResume}</span>
                  <button onClick={() => setSelectedResume(null)}><X className="h-3.5 w-3.5 hover:text-white" /></button>
                </div>
              )}
            </div>

            {/* Job description */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="mb-3 text-sm font-semibold text-white">Job description <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span></p>
              <div className="relative">
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Write or paste here..."
                  className="w-full resize-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30"
                  style={{ ...inputStyle, height: 88 }}
                />
                <button
                  onClick={() => setJobDesc("We're looking for a talented individual to join our growing team. You'll collaborate cross-functionally to deliver innovative solutions that drive real user impact.")}
                  className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <Sparkles className="h-3 w-3" /> Suggest for me
                </button>
              </div>
            </div>

            {/* Audio */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Select Audio</p>
                {audioConnected && <span className="text-xs font-semibold text-green-400">Connected</span>}
              </div>
              <button onClick={() => setAudioConnected(true)} className="flex h-11 w-full items-center justify-between rounded-xl px-4 text-sm text-white/80 hover:bg-white/10" style={{ border: `1px solid ${INPUT_BD}` }}>
                <span className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-white/50" />
                  {audioConnected ? 'Default - Adewale\' Airpod Pro' : 'No audio device selected'}
                </span>
                <ChevronDown className="h-4 w-4 text-white/50" />
              </button>
              <button
                onClick={() => setAudioConnected(true)}
                className="mt-3 h-10 w-full rounded-xl text-sm font-semibold text-white hover:opacity-90"
                style={{ background: 'rgba(26,122,255,0.3)', border: `1px solid rgba(26,122,255,0.4)` }}
              >
                Enable Microphone Access
              </button>
            </div>

            {/* Don't ask again */}
            <label className="flex cursor-pointer select-none items-center gap-3 px-1">
              <div className="relative h-5 w-5 flex-shrink-0">
                <input type="checkbox" className="sr-only" checked={dontAskAgain} onChange={e => setDontAskAgain(e.target.checked)} />
                <div className={cn('h-5 w-5 rounded flex items-center justify-center', dontAskAgain ? 'bg-blue-500' : 'border border-white/30')} onClick={() => setDontAskAgain(a => !a)}>
                  {dontAskAgain && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Don't ask again</span>
            </label>

            {/* Continue */}
            <button
              onClick={() => { if (jobTitle) setShowPreference(true) }}
              className="h-12 w-full rounded-xl text-sm font-bold text-white transition-opacity"
              style={{ background: BLUE, opacity: jobTitle ? 1 : 0.5 }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {showResumeModal && (
        <ResumeModal
          onClose={() => setShowResumeModal(false)}
          onSelect={(name) => { setSelectedResume(`${name.toLowerCase().replace(' ', '_')}_resume.pdf`); setShowResumeModal(false) }}
        />
      )}
      {showPreference && (
        <PreferenceModal
          onClose={() => setShowPreference(false)}
          onNext={() => onContinue(jobTitle || 'Software Engineer')}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 3: Live Canvas
// ---------------------------------------------------------------------------
function LiveCanvas({ jobTitle, onEnd }: { jobTitle: string; onEnd: () => void }) {
  const [copilotStatus, setCopilotStatus] = useState<CopilotStatus>('listening')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [stealthMode, setStealthMode] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [transparency, setTransparency] = useState(85)
  const [fontSize, setFontSize] = useState(14)
  const [scrollSpeed, setScrollSpeed] = useState(3)

  const statusRef = useRef(copilotStatus)
  const qIndexRef = useRef(questionIndex)
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => { statusRef.current = copilotStatus }, [copilotStatus])
  useEffect(() => { qIndexRef.current = questionIndex }, [questionIndex])

  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])
  useEffect(() => { panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' }) }, [qDisplayed, aDisplayed, copilotStatus])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      const cur = statusRef.current
      const qi = qIndexRef.current
      if (cur === 'listening') { setQDisplayed(MOCK_QA[qi].q); setCopilotStatus('processing') }
      else if (cur === 'processing') { setCopilotStatus('answering') }
      else { setHistory(h => [...h, { q: MOCK_QA[qi].q, a: MOCK_QA[qi].a }]); setQuestionIndex(i => (i + 1) % MOCK_QA.length); setCopilotStatus('listening') }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (copilotStatus !== 'listening') return
    setQDisplayed(''); setADisplayed('')
    const text = MOCK_QA[questionIndex].q; let i = 0
    const id = setInterval(() => { i++; setQDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 22)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex])

  useEffect(() => {
    if (copilotStatus !== 'answering') return
    setADisplayed('')
    const text = MOCK_QA[questionIndex].a; let i = 0
    const id = setInterval(() => { i += 6; setADisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 10)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex])

  const statusText: Record<CopilotStatus, string> = { listening: 'Listening...', processing: 'Processing...', answering: 'Answering...' }

  return (
    <div className="flex flex-1 flex-col" style={{ background: '#0A1628' }}>
      <style>{`
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 6px rgba(34,197,94,0.3),0 0 14px rgba(34,197,94,0.1)}50%{box-shadow:0 0 12px rgba(34,197,94,0.45),0 0 24px rgba(34,197,94,0.15)} }
        @keyframes processingDot { 0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
      `}</style>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Session Preferences</p>
                <div className="space-y-2 rounded-lg p-3 text-xs" style={{ background: '#0A1628' }}>
                  <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-200 truncate max-w-[140px]">{jobTitle}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Resume</span><span className="font-medium text-slate-200">Lightforth Resume</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Skip setup</span><span className="font-medium text-green-400">On</span></div>
                </div>
                <button onClick={() => setShowSettings(false)} className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Reset — show setup next time</button>
              </div>
              <div className="border-t" style={{ borderColor: '#1E2D45' }} />
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Stealth Mode</p><p className="mt-0.5 text-xs text-slate-500">Hides Copilot from screen share</p></div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between"><p className="text-sm font-medium text-slate-200">Transparent Background</p><span className="text-xs text-slate-400">{transparency}%</span></div>
                    <input type="range" min={0} max={100} value={transparency} onChange={e => setTransparency(Number(e.target.value))} className="w-full accent-primary" />
                    <p className="mt-1.5 text-xs text-slate-500">Adjust window transparency over other apps</p>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-200">Always on Top</p><p className="mt-0.5 text-xs text-slate-500">Keeps Copilot above all other windows</p></div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 text-sm text-slate-300"><div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />Interview for {jobTitle}</div>
        <div className="flex items-center gap-3"><span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span><button onClick={onEnd} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Interview</button></div>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: '#0F2340' }}>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px]">{[5,8,11,14].map((h,i) => <div key={i} className="w-[3px] rounded-sm bg-green-400" style={{height:h}} />)}</div>
            <span className="text-green-400">Strong</span>
          </div>
          <span className="italic text-slate-400">{statusText[copilotStatus]}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            Auto scroll
            <input type="range" min={1} max={5} value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-3 text-slate-500">{scrollSpeed}</span>
          </label>
          <label className="flex items-center gap-2">
            Font size
            <input type="range" min={12} max={20} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-20 accent-primary" />
            <span className="w-5 text-slate-500">{fontSize}</span>
          </label>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-2">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl transition-all duration-500" style={{ background: '#0D1929', border: copilotStatus === 'listening' ? '1px solid #22c55e' : '1px solid #1E2D45', ...(copilotStatus === 'listening' ? { animation: 'glowPulse 2s ease-in-out infinite' } : {}) }}>
          <div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3" style={{ borderColor: '#1E2D45' }}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">Live Interview Response<div className="h-2 w-2 rounded-full bg-red-500" /></div>
            <button onClick={() => setShowSettings(true)}><Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" /></button>
          </div>
          <div ref={panelRef} className="flex-1 space-y-6 overflow-y-auto p-5">
            {history.map((item, i) => (
              <div key={i} className="space-y-3">
                <div><p className="mb-1 text-xs text-slate-500">Interviewer</p><div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}><p className="text-sm text-white">{item.q}</p></div></div>
                <p className="text-sm leading-relaxed text-slate-200">{item.a}</p>
              </div>
            ))}
            <div className="space-y-3">
              {qDisplayed && (
                <div><p className="mb-1 text-xs text-slate-500">Interviewer</p><div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}><p className="text-sm text-white">{qDisplayed}{copilotStatus === 'listening' && qDisplayed.length < MOCK_QA[questionIndex].q.length && <span style={{ animation: 'blink 0.5s ease-in-out infinite' }}>|</span>}</p></div></div>
              )}
              {copilotStatus === 'processing' && <div className="flex items-center gap-1.5 py-1">{[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-slate-500" style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }} />)}</div>}
              {copilotStatus === 'answering' && aDisplayed && <p className="leading-relaxed text-slate-200" style={{ fontSize }}>{aDisplayed}{aDisplayed.length < MOCK_QA[questionIndex].a.length && <span className="ml-px inline-block w-[2px] bg-primary align-middle" style={{ height: '1em', animation: 'blink 0.45s ease-in-out infinite' }} />}</p>}
              {!qDisplayed && history.length === 0 && <p className="text-xs italic text-slate-600">Press Space to start the simulation...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 4: Complete
// ---------------------------------------------------------------------------
function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex min-h-[560px] flex-col justify-center px-12 py-16" style={{ background: 'linear-gradient(145deg, #0c1d48 0%, #0d3285 55%, #1a5aff 100%)' }}>
      <div className="max-w-[520px]">
        <h1 className="mb-5 text-4xl font-bold leading-tight text-white">👏 Your Interview is complete!</h1>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Thank you for completing your AI interview with Your Favorite Company.
        </p>
        <p className="mb-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Your responses have been recorded and will be evaluated by our Lightforth AI. Based on predefined criteria set by the hiring manager at Your Favourite Company, Lightforth will provide an unbiased assessment of vocabulary for the role.
        </p>
        <div className="flex gap-3">
          <button onClick={onGoHome} className="h-11 rounded-xl border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10">
            Go Home
          </button>
          <button className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white hover:opacity-90" style={{ background: BLUE }}>
            See Report <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function DesktopCopilotPreview() {
  const [view, setView] = useState<DesktopView>('splash')
  const [jobTitle, setJobTitle] = useState('Software Engineer')

  return (
    <MacWindow blendBar={view === 'splash' || view === 'onboarding' || view === 'complete'}>
      {view === 'splash'     && <SplashScreen    onDone={() => setView('onboarding')} />}
      {view === 'onboarding' && <OnboardingScreen onContinue={() => setView('setup')} />}
      {view === 'setup'      && <SetupScreen      onContinue={t => { setJobTitle(t); setView('live') }} />}
      {view === 'live'       && <LiveCanvas       jobTitle={jobTitle} onEnd={() => setView('complete')} />}
      {view === 'complete'   && <CompleteScreen   onGoHome={() => setView('splash')} />}
    </MacWindow>
  )
}
