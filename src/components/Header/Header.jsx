import { NavLink } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Logo from '../Logo/Logo'
import { useCart } from '../../context/CartContext/CartContext'

const LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/my-orders', label: 'My Orders' },
  { to: '/contact', label: 'Contact' }
]

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-6xl items-center justify-between gap-3 px-4 md:h-20">
        <NavLink to="/" className="flex min-h-11 min-w-0 items-center" aria-label="Chai Swad home">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[15px] font-medium transition ${isActive ? 'text-terracotta' : 'text-brown hover:text-terracotta'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/cart"
          className="relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-2xl bg-terracotta px-3 text-white md:min-w-0 md:px-4"
          aria-label={itemCount > 0 ? `Cart (${itemCount})` : 'Cart'}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden text-sm font-semibold md:inline">{itemCount > 0 ? `Cart (${itemCount})` : 'Cart'}</span>
          {itemCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-saffron px-1 text-[11px] font-bold text-clay md:hidden">
              {itemCount}
            </span>
          ) : null}
        </NavLink>
      </div>
    </header>
  )
}
