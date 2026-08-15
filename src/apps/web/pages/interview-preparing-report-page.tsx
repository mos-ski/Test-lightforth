import { InterviewPreparingReportView } from '@/features/interview/interview-prep-view'
import { reportSteps } from '@/mocks/interview'

export function InterviewPreparingReportPage() {
  return (
    <InterviewPreparingReportView
      homeHref="/v3/app"
      completeHref="/v3/interview-prep/complete"
      reportHref="/v3/interview-prep/report"
      steps={reportSteps}
    />
  )
}
