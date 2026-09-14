import React from "react";
import "./Contact.css";

const contactTypes = [
  {
    number: "01",
    title: "BUSINESS",
    text: "For business inquiries, studio opportunities, commercial work and questions about North Horizon Studios.",
  },
  {
    number: "02",
    title: "PARTNERSHIPS",
    text: "For collaborations, creative partnerships and opportunities to work together on games, technology or original projects.",
  },
  {
    number: "03",
    title: "PRESS",
    text: "For press inquiries, interviews, media requests and additional information about our studio and projects.",
  },
];

export default function Contact() {
  return (
    <main className="contact-page">
      {/* HERO */}

      <section className="contact-hero">
        <div className="contact-grid" />

        <div className="contact-orbit contact-orbit-one" />
        <div className="contact-orbit contact-orbit-two" />
        <div className="contact-orbit contact-orbit-three" />

        <div className="contact-hero-content">
          <span className="contact-eyebrow">GET IN TOUCH</span>

          <h1>
            LET'S BUILD
            <span>SOMETHING</span>
          </h1>

          <p>
            Have an idea, a question, or an opportunity you'd like to discuss.
            North Horizon Studios is always open to thoughtful conversations
            about games, creative work, partnerships and new ideas.
          </p>
        </div>

        <a
          className="contact-email-large"
          href="mailto:studiosnorthhorizon@gmail.com"
        >
          studiosnorthhorizon@gmail.com
          <span>↗</span>
        </a>
      </section>

      {/* CONTACT TYPES */}

      <section className="contact-options">
        <div className="contact-section-label">
          <span>01</span>
          <span>WHY CONTACT US</span>
        </div>

        <div className="contact-options-content">
          <div className="contact-options-heading">
            <h2>
              HAVE A
              <span>REASON</span>
            </h2>

            <p>
              Whether you are interested in our games, want to explore a
              partnership or need information about the studio, send us a
              message and tell us what you have in mind.
            </p>
          </div>

          <div className="contact-types">
            {contactTypes.map((item) => (
              <div className="contact-type" key={item.number}>
                <span className="contact-type-number">
                  {item.number}
                </span>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <span className="contact-type-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL CTA */}

      <section className="contact-cta">
        <div className="contact-cta-inner">
          <span className="contact-eyebrow">NORTH HORIZON STUDIOS</span>

          <h2>
            YOUR NEXT
            <span>IDEA STARTS HERE</span>
          </h2>

          <a
            href="mailto:studiosnorthhorizon@gmail.com"
            className="contact-cta-button"
          >
            <span>SEND US AN EMAIL</span>
            <span>↗</span>
          </a>

          <span className="contact-cta-email">
            studiosnorthhorizon@gmail.com
          </span>
        </div>
      </section>
    </main>
  );
}