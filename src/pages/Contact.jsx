import React from "react";
import "./Contact.css";

const contactTypes = [
  {
    number: "01",
    title: "BUSINESS",
    text: "For business inquiries, collaborations, and opportunities.",
  },
  {
    number: "02",
    title: "PARTNERSHIPS",
    text: "Interested in working together on something exciting?",
  },
  {
    number: "03",
    title: "PRESS",
    text: "For press, media, interviews, and studio information.",
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
            <span>SOMETHING.</span>
          </h1>

          <p>
            Have an idea, a question, or simply want to say hello?
            We'd love to hear from you.
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
              <span>REASON?</span>
            </h2>

            <p>
              Whatever you're reaching out about, drop us a message and
              we'll get back to you.
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
            <span>IDEA STARTS HERE.</span>
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