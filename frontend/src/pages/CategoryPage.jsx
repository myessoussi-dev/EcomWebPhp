import { useParams } from 'react-router-dom'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import Breadcrumbs from '../components/navigation/Breadcrumbs.jsx'
import { categories } from '../data/catalog.js'
import { useProducts } from '../hooks/useProducts.js'
import { slugToTitle } from '../utils/format.js'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = categories.find((item) => item.slug === slug)
  const { error, loading, products } = useProducts({ category: slug })
  return <section className="section--tight"><div className="container"><div className="page-hero"><Breadcrumbs items={[{ label: 'Categories', to: '/shop' }, { label: category?.name || slugToTitle(slug) }]} /><div className="page-hero__inner"><span className="eyebrow">Category</span><h1>{category?.name || slugToTitle(slug)}</h1><p className="section-copy">{category?.description || 'Products grouped by category.'}</p></div></div><ProductGrid error={error} loading={loading} products={products} /></div></section>
}
