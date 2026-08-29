import { useState } from 'react'
import type { AppState, ApplicationRecord, CaptchaState, JobHistoryGroup, PlatformId, RunLogEntry, View } from './types'
import type { ProgressWidgetState } from './components/AutoApplyProgressWidget'
import { Header } from './components/Header'
import { AutoApplyProgressWidget } from './components/AutoApplyProgressWidget'
import { TabBar, type ExtensionTab } from './components/TabBar'
import { RunLogFeed } from './components/RunLogFeed'
import { LoginView } from './views/LoginView'
import { BeforeYouBeginView } from './views/BeforeYouBeginView'
import { AutoApplyView } from './views/AutoApplyView'
import { NoJobsView } from './views/NoJobsView'
import { JobHistoryView } from './views/JobHistoryView'
import { ApplicationsView } from './views/ApplicationsView'
import { ErrorView } from './views/ErrorView'
import { SuccessView } from './views/SuccessView'

const DEFAULT_PLATFORMS: AppState['platforms'] = {
  indeed: { status: 'idle' },
  glassdoor: { status: 'idle' },
  workable: { status: 'idle' },
  linkedin: { status: 'idle' },
}

const MOCK_JOB_HISTORY: JobHistoryGroup[] = [
  {
    platform: 'linkedin',
    jobs: [
      {
        id: '1',
        title: 'Product Specialist',
        company: 'Oluwalogbon special corp',
        url: 'https://www.linkedin.com/jobs/sear...',
        logoColor: '#0A66C2',
        logoInitial: 'O',
        status: 'success',
      },
      {
        id: '2',
        title: 'Product Specialist',
        company: 'Lightforth',
        url: 'https://www.linkedin.com/jobs/sear...',
        logoColor: '#134ABE',
        logoInitial: 'L',
        status: 'failed',
        errorMessage: 'This application failed because of VPN.. please kindly turn off your VPN onward',
      },
    ],
  },
  {
    platform: 'glassdoor',
    jobs: [
      {
        id: '3',
        title: 'Product Specialist',
        company: 'Lightforth',
        url: 'https://www.glassdoor.com/Job/user-e...',
        logoColor: '#0CAA41',
        logoInitial: 'L',
        status: 'success',
      },
      {
        id: '4',
        title: 'Product Specialist',
        company: 'Lightforth',
        url: 'https://www.glassdoor.com/Job/user-e...',
        logoColor: '#0CAA41',
        logoInitial: 'L',
        status: 'success',
      },
    ],
  },
  { platform: 'indeed', jobs: [] },
  { platform: 'workable', jobs: [] },
]

const MOCK_PROGRESS: ProgressWidgetState = {
  platform: 'linkedin',
  applied: 0,
  skipped: 0,
  currentJob: {
    title: 'Senior Product Manager – Ban...',
    company: 'FairMoney',
    status: 'in-progress',
  },
  logs: [
    { id: '4', message: 'Started AI resume generation in background' },
    { id: '3', message: 'Extracting job details' },
    { id: '2', message: 'Jobs found, about to apply to each job' },
    { id: '1', message: 'Fetching jobs...' },
  ],
}

