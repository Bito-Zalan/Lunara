// ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isClicked, setIsClicked] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation(); // NE navigáljon a kártya kattintás miatt
    addToCart(product);

    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  const goToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card"
      onClick={goToProduct}
      style={{ cursor: "pointer" }}
    >
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


