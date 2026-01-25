import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductPage.css";

function ProductPage({ products = [] }) {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <main className="product-page">
        <h1>Nem található termék</h1>
        <p>Ez a termék nem létezik vagy törölve lett.</p>
      </main>
    );
  }

  return (
    <main className="product-page">
      <div className="product-layout">
        <div className="product-image-wrap">
          <img className="product-image" src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">{product.category}</p>

          <p className="product-price">
            {typeof product.price === "number"
              ? `${product.price.toLocaleString("hu-HU")} Ft`
              : ""}
          </p>

          <p className="product-desc">{product.description}</p>

          <button className="product-add" onClick={() => addToCart(product)}>
            Kosárba
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
