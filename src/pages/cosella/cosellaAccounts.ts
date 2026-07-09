// Mock, localStorage-backed account registry for Cosella logins —
// fully separate from src/pages/desktopCopilot/mockAccounts.ts.

export type AccountType = 'cosella-admin' | 'cosella-member'

export interface CosellaAccountRecord {
  accountType: AccountType
  orgName?: string
}

const STORAGE_KEY = 'cosella-mock-accounts'

function readStore(): Record<string, CosellaAccountRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, CosellaAccountRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore — mock persistence only
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getCosellaAccount(email: string): CosellaAccountRecord | null {
  const store = readStore()
  return store[normalizeEmail(email)] ?? null
}

export function setCosellaAccount(email: string, record: CosellaAccountRecord): void {
  const store = readStore()
  store[normalizeEmail(email)] = record
  writeStore(store)
}

const ACTIVE_MEMBER_KEY = 'cosella-active-member'

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
