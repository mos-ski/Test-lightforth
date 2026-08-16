import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotConfigureView } from '@/features/copilot/interview-copilot-view'
import { copilotSetup } from '@/mocks/copilot'
import { contextDocumentRows } from '@/mocks/documents'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotConfigurePage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  const setup = { ...copilotSetup, mode }

  const skipUpload = mode === 'coding' || mode === 'meeting'

  return (
    <CopilotConfigureView
      homeHref="/v3/app"
      uploadHref={skipUpload ? '/v3/app' : '/v3/interview-copilot'}
      preferencesHref={skipUpload ? '/v3/interview-copilot/session' : '/v3/interview-copilot/preferences'}
      setup={setup}
      knowledgeBaseDocuments={contextDocumentRows}
    />
  )
}
