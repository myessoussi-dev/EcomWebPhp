import CategoryCard from '../components/commerce/CategoryCard.jsx'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import SearchBar from '../components/commerce/SearchBar.jsx'
import Button from '../components/ui/Button.jsx'
import { categories as fallbackCategories, products as fallbackProducts } from '../data/catalog.js'
import { useProducts } from '../hooks/useProducts.js'

export default function HomePage() {
  const { products, categories: fetchedCategories, loading } = useProducts()

  const displayProducts = products.length > 0 ? products : (loading ? [] : fallbackProducts)
  const displayCategories = fetchedCategories.length > 0 ? fetchedCategories : (loading ? [] : fallbackCategories)

  const featuredProduct = displayProducts[0]

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
            {featuredProduct ? (
              <div className="hero-product">
                <img alt={featuredProduct.name} src={featuredProduct.image} />
                <div className="hero-product__body">
                  <div>
                    <span className="badge">Featured</span>
                    <h3>{featuredProduct.name}</h3>
                  </div>
                  <Button size="sm" to={`/products/${featuredProduct.slug}`}>View</Button>
                </div>
              </div>
            ) : (
              <div className="hero-product hero-product--skeleton" style={{ background: '#f3f4f6', minHeight: '300px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="muted">Loading featured product...</span>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Categories</span>
              <h2 className="section-title">Shop by mood.</h2>
            </div>
            <p className="section-copy">Simple category paths make the storefront easy to connect to backend category APIs.</p>
          </div>
          <div className="grid grid--4">
            {displayCategories.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured picks</span>
              <h2 className="section-title">Fresh in store.</h2>
            </div>
            <Button to="/shop" variant="secondary">View all</Button>
          </div>
          <ProductGrid loading={loading} products={displayProducts.slice(0, 6)} />
        </div>
      </section>
    </>
  )
}
