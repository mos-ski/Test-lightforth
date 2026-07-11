import { motion } from 'framer-motion'

const problems = [
  { title: 'You feel stuck and unclear about your next career move', image: '/lightforth-home/images/stuck1.png' },
  { title: 'You are tired of guessing what hiring managers want', image: '/lightforth-home/images/stuck2.png' },
  { title: 'Interview and negotiation days get you anxious and terrified', image: '/lightforth-home/images/stuck3.png' },
  { title: "You dread Mondays and only look forward to Friday", image: '/lightforth-home/images/stuck4.png' },
  { title: 'Stuck on the same salary for years, or never got a raise at all', image: '/lightforth-home/images/stuck5.png' },
  { title: "A new hire you're better than is getting paid more", image: '/lightforth-home/images/stuck6.png' },
  { title: 'Worried that AI is coming for your job next', image: '/lightforth-home/images/stuck7.png' },
  { title: 'Got a raise, but still feel cheated', image: '/lightforth-home/images/stuck8.png' },
]

export function ProblemGrid() {
  return (
    <section className="bg-[#F9FBFF] py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-slate-800">
          Sound like your career right now?
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-sm"
            >
              <img src={p.image} alt={p.title} className="h-28 w-full object-cover" />
              <p className="p-3 text-xs sm:text-sm font-medium text-[#0A2A60] leading-snug">{p.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
