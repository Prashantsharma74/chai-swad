export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Menu categories">
      {categories.map((category) => {
        const selected = category === active
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
              selected ? 'bg-terracotta text-white' : 'border border-mist bg-foam text-brown'
            }`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
