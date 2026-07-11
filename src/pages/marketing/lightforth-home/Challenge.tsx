import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Pill, Button } from './ui'

const milestones = [
  {
    title: 'Day 1',
    image: '/lightforth-home/images/challenge.png',
    points: [
      "You'll finally see how much you've been leaving on the table — and fix it.",
      "You'll have a resume that commands interviews, not hope.",
    ],
  },
  {
    title: 'Week 1',
    image: '/lightforth-home/images/challenge3.png',
    points: [
      "You'll have the confidence to apply for roles you thought were out of reach.",
      'Your outreach starts getting real replies from decision-makers.',
    ],
  },
  {
    title: 'Month 1',
    image: '/lightforth-home/images/challenge2.png',
    points: [
      'Interview requests start coming in from companies in your field.',
      "You'll know how to negotiate salary like a pro.",
    ],
  },
]

export function Challenge({ onGetStarted }: { onGetStarted: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto space-y-5 mb-14 max-w-4xl text-center">
          <Pill>What changes when you use Lightforth</Pill>
          <h2 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            Here's What Breaking Free Actually Looks Like
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[60%,40%]">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={milestones[activeIndex].image}
                src={milestones[activeIndex].image}
                alt={`Image for ${milestones[activeIndex].title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-2xl object-cover aspect-[590/350]"
              />
            </AnimatePresence>
          </div>

          <div className="w-full h-full flex flex-col justify-between gap-4">
            {milestones.map((milestone, index) => {
              const isActive = activeIndex === index
              return (
                <motion.button
                  key={milestone.title}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left cursor-pointer w-full rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-black/5 ${
                    isActive ? 'border-t-2 border-primary bg-[#F1FAFF]' : 'border border-transparent bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-primary' : 'bg-gray-300'}`}>
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0A2A60]">After {milestone.title}</h3>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        style={{ overflow: 'hidden' }}
                        className="space-y-2"
                      >
                        {milestone.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-gray-600 text-sm font-medium">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                            {point}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="mt-16 text-center max-w-md mx-auto">
          <Button onClick={onGetStarted}>See Plans</Button>
        </div>
      </div>
    </div>
  )
}
