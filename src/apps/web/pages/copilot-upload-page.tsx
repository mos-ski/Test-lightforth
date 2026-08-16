import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotUploadView } from '@/features/copilot/interview-copilot-view'
import { resumeHistoryRows } from '@/mocks/resume'

const VALID_MODES: readonly CopilotMode[] = ['interview', 'coding', 'meeting']

export function CopilotUploadPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const mode = (VALID_MODES as readonly string[]).includes(requestedMode ?? '') ? (requestedMode as CopilotMode) : 'interview'

  return (
    <CopilotUploadView
      homeHref="/v3/app"
      configureHref="/v3/interview-copilot/configure"
      historyHref="/v3/interview-copilot/history"
      mode={mode}
      savedResumes={resumeHistoryRows}
    />
  )
}
