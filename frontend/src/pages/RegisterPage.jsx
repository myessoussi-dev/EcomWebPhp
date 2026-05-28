import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useCart } from '../hooks/useCart.js'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [YOUR_DB_PASSWORD, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const { notify } = useCart()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !YOUR_DB_PASSWORD) return
    setError('')
    setLoading(true)
    try {
      await register(username, email, YOUR_DB_PASSWORD)
      notify('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed. Email or username might already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section container">
      <div className="panel auth-card">
        <form className="form" onSubmit={handleSubmit}>
          <span className="eyebrow">Join us</span>
          <h1>Create account</h1>

          {error && (
            <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.8rem', borderRadius: '0.375rem', border: '1px solid #fee2e2', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <label className="label">
            Username
            <input 
              className="field" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

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
            {loading ? 'Creating account...' : 'Register'}
          </Button>

          <p className="muted">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
