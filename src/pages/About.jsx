import React from "react";
import "./About.css";

const principles = [
  {
    number: "01",
    title: "PLAY FIRST",
    text: "Every idea starts with the player. If the game isn't fun, nothing else matters.",
  },
  {
    number: "02",
    title: "START SMALL",
    text: "Big experiences don't always need big beginnings. We believe a great idea can start with a simple prototype.",
  },
  {
    number: "03",
    title: "KEEP EXPERIMENTING",
    text: "We build, test, break, rebuild, and learn. The best ideas often appear somewhere in between.",
  },
  {
    number: "04",
    title: "MAKE IT MEMORABLE",
    text: "We want our games to leave something behind — a feeling, a moment, or a reason to come back.",
  },
];

const process = [
  {
    number: "01",
    title: "THE IDEA",
    text: "A simple mechanic, an unusual thought, or a question that makes us wonder: what if?",
  },
  {
    number: "02",
    title: "THE PROTOTYPE",
    text: "We strip the idea down to its core and find out if the fun is actually there.",
  },
  {
    number: "03",
    title: "THE BUILD",
    text: "If it works, we take it further — adding depth, personality, polish, and a world around it.",
  },
  {
    number: "04",
    title: "THE RELEASE",
    text: "We put it in players' hands, listen, learn, and keep moving toward the next horizon.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      {/* HERO */}

      <section className="about-hero">
        <div className="about-hero-grid" />

        <div className="about-hero-orbit about-hero-orbit-one" />
        <div className="about-hero-orbit about-hero-orbit-two" />
        <div className="about-hero-orbit about-hero-orbit-three" />

        <div className="about-hero-content">
          <span className="about-eyebrow">NORTH HORIZON STUDIOS</span>

          <h1>
            WE BUILD
            <span>WORLDS TO</span>
            <strong>GET LOST IN.</strong>
          </h1>

          <p>
            An independent game studio focused on building memorable
            experiences from simple ideas.
          </p>
        </div>

        <div className="about-scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <i />
        </div>
      </section>

      {/* WHO WE ARE */}

      <section className="about-intro">
        <div className="about-section-label">
          <span>01</span>
          <span>WHO WE ARE</span>
        </div>

        <div className="about-intro-content">
          <h2>
            SMALL STUDIO.
            <span>BIG HORIZON.</span>
          </h2>

          <p className="about-intro-lead">
            North Horizon Studios is an independent game studio built around
            one simple belief: great games can come from anywhere.
          </p>

          <p>
            We create games across different genres and platforms, constantly
            exploring new mechanics, new ideas, and new ways to make players
            feel something.
          </p>

          <p>
            We're not interested in making games just because they fit a
            formula. We want to experiment, take ideas further, and build
            experiences that people remember.
          </p>
        </div>
      </section>

      {/* STATEMENT */}

      <section className="about-statement">
        <div className="about-statement-line" />

        <p>
          <span>THE GOAL ISN'T TO</span>
          <strong>MAKE MORE GAMES.</strong>
          <span>IT'S TO MAKE</span>
          <strong>BETTER ONES.</strong>
        </p>

        <div className="about-statement-line" />
      </section>

      {/* PRINCIPLES */}

      <section className="about-principles">
        <div className="about-section-heading">
          <span>02 — OUR PRINCIPLES</span>

          <h2>
            WHAT WE
            <span>BELIEVE.</span>
          </h2>
        </div>

        <div className="principles-list">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span className="principle-number">{principle.number}</span>

              <h3>{principle.title}</h3>

              <p>{principle.text}</p>

              <span className="principle-plus">+</span>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS */}

      <section className="about-process">
        <div className="about-section-heading about-process-heading">
          <span>03 — HOW WE WORK</span>

          <h2>
            FROM IDEA
            <span>TO PLAYABLE.</span>
          </h2>

          <p>
            We keep our process simple: find the fun first, then build
            everything around it.
          </p>
        </div>

        <div className="process-list">
          {process.map((step) => (
            <article className="process-step" key={step.number}>
              <div className="process-step-number">{step.number}</div>

              <div className="process-step-main">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>

              <div className="process-step-arrow">↗</div>
            </article>
          ))}
        </div>
      </section>

      {/* VISION */}

      <section className="about-vision">
        <div className="about-vision-glow" />

        <span className="about-eyebrow">THE NEXT HORIZON</span>

        <h2>
          WE'RE JUST
          <span>GETTING STARTED.</span>
        </h2>

        <p>
          North Horizon is being built one game at a time. There are worlds
          we haven't imagined yet, mechanics we haven't discovered, and
          stories waiting somewhere beyond the horizon.
        </p>

        <div className="about-vision-mark">
          <span>NORTH</span>
          <div className="about-vision-circle">
            <i />
          </div>
          <span>HORIZON</span>
        </div>
      </section>
    </main>
  );
}