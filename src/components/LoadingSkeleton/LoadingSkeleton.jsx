export default function LoadingSkeleton({ variant = 'menu' }) {
  if (variant === 'product') {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2" aria-hidden="true">
        <div className="skeleton aspect-square" />
        <div className="space-y-3 pt-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-8 w-28" />
          <div className="skeleton h-12 w-40" />
        </div>
      </div>
    )
  }

  if (variant === 'orders') {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="skeleton h-36 w-full" />
        <div className="skeleton h-36 w-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card overflow-hidden">
          <div className="skeleton aspect-square rounded-none" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="flex justify-between">
              <div className="skeleton h-6 w-16" />
              <div className="skeleton h-11 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
