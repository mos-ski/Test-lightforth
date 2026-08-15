import { InterviewUploadView } from '@/features/interview/interview-prep-view'

export function InterviewUploadPage() {
  return <InterviewUploadView homeHref="/v3/app" configureHref="/v3/interview-prep/configure" historyHref="/v3/interview-prep/history" />
}
