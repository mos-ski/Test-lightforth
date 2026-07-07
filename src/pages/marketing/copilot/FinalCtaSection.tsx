import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCtaSection({ isWaitlist, onPrimaryCta }: { isWaitlist: boolean; onPrimaryCta: () => void }) {
  return (
    <section
      className="relative overflow-hidden border-t border-white/5 bg-[#061a3a] py-24 text-center text-white"
      style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      {/* soft accent glows, pure CSS — no imported artwork */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0494fc]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-sky-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-[#0494fc]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-2xl px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          <Zap className="h-3.5 w-3.5" />
          {isWaitlist ? 'Early access opening soon' : 'Ready in minutes'}
        </p>

        <h2 className="mx-auto mt-6 max-w-xl text-3xl font-black leading-[1.15] tracking-tight sm:text-4xl">
          Your next interview is coming up.{' '}
          <span className="underline decoration-sky-400 decoration-4 underline-offset-8">Be ready for it.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/70">
          {isWaitlist
            ? "Get on the list now and you'll be the first to know the moment Copilot opens — before the interview you're dreading shows up on your calendar."
            : "Set it up before your next call, not during it. Interview, Coding, and Meeting Copilot are ready the moment you press start."}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="group bg-white text-[#061a3a] hover:bg-sky-50" onClick={onPrimaryCta}>
            {isWaitlist ? 'Join the waitlist' : 'See plans'}
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <p className="text-sm font-medium text-white/50">
            {isWaitlist ? 'No spam, just a heads-up when we open.' : 'Cancel anytime. No questions asked.'}
          </p>
        </div>
      </div>
    </section>
  )
}
