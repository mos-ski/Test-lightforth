import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pill } from './ui'

const testimonials = [
  { tag: 'GOT A RAISE', quote: '"I was playing small. Now I\'m owning my value."', name: 'Tariq', role: 'Project Lead', image: 'https://placehold.co/400x500/E0E7FF/374151?text=Tariq' },
  { tag: 'NEW JOB', quote: '"My strategy was broken. Copilot fixed it."', name: 'Adam', role: 'Tech Manager', image: 'https://placehold.co/400x500/DBEAFE/1D4ED8?text=Adam' },
  { tag: 'GOT A RAISE', quote: '"From overlooked to overpaid in 3 weeks."', name: 'Maria', role: 'Data Analyst', image: 'https://placehold.co/400x500/FEF3C7/92400E?text=Maria' },
  { tag: 'NEW JOB', quote: '"9 interviews in 18 days, 2 offers 3 days later."', name: 'Mia Chen', role: 'UX Designer', image: 'https://placehold.co/400x500/FCE7F3/9D2667?text=Mia' },
  { tag: 'GOT A RAISE', quote: '"Got a new job, landed a raise in my former role first."', name: 'You could be next', role: 'Software Engineer', image: 'https://placehold.co/400x500/D1FAE5/065F46?text=You' },
]

export function Testimonials() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto space-y-4 sm:space-y-5">
          <Pill>What it feels like</Pill>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-black tracking-tight leading-tight">
            Every Time Someone Bet Against Their Own Career, Lightforth Proved Them Wrong.
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          centeredSlides
          loop
          speed={800}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 20, centeredSlides: true },
          }}
          className="pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm h-full">
                <div className="relative aspect-[4/5]">
                  <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t.tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-900">{t.quote}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {t.name} — {t.role}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
