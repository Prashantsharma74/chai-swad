import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FoodArt from '../FoodArt/FoodArt'
import QuantityControl from '../QuantityControl/QuantityControl'
import { formatINR } from '../../utils/currency'
import { useCart } from '../../context/CartContext/CartContext'

export default function ProductDetails({ item }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(
      {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image
      },
      quantity
    )
    setAdded(true)
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      <div className="card overflow-hidden">
        <div className="aspect-square">
          <FoodArt item={item} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Link to="/menu" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cocoa">
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron">{item.category}</p>
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{item.name}</h1>
        <p className="text-base text-cocoa">{item.description}</p>
        <p className="text-3xl font-semibold text-terracotta">{formatINR(item.price)}</p>
        <QuantityControl quantity={quantity} min={1} onChange={setQuantity} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className={`btn-primary ${added ? 'animate-pop bg-leaf hover:bg-leaf' : ''}`} onClick={handleAdd}>
            {added ? 'Added to cart' : 'Add to Cart'}
          </button>
          {added ? (
            <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>
              View cart
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
