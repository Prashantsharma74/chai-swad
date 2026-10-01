import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useCart } from '../../context/CartContext/CartContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { calculateOrder } from '../../services/orderService'
import { createPayment, verifyPayment } from '../../services/paymentService'
import { getContact } from '../../services/contactService'
import { getErrorMessage } from '../../utils/errors'
import { loadRazorpay } from '../../utils/razorpay'
import { clearCheckoutDraft, readCheckoutDraft, saveCheckoutDraft } from '../../utils/checkoutDraft'
import { toMoney } from '../../utils/money'
import { formatINR } from '../../utils/currency'
import { distanceMeters, readCurrentPosition } from '../../utils/geo'

const phonePattern = /^[6-9]\d{9}$/

export default function CheckoutPage() {
  usePageTitle('Checkout')
  const navigate = useNavigate()
  const { items, tableNumber, clearCart } = useCart()
  const draft = useMemo(() => readCheckoutDraft(), [])
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')
  const [quoting, setQuoting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [notice, setNotice] = useState('')
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [deliveryNote, setDeliveryNote] = useState('')
  const [cafePoint, setCafePoint] = useState(null)
  const [deliveryRadius, setDeliveryRadius] = useState(500)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: draft })

  const name = watch('name')
  const phone = watch('phone')
  const address = watch('address')

  const payload = useMemo(() => {
    if (!name?.trim() || !phonePattern.test(phone || '') || !address?.trim() || !items.length) return null
    return {
      customer: { name: name.trim(), phone, address: address.trim() },
      ...(tableNumber ? { tableNumber } : {}),
      items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      ...(location ? { location } : {})
    }
  }, [name, phone, address, items, tableNumber, location])

  useEffect(() => {
    if (name || phone || address) {
      saveCheckoutDraft({ name, phone, address })
    }
  }, [name, phone, address])

  useEffect(() => {
    let ignore = false

    async function loadCafe() {
      try {
        const contact = await getContact()
        if (ignore) return
        const radius = Number(contact.deliveryRadiusMeters) || 500
        setDeliveryRadius(radius)
        if (Number.isFinite(contact.latitude) && Number.isFinite(contact.longitude)) {
          setCafePoint({ lat: contact.latitude, lng: contact.longitude })
        }
      } catch {
        if (!ignore) setDeliveryRadius(500)
      }
    }

    loadCafe()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!location || !cafePoint) return
    const meters = distanceMeters(cafePoint, location)
    if (meters > deliveryRadius) {
      setDeliveryNote(`Sorry, Chai Swad only delivers within ${deliveryRadius} meters of the cafe.`)
    } else {
      setDeliveryNote(`You are ${meters} meters away. We can deliver here.`)
    }
  }, [location, cafePoint, deliveryRadius])

  async function useCurrentLocation() {
    setLocating(true)
    setNotice('')
    try {
      const point = await readCurrentPosition()
      setLocation(point)
    } catch (err) {
      setDeliveryNote(err.message || 'Please allow location access to confirm delivery area.')
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    if (!payload) {
      setQuote(null)
      setQuoteError('')
      return undefined
    }

    let ignore = false
    const timer = window.setTimeout(async () => {
      setQuoting(true)
      setQuoteError('')
      try {
        const order = await calculateOrder(payload)
        if (!ignore) setQuote(order)
      } catch (err) {
        if (!ignore) {
          setQuote(null)
          setQuoteError(
            getErrorMessage(
              err,
              'Unable to calculate the order.'
            )
          )
        }
      } finally {
        if (!ignore) setQuoting(false)
      }
    }, 400)

    return () => {
      ignore = true
      window.clearTimeout(timer)
    }
  }, [payload])

  async function onPay() {
    if (!payload || !quote) {
      setNotice('Enter your details and wait for the final amount before paying.')
      return
    }
    setPaying(true)
    setNotice('')

    try {
      const payment = await createPayment(payload)
      if (payment.amount !== Math.round(toMoney(quote.total) * 100)) {
        setQuoteError('Menu prices were updated. Please review the new total.')
        const refreshed = await calculateOrder(payload)
        setQuote(refreshed)
        setPaying(false)
        return
      }

      await loadRazorpay()
      const checkout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Chai Swad',
        description: 'Cafe order',
        order_id: payment.razorpayOrderId,
        prefill: {
          name: payload.customer.name,
          contact: payload.customer.phone
        },
        theme: { color: '#6F3E22' },
        handler: async (response) => {
          try {
            const order = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            clearCart()
            clearCheckoutDraft()
            navigate(`/order-success/${order.id}`, { replace: true })
          } catch (err) {
            navigate('/payment', {
              replace: true,
              state: {
                failed: true,
                paymentId: response.razorpay_payment_id,
                message: getErrorMessage(
                  err,
                  'If money was deducted, do not pay again. Contact the cafe with your payment reference.'
                )
              }
            })
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false)
            setNotice('Payment was cancelled. You have not been charged.')
          }
        }
      })

      checkout.on('payment.failed', () => {
        setPaying(false)
        navigate('/payment', {
          state: {
            failed: true,
            message: 'Your payment could not be completed.'
          }
        })
      })

      checkout.open()
    } catch (err) {
      setPaying(false)
      setQuoteError(getErrorMessage(err, 'Unable to start payment.'))
    }
  }

  const cartSubtotal = toMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0))

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is waiting for something delicious ☕"
        message="Add something from the menu before checkout."
      />
    )
  }

  return (
    <form className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr]" onSubmit={handleSubmit(onPay)} noValidate>
      <section className="card p-5">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-1 text-cocoa">Secure online payment. Only online payment is supported.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Name</span>
            <input className="field" autoComplete="name" {...register('name', { required: 'Please enter your name.' })} />
            {errors.name ? <span className="mt-1 block text-sm text-clay">{errors.name.message}</span> : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Phone Number</span>
            <input
              className="field"
              inputMode="numeric"
              autoComplete="tel"
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
            {errors.phone ? <span className="mt-1 block text-sm text-clay">{errors.phone.message}</span> : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Address</span>
            <textarea
              className="field min-h-28"
              placeholder="House / shop, area, landmark near Chai Swad"
              {...register('address', { required: 'Please enter your address.' })}
            />
            {errors.address ? <span className="mt-1 block text-sm text-clay">{errors.address.message}</span> : null}
          </label>
          <p className="text-sm text-cocoa">Delivery only within {deliveryRadius} meters of Chai Swad.</p>
          <button type="button" className="btn-secondary w-full" onClick={useCurrentLocation} disabled={locating}>
            <MapPin className="mr-2 h-4 w-4" />
            {locating ? 'Checking location...' : 'Use current location'}
          </button>
          {deliveryNote ? (
            <p className={`text-sm font-medium ${deliveryNote.startsWith('Sorry') ? 'text-clay' : 'text-leaf'}`} role="alert">
              {deliveryNote}
            </p>
          ) : null}
          {tableNumber ? (
            <p className="rounded-2xl bg-cream px-4 py-3 font-semibold">Table: {tableNumber}</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div className="card p-5">
          <h2 className="text-xl font-semibold">Customer Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt>Name</dt><dd>{name?.trim() || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Phone</dt><dd>{phone || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt>Address</dt><dd className="text-right">{address?.trim() || '—'}</dd></div>
            {tableNumber ? <div className="flex justify-between gap-4"><dt>Table</dt><dd>{tableNumber}</dd></div> : null}
          </dl>
        </div>

        <OrderSummary
          lines={(quote?.items || items).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            total: item.total ?? item.price * item.quantity
          }))}
          subtotal={quote?.subtotal ?? cartSubtotal}
          tax={quote?.tax}
          total={quote?.total ?? cartSubtotal}
          note={quoting ? 'Confirming the final amount...' : 'The cafe menu price is used for payment.'}
        />

        {quoteError ? <p className="text-sm font-medium text-clay" role="alert">{quoteError}</p> : null}
        {notice ? <p className="text-sm text-cocoa">{notice}</p> : null}

        <p className="text-sm font-medium text-leaf">Secure online payment</p>
        <button type="submit" className="btn-primary w-full" disabled={paying || quoting || !quote || deliveryNote.startsWith('Sorry')}>
          {paying ? 'Opening payment...' : `Pay ${formatINR(quote?.total ?? cartSubtotal)}`}
        </button>
      </section>
    </form>
  )
}
