import type { ContextDocumentRow } from '@/contracts/documents.draft'

export const contextDocumentRows: readonly ContextDocumentRow[] = Array.from({ length: 6 }, (_, index) => ({
  id: `context-document-${index + 1}`,
  name: 'Darnell_Smith_Resume.pdf',
  kind: 'PDF',
  sizeOrUrl: '124 KB',
  addedAtLabel: 'August 13th 2026, 12:49 pm',
}))
