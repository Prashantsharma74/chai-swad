import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import ErrorState from '../../components/ErrorState/ErrorState'
import OrderStatus from '../../components/OrderStatus/OrderStatus'
import { getOrder } from '../../services/orderService'
import { getErrorMessage } from '../../utils/errors'
import { formatINR } from '../../utils/currency'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageTitle('Order confirmed')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const next = await getOrder(orderId)
        if (!ignore) setOrder(next)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err, 'Unable to load your order.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [orderId])

  if (loading) return <LoadingSkeleton variant="orders" />
  if (error || !order) {
    return <ErrorState message="Something went wrong. Please try again." onRetry={() => window.location.reload()} />
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="success-check mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf text-white">
        <Check className="h-8 w-8" strokeWidth={2.5} />
      </div>
      <h1 className="mt-5 text-3xl font-semibold">Order Placed Successfully!</h1>
      <p className="mt-2 text-cocoa">Thank you for ordering from Chai Swad ❤️</p>
      <p className="mt-5 text-2xl font-semibold">Order #{order.orderNumber}</p>
      <p className="mt-2 text-xl font-semibold text-terracotta">{formatINR(order.total)} Paid</p>
      <div className="mt-6 text-left">
        <OrderStatus status={order.orderStatus} />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Link to={`/order/${order.id}`} className="btn-primary">
          Track Order
        </Link>
        <Link to="/my-orders" className="btn-secondary">
          View My Orders
        </Link>
      </div>
    </div>
  )
}
