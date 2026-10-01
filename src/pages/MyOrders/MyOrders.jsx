import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import EmptyState from '../../components/EmptyState/EmptyState'
import ErrorState from '../../components/ErrorState/ErrorState'
import { getOrdersByPhone } from '../../services/orderService'
import { getErrorMessage } from '../../utils/errors'
import { formatINR, formatOrderDate } from '../../utils/currency'
import { STATUS_LABELS } from '../../constants/cafe'
import { usePageTitle } from '../../hooks/usePageTitle'

const phonePattern = /^[6-9]\d{9}$/

export default function MyOrdersPage() {
  usePageTitle('My Orders')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  async function onSubmit(values) {
    setLoading(true)
    setError('')
    setPhone(values.phone)
    try {
      const next = await getOrdersByPhone(values.phone)
      setOrders(next)
    } catch (err) {
      setOrders(null)
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold">My Orders</h1>
      <p className="mt-1 text-cocoa">Look up orders with the mobile number used at checkout.</p>

      <form className="card mt-6 p-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block">
          <span className="mb-2 block font-semibold">Enter your mobile number</span>
          <input
            className="field"
            inputMode="numeric"
            maxLength={10}
            placeholder="9876543210"
            {...register('phone', {
              required: 'Please enter a valid 10-digit mobile number.',
              pattern: {
                value: phonePattern,
                message: 'Please enter a valid 10-digit mobile number.'
              }
            })}
          />
        </label>
        {errors.phone ? <p className="mt-2 text-sm text-clay">{errors.phone.message}</p> : null}
        <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
          View Orders
        </button>
      </form>

      <div className="mt-6">
        {loading ? <LoadingSkeleton variant="orders" /> : null}
        {error ? <ErrorState message={error} onRetry={() => phone && onSubmit({ phone })} /> : null}
        {orders && orders.length === 0 ? (
          <EmptyState title="No orders found." message="When you place an order, it will show up here." />
        ) : null}
        <div className="space-y-3">
          {orders?.map((order) => (
            <article key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">#{order.orderNumber}</h2>
                  <p className="text-sm text-cocoa">{formatOrderDate(order.createdAt)}</p>
                </div>
                <p className="text-lg font-semibold text-terracotta">{formatINR(order.total)}</p>
              </div>
              <ul className="mt-3 text-sm text-cocoa">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.name}`}>
                    {item.quantity} × {item.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                <span className="font-semibold">{STATUS_LABELS[order.orderStatus] || order.orderStatus}</span>
                <span className="text-cocoa"> · {order.payment?.status === 'PAID' ? 'Paid' : order.payment?.status || 'Payment'}</span>
              </p>
              <Link to={`/order/${order.id}`} className="btn-secondary mt-4">
                View Order
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
