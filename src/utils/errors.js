const TECHNICAL = /stack|exception|econn|mongo|axios|network error|request failed|internal server|etimedout/i

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const apiMessage = error?.response?.data?.message
  if (apiMessage === 'One or more items are invalid') {
    return 'Some items need to be added again. Go back to the menu, then return to checkout.'
  }
  if (typeof apiMessage === 'string' && apiMessage.length < 160 && !TECHNICAL.test(apiMessage)) {
    return apiMessage
  }

  if (!error?.response) {
    return 'Unable to connect. Please try again.'
  }

  return fallback
}
