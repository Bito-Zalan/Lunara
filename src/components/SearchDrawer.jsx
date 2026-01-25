import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchDrawer.css";

function SearchDrawer({ isOpen, onClose, products = [] }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setTerm("");
  }, [isOpen]);

  const results = useMemo(() => {
    const q = term.toLowerCase().trim();
    if (q.length === 0) return [];

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [term, products]);

  const handleClear = () => setTerm("");

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <>
      <div className={`search-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />

      <div className={`search-drawer ${isOpen ? "open" : ""}`}>
        <div className="search-header">
          <h2>Keresés</h2>
          <button className="search-close" onClick={onClose} aria-label="Bezárás">
            ✕
          </button>
        </div>

        <div className="search-content">
          <div className="search-input-row">
            <input
              className="search-input-drawer"
              type="text"
              placeholder="Keresés név vagy kategória alapján..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              autoFocus={isOpen}
            />
            <button className="search-clear" onClick={handleClear}>Törlés</button>
          </div>

          <div className="search-results">
            {term.trim().length === 0 && (
              <p className="search-hint">Kezdj el gépelni a kereséshez.</p>
            )}

            {term.trim().length > 0 && results.length === 0 && (
              <p className="search-hint">Nincs találat erre: “{term}”</p>
            )}

            {term.trim().length > 0 &&
              results.map((p, idx) => (
                <div
                  key={p.id ?? `${p.name}-${idx}`}
                  className="search-result-item"
                  onClick={() => goToProduct(p.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && goToProduct(p.id)}
                  style={{ cursor: "pointer" }}
                >
                  {idx !== 0 && <hr className="search-divider" />}

                  <div className="search-result-row">
                    <div className="search-result-imgwrap">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="search-result-img"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>

                    <div className="search-result-info">
                      <div className="search-result-name">{p.name}</div>
                      <div className="search-result-meta">
                        <span>{p.category}</span>
                        {typeof p.price === "number" && (
                          <span className="search-result-price">
                            {p.price.toLocaleString("hu-HU")} Ft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchDrawer;







