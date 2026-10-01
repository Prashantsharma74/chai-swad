import masalaSandwich from '../assets/images/masala-sandwich.jpg'
import paneerSandwich from '../assets/images/paneer-sandwich.jpg'
import coldCoffee from '../assets/images/cold-coffee.jpg'
import lemonIceTea from '../assets/images/lemon-ice-tea.jpg'

export const PRODUCT_SLIDES = [
  {
    src: masalaSandwich,
    title: 'Masala Sandwich',
    caption: 'Toasted bread with spiced potato masala.',
    slug: 'masala-sandwich'
  },
  {
    src: paneerSandwich,
    title: 'Paneer Taka Tak',
    caption: 'Charred paneer, peppers, and warm spices.',
    slug: 'paneer-taka-tak-sandwich'
  },
  {
    src: coldCoffee,
    title: 'Cold Coffee',
    caption: 'Chilled coffee blended with milk.',
    slug: 'cold-coffee'
  },
  {
    src: lemonIceTea,
    title: 'Lemon Ice Tea',
    caption: 'Brewed tea over ice with fresh lemon.',
    slug: 'lemon-ice-tea'
  }
]

const BY_SLUG = {
  'masala-sandwich': masalaSandwich,
  'masala-cheese-sandwich': masalaSandwich,
  'cheese-chutney-sandwich': masalaSandwich,
  'vegetable-sandwich': masalaSandwich,
  'vegetable-cheese-sandwich': paneerSandwich,
  'corn-cheese-sandwich': paneerSandwich,
  'paneer-taka-tak-sandwich': paneerSandwich,
  'cold-coffee': coldCoffee,
  'cold-coffee-with-ice-cream': coldCoffee,
  'ice-tea': lemonIceTea,
  'lemon-ice-tea': lemonIceTea
}

const BY_CATEGORY = {
  Sandwich: masalaSandwich,
  Beverages: coldCoffee
}

export function imageForItem(item) {
  if (item?.image) return item.image
  return BY_SLUG[item?.slug] || BY_CATEGORY[item?.category] || ''
}
