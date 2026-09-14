import React from "react";
import "./About.css";

const principles = [
  {
    number: "01",
    title: "PLAY FIRST",
    text: "Every idea starts with the player. Before we worry about features, visuals or scale, we ask whether the experience is genuinely enjoyable. If the game is not fun, nothing else matters.",
  },
  {
    number: "02",
    title: "START SMALL",
    text: "Big experiences do not always need big beginnings. We believe a strong idea can start with a simple prototype that answers one important question and gives us something real to play.",
  },
  {
    number: "03",
    title: "KEEP EXPERIMENTING",
    text: "We build, test, break, rebuild and learn. Trying different mechanics and approaches helps us discover what works, what does not and where an idea can become something more interesting.",
  },
  {
    number: "04",
    title: "MAKE IT MEMORABLE",
    text: "We want our games to leave something behind, whether that is a feeling, a moment, a challenge that stays in your mind or a reason to come back and play again.",
  },
];

const process = [
  {
    number: "01",
    title: "THE IDEA",
    text: "A simple mechanic, an unusual thought or a question that makes us wonder what if. Every project begins with curiosity and a reason to explore the idea further.",
  },
  {
    number: "02",
    title: "THE PROTOTYPE",
    text: "We strip the idea down to its core and find out if the fun is actually there. Prototyping lets us test the most important parts of a game before building everything around them.",
  },
  {
    number: "03",
    title: "THE BUILD",
    text: "If the core works, we take it further by adding depth, personality, presentation and polish. This is where a simple mechanic starts becoming a complete game experience.",
  },
  {
    number: "04",
    title: "THE RELEASE",
    text: "We put the game in players' hands, listen to how people experience it, learn from the results and use that knowledge to improve our work and move toward the next project.",
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
            <strong>GET LOST IN</strong>
          </h1>

          <p>
            North Horizon Studios is an independent game studio focused on
            creating original experiences across mobile, web and other
            platforms. We start with simple ideas and explore how far they can
            go through thoughtful game design, experimentation and iteration.
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
            SMALL STUDIO
            <span>BIG HORIZON</span>
          </h2>

          <p className="about-intro-lead">
            North Horizon Studios is an independent game studio built around
            one simple belief: great games can come from anywhere.
          </p>

          <p>
            We create original games across different genres and platforms,
            from mobile projects and puzzle experiences to browser games built
            for quick sessions. Each project gives us a chance to explore a
            different idea and learn something new about the craft of making
            games.
          </p>

          <p>
            We are interested in the entire process of creating a game, from
            the first rough concept and playable prototype to the details that
            make a finished experience feel complete. We experiment with
            mechanics, presentation and player interaction while keeping the
            core experience at the center of every decision.
          </p>

          <p>
            We are not interested in making games simply because they fit a
            formula. We want to explore ideas, take them further and build
            experiences that people remember. North Horizon is still a growing
            studio, and every project is part of that journey.
          </p>
        </div>
      </section>

      {/* STATEMENT */}

      <section className="about-statement">
        <div className="about-statement-line" />

        <p>
          <span>THE GOAL ISN'T TO</span>
          <strong>MAKE MORE GAMES</strong>
          <span>IT'S TO MAKE</span>
          <strong>BETTER ONES</strong>
        </p>

        <div className="about-statement-line" />
      </section>

      {/* PRINCIPLES */}

      <section className="about-principles">
        <div className="about-section-heading">
          <span>02, OUR PRINCIPLES</span>

          <h2>
            WHAT WE
            <span>BELIEVE</span>
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
          <span>03, HOW WE WORK</span>

          <h2>
            FROM IDEA
            <span>TO PLAYABLE</span>
          </h2>

          <p>
            We keep our process simple: find the fun first, then build the
            experience around it. Every project moves through experimentation,
            testing and refinement as we discover what makes the idea work.
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
          <span>GETTING STARTED</span>
        </h2>

        <p>
          North Horizon is being built one game at a time. We want to grow a
          library of original experiences across different genres and
          platforms while continuing to learn from every project we create.
          There are worlds we have not imagined yet, mechanics we have not
          discovered and stories waiting somewhere beyond the horizon.
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