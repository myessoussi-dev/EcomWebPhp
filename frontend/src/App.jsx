import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx'
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import FAQPage from './pages/FAQPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OrderHistoryPage from './pages/OrderHistoryPage.jsx'
import ProductDetailsPage from './pages/ProductDetailsPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx'
import PaymentCancelPage from './pages/PaymentCancelPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="products/:slug" element={<ProductDetailsPage />} />
        <Route path="categories/:slug" element={<CategoryPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-cancel" element={<PaymentCancelPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-YOUR_DB_PASSWORD" element={<ForgotPasswordPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/products" element={<AdminProductsPage />} />
        <Route path="admin/orders" element={<AdminOrdersPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