const MOCK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'a0',
    title: 'Senior Product Manager, Growth',
    company: 'Notion',
    timeLabel: '6:20 PM',
    source: 'linkedin',
    status: 'submitted',
    postingUrl: '#',
  },
  {
    id: 'a0b',
    title: 'Product Manager, Platform',
    company: 'Stripe',
    timeLabel: '6:19 PM',
    source: 'indeed',
    status: 'submitted',
    postingUrl: '#',
  },
  {
    id: 'a1',
    title: 'Technical Product Owner',
    company: 'TechStar Group',
    timeLabel: '6:19 PM',
    source: 'linkedin',
    status: 'skipped',
    reason: 'You stopped the run while this application was in progress.',
    postingUrl: '#',
  },
  {
    id: 'a2',
    title: 'Product Ownwer (Banking/ Financial)',
    company: 'Mindlance',
    timeLabel: '6:19 PM',
    source: 'linkedin',
    status: 'failed',
    reason: 'The application pane offered nothing to click.',
    postingUrl: '#',
  },
  {
    id: 'a3',
    title: 'Senior Product Manager, Digital Experience',
    company: 'Four Hands',
    timeLabel: '6:19 PM',
    source: 'linkedin',
    status: 'failed',
    reason: 'The application pane offered nothing to click.',
    postingUrl: '#',
  },
  {
    id: 'a4',
    title: 'Salesforce Platform Product Manager',
    company: 'Perry Homes',
    timeLabel: '6:19 PM',
    source: 'linkedin',
    status: 'skipped',
    reason: '"3 reactions" does not match any of your target roles (Senior Product Manager, Product Manager, Product Designer).',
    postingUrl: '#',
  },
  {
    id: 'a5',
    title: 'Senior Product Manager',
    company: 'RigUp',
    timeLabel: '6:19 PM',
    source: 'linkedin',
    status: 'failed',
    reason: 'The application pane offered nothing to click.',
    postingUrl: '#',
  },
  {
    id: 'a6',
    title: 'Product Owner - Microsoft Dynamics 365',
    company: 'V-Soft Consulting Group, Inc.',
    timeLabel: '6:18 PM',
    source: 'linkedin',
    status: 'skipped',
    reason: '"2 reactions" does not match any of your target roles (Senior Product Manager, Product Manager, Product Designer).',
    postingUrl: '#',
  },
  {
    id: 'a7',
    title: 'Product Manager, Marketing Data & Technology',
    company: 'Neighborly®',
    timeLabel: '6:18 PM',
    source: 'linkedin',
    status: 'failed',
    reason: 'The application pane offered nothing to click.',
    postingUrl: '#',
  },
  {
    id: 'a8',
    title: 'Product Manager, Intelligent Transportation Systems (ITS) & Edge Computing',
    company: 'CURRUX Vision',
    timeLabel: '6:18 PM',
    source: 'linkedin',
    status: 'failed',
    reason: 'The application pane offered nothing to click.',
    postingUrl: '#',
  },
  {
    id: 'a9',
    title: 'Lead, Digital Learning',
    company: 'The Future Edge',
    timeLabel: '6:18 PM',
    source: 'linkedin',
    status: 'skipped',
    reason: '"Lead, Digital Learning" does not match any of your target roles (Senior Product Manager, Product Manager, Product Designer).',
    postingUrl: '#',
  },
]

const MOCK_RUN_LOG: RunLogEntry[] = [
  {
    id: 'l1',
    timeLabel: '6:18:58 PM',
    level: 'warning',
    title: 'Senior Product Manager',
    message: 'The application pane offered nothing to click. — retrying (2/2).',
  },
  {
    id: 'l2',
    timeLabel: '6:19:06 PM',
    level: 'error',
    title: 'Senior Product Manager at RigUp',
    message: 'The application pane offered nothing to click.',
  },
  {
    id: 'l3',
    timeLabel: '6:19:18 PM',
    level: 'info',
    title: 'Salesforce Platform Product Manager at Perry Homes',
    message: '"3 reactions" does not match any of your target roles.',
  },
]

