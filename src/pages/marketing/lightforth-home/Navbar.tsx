import { motion } from 'framer-motion'
import LightforthLogo from '@/components/shared/LightforthLogo'

export function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 md:px-8 py-4"
    >
      <a className="hidden md:inline text-sm hover:underline" href="tel:+19018884689">
        +1 (901) 888 4689
      </a>

      <div className="flex mx-auto flex-col items-center gap-1 text-center">
        <LightforthLogo className="h-8" />
        <p className="text-sm font-light text-slate-500">The official job landing engine</p>
      </div>

      <button
        onClick={onGetStarted}
        className="hidden md:inline-block text-white text-sm font-semibold bg-primary py-3 px-4 rounded-lg transition duration-300 hover:bg-primary/90"
      >
        Get Started
      </button>
    </motion.nav>
  )
}
