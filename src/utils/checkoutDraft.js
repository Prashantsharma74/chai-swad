const CHECKOUT_KEY = 'chai-swad-checkout'

export function readCheckoutDraft() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CHECKOUT_KEY) || '{}')
    return {
      name: parsed.name || '',
      phone: parsed.phone || '',
      address: parsed.address || ''
    }
  } catch {
    return { name: '', phone: '', address: '' }
  }
}

export function saveCheckoutDraft(draft) {
  sessionStorage.setItem(
    CHECKOUT_KEY,
    JSON.stringify({
      name: draft.name || '',
      phone: draft.phone || '',
      address: draft.address || ''
    })
  )
}

export function clearCheckoutDraft() {
  sessionStorage.removeItem(CHECKOUT_KEY)
}
