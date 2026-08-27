import type { CaptchaState, PlatformId, PlatformState } from '../types'
import { PlatformRow } from '../components/PlatformRow'

interface AutoApplyViewProps {
  platforms: Record<PlatformId, PlatformState>
  onStartAutoApply: (platform: PlatformId) => void
  onConnectLightforth: () => void
  onCaptchaVerify: () => void
  onJobHistory: () => void
}

const PLATFORM_ORDER: PlatformId[] = ['indeed', 'glassdoor', 'workable', 'linkedin']

export function AutoApplyView({
  platforms,
  onStartAutoApply,
  onConnectLightforth,
  onCaptchaVerify,
  onJobHistory,
}: AutoApplyViewProps) {
  const hasAnyInProgress = PLATFORM_ORDER.some(
    p => platforms[p].status === 'in-progress'
  )

  return (
    <div className="px-5 pb-8">
      <h2 className="text-xl font-bold text-ink text-center mb-1">Start AutoApply</h2>
      <p className="text-sm text-ext-muted text-center mb-6">
        Select a platform and start AutoApply
      </p>

      <div className="flex flex-col gap-2.5">
        {PLATFORM_ORDER.map(platform => (
          <PlatformRow
            key={platform}
            platform={platform}
            status={platforms[platform].status}
            errorMessage={platforms[platform].errorMessage}
            captchaState={platforms[platform].captchaState as CaptchaState | undefined}
            onStartAutoApply={onStartAutoApply}
            onConnectLightforth={onConnectLightforth}
            onCaptchaVerify={onCaptchaVerify}
          />
        ))}
      </div>

      {hasAnyInProgress && (
        <>
          <div className="border-t border-ext-border mt-8 mb-4" />
          <div className="flex justify-start">
            <button
              onClick={onJobHistory}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              Job history
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
