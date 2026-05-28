import { useEffect, useState } from 'react'
import DataTable from '../components/admin/DataTable.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { orderService } from '../services/orderService.js'
import { formatCurrency } from '../utils/format.js'

const InvoiceDownloadButton = ({ orderId, email }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (e) => {
    e.preventDefault()
    setDownloading(true)
    try {
      const blob = await orderService.generateInvoice(orderId, email)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to download invoice')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button 
      onClick={handleDownload} 
      disabled={downloading}
      style={{ 
        background: 'none', 
        border: 'none', 
        color: '#2563eb', 
        cursor: 'pointer', 
        textDecoration: 'underline', 
        padding: 0,
        fontSize: '0.9rem',
        fontWeight: 500
      }}
    >
      {downloading ? 'Downloading...' : 'Download PDF'}
    </button>
  )
}

export default function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth()
  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false)
      return
    }

    let isMounted = true
    orderService.listByEmail(user.email)
      .then((data) => {
        if (isMounted) {
          setOrdersList(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch order history.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user?.email])

  if (!isAuthenticated) {
    return (
      <section className="section container">
        <EmptyState
          actionLabel="Log in to your account"
          actionTo="/login"
          message="Please log in to view your past orders and download invoices."
          title="Account access required"
        />
      </section>
    )
  }

  if (loading) {
    return (
      <section className="section container" style={{ textAlign: 'center' }}>
        <p className="muted">Loading your orders...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section container" style={{ textAlign: 'center' }}>
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', display: 'inline-block' }}>
          {error}
        </div>
      </section>
    )
  }

  if (ordersList.length === 0) {
    return (
      <section className="section container">
        <EmptyState
          actionLabel="Go to Shop"
          actionTo="/shop"
          message="You haven't placed any orders yet."
          title="No orders found"
        />
      </section>
    )
  }

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'date', label: 'Date' },
    { key: 'items', label: 'Items' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total' },
    { key: 'invoice', label: 'Invoice' }
  ]

  const rows = ordersList.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.product_name} (x${item.quantity})`)
      .join(', ')

    const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return {
      id: `#${order.id}`,
      date: dateStr,
      items: itemsSummary,
      status: (
        <span style={{ textTransform: 'capitalize', fontWeight: 600, color: order.status === 'paid' ? '#16a34a' : '#d97706' }}>
          {order.status}
        </span>
      ),
      total: formatCurrency(parseFloat(order.total)),
      invoice: order.payment_status === 'paid' ? (
        <InvoiceDownloadButton orderId={order.id} email={user.email} />
      ) : (
        <span className="muted" style={{ fontSize: '0.9rem' }}>N/A (Unpaid)</span>
      )
    }
  })

  return (
    <section className="section--tight">
      <div className="container">
        <div className="page-hero__inner" style={{ margin: '2rem 0' }}>
          <span className="eyebrow">Orders</span>
          <h1 className="section-title">Order history</h1>
        </div>
        <DataTable columns={columns} rows={rows} />
      </div>
    </section>
  )
}
