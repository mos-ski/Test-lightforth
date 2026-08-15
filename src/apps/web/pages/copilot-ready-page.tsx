import { CopilotPermissionView } from '@/features/copilot/interview-copilot-view'
import { copilotReadySteps } from '@/mocks/copilot'

export function CopilotReadyPage() {
  return (
    <CopilotPermissionView
      homeHref="/v3/app"
      backHref="/v3/interview-copilot/share-screen"
      nextHref="/v3/interview-copilot/session"
      steps={copilotReadySteps}
      previewSrc="/v3-assets/copilot-screen-preview.png"
      actionLabel="Start Interview"
    />
  )
}
