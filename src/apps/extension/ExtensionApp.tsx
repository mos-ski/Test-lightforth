import { useState } from 'react'
import type { AppState, CaptchaState, JobHistoryGroup, PlatformId, View } from './types'
import type { ProgressWidgetState } from './components/AutoApplyProgressWidget'
import { Header } from './components/Header'
import { AutoApplyProgressWidget } from './components/AutoApplyProgressWidget'
import { LoginView } from './views/LoginView'
import { BeforeYouBeginView } from './views/BeforeYouBeginView'
import { AutoApplyView } from './views/AutoApplyView'
import { NoJobsView } from './views/NoJobsView'
import { JobHistoryView } from './views/JobHistoryView'
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

const DEMO_STATES: { label: string; state: Partial<AppState>; progress?: ProgressWidgetState }[] = [
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
]

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    view: 'login',
    platforms: DEFAULT_PLATFORMS,
    isLoggedIn: false,
  })
  const [demoIndex, setDemoIndex] = useState(0)
  const [progressSession, setProgressSession] = useState<ProgressWidgetState | null>(null)

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
    <div className="min-h-screen bg-ext-bg">
      <div className="h-[1100px] w-[488px] overflow-visible">
        <div className="flex w-[508px] origin-top-left scale-[0.82] flex-col">
      <div
        className="mx-5 mt-5 flex h-[1148px] w-[476px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
      >
        <Header onClose={() => window.close()} onBack={getBackHandler()} />

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto">
          {appState.view === 'login' && (
            <LoginView
              onLogin={handleLogin}
            />
          )}
          {appState.view === 'before-you-begin' && (
            <BeforeYouBeginView onDone={() => navigate('auto-apply')} />
          )}
          {appState.view === 'auto-apply' && (
            <AutoApplyView
              platforms={appState.platforms}
              onStartAutoApply={handleStartAutoApply}
              onConnectLightforth={() => navigate('before-you-begin')}
              onCaptchaVerify={handleCaptchaVerify}
              onJobHistory={() => navigate('job-history')}
            />
          )}
          {appState.view === 'no-jobs' && (
            <NoJobsView onChangeFilter={() => navigate('auto-apply')} />
          )}
          {appState.view === 'job-history' && (
            <JobHistoryView groups={MOCK_JOB_HISTORY} />
          )}
          {appState.view === 'error' && (
            <ErrorView onCta={() => navigate('auto-apply')} />
          )}
          {appState.view === 'success' && (
            <SuccessView onCta={() => navigate('job-history')} />
          )}
        </div>

        {/* Live progress widget — sticks to the bottom of the card */}
        {hasProgress && (
          <AutoApplyProgressWidget session={progressSession} />
        )}
      </div>

      {/* Dev screen switcher — remove before shipping */}
      <div className="px-3 pb-3">
        <div className="bg-white/80 rounded-xl px-3 py-2.5 flex flex-col gap-1.5">
          <p className="text-[9px] font-bold text-ext-muted uppercase tracking-wide">Dev: Switch screens</p>
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
        </div>
      </div>
    </div>
  )
}
