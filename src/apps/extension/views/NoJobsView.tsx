interface NoJobsViewProps {
  onChangeFilter: () => void
}

export function NoJobsView({ onChangeFilter }: NoJobsViewProps) {
  return (
    <div className="px-6 pb-8 flex flex-col items-center pt-8">
      <SadFolderIllustration />

      <h2 className="text-2xl font-bold text-ink mt-5 mb-3">No Jobs</h2>
      <p className="text-sm text-ext-muted text-center leading-snug max-w-[220px] mb-8">
        We couldn't find job for you right now, You might need to change your search filter in the Lightforth platform
      </p>

      <button onClick={onChangeFilter} className="btn-outline text-sm">
        Change my filter
      </button>
    </div>
  )
}

function SadFolderIllustration() {
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
      {/* Folder back */}
      <path
        d="M8 30C8 26.686 10.686 24 14 24H44l6 8h36c3.314 0 6 2.686 6 6v40c0 3.314-2.686 6-6 6H14c-3.314 0-6-2.686-6-6V30z"
        fill="#1D9BF0"
      />
      {/* Folder front */}
      <path
        d="M8 38C8 34.686 10.686 32 14 32H86c3.314 0 6 2.686 6 6v36c0 3.314-2.686 6-6 6H14c-3.314 0-6-2.686-6-6V38z"
        fill="#2DB3FF"
      />
      {/* Paper sticking out */}
      <rect x="38" y="14" width="24" height="28" rx="3" fill="white" opacity="0.9" />
      <rect x="38" y="14" width="24" height="28" rx="3" stroke="#1D9BF0" strokeWidth="1" />
      <line x1="42" y1="22" x2="58" y2="22" stroke="#1D9BF0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="27" x2="58" y2="27" stroke="#1D9BF0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="32" x2="52" y2="32" stroke="#1D9BF0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sad face */}
      <circle cx="42" cy="55" r="3.5" fill="white" />
      <circle cx="58" cy="55" r="3.5" fill="white" />
      {/* Sad mouth */}
      <path
        d="M42 67c2-4 14-4 16 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
