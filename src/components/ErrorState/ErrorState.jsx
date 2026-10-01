export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="card mx-auto max-w-lg px-6 py-10 text-center" role="alert">
      <p className="text-lg font-semibold">{message}</p>
      {onRetry ? (
        <button type="button" className="btn-primary mt-5" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  )
}
