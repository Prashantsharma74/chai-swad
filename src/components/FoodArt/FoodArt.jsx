import sandwich from '../../assets/images/sandwich.svg'
import beverage from '../../assets/images/beverage.svg'
import fries from '../../assets/images/fries.svg'
import { imageForItem } from '../../constants/productImages'

const ART = {
  Sandwich: sandwich,
  Beverages: beverage,
  Fries: fries
}

export default function FoodArt({ item, className = '' }) {
  const src = imageForItem(item) || ART[item?.category] || sandwich
  return <img src={src} alt={item?.name || ''} loading="lazy" className={`h-full w-full object-cover ${className}`} />
}
