import { ProductsProvider, useProducts } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import RequireAdmin from "./components/RequireAdmin";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Velemenyek from "./pages/Velemenyek";
import ProductPage from "./pages/ProductPage";
import CheckOutPage from "./pages/CheckOutPage";

function AppInner() {
  const { products } = useProducts();

  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Header products={products} />
          <div className="page-divider"></div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/velemenyek" element={<Velemenyek />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              }
            />
          </Routes>

          <div className="page-divider"></div>
          <Footer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <AppInner />
    </ProductsProvider>
  );
}



