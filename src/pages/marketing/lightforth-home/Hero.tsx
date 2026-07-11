import { motion } from 'framer-motion'
import { Button } from './ui'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="my-10 pb-10 md:pb-20 px-4">
      <div className="max-w-[950px] mx-auto text-center space-y-8">
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
          We'll Get You the Job or Raise You Deserve — Faster
        </motion.h1>

        <motion.p variants={fadeUp} className="max-w-[600px] mx-auto text-base text-gray-700">
          Go from undervalued and stuck to the must-hire candidate, with an AI resume builder, auto-apply, and a live interview copilot that has your back.
        </motion.p>

        <motion.div variants={fadeUp} className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button className="w-full sm:w-auto" onClick={onGetStarted}>
            See Plans
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" onClick={onGetStarted}>
            Watch How It Works
          </Button>
        </motion.div>

        <motion.div variants={fadeUp} className="hidden md:block w-full">
          <img
            src="/lightforth-home/images/partner.svg"
            alt="Partner logos"
            className="mx-auto w-full max-w-3xl object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
