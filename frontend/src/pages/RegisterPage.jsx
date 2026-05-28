import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function RegisterPage() {
  return <section className="section container"><div className="panel auth-card"><form className="form"><span className="eyebrow">Join us</span><h1>Create account</h1><label className="label">Username<input className="field" /></label><label className="label">Email<input className="field" type="email" /></label><label className="label">Password<input className="field" type="YOUR_DB_PASSWORD" /></label><Button type="submit">Register</Button><p className="muted">Already registered? <Link to="/login">Login</Link></p></form></div></section>
}
