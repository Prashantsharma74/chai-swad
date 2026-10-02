import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import ErrorState from '../../components/ErrorState/ErrorState'
import OrderStatus from '../../components/OrderStatus/OrderStatus'
import { getOrder } from '../../services/orderService'
import { getErrorMessage } from '../../utils/errors'
import { formatINR } from '../../utils/currency'
import { STATUS_LABELS } from '../../constants/cafe'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageTitle(order?.orderNumber ? `Order ${order.orderNumber}` : 'Order')

  useEffect(() => {
    let ignore = false
    let timer

    async function load(silent) {
      if (!silent) {
        setLoading(true)
        setError('')
      }
      try {
        const next = await getOrder(orderId)
        if (ignore) return
        setOrder(next)
        setLoading(false)
        if (next.orderStatus !== 'COMPLETED' && next.orderStatus !== 'CANCELLED') {
          timer = window.setTimeout(() => load(true), 15000)
        }
      } catch (err) {
        if (ignore) return
        setError(getErrorMessage(err, 'Something went wrong. Please try again.'))
        setLoading(false)
      }
    }

    load(false)
    return () => {
      ignore = true
      window.clearTimeout(timer)
    }
  }, [orderId])

  if (loading) return <LoadingSkeleton variant="orders" />
  if (error || !order) return <ErrorState message="Something went wrong. Please try again." onRetry={() => window.location.reload()} />

  const rows = [
    ['Customer', order.customer.name],
    ['Phone', order.customer.phone],
    ['Email', order.customer.email],
    ['Address', order.customer.address],
    ['Table', order.tableNumber || '—'],
    ['Subtotal', formatINR(order.subtotal)],
    ...(order.tax > 0 ? [['GST', formatINR(order.tax)]] : []),
    ['Total', formatINR(order.total)],
    ['Payment', order.payment.status === 'PAID' ? 'Successful' : order.payment.status],
    ['Status', STATUS_LABELS[order.orderStatus] || order.orderStatus]
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link to="/my-orders" className="text-sm font-semibold text-cocoa">
          Back to my orders
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">Order #{order.orderNumber}</h1>
      </div>

      <OrderStatus status={order.orderStatus} />

      <section className="card p-5">
        <h2 className="text-xl font-semibold">Items</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item) => (
            <li key={`${item.menuItemId}-${item.name}`} className="flex justify-between gap-4">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>{formatINR(item.total)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <dl className="space-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-cocoa">{label}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
