import { Trash2 } from 'lucide-react'
import QuantityControl from '../QuantityControl/QuantityControl'
import FoodArt from '../FoodArt/FoodArt'
import { formatINR } from '../../utils/currency'

export default function CartItem({ item, onQuantity, onRemove }) {
  return (
    <article className="card flex items-center gap-3 p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
        <FoodArt item={item} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold">{item.name}</h2>
        <p className="text-terracotta">{formatINR(item.price)}</p>
        {item.unavailable ? <p className="mt-1 text-sm text-clay">This item is no longer available.</p> : null}
      </div>
      <div className="flex flex-col items-end gap-2">
        <QuantityControl quantity={item.quantity} onChange={onQuantity} label={item.name} />
        <button type="button" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-cocoa" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </article>
  )
}
