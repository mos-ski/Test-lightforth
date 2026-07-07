import { Mic, Phone, Video } from 'lucide-react'

function CallTile({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div className="relative flex items-end justify-center pb-10" style={{ background: gradient }}>
      <div className="flex flex-col items-center">
        <div className="h-11 w-11 rounded-full bg-white/15" />
        <div className="-mt-1 h-9 w-20 rounded-t-full bg-white/10" />
      </div>
      <span
        className="absolute bottom-2 left-2 rounded px-2 py-1 text-[10px] font-medium text-white"
        style={{ background: 'rgba(0,0,0,0.45)' }}
      >
        {name}
      </span>
    </div>
  )
}

export function CallBackground() {
  return (
    <div aria-hidden="true" className="relative h-full w-full overflow-hidden" style={{ background: '#0c1d48' }}>
      <div className="grid h-full grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <CallTile name="You" gradient="linear-gradient(160deg, #1a2f5c 0%, #0c1d48 100%)" />
        <CallTile name="Prospect" gradient="linear-gradient(160deg, #14294f 0%, #0a1836 100%)" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex h-9 items-center justify-center gap-2.5" style={{ background: 'rgba(10,20,45,0.85)' }}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Mic className="h-3 w-3 text-white/70" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Video className="h-3 w-3 text-white/70" />
        </span>
        <span className="flex h-6 w-14 items-center justify-center rounded-full bg-red-500">
          <Phone className="h-3 w-3 rotate-[135deg] text-white" />
        </span>
      </div>
    </div>
  )
}
