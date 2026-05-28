import EmptyState from '../components/ui/EmptyState.jsx'

export default function NotFoundPage() {
  return <section className="section container"><EmptyState actionLabel="Go home" actionTo="/" message="The page you requested does not exist." title="404 page not found" /></section>
}
