import { InterviewConfigureView } from '@/features/interview/interview-prep-view'
import { interviewSession } from '@/mocks/interview'

export function InterviewConfigurePage() {
  return (
    <InterviewConfigureView
      homeHref="/v3/app"
      uploadHref="/v3/interview-prep"
      voiceHref="/v3/interview-prep/voice"
      session={interviewSession}
    />
  )
}
