import type { CaptchaState, PlatformId, PlatformStatus } from '../types'
import { IndeedIcon, GlassdoorIcon, WorkableIcon, LinkedInIcon } from './PlatformIcons'
import { CloudflareWidget } from './CloudflareWidget'

interface PlatformRowProps {
  platform: PlatformId
  status: PlatformStatus
  errorMessage?: string
  captchaState?: CaptchaState
  onStartAutoApply?: (platform: PlatformId) => void
  onConnectLightforth?: () => void
  onCaptchaVerify?: () => void
}

const PLATFORM_LABELS: Record<PlatformId, string> = {
  indeed: 'Indeed',
  glassdoor: 'Glassdoor',
  workable: 'Workable',
  linkedin: 'LinkedIn',
}

export function PlatformRow({
  platform,
  status,
  errorMessage,
  captchaState,
  onStartAutoApply,
  onConnectLightforth,
  onCaptchaVerify,
}: PlatformRowProps) {
  const showCaptcha = platform === 'indeed' && captchaState && captchaState !== 'none'

  return (
    <div className={`rounded-xl overflow-hidden ${showCaptcha ? 'bg-ext-row' : ''}`}>
      <div className={`flex items-center justify-between px-3 py-3 gap-3 ${showCaptcha ? '' : 'bg-ext-row rounded-xl'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <PlatformIcon platform={platform} />
          <span className="text-sm font-semibold text-ink truncate">
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
        <PlatformAction
          platform={platform}
          status={status}
          onStartAutoApply={onStartAutoApply}
          onConnectLightforth={onConnectLightforth}
        />
      </div>

      {showCaptcha && (
        <div className="px-3 pb-3">
          <CloudflareWidget state={captchaState!} onVerify={onCaptchaVerify} />
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-[#EF4444] font-medium px-3 pb-2 -mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function PlatformIcon({ platform }: { platform: PlatformId }) {
  switch (platform) {
    case 'indeed': return <IndeedIcon />
    case 'glassdoor': return <GlassdoorIcon />
    case 'workable': return <WorkableIcon />
    case 'linkedin': return <LinkedInIcon />
  }
}

function PlatformAction({
  platform,
  status,
  onStartAutoApply,
  onConnectLightforth,
}: Pick<PlatformRowProps, 'platform' | 'status' | 'onStartAutoApply' | 'onConnectLightforth'>) {
  if (status === 'in-progress') {
    return (
      <span className="flex items-center gap-1.5 bg-[#EEEEEE] text-[#888] text-[11px] font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap">
        Application in progress
        <svg className="animate-spin w-3 h-3" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="14 10" strokeLinecap="round" />
        </svg>
      </span>
    )
  }

  if (platform === 'workable') {
    return (
      <button onClick={onConnectLightforth} className="btn-connect">
        Connect to Lightforth
      </button>
    )
  }

  return (
    <button onClick={() => onStartAutoApply?.(platform)} className="btn-action">
      Start AutoApply
    </button>
  )
}
