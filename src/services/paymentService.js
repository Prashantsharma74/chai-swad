import api from './api'

export async function createPayment(payload) {
  const response = await api.post('/payment/create', payload)
  return response.data.data
}

export async function verifyPayment(payload) {
  const response = await api.post('/payment/verify', payload)
  return response.data.data.order
}
