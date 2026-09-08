import React from "react";
import { Link } from "react-router-dom";

function InstagramIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="4" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.9h1.73L8.32 4H6.46L17.8 19.9Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 8.2a8.6 8.6 0 0 1 7 0" />
      <path d="M6.5 17.2c1.8 1.3 3.5 1.8 5.5 1.8s3.7-.5 5.5-1.8" />
      <path d="M7.2 7.3c-1.4 1.9-2.1 4.3-2.1 7.1 1.7 1.4 3.5 2.3 5.5 2.7" />
      <path d="M16.8 7.3c1.4 1.9 2.1 4.3 2.1 7.1-1.7 1.4-3.5 2.3-5.5 2.7" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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

        <div className="socials">
          <a href="#" aria-label="YouTube">
            <YoutubeIcon />
          </a>

          <a href="#" aria-label="Instagram">
            <InstagramIcon />
          </a>

          <a href="#" aria-label="Twitter">
            <TwitterIcon />
          </a>

          <a href="#" aria-label="Discord">
            <DiscordIcon />
          </a>
        </div>
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