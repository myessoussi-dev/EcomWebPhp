import { NavLink } from 'react-router-dom'

const adminLinks = [['Dashboard', '/admin'], ['Products', '/admin/products'], ['Orders', '/admin/orders'], ['Users', '/admin/users']]

export default function AdminLayout({ children, title }) {
  return (
    <section className="section--tight">
      <div className="container admin-shell">
        <aside className="panel admin-nav">{adminLinks.map(([label, to]) => <NavLink end={to === '/admin'} key={to} to={to}>{label}</NavLink>)}</aside>
        <div><div className="page-hero__inner" style={{ marginBottom: '1.5rem' }}><span className="eyebrow">Admin</span><h1 className="section-title">{title}</h1></div>{children}</div>
      </div>
    </section>
  )
}
