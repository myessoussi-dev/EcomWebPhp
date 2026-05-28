import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart.js'
import { useAuth } from '../../hooks/useAuth.js'
import Button from '../ui/Button.jsx'

const links = [['Shop', '/shop'], ['Categories', '/categories/new-arrivals'], ['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount, notify } = useCart()
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    notify('Logged out successfully.')
    navigate('/')
    setOpen(false)
  }

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
          {isAuthenticated ? (
            <>
              <NavLink className="navbar__link desktop-only" to="/account" title={`Logged in as ${user?.username || 'user'}`}>
                Account
              </NavLink>
              <button 
                onClick={handleLogout} 
                className="navbar__link desktop-only" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink className="navbar__link desktop-only" to="/login">Login</NavLink>
          )}
          <Link className="cart-chip" aria-label={`${cartCount} items in cart`} to="/cart">{cartCount}</Link>
          <Button className="desktop-only" size="sm" to="/shop">Shop now</Button>
          <Button aria-expanded={open} aria-label="Toggle menu" className="mobile-toggle" onClick={() => setOpen((value) => !value)} size="sm" variant="secondary">Menu</Button>
        </div>
      </div>
      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        <nav className="mobile-menu__inner" aria-label="Mobile navigation">
          {links.map(([label, to]) => (
            <NavLink className="navbar__link" key={to} onClick={() => setOpen(false)} to={to}>{label}</NavLink>
          ))}
          <NavLink className="navbar__link" onClick={() => setOpen(false)} to="/wishlist">Wishlist</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink className="navbar__link" onClick={() => setOpen(false)} to="/account">Account</NavLink>
              <button 
                onClick={handleLogout} 
                className="navbar__link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: '0.75rem 0', textAlign: 'left' }}
              >
                Logout ({user?.username})
              </button>
            </>
          ) : (
            <NavLink className="navbar__link" onClick={() => setOpen(false)} to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
