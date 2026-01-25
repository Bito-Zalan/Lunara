import "./CartDrawer.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // később itt lesz backend checkout
    alert(`Rendelés leadva! Összeg: ${totalPrice.toLocaleString("hu-HU")} Ft`);
    clearCart();
    onClose();
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Kosár</h2>
          <button onClick={onClose} className="cart-close">
            ✕
          </button>
        </div>

        <div className="cart-content">
          {/* Üres állapot */}
          {cartItems.length === 0 && (
            <div className="cart-empty-state">
              <p className="cart-empty-title">A kosarad üres</p>
              <p className="cart-empty-sub">
                Nézz körül a termékek között, és tedd a kedvenceidet a kosárba.
              </p>

              <button className="cart-continue-btn" onClick={onClose}>
                Vásárlás folytatása
              </button>
            </div>
          )}

          {/* Lista */}
          {cartItems.length > 0 && (
            <>
              <div className="cart-list">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className="cart-list-item">
                    {idx !== 0 && <hr className="cart-divider" />}

                    <div className="cart-row">
                      <div
                        className="cart-imgwrap"
                        onClick={() => goToProduct(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && goToProduct(item.id)
                        }
                      >
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-info">
                        <div
                          className="cart-top"
                          onClick={() => goToProduct(item.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && goToProduct(item.id)
                          }
                        >
                          <div className="cart-name">{item.name}</div>
                          <div className="cart-price">
                            {item.price.toLocaleString("hu-HU")} Ft
                          </div>
                        </div>

                        <div
                          className="cart-qty"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="qty-btn"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            -
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-line-total">
                          Összesen:{" "}
                          <b>
                            {(item.price * item.quantity).toLocaleString(
                              "hu-HU"
                            )}{" "}
                            Ft
                          </b>
                        </div>

                        <button
                          className="cart-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.id);
                          }}
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alsó rész: végösszeg + gombok */}
              <div className="cart-total">
                <h3>Végösszeg: {totalPrice.toLocaleString("hu-HU")} Ft</h3>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Megrendelés
                </button>

                <button className="cart-continue-btn secondary" onClick={onClose}>
                  Vásárlás folytatása
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;




