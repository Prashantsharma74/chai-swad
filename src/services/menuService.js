import api from './api'

export async function getMenu(category) {
  const response = await api.get('/menu', {
    params: category ? { category } : undefined
  })
  return response.data.data
}

export async function getMenuItem(id) {
  const response = await api.get(`/menu/${id}`)
  return response.data.data.item
}
