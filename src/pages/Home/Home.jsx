import { Link, useLocation } from 'react-router-dom'
import { Clock } from 'lucide-react'
import ImageSlider from '../../components/ImageSlider/ImageSlider'
import { PRODUCT_SLIDES } from '../../constants/productImages'
import Logo from '../../components/Logo/Logo'
import { usePageTitle } from '../../hooks/usePageTitle'
import { BRAND } from '../../constants/cafe'
import { useCart } from '../../context/CartContext/CartContext'

export default function HomePage() {
  usePageTitle('Home')
  const { search } = useLocation()
  const { tableNumber } = useCart()
  const menuTo = `/menu${search}`

  return (
    <section className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
      <div>
        <Logo className="h-16 w-auto max-w-full object-left md:h-24" />
        <h1 className="sr-only">{BRAND.name} — {BRAND.tagline}</h1>
        <p className="mt-3 text-lg text-cocoa">{BRAND.line}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-terracotta">
          <Clock className="h-4 w-4" />
          Open today • {BRAND.hours}
        </p>
        {tableNumber ? <p className="mt-3 text-sm font-semibold text-brown">Table {tableNumber}</p> : null}
        <Link to={menuTo} className="btn-primary mt-6 w-full sm:w-auto">
          Order Now
        </Link>
      </div>
      <ImageSlider slides={PRODUCT_SLIDES} />
    </section>
  )
}
