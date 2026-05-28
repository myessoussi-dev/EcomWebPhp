import { useState } from 'react'
import FiltersSidebar from '../components/commerce/FiltersSidebar.jsx'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import SearchBar from '../components/commerce/SearchBar.jsx'
import Breadcrumbs from '../components/navigation/Breadcrumbs.jsx'
import { useProducts } from '../hooks/useProducts.js'

export default function ShopPage() {
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('featured')
  const { error, loading, products } = useProducts({ category, sort })
  return (
    <section className="section--tight"><div className="container"><div className="page-hero"><Breadcrumbs items={[{ label: 'Shop' }]} /><div className="page-hero__inner"><span className="eyebrow">Shop</span><h1>All products</h1><p className="section-copy">Browse the complete catalog with filters, sorting, and API-ready data loading.</p></div></div><div className="toolbar"><SearchBar /><p className="muted">{products.length} products</p></div><div className="commerce-layout"><FiltersSidebar onCategoryChange={setCategory} onSortChange={setSort} selectedCategory={category} sort={sort} /><ProductGrid error={error} loading={loading} products={products} /></div></div></section>
  )
}
