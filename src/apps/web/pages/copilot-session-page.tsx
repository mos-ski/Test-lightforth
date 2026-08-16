import { useSearchParams } from 'react-router-dom'

import type { CopilotMode } from '@/contracts/copilot.draft'
import { CopilotLiveView } from '@/features/copilot/interview-copilot-view'
import { copilotCodingBank, copilotInterviewTranscript, copilotLiveSession, copilotMeetingTranscript } from '@/mocks/copilot'

export function CopilotSessionPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode')
  const modeOverride: CopilotMode | null = mode === 'coding' || mode === 'meeting' ? mode : null
  const session = modeOverride ? { ...copilotLiveSession, mode: modeOverride } : copilotLiveSession

  return (
    <CopilotLiveView
      completeHref="/v3/interview-copilot/complete"
      session={session}
      isLoading={params.get('state') === 'loading'}
      transcriptBank={session.mode === 'meeting' ? copilotMeetingTranscript : copilotInterviewTranscript}
      codingBank={copilotCodingBank}
    />
  )
}
