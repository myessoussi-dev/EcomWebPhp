import { categories, products } from '../data/catalog.js'
import { apiRequest } from './apiClient.js'

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id,
    slug: product.slug || String(product.name || product.id).toLowerCase().replace(/\s+/g, '-'),
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    category: product.category?.slug || product.category || 'uncategorized',
    categoryName: product.category?.name || product.categoryName || product.category || 'Uncategorized',
    image: product.image || product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  }
}

async function listFromApi(path, fallback) {
  try {
    const data = await apiRequest(path)
    const items = Array.isArray(data) ? data : data.items || data.products || []
    return items.length ? items.map(normalizeProduct) : fallback
  } catch {
    return fallback
  }
}

export const productService = {
  async listProducts() {
    return listFromApi('/products', products)
  },
  async getProduct(slug) {
    const list = await this.listProducts()
    return list.find((product) => product.slug === slug || String(product.id) === slug)
  },
  async listCategories() {
    try {
      const data = await apiRequest('/categories')
      return Array.isArray(data) && data.length ? data : categories
    } catch {
      return categories
    }
  },
}
