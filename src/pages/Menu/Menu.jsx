import { useMemo, useState } from 'react'
import CategoryTabs from '../../components/CategoryTabs/CategoryTabs'
import ImageSlider from '../../components/ImageSlider/ImageSlider'
import { PRODUCT_SLIDES } from '../../constants/productImages'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import EmptyState from '../../components/EmptyState/EmptyState'
import ErrorState from '../../components/ErrorState/ErrorState'
import { useMenu } from '../../hooks/useMenu'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useCart } from '../../context/CartContext/CartContext'
import { BRAND, MENU_TABS } from '../../constants/cafe'

export default function MenuPage() {
  usePageTitle('Menu')
  const { items, loading, error, retry } = useMenu()
  const { tableNumber } = useCart()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      return matchesCategory && matchesSearch
    })
  }, [items, category, query])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-saffron">{BRAND.name}</p>
          <h1 className="text-3xl font-semibold md:text-4xl">Freshly prepared with love.</h1>
        </div>
        {tableNumber ? (
          <p className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white">Table {tableNumber}</p>
        ) : null}
      </div>

      <ImageSlider slides={PRODUCT_SLIDES} items={items} />
      <div className="mt-5">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <div className="mt-4">
        <CategoryTabs categories={MENU_TABS} active={category} onChange={setCategory} />
      </div>

      <div className="mt-6">
        {loading ? <LoadingSkeleton variant="menu" /> : null}
        {error ? <ErrorState message="Something went wrong. Please try again." onRetry={retry} /> : null}
        {!loading && !error && visible.length === 0 ? (
          <EmptyState
            title={query ? 'No search results' : 'Nothing here yet'}
            message={query ? 'Try another name or browse a different category.' : 'No items in this category right now.'}
          />
        ) : null}
        {!loading && !error && visible.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
