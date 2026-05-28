import { useState, useEffect } from 'react';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/format.js';
import { orderService } from '../services/orderService.js';

export default function CheckoutPage() {
  const { cart, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [customer, setCustomer] = useState({
    full_name: '',
    email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        email: user.email || '',
        full_name: user.username || ''
      }));
    }
  }, [user]);

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setError('');
    try {
      const response = await orderService.checkout(customer, cart);
      // Expect response like { success: true, checkout_url: '...' }
      if (response && response.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.checkout_url;
        // Optionally clear cart after successful redirect
        clearCart();
      } else {
        setError('Unexpected response from checkout server.');
        console.error('Unexpected checkout response', response);
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Please check your information and try again.');
      console.error('Checkout failed', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section container">
        <EmptyState
          actionLabel="Log in to your account"
          actionTo="/login"
          message="You must be logged in to complete your checkout and place an order."
          title="Authentication required"
          error={error}
        />
      </section>
    );
  }

  if (!cart.length)
    return (
      <section className="section container">
        <EmptyState
          actionLabel="Browse products"
          actionTo="/shop"
          message="Add products before starting checkout."
          title="No checkout items"
          error={error}
        />
      </section>
    );

  return (
    <section className="section--tight">
      <div className="container">
        <div className="page-hero__inner" style={{ margin: '2rem 0' }}>
          <span className="eyebrow">Checkout</span>
          <h1 className="section-title">Secure checkout</h1>
        </div>
        <div className="split">
          <form className="panel form" onSubmit={handlePlaceOrder}>
            <div className="form-row">
              <label className="label">
                Full name
                <input
                  className="field"
                  name="full_name"
                  required
                  value={customer.full_name}
                  onChange={handleChange}
                />
              </label>
              <label className="label">
                Phone
                <input
                  className="field"
                  name="phone"
                  required
                  value={customer.phone}
                  onChange={handleChange}
                />
              </label>
            </div>
            <label className="label">
              Email
              <input
                className="field"
                name="email"
                type="email"
                required
                value={customer.email}
                onChange={handleChange}
              />
            </label>
            <label className="label">
              Address
              <input
                className="field"
                name="address"
                required
                value={customer.address}
                onChange={handleChange}
              />
            </label>
            <div className="form-row">
              <label className="label">
                City
                <input className="field" required />
              </label>
              <label className="label">
                Postal code
                <input className="field" required />
              </label>
            </div>
            {error && (
              <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fee2e2', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <Button type="submit">Place order</Button>
          </form>
          <aside className="panel summary">
            <h2>Order total</h2>
            {cart.map((item) => (
              <div className="summary-row" key={item.id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
            <hr />
            <div className="summary-row">
              <span>Total due</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
