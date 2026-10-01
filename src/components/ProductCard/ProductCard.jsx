import { useState } from 'react'
import { Link } from 'react-router-dom'
import FoodArt from '../FoodArt/FoodArt'
import { formatINR } from '../../utils/currency'
import { useCart } from '../../context/CartContext/CartContext'

export default function ProductCard({ item }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 800)
  }

  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <Link to={`/product/${item.id}`} className="block aspect-square overflow-hidden bg-cream">
        <FoodArt item={item} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          {item.category ? <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-saffron">{item.category}</p> : null}
          <Link to={`/product/${item.id}`}>
            <h2 className="text-lg font-semibold leading-tight">{item.name}</h2>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-cocoa">{item.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-terracotta">{formatINR(item.price)}</p>
          <button type="button" className={`btn-primary min-w-[5.5rem] px-4 ${added ? 'animate-pop bg-leaf hover:bg-leaf' : ''}`} onClick={handleAdd}>
            {added ? 'Added' : '+ Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
