import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.js'
import { formatCurrency } from '../../utils/format.js'
import Button from '../ui/Button.jsx'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart()
  const wished = wishlist.some((item) => item.id === product.id)
  return (
    <article className="card product-card">
      <Link className="product-card__media" to={`/products/${product.slug}`}>
        <img alt={product.name} src={product.image} />
        <span className="badge product-card__badge">{product.badge}</span>
      </Link>
      <button aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} className={`product-card__wish ${wished ? 'is-active' : ''}`} onClick={() => toggleWishlist(product)} type="button">{wished ? 'W' : '+'}</button>
      <div className="product-card__body">
        <div className="product-card__meta">
          <div><Link to={`/products/${product.slug}`}><h3>{product.name}</h3></Link><p className="muted">{product.categoryName}</p></div>
          <strong className="price">{formatCurrency(product.price)}</strong>
        </div>
        <p className="rating">{product.rating} rating</p>
        <Button onClick={() => addToCart(product)} size="sm">Add to cart</Button>
      </div>
    </article>
  )
}
