import { useSearchParams } from 'react-router-dom'

import { CopilotLiveView } from '@/features/copilot/interview-copilot-view'
import { copilotLiveSession } from '@/mocks/copilot'

export function CopilotSessionPage() {
  const [params] = useSearchParams()

  return <CopilotLiveView completeHref="/v3/interview-copilot/complete" session={copilotLiveSession} isLoading={params.get('state') === 'loading'} />
}
