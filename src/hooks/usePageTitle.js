import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Chai Swad` : 'Chai Swad — Har Bite Mein Swad'
  }, [title])
}
