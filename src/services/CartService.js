// src/services/CartService.js

const CART_KEY = "lunara_cart";

export const CartService = {
  getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.saveCart(cart);
    return cart;
  },

  removeItem(id) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== id);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    return [];
  },

  increaseQuantity(id) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.quantity += 1;
    this.saveCart(cart);
    return cart;
  },

  decreaseQuantity(id) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    this.saveCart(cart);
    return cart;
  }
};
