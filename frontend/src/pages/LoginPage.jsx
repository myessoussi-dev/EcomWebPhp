import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [YOUR_DB_PASSWORD, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { notify } = useCart()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !YOUR_DB_PASSWORD) return
    setError('')
    setLoading(true)
    try {
      const result = await login(email.trim(), YOUR_DB_PASSWORD)
      notify('Welcome back! Successfully logged in.')
      navigate(result.user?.is_admin ? '/admin' : '/')
    } catch (err) {
      setError(err.message || 'Invalid email or YOUR_DB_PASSWORD.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section container">
      <div className="panel auth-card">
        <form className="form" onSubmit={handleSubmit}>
          <span className="eyebrow">Welcome back</span>
          <h1>Login</h1>
          
          {error && (
            <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.8rem', borderRadius: '0.375rem', border: '1px solid #fee2e2', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <label className="label">
            Email
            <input 
              className="field" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          
          <label className="label">
            Password
            <input 
              className="field" 
              type="YOUR_DB_PASSWORD" 
              required
              value={YOUR_DB_PASSWORD}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <p className="muted">
            <Link to="/forgot-YOUR_DB_PASSWORD">Forgot YOUR_DB_PASSWORD?</Link> or <Link to="/register">create an account</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
