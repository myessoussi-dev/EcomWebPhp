import { Outlet } from 'react-router-dom'
import ToastStack from '../feedback/ToastStack.jsx'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main"><Outlet /></main>
      <Footer />
      <ToastStack />
    </div>
  )
}
