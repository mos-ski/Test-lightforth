import { CopilotCompleteView } from '@/features/copilot/interview-copilot-view'

export function CopilotCompletePage() {
  return (
    <CopilotCompleteView
      homeHref="/v3/app"
      sessionHref="/v3/interview-copilot/session"
      historyHref="/v3/interview-copilot/history"
    />
  )
}
