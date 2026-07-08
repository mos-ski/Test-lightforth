// Mock, localStorage-backed account registry for Closer OS logins —
// fully separate from src/pages/desktopCopilot/mockAccounts.ts.

export type AccountType = 'closer-os-admin' | 'closer-os-member'

export interface CloserAccountRecord {
  accountType: AccountType
  orgName?: string
}

const STORAGE_KEY = 'closer-os-mock-accounts'

function readStore(): Record<string, CloserAccountRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, CloserAccountRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore — mock persistence only
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getCloserAccount(email: string): CloserAccountRecord | null {
  const store = readStore()
  return store[normalizeEmail(email)] ?? null
}

export function setCloserAccount(email: string, record: CloserAccountRecord): void {
  const store = readStore()
  store[normalizeEmail(email)] = record
  writeStore(store)
}

const ACTIVE_MEMBER_KEY = 'closer-os-active-member'

export function setActiveMemberEmail(email: string): void {
  try {
    localStorage.setItem(ACTIVE_MEMBER_KEY, normalizeEmail(email))
  } catch {
    // ignore
  }
}

export function getActiveMemberEmail(): string | null {
  try {
    return localStorage.getItem(ACTIVE_MEMBER_KEY)
  } catch {
    return null
  }
}
