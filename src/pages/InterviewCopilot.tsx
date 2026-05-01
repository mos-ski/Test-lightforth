import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Settings, Upload, Trash2, Mic, Sparkles,
  ChevronDown, Search, Play, Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CopilotView = 'landing' | 'setup' | 'live' | 'complete' | 'report'
type ResponseType = 'default' | 'headlines' | 'coaching'
type LiveState = 'waiting' | 'sharing' | 'interviewing'

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_HISTORY = [
  { id: '1', title: 'UI/UX Designer', date: 'May 1st 2026, 4:23 pm', duration: '2m' },
  { id: '2', title: 'Product Manager', date: 'April 22nd 2026, 12:40 pm', duration: '12m' },
  { id: '3', title: 'Product Designer', date: 'April 21st 2026, 1:10 pm', duration: '4m' },
  { id: '4', title: 'Product Designer', date: 'April 21st 2026, 1:02 pm', duration: '6m' },
  { id: '5', title: 'Software Engineer', date: 'April 20th 2026, 5:42 pm', duration: '1m' },
  { id: '6', title: 'Product Designer', date: 'April 18th 2026, 1:14 pm', duration: '4m' },
  { id: '7', title: 'Product Manager', date: 'April 15th 2026, 1:09 pm', duration: '3m' },
  { id: '8', title: 'Product Designer', date: 'April 13th 2026, 6:13 pm', duration: '4m' },
  { id: '9', title: 'Product Designer', date: 'April 13th 2026, 6:08 pm', duration: '3m' },
]

