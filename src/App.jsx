import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Velemenyek from './pages/Velemenyek';
// import Kapcsolat from './pages/Kapcsolat';

import { CartProvider } from './context/CartContext';

function App() {
  const products = [
    {
      id: 1,
      name: "Luxury Lipstick",
      category: "Makeup",
      price: 1299,
      description: "Vibrant and long-lasting color.",
      image: "/assets/lipstick.jpg"
    },
    {
      id: 2,
      name: "Spa Gift Box",
      category: "Ajándékcsomag",
      price: 2999,
      description: "Relaxing bath & body products.",
      image: "/assets/spabox.jpg"
    },
    {
      id: 3,
      name: "Face Cream",
      category: "Beauty",
      price: 1850,
      description: "Hydrating cream for all skin types.",
      image: "/assets/facecream.jpg"
    },
    {
      id: 4,
      name: "Perfume Set",
      category: "Beauty",
      price: 3600,
      description: "Lovely fragrance for everyday use.",
      image: "/assets/perfume.jpg"
    }
  ];

  return (
    <CartProvider>
      <Router>
        <Header />
        <div className="page-divider"></div>

        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/velemenyek" element={<Velemenyek />} />
        </Routes>

        <div className="page-divider"></div>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
