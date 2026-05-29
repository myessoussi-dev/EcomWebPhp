import { apiRequest } from './apiClient.js'

function normalizeProduct(product) {
  return {
    ...product,
    id: product.id,
    categoryName: product.categoryName || product.category || 'Uncategorized',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    badge: product.badge || product.payment_status || '-',
  }
}

function normalizeOrder(order) {
  return {
    ...order,
    id: `ORD-${order.id}`,
    date: order.created_at || order.date || '-',
    customer: order.username || order.email || '-',
    status: order.payment_status || order.status || '-',
    total: Number(order.total || 0),
  }
}

function normalizeUser(user) {
  return {
    ...user,
    name: user.username || user.name || '-',
    email: user.email || '-',
    role: Number(user.is_admin || 0) === 1 ? 'Admin' : 'Customer',
    status: 'Active',
  }
}

export const adminService = {
  async dashboard() {
    const response = await apiRequest('/admin')
    const data = response.data || {}

    return {
      revenue: Number(data.revenue || 0),
      ordersCount: Number(data.orders_count || 0),
      productsCount: Number(data.products_count || 0),
      orders: Array.isArray(data.data) ? data.data.map(normalizeOrder) : [],
    }
  },

  async products() {
    const response = await apiRequest('/admin/products')
    return Array.isArray(response.data) ? response.data.map(normalizeProduct) : []
  },

  async orders() {
    const response = await apiRequest('/admin/orders')
    return Array.isArray(response.data) ? response.data.map(normalizeOrder) : []
  },

  async users() {
    const response = await apiRequest('/admin/users')
    return Array.isArray(response.data) ? response.data.map(normalizeUser) : []
  },
}
