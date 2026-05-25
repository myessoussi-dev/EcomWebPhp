import DataTable from '../components/admin/DataTable.jsx'
import { orders } from '../data/catalog.js'
import { formatCurrency } from '../utils/format.js'

export default function OrderHistoryPage() {
  return <section className="section--tight"><div className="container"><div className="page-hero__inner" style={{ margin: '2rem 0' }}><span className="eyebrow">Orders</span><h1 className="section-title">Order history</h1></div><DataTable columns={[{ key: 'id', label: 'Order' }, { key: 'date', label: 'Date' }, { key: 'items', label: 'Items' }, { key: 'status', label: 'Status' }, { key: 'total', label: 'Total' }]} rows={orders.map((order) => ({ ...order, total: formatCurrency(order.total) }))} /></div></section>
}
