import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cart-context.js'

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return undefined
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('ecomwebphp_cart', []))
  const [wishlist, setWishlist] = useState(() => readStorage('ecomwebphp_wishlist', []))
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message) => {
    const id = crypto.randomUUID()
    setToasts((items) => [...items, { id, message }])
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 2600)
  }, [])

  const updateCart = useCallback((updater) => {
    setCart((current) => {
      const next = updater(current)
      writeStorage('ecomwebphp_cart', next)
      return next
    })
  }, [])

  const updateWishlist = useCallback((updater) => {
    setWishlist((current) => {
      const next = updater(current)
      writeStorage('ecomwebphp_wishlist', next)
      return next
    })
  }, [])

  const addToCart = useCallback((product, quantity = 1) => {
    updateCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { ...product, quantity }]
    })
    notify(`${product.name} added to cart`)
  }, [notify, updateCart])

  const removeFromCart = useCallback((id) => updateCart((current) => current.filter((item) => item.id !== id)), [updateCart])
  const setQuantity = useCallback((id, quantity) => updateCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)), [updateCart])
  const clearCart = useCallback(() => updateCart(() => []), [updateCart])

  const toggleWishlist = useCallback((product) => {
    updateWishlist((current) => current.some((item) => item.id === product.id) ? current.filter((item) => item.id !== product.id) : [...current, product])
    notify('Wishlist updated')
  }, [notify, updateWishlist])

  const value = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12
    const tax = subtotal * 0.075
    return {
      addToCart,
      cart,
      cartCount: cart.reduce((count, item) => count + item.quantity, 0),
      clearCart,
      removeFromCart,
      setQuantity,
      shipping,
      subtotal,
      tax,
      toasts,
      toggleWishlist,
      total: subtotal + shipping + tax,
      wishlist,
    }
  }, [addToCart, cart, clearCart, removeFromCart, setQuantity, toasts, toggleWishlist, wishlist])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
