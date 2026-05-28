import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import Breadcrumbs from '../components/navigation/Breadcrumbs.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Loader from '../components/ui/Loader.jsx'
import { products } from '../data/catalog.js'
import { useCart } from '../hooks/useCart.js'
import { productService } from '../services/productService.js'
import { formatCurrency } from '../utils/format.js'

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, toggleWishlist } = useCart()
  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      const result = await productService.getProduct(slug)
      if (alive) { setProduct(result); setLoading(false) }
    }
    load()
    return () => { alive = false }
  }, [slug])
  if (loading) return <section className="section container"><Loader /></section>
  if (!product) return <section className="section container"><EmptyState actionLabel="Back to shop" actionTo="/shop" message="That product may have moved or sold out." title="Product not found" /></section>
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3)
  return (
    <section className="section--tight"><div className="container"><Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} /><div className="product-detail"><div className="product-detail__image"><img alt={product.name} src={product.image} /></div><div className="product-detail__info"><span className="eyebrow">{product.categoryName}</span><h1>{product.name}</h1><p className="section-copy">{product.description}</p><strong className="price" style={{ fontSize: '1.5rem' }}>{formatCurrency(product.price)}</strong><p className="muted">{product.stock} in stock. Rated {product.rating} by customers.</p><div className="qty" aria-label="Quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">-</button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} type="button">+</button></div><div className="hero__actions"><Button onClick={() => addToCart(product, quantity)} size="lg">Add to cart</Button><Button onClick={() => toggleWishlist(product)} size="lg" variant="secondary">Save</Button></div></div></div><div className="section"><div className="section-head"><div><span className="eyebrow">Related</span><h2 className="section-title">You may also like.</h2></div></div><ProductGrid loading={false} products={related} /></div></div></section>
  )
}
