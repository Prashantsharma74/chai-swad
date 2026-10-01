import { Link } from 'react-router-dom'

export default function EmptyState({ title, message, actionLabel = 'Explore Menu', to = '/menu' }) {
  return (
    <div className="card mx-auto max-w-lg px-6 py-14 text-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {message ? <p className="mt-2 text-cocoa">{message}</p> : null}
      <Link to={to} className="btn-primary mt-6">
        {actionLabel}
      </Link>
    </div>
  )
}
