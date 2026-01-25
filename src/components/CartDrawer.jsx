import "./CartDrawer.css";
import { useCart } from "../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
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

  // Checkout gomb funkció (jelenleg csak alert)
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("A kosár üres!");
      return;
    }
    // Később itt hívjuk a backend API-t
    alert(`Rendelés leadva! Összeg: ${totalPrice.toLocaleString("hu-HU")} Ft`);
    clearCart(); // kosár ürítése
    onClose(); // drawer bezárása
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
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Egységár: {item.price.toLocaleString("hu-HU")} Ft</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <p>Összesen: {(item.price * item.quantity).toLocaleString("hu-HU")} Ft</p>
              </div>
              <button onClick={() => removeFromCart(item.id)}>Törlés</button>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="cart-total">
              <h3>Végösszeg: {totalPrice.toLocaleString("hu-HU")} Ft</h3>
              <button className="checkout-btn" onClick={handleCheckout}>
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

