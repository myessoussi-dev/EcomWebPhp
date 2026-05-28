import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Button from '../../components/ui/Button.jsx'
import { products } from '../../data/catalog.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminProductsPage() {
  return <AdminLayout title="Product management"><div className="toolbar"><p className="muted">Manage catalog items, inventory, and merchandising badges.</p><Button size="sm">Add product</Button></div><DataTable columns={[{ key: 'name', label: 'Product' }, { key: 'categoryName', label: 'Category' }, { key: 'price', label: 'Price' }, { key: 'stock', label: 'Stock' }, { key: 'badge', label: 'Badge' }]} rows={products.map((product) => ({ ...product, price: formatCurrency(product.price) }))} /></AdminLayout>
}
