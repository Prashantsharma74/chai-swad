import api from './api'

export async function getContact() {
  const response = await api.get('/contact')
  return response.data.data.contact
}
