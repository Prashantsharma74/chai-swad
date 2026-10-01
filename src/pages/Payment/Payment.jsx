import { Link, useLocation } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function PaymentPage() {
  usePageTitle('Payment')
  const { state } = useLocation()
  const failed = Boolean(state?.failed)

  if (!failed) {
    return (
      <div className="card mx-auto max-w-lg px-6 py-14 text-center">
        <h1 className="text-3xl font-semibold">No pending payment</h1>
        <p className="mt-2 text-cocoa">Start from your cart when you are ready to pay.</p>
        <p className="mt-3 text-sm font-medium text-leaf">Secure online payment</p>
        <Link to="/cart" className="btn-primary mt-6">
          Back to Cart
        </Link>
      </div>
    )
  }

  return (
    <div className="card mx-auto max-w-lg px-6 py-14 text-center">
      <h1 className="text-3xl font-semibold">Payment Failed</h1>
      <p className="mt-3 text-cocoa">{state.message || 'Your payment could not be completed.'}</p>
      {state.paymentId ? (
        <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm">
          Payment reference: {state.paymentId}
          <span className="mt-1 block">If money was deducted, do not pay again.</span>
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3">
        <Link to="/checkout" className="btn-primary">
          Try Again
        </Link>
        <Link to="/cart" className="btn-secondary">
          Back to Cart
        </Link>
      </div>
    </div>
  )
}
