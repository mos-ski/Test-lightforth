import { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, FileText, Mic, Settings, Sparkles, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock Q&A — 10 questions
// ---------------------------------------------------------------------------

const MOCK_QA = [
  {
    q: "Can you tell me a little bit about yourself and your background?",
    a: "I'm a product designer and manager with over 6 years of experience building digital products across fintech, crypto, and AI spaces. I've shipped 12 live applications and led cross-functional teams from ideation all the way to launch. What drives me is the intersection of user empathy and business impact — I love creating products that are not just beautiful but genuinely solve real problems for real people.",
  },
  {
    q: "What would you say is your greatest professional strength?",
    a: "My greatest strength is owning the full product lifecycle. I can sit in a strategy meeting in the morning, run a user research session in the afternoon, and review a design prototype by evening. That end-to-end ownership reduces handoff friction and speeds up delivery. I've used this to cut time-to-market by over 40% on my last two major products.",
  },
  {
    q: "What are some areas where you feel you could still improve?",
    a: "Earlier in my career I focused heavily on execution without always ensuring long-term strategy and scalability were equally prioritized. I've since adopted frameworks like RICE and MoSCoW to balance short-term wins with long-term vision. I've also been intentional about improving how I communicate across larger cross-functional teams as they scale.",
  },
  {
    q: "Why are you interested in this role and our company specifically?",
    a: "I've been following your company's trajectory closely. The focus on emerging markets and user-centric innovation aligns deeply with the work I've been doing in Africa's fintech ecosystem. What drew me most is the mission — building products that matter in markets often underserved by traditional tech. I believe my background positions me to contribute meaningfully from day one.",
  },
  {
    q: "Can you walk me through how you approach a brand new product or feature?",
    a: "I start with the problem, not the solution. I run discovery sessions — user interviews, competitive analysis, data review — to understand the pain point deeply. From there I map out user journeys, define success metrics, and ideate collaboratively with engineering and design. I prototype early, test with real users, and iterate before any major development investment. The key is keeping the user at the centre at every stage.",
  },
  {
    q: "Tell me about a time you had a conflict with a stakeholder. How did you handle it?",
    a: "On one project a senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I prepared a data brief showing the risk alongside two alternative approaches that met their business goal differently. We aligned on a smaller version of the feature with a 30-day review gate. It shipped, performed well, and actually strengthened the relationship.",
  },
  {
    q: "How do you prioritize features when you have limited time and resources?",
    a: "I use a combination of RICE scoring and stakeholder alignment sessions. RICE helps me quantify reach, impact, confidence, and effort objectively. But I pair that with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently. It removes a lot of the politics from prioritization.",
  },
  {
    q: "How do you measure the success of a product or feature after it launches?",
    a: "Success starts with defining the right metrics before launch — not after. I work with the team to agree on a north star metric and two to three supporting KPIs tied directly to the problem we set out to solve. Post-launch I review these weekly for the first month, then monthly. I also run qualitative follow-ups with users to catch anything the numbers don't show.",
  },
  {
    q: "Where do you see yourself professionally in the next three to five years?",
    a: "I see myself leading product strategy at a company building something with genuine societal impact — either as a VP of Product or a founder. I'm deeply interested in how AI can be layered into product experiences to make them smarter and more personalised. I'm also passionate about building and mentoring strong product teams, not just shipping great products myself.",
  },
  {
    q: "Do you have any questions for us about the role or the team?",
    a: "Yes, a few. First — what does success look like for this role in the first 90 days? Second — how does the product team collaborate with engineering and design today, and where do you see room to improve that? And third — what's the biggest unsolved problem the product team is wrestling with right now? That last one tells me a lot about where I'd be spending my energy.",
  },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DesktopView = 'onboarding' | 'setup' | 'live' | 'complete'
type CopilotStatus = 'listening' | 'processing' | 'answering'

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Mac Window Frame
// ---------------------------------------------------------------------------

function MacWindow({ children, tall }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#1c1c1e' }}>
      <div className={cn('w-full max-w-[960px] overflow-hidden rounded-xl shadow-2xl', tall ? 'h-[680px] flex flex-col' : '')}>
        {/* Title bar */}
        <div className="relative flex h-10 flex-shrink-0 items-center px-4" style={{ background: '#2c2c2e' }}>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Interview Copilot
          </span>
        </div>
        <div className={cn(tall ? 'flex flex-1 flex-col overflow-hidden' : '')}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toggle Switch
// ---------------------------------------------------------------------------

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-green-500' : 'bg-slate-300')}
    >
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
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
    <div className="bg-white px-10 py-10">
      {/* Logo + heading */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
          <span className="text-lg font-black text-primary">L</span>
          <span className="-ml-1 text-lg font-black text-orange-500">F</span>
        </span>
        <div>
          <h1 className="text-lg font-bold text-foreground">Interview Copilot</h1>
          <p className="text-xs text-muted-foreground">Desktop App · Stealth Mode</p>
        </div>
      </div>

      <p className="mb-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Copilot listens to your interview in real time and quietly displays the right answer on your screen — invisible to your interviewer, even during a full screen share.
      </p>

      {/* Permission rows */}
      <p className="mb-4 text-sm font-semibold text-foreground">Required Permissions</p>
      <div className="mb-6 space-y-3">
        {permissions.map(p => (
          <div key={p.key} className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-sm font-medium text-foreground">{p.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
            </div>
            {grants[p.key] ? (
              <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                <Check className="h-3.5 w-3.5" /> Granted
              </span>
            ) : (
              <button
                onClick={() => setGrants(g => ({ ...g, [p.key]: true }))}
                className="flex-shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
              >
                Grant Access
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mb-8 rounded-lg bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        If Lightforth Copilot doesn't appear in your system permissions list, click "+" and select it from your Applications folder. The app will restart automatically once permissions are granted — your audio will connect correctly after restart.
      </p>

      <button onClick={onContinue} className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90">
        Continue
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------

type ResponseStyle = 'Default' | 'Headlines' | 'Coaching'

function PreferenceModal({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<ResponseStyle>('Default')

  const descriptions: Record<ResponseStyle, string> = {
    Default: 'A full, natural-sounding answer you can read out directly.',
    Headlines: 'Structured bullet points (STAR format) to hit every key point.',
    Coaching: 'Brief tips and pointers to guide your own answer rather than a full script.',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Response Style</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">Choose how Copilot presents suggested answers during your interview.</p>
        <div className="mb-4 space-y-3">
          {(['Default', 'Headlines', 'Coaching'] as ResponseStyle[]).map(style => (
            <button
              key={style}
              onClick={() => setSelected(style)}
              className={cn('flex h-12 w-full items-center gap-4 rounded-md border px-4 text-left text-sm font-medium transition-colors', selected === style ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-muted')}
            >
              <span className={cn('flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border', selected === style ? 'border-primary' : 'border-slate-300')}>
                {selected === style && <span className="h-3 w-3 rounded-full bg-primary" />}
              </span>
              {style}
            </button>
          ))}
        </div>
        <p className="mb-6 rounded-md bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {descriptions[selected]}
        </p>
        <button onClick={onNext} className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90">
          Next
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 2: Setup
// ---------------------------------------------------------------------------

function SetupScreen({ onContinue }: { onContinue: (jobTitle: string) => void }) {
  const [jobTitle, setJobTitle] = useState('')
  const [resumeType, setResumeType] = useState<'upload' | 'lightforth'>('lightforth')
  const [jobDesc, setJobDesc] = useState('')
  const [audioConnected, setAudioConnected] = useState(false)
  const [dontAskAgain, setDontAskAgain] = useState(false)
  const [showPreference, setShowPreference] = useState(false)

  return (
    <div className="overflow-y-auto bg-background" style={{ maxHeight: 'calc(100vh - 80px)' }}>
      <div className="mx-auto max-w-[600px] px-8 py-8">
        <h2 className="lf-overlay-title mb-1">Set up Interview Copilot</h2>
        <p className="lf-body mb-7">Connect your role, resume, and audio so Copilot can guide you during the live interview.</p>

        {/* Job title */}
        <div className="mb-5">
          <label className="lf-label mb-2 block">Job title</label>
          <div className="relative">
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="Enter job role"
              className="lf-input h-11 pr-8"
            />
            {jobTitle && (
              <button onClick={() => setJobTitle('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {['UI/UX Designer', 'Software Engineer', 'SEO Specialist'].map(s => (
              <button key={s} onClick={() => setJobTitle(s)} className="text-xs font-medium text-primary hover:underline">{s}</button>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="mb-5">
          <label className="lf-label mb-2 block">Choose resume</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResumeType('upload')}
              className={cn('flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors', resumeType === 'upload' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
            >
              <Upload className="h-4 w-4" /> Upload a new resume
            </button>
            <button
              onClick={() => setResumeType('lightforth')}
              className={cn('relative flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors', resumeType === 'lightforth' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted')}
            >
              {resumeType === 'lightforth' && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-white px-2 py-0.5 text-[9px] font-bold text-primary">RECOMMENDED</span>
              )}
              <Sparkles className="h-4 w-4" /> Use Lightforth Resume
            </button>
          </div>
          {resumeType === 'lightforth' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 fill-red-500 text-red-500" />
              <span>Darnell_Smith_resume.pdf</span>
              <button aria-label="Remove resume"><X className="h-3.5 w-3.5 hover:text-destructive" /></button>
            </div>
          )}
        </div>

        {/* Job description */}
        <div className="mb-5">
          <label className="lf-label mb-2 block">Job description <span className="text-xs text-muted-foreground">(optional)</span></label>
          <div className="relative">
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Write or paste here..."
              className="lf-input h-24 resize-none py-3"
            />
            <button
              onClick={() => setJobDesc("We're looking for a talented individual to join our growing team. You'll collaborate cross-functionally to deliver innovative solutions that drive real user impact. Strong communication skills and attention to detail are essential.")}
              className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Sparkles className="h-3 w-3" /> Suggest for me
            </button>
          </div>
        </div>

        {/* Audio */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="lf-label">Select audio</label>
            {audioConnected && <span className="text-xs font-medium text-green-600">Connected</span>}
          </div>
          <button
            onClick={() => setAudioConnected(true)}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-white px-3 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-muted-foreground" />
              {audioConnected ? 'MacBook Pro Microphone' : 'No audio device selected'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <button
          onClick={() => setAudioConnected(true)}
          className="mb-4 h-11 w-full rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Enable Microphone Access
        </button>

        <label className="mb-4 flex cursor-pointer select-none items-center gap-2.5">
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={e => setDontAskAgain(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm text-muted-foreground">Don't ask me again — skip setup next time</span>
        </label>

        <button
          onClick={() => { if (jobTitle) setShowPreference(true) }}
          className={cn('h-11 w-full rounded-lg text-sm font-semibold text-white transition-colors', jobTitle ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-primary/40')}
        >
          Continue
        </button>
      </div>

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

  const statusRef = useRef(copilotStatus)
  const qIndexRef = useRef(questionIndex)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { statusRef.current = copilotStatus }, [copilotStatus])
  useEffect(() => { qIndexRef.current = questionIndex }, [questionIndex])

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll
  useEffect(() => {
    panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' })
  }, [qDisplayed, aDisplayed, copilotStatus])

  // Spacebar cycles states
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      const cur = statusRef.current
      const qi = qIndexRef.current
      if (cur === 'listening') {
        setQDisplayed(MOCK_QA[qi].q)
        setCopilotStatus('processing')
      } else if (cur === 'processing') {
        setCopilotStatus('answering')
      } else {
        setHistory(h => [...h, { q: MOCK_QA[qi].q, a: MOCK_QA[qi].a }])
        setQuestionIndex(i => (i + 1) % MOCK_QA.length)
        setCopilotStatus('listening')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Question typewriter
  useEffect(() => {
    if (copilotStatus !== 'listening') return
    setQDisplayed('')
    setADisplayed('')
    const text = MOCK_QA[questionIndex].q
    let i = 0
    const id = setInterval(() => {
      i++
      setQDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex])

  // Answer typewriter
  useEffect(() => {
    if (copilotStatus !== 'answering') return
    setADisplayed('')
    const text = MOCK_QA[questionIndex].a
    let i = 0
    const id = setInterval(() => {
      i += 6
      setADisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 10)
    return () => clearInterval(id)
  }, [copilotStatus, questionIndex])

  const statusText: Record<CopilotStatus, string> = {
    listening: 'Listening...',
    processing: 'Processing...',
    answering: 'Answering...',
  }

  return (
    <div className="flex flex-1 flex-col" style={{ background: '#0A1628' }}>
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.3), 0 0 14px rgba(34,197,94,0.1); }
          50% { box-shadow: 0 0 12px rgba(34,197,94,0.45), 0 0 24px rgba(34,197,94,0.15); }
        }
        @keyframes processingDot {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Top bar */}
      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3" style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Interview for {jobTitle}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span>
          <button onClick={onEnd} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">
            End Interview
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-2" style={{ background: '#0F2340' }}>
        <div className="flex items-center gap-5 text-xs">
          {/* Network */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px]">
              {[5, 8, 11, 14].map((h, i) => (
                <div key={i} className="w-[3px] rounded-sm bg-green-400" style={{ height: h }} />
              ))}
            </div>
            <span className="text-green-400">Strong</span>
          </div>
          {/* Audio state */}
          <span className="italic text-slate-400">{statusText[copilotStatus]}</span>
        </div>
        <span className="text-[10px] italic text-slate-600">Press Space to advance</span>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl" style={{ background: '#0D1929', border: '1px solid #1E2D45' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: '#1E2D45' }}>
              <p className="text-sm font-semibold text-white">Settings</p>
              <button onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Session Preferences */}
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Session Preferences</p>
                <div className="space-y-2 rounded-lg p-3 text-xs" style={{ background: '#0A1628' }}>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Role</span>
                    <span className="max-w-[160px] truncate font-medium text-slate-200">{jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resume</span>
                    <span className="font-medium text-slate-200">Lightforth Resume</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skip setup</span>
                    <span className="font-medium text-green-400">On</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="mt-3 w-full rounded-lg py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Reset — show setup next time
                </button>
              </div>

              {/* Divider */}
              <div className="border-t" style={{ borderColor: '#1E2D45' }} />

              {/* Window Settings */}
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Window Settings</p>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Stealth Mode</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">Hides Copilot from screen share and recording</p>
                    </div>
                    <Toggle on={stealthMode} onToggle={() => setStealthMode(s => !s)} />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-200">Transparent Background</p>
                      <span className="text-xs text-slate-400">{transparency}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={transparency}
                      onChange={e => setTransparency(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Adjust how transparent the window appears over other apps</p>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Always on Top</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">Keeps Copilot floating above all other windows</p>
                    </div>
                    <Toggle on={alwaysOnTop} onToggle={() => setAlwaysOnTop(s => !s)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-width response panel */}
      <div className="flex flex-1 overflow-hidden p-2">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl transition-all duration-500"
          style={{
            background: '#0D1929',
            border: copilotStatus === 'listening' ? '1px solid #22c55e' : '1px solid #1E2D45',
            ...(copilotStatus === 'listening' ? { animation: 'glowPulse 2s ease-in-out infinite' } : {}),
          }}
        >
          {/* Panel header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3" style={{ borderColor: '#1E2D45' }}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              Live Interview Response
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <button onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
            </button>
          </div>

          {/* Panel content */}
          <div ref={panelRef} className="flex-1 space-y-6 overflow-y-auto p-5">
            {/* Completed Q&A history */}
            {history.map((item, i) => (
              <div key={i} className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-slate-500">Interviewer</p>
                  <div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}>
                    <p className="text-sm text-white">{item.q}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{item.a}</p>
              </div>
            ))}

            {/* Current exchange */}
            <div className="space-y-3">
              {qDisplayed && (
                <div>
                  <p className="mb-1 text-xs text-slate-500">Interviewer</p>
                  <div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}>
                    <p className="text-sm text-white">
                      {qDisplayed}
                      {copilotStatus === 'listening' && qDisplayed.length < MOCK_QA[questionIndex].q.length && (
                        <span style={{ animation: 'blink 0.5s ease-in-out infinite' }}>|</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {copilotStatus === 'processing' && (
                <div className="flex items-center gap-1.5 py-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-slate-500"
                      style={{ animation: 'processingDot 0.9s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              )}

              {copilotStatus === 'answering' && aDisplayed && (
                <p className="text-sm leading-relaxed text-slate-200">
                  {aDisplayed}
                  {aDisplayed.length < MOCK_QA[questionIndex].a.length && (
                    <span
                      className="ml-px inline-block w-[2px] bg-primary align-middle"
                      style={{ height: '1em', animation: 'blink 0.45s ease-in-out infinite' }}
                    />
                  )}
                </p>
              )}

              {!qDisplayed && history.length === 0 && (
                <p className="text-xs italic text-slate-600">Press Space to start the simulation...</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen 4: Session Complete
// ---------------------------------------------------------------------------

function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center bg-white px-8 py-16">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">Session complete!</h2>
      <p className="mb-10 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        Your interview has been recorded and saved. You can review the full transcript and insights from your session history.
      </p>
      <button onClick={onGoHome} className="h-11 rounded-lg bg-primary px-8 text-sm font-semibold text-white hover:bg-primary/90">
        Go Home
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function DesktopCopilotPreview() {
  const [view, setView] = useState<DesktopView>('onboarding')
  const [jobTitle, setJobTitle] = useState('Software Engineer')

  return (
    <MacWindow tall={view === 'live'}>
      {view === 'onboarding' && (
        <OnboardingScreen onContinue={() => setView('setup')} />
      )}
      {view === 'setup' && (
        <SetupScreen onContinue={title => { setJobTitle(title); setView('live') }} />
      )}
      {view === 'live' && (
        <LiveCanvas jobTitle={jobTitle} onEnd={() => setView('complete')} />
      )}
      {view === 'complete' && (
        <CompleteScreen onGoHome={() => setView('onboarding')} />
      )}
    </MacWindow>
  )
}
