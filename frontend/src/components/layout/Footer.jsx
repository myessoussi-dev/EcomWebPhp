import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link className="brand" to="/"><span className="brand__mark">E</span><span>EcomWeb</span></Link>
          <p style={{ marginTop: '1rem' }}>A responsive commerce frontend built for the project API, curated products, and clean shopping flows.</p>
        </div>
        <div className="footer__links"><h3>Shop</h3><Link to="/shop">All products</Link><Link to="/categories/new-arrivals">New arrivals</Link><Link to="/wishlist">Wishlist</Link></div>
        <div className="footer__links"><h3>Support</h3><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><Link to="/orders">Orders</Link></div>
        <div className="footer__links"><h3>Account</h3><Link to="/login">Login</Link><Link to="/register">Register</Link><Link to="/account">Profile</Link></div>
      </div>
    </footer>
  )
}
