import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function LoginPage() {
  return <section className="section container"><div className="panel auth-card"><form className="form"><span className="eyebrow">Welcome back</span><h1>Login</h1><label className="label">Email<input className="field" type="email" /></label><label className="label">Password<input className="field" type="YOUR_DB_PASSWORD" /></label><Button type="submit">Sign in</Button><p className="muted"><Link to="/forgot-YOUR_DB_PASSWORD">Forgot YOUR_DB_PASSWORD?</Link> or <Link to="/register">create an account</Link></p></form></div></section>
}
