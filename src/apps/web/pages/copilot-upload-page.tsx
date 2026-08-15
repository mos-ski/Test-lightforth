import { CopilotUploadView } from '@/features/copilot/interview-copilot-view'

export function CopilotUploadPage() {
  return (
    <CopilotUploadView
      homeHref="/v3/app"
      configureHref="/v3/interview-copilot/configure"
      historyHref="/v3/interview-copilot/history"
    />
  )
}
