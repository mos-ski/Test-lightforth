import { AutoApplyUploadView } from '@/features/auto-apply/auto-apply-view'
import { resumeHistoryRows } from '@/mocks/resume'

export function AutoApplyUploadPage() {
  return (
    <AutoApplyUploadView
      homeHref="/v3/app"
      contactHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      savedResumes={resumeHistoryRows}
    />
  )
}
