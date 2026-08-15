import { CopilotReportView } from '@/features/copilot/interview-copilot-view'
import { copilotReport } from '@/mocks/copilot'

export function CopilotReportPage() {
  return (
    <CopilotReportView
      homeHref="/v3/app"
      historyHref="/v3/interview-copilot/history"
      report={copilotReport}
    />
  )
}
