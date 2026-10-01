import api from './api'

export async function calculateOrder(payload) {
  const response = await api.post('/orders', payload)
  return response.data.data.order
}

export async function getOrder(orderId) {
  const response = await api.get(`/orders/${orderId}`)
  return response.data.data.order
}

export async function getOrdersByPhone(phone) {
  const response = await api.get('/orders/by-phone', { params: { phone } })
  return response.data.data.orders
}
