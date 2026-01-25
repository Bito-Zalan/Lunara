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

  useEffect(() => {
    setQty(1);
    setIsAdded(false);
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const cat = String(product.category || "").toLowerCase();

    return products
      .filter((p) => String(p.id) !== String(product.id))
      .filter((p) => String(p.category || "").toLowerCase() === cat)
      .slice(0, 4);
  }, [products, product]);

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
              <button className="qty-btn" onClick={dec}>-</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={inc}>+</button>
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

      {/* Kapcsolódó termékek */}
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">Kapcsolódó termékek</h2>

          <div className="related-grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="related-card"
                onClick={() => navigate(`/product/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${p.id}`)}
              >
                <div className="related-imgwrap">
                  <img src={p.image} alt={p.name} />
                </div>

                <div className="related-info">
                  <div className="related-name">{p.name}</div>
                  <div className="related-meta">
                    <span>{p.category}</span>
                    {typeof p.price === "number" && (
                      <span className="related-price">
                        {p.price.toLocaleString("hu-HU")} Ft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductPage;

