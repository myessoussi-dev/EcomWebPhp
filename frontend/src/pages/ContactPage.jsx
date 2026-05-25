import Button from '../components/ui/Button.jsx'

export default function ContactPage() {
  return <section className="section container"><div className="grid grid--2"><div className="page-hero__inner"><span className="eyebrow">Contact</span><h1 className="section-title">We are here to help.</h1><p className="section-copy">Send a message about orders, product questions, returns, or store partnerships.</p></div><form className="panel form"><label className="label">Name<input className="field" /></label><label className="label">Email<input className="field" type="email" /></label><label className="label">Message<textarea className="textarea" /></label><Button type="submit">Send message</Button></form></div></section>
}
