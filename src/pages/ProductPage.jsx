import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductPage.css";

function ProductPage({ products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // ha másik termékre navigálsz, reseteljük
  useEffect(() => {
    setQty(1);
    setIsAdded(false);
  }, [id]);

  if (!product) {
    return (
      <main className="product-page">
        <div className="product-topbar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Vissza
          </button>
        </div>

        <div className="product-notfound">
          <h1>Nem található termék</h1>
          <p>Ez a termék nem létezik vagy törölve lett.</p>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Vissza a kezdőlapra
          </button>
        </div>
      </main>
    );
  }

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    // qty darabot adunk hozzá úgy, hogy többször hívjuk
    for (let i = 0; i < qty; i++) addToCart(product);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };

  return (
    <main className="product-page">
      <div className="product-topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Vissza
        </button>
      </div>

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

          <div className="product-actions">
            <div className="qty-controls">
              <button className="qty-btn" onClick={dec}>
                -
              </button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={inc}>
                +
              </button>
            </div>

            <button
              className={`product-add ${isAdded ? "added" : ""}`}
              onClick={handleAdd}
            >
              {isAdded ? "Hozzáadva ✓" : "Kosárba"}
            </button>
          </div>

          <p className="product-hint">
            Tipp: a kosárban a termékre kattintva visszajutsz ide.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
