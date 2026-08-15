import { InterviewSessionView } from '@/features/interview/interview-prep-view'
import { interviewLiveSession } from '@/mocks/interview'

export function InterviewSessionPage() {
  return (
    <InterviewSessionView
      voiceHref="/v3/interview-prep/voice"
      completeHref="/v3/interview-prep/complete"
      session={interviewLiveSession}
    />
  )
}
