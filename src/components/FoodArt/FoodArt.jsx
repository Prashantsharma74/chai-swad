import sandwich from '../../assets/images/sandwich.svg'
import beverage from '../../assets/images/beverage.svg'
import fries from '../../assets/images/fries.svg'

const ART = {
  Sandwich: sandwich,
  Beverages: beverage,
  Fries: fries
}

export default function FoodArt({ item, className = '' }) {
  if (item?.image) {
    return (
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const src = ART[item?.category] || sandwich
  return <img src={src} alt={item?.name || ''} loading="lazy" className={`h-full w-full object-cover ${className}`} />
}
