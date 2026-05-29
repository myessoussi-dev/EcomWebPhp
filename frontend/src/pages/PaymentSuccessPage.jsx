import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { apiRequest } from '../services/apiClient.js';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('Session ID is missing.');
      return;
    }

    // Call payment success confirmation API
    apiRequest(`/payment-success?session_id=${encodeURIComponent(sessionId)}`)
      .then((data) => {
        clearCart();
        setOrderId(data.order_id);
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Verification failed.');
      });
  }, [sessionId, clearCart]);

  return (
    <section className="section container text-center" style={{ padding: '6rem 2rem' }}>
      <div className="panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
        <span className="eyebrow" style={{ color: '#16a34a' }}>Stripe Payment</span>
        
        {status === 'loading' && (
          <>
            <h1 className="section-title" style={{ marginTop: '1rem' }}>Verifying payment...</h1>
            <p className="hero-copy">Please hold on while we confirm your order.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="section-title" style={{ marginTop: '1rem', color: '#16a34a' }}>Payment Confirmed</h1>
            <p className="hero-copy" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
              Thank you for your purchase!
            </p>
            <p className="hero-copy" style={{ color: '#666' }}>
              Your order <strong>#{orderId}</strong> has been successfully placed.
            </p>
            <Link to="/orders" className="button" style={{ marginTop: '2rem', display: 'inline-block' }}>
              View Order History
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="section-title" style={{ marginTop: '1rem', color: '#dc2626' }}>Payment Failed</h1>
            <p className="hero-copy" style={{ color: '#dc2626' }}>{errorMsg}</p>
            <p className="hero-copy" style={{ color: '#666' }}>
              There was an issue verifying your payment. Please contact support if this persists.
            </p>
            <Link to="/cart" className="button button--secondary" style={{ marginTop: '2rem', display: 'inline-block' }}>
              Return to Cart
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
