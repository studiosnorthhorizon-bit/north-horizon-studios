import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <Link to="/" className="brand" onClick={closeMenu}>
        <span>NORTH HORIZON</span>
        <small>STUDIOS</small>
      </Link>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>

        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/games" onClick={closeMenu}>
          Games
        </NavLink>

        <NavLink to="/arcade" onClick={closeMenu}>
          Arcade
        </NavLink>

        <NavLink to="/projects" onClick={closeMenu}>
          Projects
        </NavLink>

        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>

        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>

      </nav>

      <Link to="/arcade" className="nav-cta">
        Play Arcade
        <ArrowRight size={16} />
      </Link>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

    </header>
  );
}