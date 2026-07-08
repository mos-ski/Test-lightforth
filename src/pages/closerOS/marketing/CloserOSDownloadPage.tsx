import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Apple, Check, MonitorDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

function mockDownload(os: string) {
  toast.success(`Downloading Closer OS for ${os}...`, {
    description: 'This is a prototype — no file is actually downloading.',
  })
}

export default function CloserOSDownloadPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md text-center">
        <LightforthLogo className="mx-auto" to="/closer-os" />

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-6 w-6 text-emerald-500" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">You're all set</h1>
          <p className="mt-1 text-sm text-slate-500">Download Closer OS to your computer to get started.</p>

          <div className="mt-7 space-y-3">
            <Button size="lg" variant="outline" className="w-full" onClick={() => mockDownload('Mac')}>
              <Apple className="h-4 w-4" /> Download for Mac
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => mockDownload('Windows')}>
              <MonitorDown className="h-4 w-4" /> Download for Windows
            </Button>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-7">
            <p className="text-sm text-slate-500">Already downloaded it?</p>
            <Button
              size="lg"
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => navigate(`/closer-os/sign-in${email ? `?email=${encodeURIComponent(email)}` : ''}`)}
            >
              Open Closer OS
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
