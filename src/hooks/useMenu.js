import { useCallback, useEffect, useState } from 'react'
import { getMenu } from '../services/menuService'
import { getErrorMessage } from '../utils/errors'

export function useMenu() {
  const [items, setItems] = useState([])
  const [taxPercent, setTaxPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMenu()
      setItems(data.items || [])
      setTaxPercent(Number.isFinite(data.taxPercent) ? data.taxPercent : 0)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load menu.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { items, taxPercent, loading, error, retry: load }
}
