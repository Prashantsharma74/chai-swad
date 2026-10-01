import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getMenu } from '../../services/menuService'
import { getErrorMessage } from '../../utils/errors'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
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

  return (
    <MenuContext.Provider value={{ items, taxPercent, loading, error, retry: load }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenuContext must be used within MenuProvider')
  }
  return context
}
