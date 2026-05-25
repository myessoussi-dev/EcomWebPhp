import EmptyState from '../ui/EmptyState.jsx'
import Loader from '../ui/Loader.jsx'
import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ error, loading, products }) {
  if (loading) return <Loader />
  if (error) return <EmptyState message={error} title="Products unavailable" />
  if (!products.length) return <EmptyState actionLabel="Browse all products" actionTo="/shop" message="Try another search term or clear your filters to see more products." title="No products found" />
  return <div className="grid grid--3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}
