import { getAccount } from './mockAccounts'
import { getOrgByAdminEmail, findMemberByEmail } from '@/pages/sales/mockOrg'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

export interface ContextDoc {
  id: string
  name: string
  type: string
}

const PERSONAL_CONTEXT_DOCS: ContextDoc[] = MOCK_CONTEXT_SOURCES.map(s => ({ id: s.id, name: s.name, type: s.type }))

export function resolveContextDocs(email: string): ContextDoc[] {
  const account = email ? getAccount(email) : null

  if (account?.accountType === 'enterprise-admin' || account?.accountType === 'enterprise-member') {
    const org = getOrgByAdminEmail(email) ?? findMemberByEmail(email)?.org ?? null
    if (org) {
      return org.knowledgeBase.documents
        .filter(d => d.enabled)
        .map(d => ({ id: d.id, name: d.name, type: 'Knowledge Base' }))
    }
  }

  return PERSONAL_CONTEXT_DOCS
}
