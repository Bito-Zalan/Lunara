import { createContext, useContext, useEffect, useState } from "react";
import { CartService } from "../services/CartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(CartService.getCart());
  }, []);

  const addToCart = (product) => {
    const updated = CartService.addItem(product);
    setCartItems(updated);
  };

  const removeFromCart = (id) => {
    const updated = CartService.removeItem(id);
    setCartItems(updated);
  };

  const clearCart = () => {
    CartService.clearCart();
    setCartItems([]);
  };

  const increaseQuantity = (id) => {
    const updated = CartService.increaseQuantity(id);
    setCartItems(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = CartService.decreaseQuantity(id);
    setCartItems(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
