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
      {/* <p className="description">{product.description}</p> */}
      <div className="price-row">
        <p className="price">
          {product.price.toLocaleString("hu-HU")} Ft
        </p>

        <button
          className={`cart-icon-btn ${isClicked ? "clicked" : ""}`}
          onClick={handleAdd}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;


