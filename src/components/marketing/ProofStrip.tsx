export function ProofStrip({ items, tone = 'light' }: { items: string[]; tone?: 'light' | 'dark' }) {
  return (
    <div
      className={
        tone === 'dark'
          ? 'border-y border-white/10 bg-white/5'
          : 'border-y border-slate-100 bg-slate-50/60'
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 text-center">
        {items.map(item => (
          <p
            key={item}
            className={
              tone === 'dark'
                ? 'text-sm font-semibold text-white/80'
                : 'text-sm font-semibold text-slate-700'
            }
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

export interface FaqItem {
  q: string
  a: string
}

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="border-t border-slate-100 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <div className="mt-8 divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.q} className="py-5">
              <p className="font-bold text-slate-900">{item.q}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
