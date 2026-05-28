import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/categories/${category.slug}`}>
      <img alt={category.name} src={category.image} />
      <div className="category-card__body"><span className="badge">{category.name}</span><h3>{category.name}</h3><p>{category.description}</p></div>
    </Link>
  )
}
