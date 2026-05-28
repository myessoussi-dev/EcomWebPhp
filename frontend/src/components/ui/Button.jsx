import { Link } from 'react-router-dom'

export default function Button({ children, className = '', size = 'md', to, type = 'button', variant = 'primary', ...props }) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>
  return <button className={classes} type={type} {...props}>{children}</button>
}
