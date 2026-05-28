import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { notify } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    notify('Logged out successfully.')
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <section className="section container">
        <EmptyState
          actionLabel="Log in to your account"
          actionTo="/login"
          message="Please log in to view and manage your profile details."
          title="Account access required"
        />
      </section>
    )
  }

  return (
    <section className="section--tight">
      <div className="container">
        <div className="page-hero__inner" style={{ margin: '2rem 0' }}>
          <span className="eyebrow">Account</span>
          <h1 className="section-title">Your profile</h1>
        </div>
        <div className="grid grid--2">
          <form className="panel form" onSubmit={(e) => e.preventDefault()}>
            <h2>Profile details</h2>
            <label className="label">
              Username
              <input className="field" readOnly value={user?.username || ''} />
            </label>
            <label className="label">
              Email
              <input className="field" readOnly value={user?.email || ''} type="email" />
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button type="button" onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </div>
          </form>
          <div className="panel form">
            <h2>Preferences</h2>
            <label className="check-row">
              <span>Email order updates</span>
              <input defaultChecked type="checkbox" />
            </label>
            <label className="check-row">
              <span>Product recommendations</span>
              <input defaultChecked type="checkbox" />
            </label>
            <Button to="/orders" variant="secondary">
              View orders
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
