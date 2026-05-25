import AdminLayout from '../../components/admin/AdminLayout.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import { orders, products } from '../../data/catalog.js'
import { formatCurrency } from '../../utils/format.js'

export default function AdminDashboardPage() {
  return <AdminLayout title="Dashboard"><div className="grid grid--4"><StatCard label="Revenue" value={formatCurrency(48240)} /><StatCard label="Orders" value="1,284" /><StatCard label="Products" value={products.length} /><StatCard label="Conversion" value="4.8%" /></div><div style={{ marginTop: '1.5rem' }}><DataTable columns={[{ key: 'id', label: 'Order' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }]} rows={orders.map((order) => ({ ...order, total: formatCurrency(order.total) }))} /></div></AdminLayout>
}
