import { CopilotLiveView } from '@/features/copilot/interview-copilot-view'
import { copilotLiveSession } from '@/mocks/copilot'

export function CopilotSessionPage() {
  return <CopilotLiveView completeHref="/v3/interview-copilot/complete" session={copilotLiveSession} />
}
