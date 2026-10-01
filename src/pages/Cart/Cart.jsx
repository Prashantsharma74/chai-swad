import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../../components/CartItem/CartItem'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import EmptyState from '../../components/EmptyState/EmptyState'
import ErrorState from '../../components/ErrorState/ErrorState'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import { useCart } from '../../context/CartContext/CartContext'
import { useMenu } from '../../hooks/useMenu'
import { usePageTitle } from '../../hooks/usePageTitle'
import { toMoney } from '../../utils/money'

export default function CartPage() {
  usePageTitle('Cart')
  const { items, updateQuantity, removeItem, clearCart, itemCount } = useCart()
  const { items: menu, loading, error, retry } = useMenu()
  const [confirmClear, setConfirmClear] = useState(false)

  const priced = useMemo(() => {
    return items.map((item) => {
      const fresh = menu.find((entry) => entry.id === item.menuItemId)
      const price = fresh ? fresh.price : item.price
      return {
        ...item,
        price,
        unavailable: menu.length > 0 && !fresh,
        lineTotal: toMoney(price * item.quantity)
      }
    })
  }, [items, menu])

  const subtotal = toMoney(priced.reduce((sum, item) => sum + (item.unavailable ? 0 : item.lineTotal), 0))
  const total = subtotal
  const blocked = priced.some((item) => item.unavailable)

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is waiting for something delicious ☕"
        message="Add a sandwich, chai, or fries to get started."
        actionLabel="Explore Menu"
      />
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Cart {itemCount ? `(${itemCount})` : ''}</h1>
          <button type="button" className="min-h-11 text-sm font-semibold text-cocoa" onClick={() => setConfirmClear(true)}>
            Clear cart
          </button>
        </div>
        {confirmClear ? (
          <div className="mb-4 rounded-2xl bg-mist px-4 py-3 text-sm">
            Clear all items?
            <button type="button" className="ml-3 font-semibold" onClick={() => { clearCart(); setConfirmClear(false) }}>
              Yes
            </button>
            <button type="button" className="ml-3 font-semibold" onClick={() => setConfirmClear(false)}>
              No
            </button>
          </div>
        ) : null}
        {loading ? <LoadingSkeleton variant="orders" /> : null}
        {error ? <ErrorState message="Unable to refresh prices. Please try again." onRetry={retry} /> : null}
        <div className="space-y-3 pb-24 lg:pb-0">
          {priced.map((item) => (
            <CartItem
              key={item.menuItemId}
              item={item}
              onQuantity={(quantity) => updateQuantity(item.menuItemId, quantity)}
              onRemove={() => removeItem(item.menuItemId)}
            />
          ))}
        </div>
      </section>
      <div className="space-y-4">
        <OrderSummary
          lines={priced.filter((item) => !item.unavailable).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            total: item.lineTotal
          }))}
          subtotal={subtotal}
          total={total}
          note="Final amount is confirmed at checkout."
        />
        {blocked ? <p className="text-sm text-clay">Remove unavailable items before checkout.</p> : null}
        <div className="fixed inset-x-0 bottom-[4.75rem] z-20 px-4 md:static md:bottom-auto md:z-auto md:px-0">
          {blocked ? (
            <span className="btn-primary w-full opacity-60">Proceed to Checkout</span>
          ) : (
            <Link to="/checkout" className="btn-primary w-full">
              Proceed to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
