import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getMenu } from '../../services/menuService'

const CART_KEY = 'chai-swad-cart'
const TABLE_KEY = 'chai-swad-table'

const CartContext = createContext(null)

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item) => item?.menuItemId && item.name && Number.isInteger(item.quantity) && item.quantity > 0)
      .map((item) => ({
        menuItemId: String(item.menuItemId),
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Math.min(item.quantity, 20),
        category: item.category || 'Sandwich',
        image: item.image || ''
      }))
  } catch {
    return []
  }
}

function readTable() {
  const number = Number(sessionStorage.getItem(TABLE_KEY))
  return Number.isInteger(number) && number > 0 && number <= 500 ? number : null
}

function remapCart(cartItems, menuItems) {
  if (!menuItems.length) return cartItems

  let changed = false
  const next = cartItems.map((item) => {
    const exact = menuItems.find((entry) => String(entry.id) === String(item.menuItemId))
    const match = exact || menuItems.find((entry) => entry.name === item.name)
    if (!match) return item

    const menuItemId = String(match.id)
    const price = Number(match.price) || 0
    if (
      menuItemId === item.menuItemId &&
      price === item.price &&
      match.name === item.name &&
      (match.category || item.category) === item.category
    ) {
      return item
    }

    changed = true
    return {
      ...item,
      menuItemId,
      name: match.name,
      price,
      category: match.category || item.category,
      image: match.image || item.image
    }
  })

  return changed ? next : cartItems
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [tableNumber, setTableState] = useState(readTable)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    let ignore = false

    async function reconcile() {
      try {
        const data = await getMenu()
        if (ignore) return
        setItems((current) => remapCart(current, data.items || []))
      } catch {
        // Keep the saved cart if the menu cannot be refreshed.
      }
    }

    reconcile()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (tableNumber) sessionStorage.setItem(TABLE_KEY, String(tableNumber))
  }, [tableNumber])

  const setTableNumber = useCallback((value) => {
    const number = Number(value)
    if (Number.isInteger(number) && number > 0 && number <= 500) {
      setTableState(number)
    }
  }, [])

  function addItem(item, quantity = 1) {
    const nextQuantity = Math.min(Math.max(quantity, 1), 20)
    setItems((current) => {
      const index = current.findIndex((entry) => entry.menuItemId === item.menuItemId)
      if (index === -1) {
        return [...current, { ...item, quantity: nextQuantity }]
      }

      return current.map((entry, entryIndex) =>
        entryIndex === index
          ? { ...entry, ...item, quantity: Math.min(entry.quantity + nextQuantity, 20) }
          : entry
      )
    })
  }

  function updateQuantity(menuItemId, quantity) {
    setItems((current) => {
      if (quantity < 1) return current.filter((item) => item.menuItemId !== menuItemId)
      return current.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity: Math.min(quantity, 20) } : item
      )
    })
  }

  function removeItem(menuItemId) {
    setItems((current) => current.filter((item) => item.menuItemId !== menuItemId))
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
