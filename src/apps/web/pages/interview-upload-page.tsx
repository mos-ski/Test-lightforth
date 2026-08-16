import { InterviewUploadView } from '@/features/interview/interview-prep-view'
import { resumeHistoryRows } from '@/mocks/resume'

export function InterviewUploadPage() {
  return (
    <InterviewUploadView
      homeHref="/v3/app"
      configureHref="/v3/interview-prep/configure"
      historyHref="/v3/interview-prep/history"
      savedResumes={resumeHistoryRows}
    />
  )
}
