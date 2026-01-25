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
    clearCart
  } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  // Checkout gomb funkció (jelenleg csak alert)
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("A kosár üres!");
      return;
    }
    // Később itt hívjuk a backend API-t
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
          <button onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 && <p>A kosarad jelenleg üres.</p>}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-item"
              style={{ cursor: "pointer" }}
              onClick={() => goToProduct(item.id)}
            >
              <img src={item.image} alt={item.name} />

              <div>
                <h4>{item.name}</h4>
                <p>Egységár: {item.price.toLocaleString("hu-HU")} Ft</p>

                <div
                  className="quantity-controls"
                  onClick={(e) => e.stopPropagation()} // gombok ne navigáljanak
                >
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <p>
                  Összesen: {(item.price * item.quantity).toLocaleString("hu-HU")} Ft
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(item.id);
                }}
              >
                Törlés
              </button>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="cart-total">
              <h3>Végösszeg: {totalPrice.toLocaleString("hu-HU")} Ft</h3>
              <button
                className="checkout-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout();
                }}
              >
                Megrendelés
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;


