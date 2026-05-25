export default function Loader({ label = 'Loading store data...' }) {
  return (
    <div className="loader" role="status">
      <div className="grid grid--3" style={{ width: '100%' }}>
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <p className="muted">{label}</p>
    </div>
  )
}
