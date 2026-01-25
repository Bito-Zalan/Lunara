import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import logo from "../assets/weblogo.png";
import "./Header.css";

import CartDrawer from "./CartDrawer";
import NavDrawer from "./NavDrawer";
import SearchDrawer from "./SearchDrawer";

function Header({ products = [] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (totalQuantity === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [totalQuantity]);

  // ✅ ESC zárás + ✅ body scroll lock
  useEffect(() => {
    const anyOpen = isCartOpen || isNavOpen || isSearchOpen;

    // Scroll lock
    const prevOverflow = document.body.style.overflow;
    if (anyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflow || "";
    }

    // ESC handler
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsNavOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // cleanup: visszaállítjuk
      document.body.style.overflow = prevOverflow || "";
    };
  }, [isCartOpen, isNavOpen, isSearchOpen]);

  return (
    <>
      <header>
        <nav className="navbar">
          {/* Hamburger ikon */}
          <div className="hamburger-icon" onClick={() => setIsNavOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </div>

          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Lunara logo" />
            </Link>
          </div>

          {/* Jobb oldal */}
          <div className="nav-right">
            <ul className="nav-links"></ul>

            {/* Search ikon */}
            <div className="search-icon" onClick={() => setIsSearchOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>

            {/* Kosár ikon + badge */}
            <div
              className="cart-icon"
              onClick={() => setIsCartOpen(true)}
              style={{ position: "relative" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z" />
              </svg>

              {totalQuantity > 0 && (
                <span className={`cart-badge ${isBumping ? "bump" : ""}`}>
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Drawerek */}
      <NavDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
      />
    </>
  );
}

export default Header;


