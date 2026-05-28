import { Link } from 'react-router-dom';

export default function PaymentCancelPage() {
  return (
    <section className="section container text-center" style={{ padding: '6rem 2rem' }}>
      <div className="panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
        <span className="eyebrow" style={{ color: '#dc2626' }}>Checkout</span>
        <h1 className="section-title" style={{ marginTop: '1rem', color: '#dc2626' }}>Payment Cancelled</h1>
        <p className="hero-copy" style={{ color: '#666' }}>
          Your payment transaction was cancelled. No charges were made to your account.
        </p>
        <p className="hero-copy">
          You can return to your cart and complete checkout whenever you are ready.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/cart" className="button">
            Return to Cart
          </Link>
          <Link to="/shop" className="button button--secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
