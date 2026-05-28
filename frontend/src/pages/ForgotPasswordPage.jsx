import Button from '../components/ui/Button.jsx'

export default function ForgotPasswordPage() {
  return <section className="section container"><div className="panel auth-card"><form className="form"><span className="eyebrow">Reset access</span><h1>Forgot YOUR_DB_PASSWORD</h1><p className="section-copy">Enter your email and the app can connect this request once the backend YOUR_DB_PASSWORD reset route exists.</p><label className="label">Email<input className="field" type="email" /></label><Button type="submit">Send reset link</Button></form></div></section>
}
