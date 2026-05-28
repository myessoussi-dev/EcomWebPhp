import ProductGrid from '../components/commerce/ProductGrid.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useCart } from '../hooks/useCart.js'

export default function WishlistPage() {
  const { wishlist } = useCart()
  return <section className="section--tight"><div className="container"><div className="page-hero__inner" style={{ margin: '2rem 0' }}><span className="eyebrow">Wishlist</span><h1 className="section-title">Saved products</h1></div>{wishlist.length ? <ProductGrid loading={false} products={wishlist} /> : <EmptyState actionLabel="Find favorites" actionTo="/shop" message="Save products you want to revisit later." title="No saved products" />}</div></section>
}
