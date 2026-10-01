import { useEffect } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import Header from '../Header/Header'
import BottomNavigation from '../BottomNavigation/BottomNavigation'
import { useCart } from '../../context/CartContext/CartContext'

export default function Layout() {
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const { setTableNumber } = useCart()

  useEffect(() => {
    const table = params.get('table')
    if (table && /^[1-9]\d{0,2}$/.test(table)) {
      const number = Number(table)
      if (number <= 500) setTableNumber(number)
    }
  }, [params, setTableNumber])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 md:pb-12">
        <div key={pathname} className="animate-rise">
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
    </div>
  )
}
