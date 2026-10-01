import { NavLink } from 'react-router-dom'
import { ClipboardList, Phone, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '../../context/CartContext/CartContext'

const LINKS = [
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: true },
  { to: '/my-orders', label: 'My Orders', icon: ClipboardList },
  { to: '/contact', label: 'Contact', icon: Phone }
]

export default function BottomNavigation() {
  const { itemCount } = useCart()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-mist bg-foam/95 backdrop-blur md:hidden" aria-label="Primary">
      <ul className="mx-auto grid max-w-lg grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {LINKS.map((link) => {
          const Icon = link.icon
          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                    isActive ? 'text-terracotta' : 'text-cocoa'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {link.label}
                {link.badge && itemCount > 0 ? (
                  <span className="absolute right-5 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
