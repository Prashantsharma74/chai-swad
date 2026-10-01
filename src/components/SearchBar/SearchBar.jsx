import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search menu...' }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search menu</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa" />
      <input
        className="field pl-11"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
