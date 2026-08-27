import type { CaptchaState } from '../types'

interface CloudflareWidgetProps {
  state: CaptchaState
  onVerify?: () => void
}

export function CloudflareWidget({ state, onVerify }: CloudflareWidgetProps) {
  return (
    <div className="mt-2 mx-0 border border-[#E0E0E0] rounded-lg bg-white flex items-center justify-between px-4 py-3 gap-3">
      <div className="flex items-center gap-3 flex-1">
        {state === 'verify' && (
          <>
            <button
              onClick={onVerify}
              className="w-6 h-6 border-2 border-[#C0C0C0] rounded flex-shrink-0 hover:border-[#0085FF] transition-colors"
            />
            <span className="text-[13px] text-[#333]">Verify you are human</span>
          </>
        )}
        {state === 'verifying' && (
          <>
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <svg
                className="animate-captcha-spin"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="9"
                  stroke="#0085FF"
                  strokeWidth="2"
                  strokeDasharray="28 56"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[13px] text-[#333]">Verifying...</span>
          </>
        )}
        {state === 'success' && (
          <>
            <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path
                  d="M1 5.5L5 9.5L13 1.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#22C55E]">Success!</span>
          </>
        )}
        {state === 'failure' && (
          <>
            <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3l6 6"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#EF4444]">Failure!</span>
          </>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <CloudflareLogo />
        <span className="text-[9px] text-[#999]">Privacy · Terms</span>
      </div>
    </div>
  )
}

function CloudflareLogo() {
  return (
    <svg width="64" height="14" viewBox="0 0 100 22" fill="none">
      <path
        d="M62.6 8.9c-.1-.4-.5-.7-1-.7H49.8l-1.5 5.4h12.4c.4 0 .8-.3 1-.7l.9-4z"
        fill="#F6821F"
      />
      <path
        d="M56.2 14.9c-.3 1.1-1.3 1.9-2.4 1.9H38.6l.8-2.8H56.2z"
        fill="#FBAD41"
      />
      <path
        d="M65.3 6.4c-.1-.4-.5-.7-1-.7H51.5l-.6 2.5H65l.3-1.8z"
        fill="#F6821F"
      />
      <text x="0" y="16" fontSize="14" fontWeight="600" fill="#404040" fontFamily="Arial, sans-serif">CLOUDFLARE</text>
    </svg>
  )
}
