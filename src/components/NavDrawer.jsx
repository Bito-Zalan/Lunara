// NavDrawer.jsx
import { Link } from "react-router-dom";
import "./NavDrawer.css";

function NavDrawer({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`nav-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`nav-drawer ${isOpen ? "open" : ""}`}>
        <div className="nav-header">
          <h2>Menü</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <ul className="nav-drawer-links">
          <li>
            <Link to="/" onClick={onClose}>Kezdőlap</Link>
          </li>
          <li>
            <Link to="/velemenyek" onClick={onClose}>Vélemények</Link>
          </li>
          <li>
            <Link to="/kapcsolat" onClick={onClose}>Kapcsolat</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default NavDrawer;
