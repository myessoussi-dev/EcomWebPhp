import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useCart } from '../hooks/useCart.js'
import { formatCurrency } from '../utils/format.js'

export default function CartPage() {
  const { cart, removeFromCart, setQuantity, shipping, subtotal, tax, total } = useCart()
  if (!cart.length) return <section className="section container"><EmptyState actionLabel="Start shopping" actionTo="/shop" message="Your cart is ready for something good." title="Your cart is empty" /></section>
  return (
    <section className="section--tight"><div className="container"><div className="page-hero__inner" style={{ margin: '2rem 0' }}><span className="eyebrow">Cart</span><h1 className="section-title">Shopping cart</h1></div><div className="split"><div className="cart-list">{cart.map((item) => <article className="panel cart-item" key={item.id}><img alt={item.name} src={item.image} /><div><h3>{item.name}</h3><p className="muted">{formatCurrency(item.price)} each</p><button className="btn btn--ghost btn--sm" onClick={() => removeFromCart(item.id)} type="button">Remove</button></div><div className="qty"><button onClick={() => setQuantity(item.id, item.quantity - 1)} type="button">-</button><span>{item.quantity}</span><button onClick={() => setQuantity(item.id, item.quantity + 1)} type="button">+</button></div></article>)}</div><aside className="panel summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-row"><span>Shipping</span><strong>{shipping ? formatCurrency(shipping) : 'Free'}</strong></div><div className="summary-row"><span>Estimated tax</span><strong>{formatCurrency(tax)}</strong></div><hr /><div className="summary-row"><span>Total</span><strong>{formatCurrency(total)}</strong></div><Button to="/checkout">Checkout</Button></aside></div></div></section>
  )
}
