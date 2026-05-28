import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item) => <span key={item.label}><span>/ </span>{item.to ? <Link to={item.to}>{item.label}</Link> : item.label}</span>)}
    </nav>
  )
}
