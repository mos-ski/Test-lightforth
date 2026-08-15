import { CopilotPreferencesView } from '@/features/copilot/interview-copilot-view'
import { copilotSetup } from '@/mocks/copilot'

export function CopilotPreferencesPage() {
  return (
    <CopilotPreferencesView
      homeHref="/v3/app"
      configureHref="/v3/interview-copilot/configure"
      shareHref="/v3/interview-copilot/share-screen"
      setup={copilotSetup}
    />
  )
}