const MOCK_TRANSCRIPT = [
  { role: 'interviewer', time: '00:00', text: 'as your greatest and...' },
  { role: 'interviewer', time: '00:01', text: 'biggest improvement areas.' },
  { role: 'interviewer', time: '00:04', text: 'And what have you done to improve them so far?' },
  { role: 'user', time: '00:07', text: "One of my greatest strengths is my ability to own the full product lifecycle, from strategy all the way to delivering a working product. My background as both a product manager and a design engineer allows me to not only define the vision but also execute and iterate quickly with lean teams. This combination has been instrumental in reducing time-to-market and shipping 12 live apps across fintech, crypto, and AI spaces. Additionally, I thrive in data-driven environments, where I can continuously measure KPIs and make informed decisions to improve user retention and feature adoption. As for areas of improvement, earlier in my career I focused heavily on execution without always ensuring that long-term strategy and scalability were equally prioritized. Over time, I realized the importance of balancing short-term wins with long-term product vision." },
]

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function formatTime(s: number): string {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Preference Modal
// ---------------------------------------------------------------------------

function PreferenceModal({
  responseType,
  setResponseType,
  onNext,
  onClose,
}: {
  responseType: ResponseType
  setResponseType: (t: ResponseType) => void
  onNext: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Preference</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        <p className="text-xs font-medium text-muted-foreground mb-3">Select Response Type</p>

        <div className="flex gap-2 mb-4">
          {(['default', 'headlines', 'coaching'] as ResponseType[]).map(t => (
            <button
              key={t}
              onClick={() => setResponseType(t)}
              className={cn(
                'flex-1 flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors',
                responseType === t ? 'border-primary text-primary bg-primary/5' : 'border-border text-foreground',
              )}
            >
              <div className={cn(
                'h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                responseType === t ? 'border-primary' : 'border-muted-foreground',
              )}>
                {responseType === t && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-gray-50 p-4 mb-3 text-sm leading-relaxed text-foreground">
          {responseType === 'default' && (
            <p>
              &quot;I redesigned a <strong>vehicle maintenance app</strong> that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalized dashboard. <strong><em>Engagement increased by 30% in 3 months</em></strong>, and customer satisfaction improved significantly. Strong experience in user centered design and cross-functional collaboration&quot;
            </p>
          )}
          {responseType === 'headlines' && (
            <div className="space-y-2">
              <p className="italic">&quot;Absolutely, Eric! I&apos;d love to share my experience in product management within the automotive aftermarket.&quot;</p>
              <p><strong>• Situation:</strong> Our vehicle maintenance app had low engagement and poor satisfaction.</p>
              <p><strong>• Task:</strong> I led a cross-functional team to redesign the app and improve usability.</p>
              <p><strong>• Action:</strong> Conducted user interviews → Redesigned UI → Simplified navigation → Personalized dashboard.</p>
              <p><strong>• Result:</strong> Engagement increased by <span className="text-green-600 font-medium">30% in 3 months</span>, customer satisfaction improved.</p>
              <p className="italic text-muted-foreground">This project reinforced my skills in user-centered design and collaboration. How does your team at Lightforth incorporate user feedback into product design?</p>
            </div>
          )}
          {responseType === 'coaching' && (
            <div className="space-y-2">
              <p className="italic">&quot;Start by setting the context—mention the project and its challenges. Then, highlight your leadership role and actions. Be sure to emphasize impact. Keep it conversational and confident.&quot;</p>
              <p className="font-bold flex items-center gap-1">
                <span className="text-primary">♦</span> Key Pointers for Your Response:
              </p>
              <ul className="space-y-1">
                <li>• <strong>Mention the project</strong> and its objective.</li>
                <li>• <strong>Explain your role</strong> and what actions you took.</li>
                <li>• <strong>End with results &amp; impact</strong> (numbers help).</li>
                <li>• <strong>Engage the interviewer</strong> with a follow-up question.</li>
              </ul>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {responseType === 'default' && 'Best for candidates who want a direct, no-frills answer'}
          {responseType === 'headlines' && 'Best for candidates who want structured responses that hit all key points.'}
          {responseType === 'coaching' && 'Best for candidates who prefer brief coaching instead of a full answer'}
        </p>

        <button
          onClick={onNext}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Landing Content (within AppLayout)
// ---------------------------------------------------------------------------

function LandingContent({
  onStart,
  onSelectHistory,
  onDownload,
}: {
  onStart: () => void
  onSelectHistory: (id: string) => void
  onDownload: () => void
}) {
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Interview Co-Pilot</h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Bring Co-Pilot into your next interview. It quietly listens and delivers the right answers on your screen whenever you&apos;re unsure what to say.
        </p>
      </div>

      {/* Amber banner */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-800 font-medium">For coding interviews and stealth version.</p>
        <div className="flex gap-2">
          <button onClick={onDownload} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
            <Monitor className="h-3 w-3" /> Install Desktop
          </button>
          <button onClick={onDownload} className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
            <Monitor className="h-3 w-3" /> Install Mobile
          </button>
        </div>
      </div>

      {/* History heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">History</h2>
      </div>

      {/* Search + Start button row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search"
            className="lf-input pl-9"
          />
        </div>
        <button
          onClick={onStart}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Start Interview
        </button>
      </div>

      {/* History table */}
      <div className="lf-table-wrap">
      <table className="lf-table">
        <thead className="lf-table-head">
          <tr>
            <th className="lf-table-th w-8"></th>
            <th className="lf-table-th">Title ↓</th>
            <th className="lf-table-th">Date &amp; Time ↓</th>
            <th className="lf-table-th">Duration ↓</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_HISTORY.map(item => (
            <tr
              key={item.id}
              onClick={() => onSelectHistory(item.id)}
              className="lf-table-row cursor-pointer"
            >
              <td className="lf-table-cell">
                <div className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground">
                  <Play className="h-3 w-3" />
                </div>
              </td>
              <td className="lf-table-cell font-medium text-foreground">{item.title}</td>
              <td className="lf-table-cell text-muted-foreground">{item.date}</td>
              <td className="lf-table-cell text-muted-foreground">{item.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

// ---------------------------------------------------------------------------
// Setup Overlay
// ---------------------------------------------------------------------------

function SetupContent({
  jobTitle,
  setJobTitle,
  resumeType,
  setResumeType,
  jobDesc,
  setJobDesc,
  audioConnected,
  setAudioConnected,
  onBack,
  onContinue,
}: {
  jobTitle: string
  setJobTitle: (v: string) => void
  resumeType: 'upload' | 'lightforth'
  setResumeType: (v: 'upload' | 'lightforth') => void
  jobDesc: string
  setJobDesc: (v: string) => void
  audioConnected: boolean
  setAudioConnected: (v: boolean) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <>
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onBack}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-6 py-10">
        {/* Greeting */}
        <div className="mb-6">
          <p className="text-3xl mb-1">👋</p>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Hola, Welcome to<br />Interview Co-Pilot
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            You&apos;ve already applied and need to prep now. Learn how to answer the most common interview questions, sharpen your presentation skills, and master the art of selling yourself. Stand out from the competition with techniques other candidates don&apos;t know.
          </p>
        </div>

        {/* Job title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">Job title</label>
          <div className="relative">
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="Enter job role"
              className="w-full rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:border-primary pr-8"
            />
            {jobTitle && (
              <button onClick={() => setJobTitle('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {['UI/UX Designer', 'Software Engineer', 'SEO Specialist'].map(s => (
              <button
                key={s}
                onClick={() => setJobTitle(s)}
                className={cn(
                  'text-xs hover:underline',
                  jobTitle === s ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Choose Resume */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">Choose Resume</label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setResumeType('upload')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 text-sm transition-colors',
                resumeType === 'upload' ? 'border-primary text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Upload className="h-3.5 w-3.5" /> Upload a new resume
            </button>
            <button
              onClick={() => setResumeType('lightforth')}
              className={cn(
                'flex-1 relative flex items-center justify-center gap-1.5 py-2 text-sm border-l border-border transition-colors',
                resumeType === 'lightforth' ? 'border-primary text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {resumeType === 'lightforth' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-white px-1.5 py-0.5 text-[9px] font-bold text-primary">
                  RECOMMENDED
                </span>
              )}
              → Use Lightforth Resume
            </button>
          </div>

          {resumeType === 'lightforth' && (
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-red-100">
                <span className="text-[10px] font-bold text-red-500">PDF</span>
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">Darnell Smith</span>
              <button><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
            </div>
          )}
        </div>

        {/* Job description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">Job description</label>
          <div className="relative">
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Write or paste here..."
              className="w-full h-24 rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
            <button className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-primary hover:underline">
              <Sparkles className="h-3 w-3" /> Suggest for me
            </button>
          </div>
        </div>

        {/* Select Audio */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Select Audio</label>
            {audioConnected && <span className="text-xs font-medium text-green-600">Connected</span>}
          </div>
          <button
            onClick={() => setAudioConnected(true)}
            className="w-full flex items-center justify-between rounded-lg border border-input px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-muted-foreground" />
              {audioConnected ? 'MacBook Pro Microphone' : 'No audio device selected'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Buttons */}
        <button
          onClick={() => setAudioConnected(true)}
          className="mb-2 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Enable Microphone Access
        </button>
        <button
          onClick={onContinue}
          className={cn(
            'w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors',
            jobTitle ? 'bg-primary hover:bg-primary/90' : 'bg-primary/40 cursor-not-allowed',
          )}
        >
          Continue
        </button>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Live Interview Overlay
// ---------------------------------------------------------------------------

function LiveInterview({
  jobTitle,
  liveState,
  setLiveState,
  elapsed,
  onEnd,
}: {
  jobTitle: string
  liveState: LiveState
  setLiveState: (s: LiveState) => void
  elapsed: number
  onEnd: () => void
}) {
  const [responseWidth, setResponseWidth] = useState(70)
  const [transcriptHeight, setTranscriptHeight] = useState(34)

  const applyPreset = (preset: 'balanced' | 'response' | 'mirror' | 'transcript') => {
    if (preset === 'balanced') {
      setResponseWidth(70)
      setTranscriptHeight(34)
    }
    if (preset === 'response') {
      setResponseWidth(82)
      setTranscriptHeight(26)
    }
    if (preset === 'mirror') {
      setResponseWidth(54)
      setTranscriptHeight(18)
    }
    if (preset === 'transcript') {
      setResponseWidth(58)
      setTranscriptHeight(58)
    }
  }

  return (
    <>
      {/* Top bar */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between px-6" style={{ background: '#0A1628' }}>
        <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Interview for {jobTitle || 'Software Engineer'}
        </button>
        <div className="flex items-center gap-3">
          {liveState === 'interviewing' && (
            <>
              <div className="flex items-center gap-1.5 text-sm text-slate-300">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {formatTime(elapsed)}
              </div>
              <button
                onClick={onEnd}
                className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                End Interview
              </button>
            </>
          )}
          {liveState === 'waiting' && (
            <button className="rounded-lg border border-slate-600 px-4 py-1.5 text-sm font-medium text-slate-300">
              Start Interview
            </button>
          )}
          {liveState === 'sharing' && (
            <button
              onClick={() => setLiveState('interviewing')}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Start Interview
            </button>
          )}
        </div>
      </div>

      {/* Two-panel body */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2" style={{ background: '#0F2340' }}>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Canvas layout</span>
          {(['balanced', 'response', 'mirror', 'transcript'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-white/15 px-3 py-1 capitalize hover:border-white/40 hover:text-white"
            >
              {preset}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            Response
            <input
              type="range"
              min="52"
              max="84"
              value={responseWidth}
              onChange={(event) => setResponseWidth(Number(event.target.value))}
              className="w-28 accent-primary"
            />
          </label>
          <label className="flex items-center gap-2">
            Transcript
            <input
              type="range"
              min="18"
              max="60"
              value={transcriptHeight}
              onChange={(event) => setTranscriptHeight(Number(event.target.value))}
              className="w-28 accent-primary"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-1 gap-2 overflow-hidden p-3">
        {/* Left: Live Interview Response */}
        <div className="flex flex-col overflow-hidden rounded-xl" style={{ width: `${responseWidth}%`, background: '#0D1929', border: '1px solid #1E2D45' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1E2D45' }}>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              Live Interview Response
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
            <button><Settings className="h-4 w-4 text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {liveState === 'interviewing' ? (
              <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                <p>
                  One of my greatest strengths is my ability to own the full product lifecycle, from strategy all the way to delivering a working product. My background as both a product manager and a design engineer allows me to not only define the vision but also execute and iterate quickly with lean teams. This combination has been instrumental in reducing time-to-market and shipping 12 live apps across fintech, crypto, and AI spaces.
                </p>
                <p>
                  Additionally, I thrive in data-driven environments, where I can continuously measure KPIs and make informed decisions to improve user retention and feature adoption. As for areas of improvement, earlier in my career I focused heavily on execution without always ensuring that long-term strategy and scalability were equally prioritized. Over time, I realized the importance of balancing{' '}
                  <span className="text-primary font-medium">short-term wins with long-term product vision</span>. I&apos;ve proactively adopted more structured roadmapping and prioritization frameworks like RICE and MoSCoW.
                </p>
                <p>
                  I&apos;ve also identified that{' '}
                  <span className="text-primary font-medium">communication across larger cross-functional teams</span>{' '}
                  can be an area for growth, especially as teams scale. To improve in this area, I&apos;ve adopted more structured sprint planning and improved stakeholder updates.
                </p>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Interviewer:</p>
                  <div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}>
                    <p className="text-white text-sm">All right.</p>
                  </div>
                </div>

                <p className="text-slate-300">Thank you! Let me know if there&apos;s any specific area you&apos;d like me to expand on.</p>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Interviewer:</p>
                  <div className="inline-block rounded-lg px-3 py-2" style={{ background: '#1A2F4A' }}>
                    <p className="text-white text-sm">Why are you interviewing with me today? What made you apply for this job and why do you want to work here?</p>
                  </div>
                </div>

                <p>
                  I&apos;m excited to be here today because I see a strong alignment between my background and the direction of your company. I&apos;ve spent the past several years building and shipping fintech, crypto, and AI-driven products across emerging markets, particularly in Africa. Your company&apos;s focus on driving innovation in similar domains resonates deeply with my experience and passion.
                </p>
                <p>
                  One of the main reasons I was drawn to this role is the emphasis on delivering user-centric solutions. Throughout my career, I&apos;ve been focused on creating products that are not just technologically advanced but also solve real pain points for users. I see that same commitment here, and I believe I can contribute significantly to that mission.
                </p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-500">Lightforth will analyze the interview questions and give target response...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Your Interview + Your Transcript */}
        <div className="flex min-w-[280px] flex-1 flex-col gap-2">
          {/* Your Interview */}
          <div className="flex flex-col overflow-hidden rounded-xl" style={{ height: `${100 - transcriptHeight}%`, background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="px-4 py-3 border-b text-sm font-medium text-white" style={{ borderColor: '#1E2D45' }}>
              Your Interview
            </div>
            <div className="flex-1 relative overflow-hidden">
              {liveState === 'waiting' && (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs text-slate-400 mb-3">Share your interview tab to get started</p>
                  <button
                    onClick={() => setLiveState('sharing')}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-400 hover:text-white mb-3"
                  >
                    <Upload className="h-3.5 w-3.5" /> Share Interview Screen
                  </button>
                  <div className="w-full rounded-lg p-3 text-left text-xs" style={{ background: '#1A2F4A' }}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-white text-xs">1. Share your Screen</p>
                      <button><X className="h-3.5 w-3.5 text-slate-400" /></button>
                    </div>
                    <p className="text-slate-300 leading-relaxed">Click here to share the browser tab where your interview is taking place. Share only the interview tab and not your entire screen. Make sure the interview tab is in this browser window</p>
                  </div>
                </div>
              )}
              {(liveState === 'sharing' || liveState === 'interviewing') && (
                <div className="relative h-full">
                  <div className="h-full w-full" style={{ background: '#1A2533' }}>
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="w-full h-48 bg-gray-700 rounded-lg mx-2 flex items-center justify-center text-xs text-gray-400">
                        [Interview Screen]
                      </div>
                    </div>
                  </div>
                  {liveState === 'sharing' && (
                    <div className="absolute right-2 top-2 w-44 rounded-lg p-3 text-xs shadow-lg" style={{ background: '#1E3A5F' }}>
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-white">2. Start Interview</p>
                        <button><X className="h-3.5 w-3.5 text-slate-400" /></button>
                      </div>
                      <p className="text-slate-300">Click here to start your interview when you&apos;re ready.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Your Transcript */}
          <div className="flex flex-col overflow-hidden rounded-xl" style={{ height: `${transcriptHeight}%`, background: '#0D1929', border: '1px solid #1E2D45' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1E2D45' }}>
              <span className="text-sm font-medium text-white">Your Transcript</span>
              <button className="h-5 w-9 rounded-full bg-slate-600 flex items-center px-0.5">
                <div className="h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-500">Your transcript will show here...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Complete Screen
// ---------------------------------------------------------------------------

function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <button onClick={onGoHome} className="flex items-center gap-2 text-sm text-foreground">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onGoHome}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <p className="text-5xl mb-4">👏</p>
        <h1 className="text-3xl font-bold text-foreground mb-3">Your Interview is complete!</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-8">
          Thank you for completing the AI interview. Your responses have been recorded and will be evaluated by our AI to provide an unbiased assessment.
        </p>
        <button
          onClick={onGoHome}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Go Home
        </button>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Report Page
// ---------------------------------------------------------------------------

function ReportPage({ onBack }: { onBack: () => void }) {
  return (
    <>
      {/* Top bar */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-foreground">
          <ArrowLeft className="h-4 w-4" /> Interview Copilot
        </button>
        <button onClick={onBack}><X className="h-5 w-5 text-muted-foreground" /></button>
      </div>

      {/* Back link */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Copilot
        </button>
      </div>

      {/* Two-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Transcript */}
        <div className="flex-1 overflow-y-auto border-r border-border p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Interview Transcript</h2>
          <div className="space-y-4">
            {MOCK_TRANSCRIPT.map((entry, i) => (
              <div key={i}>
                {entry.role === 'interviewer' ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Interviewer</span>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    <p className="text-sm text-foreground pl-2">{entry.text}</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-5 w-8 items-center justify-center rounded-md bg-foreground">
                        <span className="text-[10px] font-bold text-white">You</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pl-2">{entry.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Insights */}
        <div className="w-96 flex-shrink-0 overflow-y-auto p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Insights</h2>
          <h3 className="text-lg font-bold text-foreground mb-4">Software Engineer</h3>

          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Session Summary:</p>
            <p className="text-sm text-foreground leading-relaxed">
              The session captured a discussion focused on your improvement areas, reasons you applied for the job, and motivations for wanting to join.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-3">Improvement:</p>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">1. Clarity in Communication:</p>
                <p className="text-sm text-foreground leading-relaxed">Your communication was punctuated and clear, allowing easy understanding of your responses. However, be cautious of disruptive pauses and ensure a smooth continuation between all topics. Such fluency will enhance the conversational flow.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">2. Specificity in Examples:</p>
                <p className="text-sm text-foreground leading-relaxed">Unfortunately, without candidate responses noted in the logs, there was no opportunity to assess specificity. Aim to always provide detailed examples and explanations to support your points, as this demonstrates insight and depth in your experience.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">3. Follow-Up and Engagement with the Interviewer:</p>
                <p className="text-sm text-foreground leading-relaxed">Due to a lack of candidate responses in the transcript, it&apos;s challenging to evaluate your engagement. In general, active engagement and probing questions regarding the role and company not only show your interest but also help ascertain if the position aligns with your career goals.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Feedback Conclusion:</p>
                <p className="text-sm text-foreground leading-relaxed">While this session&apos;s transcript was limited to the AI&apos;s questions and lacked your direct responses, it&apos;s essential in any interview to communicate clearly and specifically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function InterviewCopilot() {
  const navigate = useNavigate()
  const [view, setView] = useState<CopilotView>('landing')
  const [showPreference, setShowPreference] = useState(false)
  const [responseType, setResponseType] = useState<ResponseType>('default')
  const [liveState, setLiveState] = useState<LiveState>('waiting')
  const [jobTitle, setJobTitle] = useState('')
  const [resumeType, setResumeType] = useState<'upload' | 'lightforth'>('lightforth')
  const [jobDesc, setJobDesc] = useState('')
  const [audioConnected, setAudioConnected] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [, setSelectedHistoryId] = useState<string | null>(null)

  useEffect(() => {
    if (liveState !== 'interviewing') return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [liveState])

  function goToLive() {
    setShowPreference(false)
    setView('live')
    setLiveState('waiting')
  }

  function handleContinue() {
    if (jobTitle) setShowPreference(true)
  }

  function handleEndInterview() {
    setView('complete')
    setLiveState('waiting')
    setElapsed(0)
  }

  function handleSelectHistory(id: string) {
    setSelectedHistoryId(id)
    setView('report')
  }

  return (
    <>
      {/* Landing content (within AppLayout) */}
      <LandingContent
        onStart={() => setView('setup')}
        onSelectHistory={handleSelectHistory}
        onDownload={() => navigate('/downloads')}
      />

      {/* Setup overlay */}
      {view === 'setup' && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <SetupContent
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            resumeType={resumeType}
            setResumeType={setResumeType}
            jobDesc={jobDesc}
            setJobDesc={setJobDesc}
            audioConnected={audioConnected}
            setAudioConnected={setAudioConnected}
            onBack={() => setView('landing')}
            onContinue={handleContinue}
          />
          {showPreference && (
            <PreferenceModal
              responseType={responseType}
              setResponseType={setResponseType}
              onNext={goToLive}
              onClose={() => setShowPreference(false)}
            />
          )}
        </div>
      )}

      {/* Live interview overlay */}
      {view === 'live' && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#0A1628' }}>
          <LiveInterview
            jobTitle={jobTitle}
            liveState={liveState}
            setLiveState={setLiveState}
            elapsed={elapsed}
            onEnd={handleEndInterview}
          />
        </div>
      )}

      {/* Complete screen */}
      {view === 'complete' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <CompleteScreen onGoHome={() => setView('landing')} />
        </div>
      )}

      {/* Report overlay */}
      {view === 'report' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
          <ReportPage onBack={() => setView('landing')} />
        </div>
      )}
    </>
  )
}
