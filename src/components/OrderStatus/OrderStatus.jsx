const STEPS = [
  { index: 0, label: 'Payment Successful' },
  { index: 1, label: 'Order Received' },
  { index: 2, label: 'Preparing' },
  { index: 3, label: 'Ready' },
  { index: 4, label: 'Completed' }
]

const RANK = {
  RECEIVED: 1,
  PREPARING: 2,
  READY: 3,
  COMPLETED: 4
}

export default function OrderStatus({ status }) {
  if (status === 'CANCELLED') {
    return (
      <section className="card p-5">
        <h2 className="text-xl font-semibold">Status</h2>
        <p className="mt-3 rounded-2xl bg-cream px-4 py-3 font-semibold text-clay">This order was cancelled.</p>
      </section>
    )
  }

  const rank = RANK[status] ?? 1

  return (
    <section className="card p-5">
      <h2 className="text-xl font-semibold">Order status</h2>
      <ol className="mt-5 space-y-0">
        {STEPS.map((step, index) => {
          let state = 'upcoming'
          if (status === 'COMPLETED' || step.index < rank) state = 'done'
          else if (step.index === rank) state = 'current'
          const last = index === STEPS.length - 1

          return (
            <li key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                    state === 'done'
                      ? 'bg-leaf text-white'
                      : state === 'current'
                        ? 'bg-terracotta text-white'
                        : 'bg-cream text-cocoa'
                  }`}
                  aria-hidden="true"
                >
                  {state === 'done' ? '✓' : state === 'current' ? '●' : '○'}
                </span>
                {last ? null : <span className={`h-6 w-px ${state === 'upcoming' ? 'bg-mist' : 'bg-terracotta/40'}`} />}
              </div>
              <span className={`pt-1 ${state === 'upcoming' ? 'text-cocoa' : 'font-semibold'}`}>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
