import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetails from '../../components/ProductDetails/ProductDetails'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import ErrorState from '../../components/ErrorState/ErrorState'
import { getMenuItem } from '../../services/menuService'
import { getErrorMessage } from '../../utils/errors'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ProductPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageTitle(item?.name || 'Item')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const next = await getMenuItem(id)
        if (!ignore) setItem(next)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err, 'Something went wrong. Please try again.'))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) return <LoadingSkeleton variant="product" />
  if (error || !item) return <ErrorState message="Something went wrong. Please try again." onRetry={() => window.location.reload()} />
  return <ProductDetails item={item} />
}
