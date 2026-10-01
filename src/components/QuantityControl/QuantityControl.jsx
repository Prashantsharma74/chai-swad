import { Minus, Plus } from 'lucide-react'

export default function QuantityControl({ quantity, onChange, label = 'Quantity', min = 0 }) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-mist bg-cream" aria-label={label}>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-2xl"
        onClick={() => onChange(Math.max(quantity - 1, min))}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-base font-semibold">{quantity}</span>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-2xl"
        onClick={() => onChange(Math.min(quantity + 1, 20))}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
