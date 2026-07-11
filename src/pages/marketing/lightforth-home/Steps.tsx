import { motion } from 'framer-motion'
import { Search, FileText, Target, Smile } from 'lucide-react'
import { Pill } from './ui'

const steps = [
  {
    title: 'Reflect',
    description:
      "We'll help you make peace with your past and rediscover what actually makes you valuable. You've done more than you think.",
    icon: Search,
  },
  {
    title: 'Rebuild',
    description:
      'No more Googling "how to write a resume." Together we shape your story into something that feels real, honest, and strong — so you get seen, not ignored.',
    icon: FileText,
  },
  {
    title: 'Reposition',
    description:
      "Walk into interviews with confidence. Whether it's a call, a bio, or a raise request, you'll talk about your worth in a way that feels natural, not rehearsed.",
    icon: Target,
  },
  {
    title: 'Run',
    description: "You'll finally land the offer or the raise you deserve — not the one you feel forced to settle for.",
    icon: Smile,
  },
]

export function Steps() {
  return (
    <section className="relative bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl space-y-5 text-center">
          <Pill>Trapped in the Same Job, Same Pay?</Pill>
          <h2 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            We'll Work With You Until You Land That Job or Get the Raise That Felt Out of Reach
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col items-center text-center gap-4 rounded-2xl border border-gray-100 bg-[#F1FAFF] p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2A60]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
