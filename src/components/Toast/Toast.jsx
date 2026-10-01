import { useEffect } from 'react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(onClose, 5000)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 md:bottom-6" role="alert">
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-clay px-4 py-3 text-sm font-medium text-white shadow-card">
        <p className="flex-1">{message}</p>
        <button type="button" className="min-h-11 shrink-0 font-semibold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
