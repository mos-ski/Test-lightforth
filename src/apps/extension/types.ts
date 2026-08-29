export type View =
  | 'login'
  | 'before-you-begin'
  | 'auto-apply'
  | 'no-jobs'
  | 'job-history'
  | 'error'
  | 'success'

export type CaptchaState = 'none' | 'verify' | 'verifying' | 'success' | 'failure'

export type PlatformId = 'indeed' | 'glassdoor' | 'workable' | 'linkedin'

export type PlatformStatus = 'idle' | 'in-progress' | 'error'

export interface PlatformState {
  status: PlatformStatus
  errorMessage?: string
  captchaState?: CaptchaState
}

export interface AppState {
  view: View
  platforms: Record<PlatformId, PlatformState>
  isLoggedIn: boolean
}

export interface JobEntry {
  id: string
  title: string
  company: string
  url: string
  logoColor: string
  logoInitial: string
  status: 'success' | 'failed'
  errorMessage?: string
}

export interface JobHistoryGroup {
  platform: PlatformId
  jobs: JobEntry[]
}

export type ApplicationStatus = 'submitted' | 'failed' | 'skipped'

export interface ApplicationRecord {
  id: string
  title: string
  company: string
  timeLabel: string
  source: PlatformId
  status: ApplicationStatus
  reason?: string
  postingUrl?: string
}

export type RunLogLevel = 'info' | 'warning' | 'error'

export interface RunLogEntry {
  id: string
  timeLabel: string
  level: RunLogLevel
  title?: string
  message: string
}
