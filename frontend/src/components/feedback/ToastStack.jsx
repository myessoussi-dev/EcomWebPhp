import { useCart } from '../../hooks/useCart.js'

export default function ToastStack() {
  const { toasts } = useCart()
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => <div className="toast" key={toast.id}>{toast.message}</div>)}
    </div>
  )
}
