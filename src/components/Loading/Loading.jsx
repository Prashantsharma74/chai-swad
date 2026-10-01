import { Loader2 } from 'lucide-react'

export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-cocoa" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      <p>{label}</p>
    </div>
  )
}
