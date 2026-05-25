import CategoryCard from '../components/commerce/CategoryCard.jsx'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import SearchBar from '../components/commerce/SearchBar.jsx'
import Button from '../components/ui/Button.jsx'
import { categories, products } from '../data/catalog.js'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">Curated commerce</span>
            <h1>Objects for better everyday living.</h1>
            <p className="hero__subtitle">Shop modern essentials, home goods, accessories, and season-ready pieces through a fast, responsive storefront built for real checkout flows.</p>
            <SearchBar />
            <div className="hero__actions"><Button size="lg" to="/shop">Explore shop</Button><Button size="lg" to="/about" variant="secondary">Our story</Button></div>
          </div>
          <div className="hero__visual" aria-label="Featured product">
            <div className="hero-product">
              <img alt={products[0].name} src={products[0].image} />
              <div className="hero-product__body"><div><span className="badge">Featured</span><h3>{products[0].name}</h3></div><Button size="sm" to={`/products/${products[0].slug}`}>View</Button></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Categories</span><h2 className="section-title">Shop by mood.</h2></div><p className="section-copy">Simple category paths make the storefront easy to connect to backend category APIs.</p></div><div className="grid grid--4">{categories.map((category) => <CategoryCard category={category} key={category.id} />)}</div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Featured picks</span><h2 className="section-title">Fresh in store.</h2></div><Button to="/shop" variant="secondary">View all</Button></div><ProductGrid loading={false} products={products.slice(0, 6)} /></div></section>
    </>
  )
}
