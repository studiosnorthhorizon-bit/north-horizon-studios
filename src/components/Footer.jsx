import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Link to="/" className="footer-brand">
          <span>NORTH HORIZON</span>
          <small>STUDIOS</small>
        </Link>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/games">Games</Link>
          <Link to="/arcade">Arcade</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <div className="footer-legal">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/cookie-policy">Cookie Policy</Link>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 North Horizon Studios. All rights reserved.
        </span>

        <span className="footer-tagline">
          Play&nbsp;&nbsp; Create&nbsp;&nbsp; Explore&nbsp;&nbsp; |&nbsp;&nbsp;
          A Brighter Tomorrow
        </span>
      </div>
    </footer>
  );
}