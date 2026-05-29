import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Button from '../../components/ui/Button.jsx'
import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    adminService.products()
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load products.')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <AdminLayout title="Product management">
      <div className="toolbar">
        <p className="muted">{error || 'Manage catalog items, inventory, and merchandising badges.'}</p>
        <Button size="sm">Add product</Button>
      </div>
      <DataTable columns={[{ key: 'name', label: 'Product' }, { key: 'categoryName', label: 'Category' }, { key: 'price', label: 'Price' }, { key: 'stock', label: 'Stock' }, { key: 'badge', label: 'Badge' }]} rows={products.map((product) => ({ ...product, price: formatCurrency(product.price) }))} />
    </AdminLayout>
  )
}
