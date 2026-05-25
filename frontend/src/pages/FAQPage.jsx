const faqs = [
  ['How do API calls work?', 'The frontend uses a service layer and falls back to local data until product/category backend endpoints are available.'],
  ['Can customers save products?', 'Yes. Wishlist and cart state persist locally and are ready to map to authenticated backend records.'],
  ['Is checkout complete?', 'The UI flow is complete and structured for posting order payloads once the endpoint exists.'],
  ['Is there an admin dashboard?', 'Yes. The admin area includes dashboard, product, order, and user management screens.'],
]

export default function FAQPage() {
  return <section className="section container"><div className="page-hero__inner"><span className="eyebrow">FAQ</span><h1 className="section-title">Common questions</h1></div><div className="faq-list" style={{ marginTop: '2rem' }}>{faqs.map(([question, answer]) => <details className="panel faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
}
