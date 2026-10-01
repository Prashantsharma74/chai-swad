import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const INTERVAL_MS = 4000

export default function ImageSlider({ slides, items = [] }) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const slide = slides[index]

  useEffect(() => {
    if (count < 2) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count])

  function go(next) {
    setIndex((next + count) % count)
  }

  const match = items.find((item) => item.slug === slide.slug)
  const href = match ? `/product/${match.id}` : '/menu'

  return (
    <section className="card relative overflow-hidden" aria-roledescription="carousel" aria-label="Featured items">
      <div className="relative aspect-[16/9]">
        {slides.map((item, slideIndex) => (
          <img
            key={item.slug}
            src={item.src}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${slideIndex === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-brown/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/80">Featured</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">{slide.title}</h2>
            <p className="mt-1 max-w-md text-sm text-cream/90">{slide.caption}</p>
            <Link to={href} className="btn-secondary mt-3">
              View item
            </Link>
          </div>
        </div>
        <button
          type="button"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foam/90 text-brown"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foam/90 text-brown"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex justify-center gap-2 py-3">
        {slides.map((item, slideIndex) => (
          <button
            key={item.slug}
            type="button"
            aria-label={`Show ${item.title}`}
            className={`h-2.5 rounded-full transition-all ${slideIndex === index ? 'w-6 bg-terracotta' : 'w-2.5 bg-mist'}`}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
      </div>
    </section>
  )
}
