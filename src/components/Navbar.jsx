import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const closeMenu = () => setOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span>NORTH HORIZON</span>
        <small>STUDIOS</small>
      </Link>

      <nav className={`nav-links ${open ? "nav-open" : ""}`}>
        <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeMenu}>Home</Link>
        <Link to="/games" className={isActive("/games") ? "active" : ""} onClick={closeMenu}>Games</Link>
        <Link to="/arcade" className={isActive("/arcade") ? "active" : ""} onClick={closeMenu}>Arcade</Link>
        <Link to="/projects" className={isActive("/projects") ? "active" : ""} onClick={closeMenu}>Projects</Link>
        <Link to="/about" className={isActive("/about") ? "active" : ""} onClick={closeMenu}>About</Link>
        <Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={closeMenu}>Contact</Link>
      </nav>

      <Link to="/arcade" className="nav-cta" onClick={closeMenu}>
        Play Arcade Now
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
