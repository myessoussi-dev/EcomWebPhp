import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../utils/format.js'

export default function CheckoutPage() {
  const { cart, clearCart, total } = useCart()
  if (!cart.length) return <section className="section container"><EmptyState actionLabel="Browse products" actionTo="/shop" message="Add products before starting checkout." title="No checkout items" /></section>
  return <section className="section--tight"><div className="container"><div className="page-hero__inner" style={{ margin: '2rem 0' }}><span className="eyebrow">Checkout</span><h1 className="section-title">Secure checkout</h1></div><div className="split"><form className="panel form"><div className="form-row"><label className="label">First name<input className="field" required /></label><label className="label">Last name<input className="field" required /></label></div><label className="label">Email<input className="field" required type="email" /></label><label className="label">Address<input className="field" required /></label><div className="form-row"><label className="label">City<input className="field" required /></label><label className="label">Postal code<input className="field" required /></label></div><Button onClick={clearCart} type="button">Place order</Button></form><aside className="panel summary"><h2>Order total</h2>{cart.map((item) => <div className="summary-row" key={item.id}><span>{item.name} x {item.quantity}</span><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}<hr /><div className="summary-row"><span>Total due</span><strong>{formatCurrency(total)}</strong></div></aside></div></div></section>
}
