import { apiBlobRequest, apiRequest } from './apiClient.js'

function toCheckoutItem(item) {
  return {
    product_id: Number(item.id),
    quantity: Number(item.quantity),
  }
}

export const orderService = {
  async checkout(customer, cart) {
    return apiRequest('/checkout.php', {
      method: 'POST',
      body: JSON.stringify({
        customer,
        items: cart.map(toCheckoutItem),
      }),
    })
  },

  async listByEmail(email) {
    const data = await apiRequest(`/orders.php?email=${encodeURIComponent(email)}`)
    return data.orders || []
  },

  async generateInvoice(orderId, email) {
    return apiBlobRequest('/invoice.php', {
      method: 'POST',
      body: JSON.stringify({
        order_id: Number(orderId),
        email,
      }),
    })
  },
}
