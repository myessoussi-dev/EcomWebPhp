import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState({ revenue: 0, ordersCount: 0, productsCount: 0, orders: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    adminService.dashboard()
      .then((data) => {
        if (active) setDashboard(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load admin dashboard.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const rows = dashboard.orders.map((order) => ({ ...order, total: formatCurrency(order.total) }))

  return (
    <AdminLayout title="Dashboard">
      {error && <p className="muted">{error}</p>}
      <div className="grid grid--4">
        <StatCard label="Revenue" value={formatCurrency(dashboard.revenue)} />
        <StatCard label="Orders" value={loading ? '...' : dashboard.ordersCount} />
        <StatCard label="Products" value={loading ? '...' : dashboard.productsCount} />
        <StatCard label="Recent orders" value={loading ? '...' : rows.length} />
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <DataTable columns={[{ key: 'id', label: 'Order' }, { key: 'date', label: 'Date' }, { key: 'customer', label: 'Customer' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }]} rows={rows} />
      </div>
    </AdminLayout>
  )
}
