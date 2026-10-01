import api from './api'

const MENU_CACHE_KEY = 'chai-swad-menu-cache'
const MENU_CACHE_MS = 5 * 60 * 1000

function readMenuCache() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(MENU_CACHE_KEY) || 'null')
    if (!parsed?.savedAt || !parsed.data) return null
    if (Date.now() - parsed.savedAt > MENU_CACHE_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeMenuCache(data) {
  try {
    sessionStorage.setItem(MENU_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Ignore quota errors.
  }
}

export async function getMenu(category) {
  if (!category) {
    const cached = readMenuCache()
    if (cached) return cached
  }

  const response = await api.get('/menu', {
    params: category ? { category } : undefined
  })
  const data = response.data.data
  if (!category) writeMenuCache(data)
  return data
}

export async function getMenuItem(id) {
  const response = await api.get(`/menu/${id}`)
  return response.data.data.item
}