const DEMO_STATES: { label: string; state: Partial<AppState>; progress?: ProgressWidgetState; tab?: ExtensionTab }[] = [
  { label: 'Login', state: { view: 'login' } },
  { label: 'Before you begin', state: { view: 'before-you-begin' } },
  {
    label: 'AutoApply – default',
    state: { view: 'auto-apply', platforms: DEFAULT_PLATFORMS },
  },
  {
    label: 'AutoApply – in progress',
    state: {
      view: 'auto-apply',
      platforms: { ...DEFAULT_PLATFORMS, linkedin: { status: 'in-progress' } },
    },
    progress: MOCK_PROGRESS,
  },
  {
    label: 'AutoApply – CAPTCHA verify',
    state: {
      view: 'auto-apply',
      platforms: {
        ...DEFAULT_PLATFORMS,
        indeed: { status: 'in-progress', captchaState: 'verify' as CaptchaState },
      },
    },
  },
  {
    label: 'AutoApply – CAPTCHA verifying',
    state: {
      view: 'auto-apply',
      platforms: {
        ...DEFAULT_PLATFORMS,
        indeed: { status: 'in-progress', captchaState: 'verifying' as CaptchaState },
      },
    },
  },
  {
    label: 'AutoApply – CAPTCHA failure',
    state: {
      view: 'auto-apply',
      platforms: {
        ...DEFAULT_PLATFORMS,
        indeed: { status: 'in-progress', captchaState: 'failure' as CaptchaState },
      },
    },
  },
  {
    label: 'AutoApply – CAPTCHA success',
    state: {
      view: 'auto-apply',
      platforms: {
        ...DEFAULT_PLATFORMS,
        indeed: { status: 'in-progress', captchaState: 'success' as CaptchaState },
      },
    },
  },
  {
    label: 'AutoApply – errors',
    state: {
      view: 'auto-apply',
      platforms: {
        indeed: { status: 'in-progress' },
        glassdoor: { status: 'idle' },
        workable: { status: 'error', errorMessage: "We couldn't find a job position for this platform" },
        linkedin: { status: 'error', errorMessage: 'An error occurred' },
      },
    },
  },
  { label: 'No Jobs', state: { view: 'no-jobs' } },
  { label: 'Job History', state: { view: 'job-history' } },
  { label: 'Error', state: { view: 'error' } },
  { label: 'Success', state: { view: 'success' } },
  {
    label: 'Progress widget',
    state: {
      view: 'auto-apply',
      platforms: {
        ...DEFAULT_PLATFORMS,
        glassdoor: { status: 'idle' },
        indeed: { status: 'idle' },
        linkedin: { status: 'in-progress' },
      },
    },
    progress: MOCK_PROGRESS,
  },
  {
    label: 'Live run (finished)',
    state: {
      view: 'auto-apply',
      platforms: { ...DEFAULT_PLATFORMS, linkedin: { status: 'idle' } },
    },
  },
  {
    label: 'Applications tab',
    state: { view: 'auto-apply', platforms: DEFAULT_PLATFORMS },
    tab: 'applications',
  },
]

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    view: 'login',
    platforms: DEFAULT_PLATFORMS,
    isLoggedIn: false,
  })
  const [demoIndex, setDemoIndex] = useState(0)
  const [progressSession, setProgressSession] = useState<ProgressWidgetState | null>(null)
  const [activeTab, setActiveTab] = useState<ExtensionTab>('boards')
  const [showRunLog, setShowRunLog] = useState(false)

  function navigate(view: View) {
    setAppState(prev => ({ ...prev, view }))
  }

  function applyDemoState(index: number) {
    const demo = DEMO_STATES[index]
    setAppState(prev => ({
      ...prev,
      ...demo.state,
      platforms: demo.state.platforms ?? prev.platforms,
    }))
    setProgressSession(demo.progress ?? null)
    setShowRunLog(demo.label === 'Live run (finished)')
    setActiveTab(demo.tab ?? 'boards')
    setDemoIndex(index)
  }

  function handleLogin(_email: string, _password: string) {
    setAppState(prev => ({ ...prev, isLoggedIn: true }))
    navigate('before-you-begin')
  }

  function handleStartAutoApply(platform: PlatformId) {
    setAppState(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: { status: 'in-progress', captchaState: 'none' },
      },
    }))
    setProgressSession({
      platform,
      applied: 0,
      skipped: 0,
      logs: [{ id: '1', message: 'Fetching jobs...' }],
    })
    setShowRunLog(true)
  }

  function handleCaptchaVerify() {
    setAppState(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        indeed: { ...prev.platforms.indeed, captchaState: 'verifying' },
      },
    }))
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        platforms: {
          ...prev.platforms,
          indeed: { ...prev.platforms.indeed, captchaState: 'success' },
        },
      }))
    }, 2000)
  }

  const hasProgress = progressSession !== null
  const isMainApp = appState.view !== 'login' && appState.view !== 'before-you-begin'

  function getBackHandler(): (() => void) | undefined {
    switch (appState.view) {
      case 'before-you-begin':
        return () => navigate('login')
      case 'auto-apply':
        return () => navigate('before-you-begin')
      case 'no-jobs':
      case 'job-history':
      case 'error':
      case 'success':
        return () => navigate('auto-apply')
      default:
        return undefined
    }
  }

  return (
    <div className="flex h-screen bg-ext-bg">
      {/* Extension panel — fixed left, full height */}
      <div style={{ width: 380 }} className="flex flex-col h-full flex-shrink-0 bg-white shadow-xl">
        <Header onClose={() => {}} onBack={getBackHandler()} />

        {isMainApp && (
          <TabBar credits={40} activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto">
          {appState.view === 'login' && (
            <LoginView
              onLogin={handleLogin}
              onGoogleLogin={() => {
                setAppState(prev => ({ ...prev, isLoggedIn: true }))
                navigate('before-you-begin')
              }}
            />
          )}
          {appState.view === 'before-you-begin' && (
            <BeforeYouBeginView onDone={() => navigate('auto-apply')} />
          )}
          {isMainApp && activeTab === 'applications' && (
            <ApplicationsView
              applications={MOCK_APPLICATIONS}
              totalCount={169}
              onRefresh={() => {}}
            />
          )}
          {isMainApp && activeTab === 'boards' && appState.view === 'auto-apply' && (
            <>
              <AutoApplyView
                platforms={appState.platforms}
                onStartAutoApply={handleStartAutoApply}
                onConnectLightforth={() => navigate('before-you-begin')}
                onCaptchaVerify={handleCaptchaVerify}
                onJobHistory={() => navigate('job-history')}
              />
              {showRunLog && <RunLogFeed entries={MOCK_RUN_LOG} finished />}
            </>
          )}
          {isMainApp && activeTab === 'boards' && appState.view === 'no-jobs' && (
            <NoJobsView onChangeFilter={() => navigate('auto-apply')} />
          )}
          {isMainApp && activeTab === 'boards' && appState.view === 'job-history' && (
            <JobHistoryView groups={MOCK_JOB_HISTORY} />
          )}
          {isMainApp && activeTab === 'boards' && appState.view === 'error' && (
            <ErrorView onCta={() => navigate('auto-apply')} />
          )}
          {isMainApp && activeTab === 'boards' && appState.view === 'success' && (
            <SuccessView onCta={() => navigate('job-history')} />
          )}
        </div>

        {/* Live progress widget — sticks to the bottom */}
        {hasProgress && activeTab === 'boards' && (
          <AutoApplyProgressWidget session={progressSession} />
        )}

        {/* Dev screen switcher */}
        <div className="border-t border-ext-border px-3 py-2.5 bg-white/95">
          <p className="text-[9px] font-bold text-ext-muted uppercase tracking-wide mb-1.5">Dev: Switch screens</p>
          <div className="flex flex-wrap gap-1">
            {DEMO_STATES.map((d, i) => (
              <button
                key={i}
                onClick={() => applyDemoState(i)}
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                  demoIndex === i
                    ? 'bg-brand text-white'
                    : 'bg-ext-row text-ext-muted hover:bg-brand/10 hover:text-brand'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — empty canvas */}
      <div className="flex-1" />
    </div>
  )
}
