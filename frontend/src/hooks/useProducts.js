import { useEffect, useMemo, useState } from 'react'
import { productService } from '../services/productService.js'

export function useProducts({ category, query, sort = 'featured' } = {}) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [productList, categoryList] = await Promise.all([productService.listProducts(), productService.listCategories()])
        if (alive) {
          setProducts(productList)
          setCategories(categoryList)
        }
      } catch {
        if (alive) setError('We could not load products right now.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const filteredProducts = useMemo(() => {
    const term = query?.trim().toLowerCase()
    let result = [...products]
    if (category) result = result.filter((product) => product.category === category)
    if (term) {
      result = result.filter((product) => [product.name, product.description, product.categoryName].some((value) => value?.toLowerCase().includes(term)))
    }
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [category, products, query, sort])

  return { categories, error, loading, products: filteredProducts }
}
