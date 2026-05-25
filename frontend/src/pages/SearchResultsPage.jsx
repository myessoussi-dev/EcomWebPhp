import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/commerce/ProductGrid.jsx'
import SearchBar from '../components/commerce/SearchBar.jsx'
import Breadcrumbs from '../components/navigation/Breadcrumbs.jsx'
import { useProducts } from '../hooks/useProducts.js'

export default function SearchResultsPage() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const { error, loading, products } = useProducts({ query })
  return <section className="section--tight"><div className="container"><div className="page-hero"><Breadcrumbs items={[{ label: 'Search' }]} /><div className="page-hero__inner"><span className="eyebrow">Search</span><h1>Results for {query || 'all products'}</h1><SearchBar defaultValue={query} /></div></div><ProductGrid error={error} loading={loading} products={products} /></div></section>
}
