import { ResumeUploadView } from '@/features/resume/resume-builder-view'

export function ResumeUploadPage() {
  return <ResumeUploadView homeHref="/v3/app" configureHref="/v3/resume/configure" historyHref="/v3/resume/history" />
}
