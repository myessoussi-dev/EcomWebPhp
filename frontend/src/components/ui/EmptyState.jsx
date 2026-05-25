import Button from './Button.jsx'

export default function EmptyState({ actionLabel, actionTo, message, title = 'Nothing here yet' }) {
  return (
    <div className="empty-state">
      <span className="eyebrow">Empty</span>
      <h2>{title}</h2>
      <p className="section-copy">{message}</p>
      {actionLabel && actionTo ? <Button to={actionTo}>{actionLabel}</Button> : null}
    </div>
  )
}
