import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import HomePage from '../pages/Home/Home'
import MenuPage from '../pages/Menu/Menu'
import ProductPage from '../pages/Product/Product'
import CartPage from '../pages/Cart/Cart'
import CheckoutPage from '../pages/Checkout/Checkout'
import PaymentPage from '../pages/Payment/Payment'
import OrderSuccessPage from '../pages/OrderSuccess/OrderSuccess'
import MyOrdersPage from '../pages/MyOrders/MyOrders'
import OrderDetailsPage from '../pages/OrderDetails/OrderDetails'
import ContactPage from '../pages/Contact/Contact'

function FallbackRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/menu${search}`} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<FallbackRedirect />} />
      </Route>
    </Routes>
  )
}
