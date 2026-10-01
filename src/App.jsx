import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext/CartContext'
import { MenuProvider } from './context/MenuContext/MenuContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MenuProvider>
    </BrowserRouter>
  )
}
