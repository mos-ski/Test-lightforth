import { CopilotPermissionView } from '@/features/copilot/interview-copilot-view'
import { copilotShareSteps } from '@/mocks/copilot'

export function CopilotShareScreenPage() {
  return (
    <CopilotPermissionView
      homeHref="/v3/app"
      backHref="/v3/interview-copilot/preferences"
      nextHref="/v3/interview-copilot/ready"
      steps={copilotShareSteps}
      actionLabel="Continue"
    />
  )
}
