import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    adminService.orders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load orders.')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <AdminLayout title="Orders management">
      {error && <p className="muted">{error}</p>}
      <DataTable columns={[{ key: 'id', label: 'Order' }, { key: 'date', label: 'Date' }, { key: 'customer', label: 'Customer' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }]} rows={orders.map((order) => ({ ...order, total: formatCurrency(order.total) }))} />
    </AdminLayout>
  )
}
