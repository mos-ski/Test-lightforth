const PENDING_JOB_DESCRIPTION_KEY = 'lf_resume_pending_jd'

export function getPendingResumeJobDescription(): string | null {
  try {
    return localStorage.getItem(PENDING_JOB_DESCRIPTION_KEY)
  } catch {
    return null
  }
}

export function setPendingResumeJobDescription(value: string): void {
  try {
    if (value.trim()) localStorage.setItem(PENDING_JOB_DESCRIPTION_KEY, value)
    else localStorage.removeItem(PENDING_JOB_DESCRIPTION_KEY)
  } catch {
    // ignore write failures (private browsing, storage disabled, etc.)
  }
}

export function clearPendingResumeJobDescription(): void {
  try {
    localStorage.removeItem(PENDING_JOB_DESCRIPTION_KEY)
  } catch {
    // ignore
  }
}
