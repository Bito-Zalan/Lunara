// ProductCard.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isClicked, setIsClicked] = useState(false);

  const handleAdd = () => {
    addToCart(product);          // termék hozzáadása kosárhoz
    setIsClicked(true);          // animáció triggerelése

    setTimeout(() => {
      setIsClicked(false);       // visszaállítás 0.2s után
    }, 200);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="description">{product.description}</p>
      <p className="price">{product.price.toLocaleString("hu-HU")} Ft</p>
      <button
        className={`add-to-cart-btn ${isClicked ? "clicked" : ""}`}
        onClick={handleAdd}
      >
        Kosárba
      </button>
    </div>
  );
}

export default ProductCard;

