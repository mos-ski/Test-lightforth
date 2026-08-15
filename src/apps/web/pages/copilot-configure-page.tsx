import { CopilotConfigureView } from '@/features/copilot/interview-copilot-view'
import { copilotSetup } from '@/mocks/copilot'

export function CopilotConfigurePage() {
  return (
    <CopilotConfigureView
      homeHref="/v3/app"
      uploadHref="/v3/interview-copilot"
      preferencesHref="/v3/interview-copilot/preferences"
      setup={copilotSetup}
    />
  )
}
