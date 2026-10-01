import { formatINR } from '../../utils/currency'

export default function OrderSummary({
  lines,
  subtotal,
  tax,
  total,
  taxLabel = 'GST',
  note
}) {
  const showTax = Number(tax) > 0
  return (
    <section className="card p-5">
      <h2 className="text-xl font-semibold">Order summary</h2>
      {lines?.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((line) => (
            <li key={`${line.name}-${line.quantity}`} className="flex justify-between gap-4">
              <span>
                {line.quantity} × {line.name}
              </span>
              <span>{formatINR(line.total)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <dl className="mt-4 space-y-2 border-t border-mist pt-4">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatINR(subtotal)}</dd>
        </div>
        {showTax ? (
          <div className="flex justify-between">
            <dt>{taxLabel}</dt>
            <dd>{formatINR(tax)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-dashed border-mist pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd>{total === null || total === undefined ? '—' : formatINR(total)}</dd>
        </div>
      </dl>
      {note ? <p className="mt-3 text-sm text-cocoa">{note}</p> : null}
    </section>
  )
}
