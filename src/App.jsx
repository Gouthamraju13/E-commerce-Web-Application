import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import { MapOffIcon } from "./components/Icons";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <ToastProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route
                    path="*"
                    element={
                      <div className="container empty-state" style={{ paddingTop: 100 }}>
                        <div className="icon"><MapOffIcon /></div>
                        <h3>Page not found</h3>
                        <Link to="/" className="btn btn-primary">Go Home</Link>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}