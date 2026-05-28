import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import { orders } from '../../data/catalog.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminOrdersPage() {
  return <AdminLayout title="Orders management"><DataTable columns={[{ key: 'id', label: 'Order' }, { key: 'date', label: 'Date' }, { key: 'items', label: 'Items' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }]} rows={orders.map((order) => ({ ...order, total: formatCurrency(order.total) }))} /></AdminLayout>
}
