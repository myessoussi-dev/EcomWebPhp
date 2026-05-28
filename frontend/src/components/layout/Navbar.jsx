import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.js'
import Button from '../ui/Button.jsx'

const links = [['Shop', '/shop'], ['Categories', '/categories/new-arrivals'], ['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <Link className="brand" to="/"><span className="brand__mark">E</span><span>EcomWeb</span></Link>
          <nav className="navbar__links" aria-label="Primary navigation">
            {links.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          </nav>
        </div>
        <div className="navbar__actions">
          <NavLink className="navbar__link desktop-only" to="/wishlist">Wishlist</NavLink>
          <NavLink className="navbar__link desktop-only" to="/login">Login</NavLink>
          <Link className="cart-chip" aria-label={`${cartCount} items in cart`} to="/cart">{cartCount}</Link>
          <Button className="desktop-only" size="sm" to="/shop">Shop now</Button>
          <Button aria-expanded={open} aria-label="Toggle menu" className="mobile-toggle" onClick={() => setOpen((value) => !value)} size="sm" variant="secondary">Menu</Button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        <nav className="mobile-menu__inner" aria-label="Mobile navigation">
          {[...links, ['Wishlist', '/wishlist'], ['Account', '/account'], ['Admin', '/admin']].map(([label, to]) => (
            <NavLink className="navbar__link" key={to} onClick={() => setOpen(false)} to={to}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
