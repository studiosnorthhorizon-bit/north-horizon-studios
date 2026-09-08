import React from "react";
import "./Projects.css";

const projects = [
  {
    number: "01",
    title: "PREDICTABLE",
    category: "RAGE PUZZLE",
    status: "IN DEVELOPMENT",
    platform: "PC / MOBILE",
    description:
      "A deceptively simple puzzle game designed to test patience, precision, and the player's ability to see what is coming next.",
    accent: "predictable",
    image: "/assets/home/predictable.png",
  },
  {
    number: "02",
    title: "SKYBOUND",
    category: "PLATFORMER",
    status: "IN DEVELOPMENT",
    platform: "MOBILE",
    description:
      "A vertical journey through a world that keeps expanding above the clouds. Jump, climb, and survive six increasingly strange worlds.",
    accent: "skybound",
    image: "/assets/home/skybound.png",
  },
  {
    number: "03",
    title: "MEMORY TILES",
    category: "PUZZLE / MEMORY",
    status: "IN DEVELOPMENT",
    platform: "MOBILE",
    description:
      "A minimalist memory challenge where every round tests how quickly you can observe, remember, and react.",
    accent: "memory",
    image: "/assets/home/memory-tiles.png",
  },
  {
    number: "04",
    title: "KAKERU",
    category: "ENDLESS RUNNER",
    status: "IN DEVELOPMENT",
    platform: "MOBILE",
    description:
      "A fast-paced endless runner built around momentum, timing, and the simple instinct to keep moving forward.",
    accent: "kakeru",
    image: "/assets/home/kakeru.png",
  },
  {
    number: "05",
    title: "NORTH HORIZON ARCADE",
    category: "BROWSER GAMES",
    status: "LIVE",
    platform: "WEB",
    description:
      "A collection of fast, accessible games built around one idea: simple controls, instant feedback, and gameplay that keeps you coming back.",
    accent: "arcade",
    image: "/assets/arcade/hero.png",
  },
];

function ProjectVisual({ accent, image }) {
  return (
    <div className={`project-visual project-visual-${accent}`}>
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="project-visual-image"
            loading="lazy"
            decoding="async"
          />

          <div className="project-visual-image-overlay" />
        </>
      ) : (
        <>
          <div className="project-visual-noise" />

          {accent === "arcade" && (
            <>
              <div className="arcade-circle arcade-circle-one" />
              <div className="arcade-circle arcade-circle-two" />
              <div className="arcade-circle arcade-circle-three" />
              <div className="arcade-cross arcade-cross-one" />
              <div className="arcade-cross arcade-cross-two" />
            </>
          )}
        </>
      )}

      <span className="project-visual-label">NORTH HORIZON</span>
    </div>
  );
}

export default function Projects() {
  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="projects-hero-grid" />

        <div className="projects-hero-content">
          <span className="projects-eyebrow">OUR WORK</span>

          <h1>
            PROJECTS
            <span>WE'RE BUILDING.</span>
          </h1>

          <p>
            Games, experiments, and ideas we're turning into something real.
          </p>
        </div>

        <div className="projects-hero-meta">
          <span>05 PROJECTS</span>
          <span>2026 — PRESENT</span>
        </div>
      </section>

      <section className="projects-list-section">
        <div className="projects-section-intro">
          <span>SELECTED WORK</span>

          <p>
            We believe great games can start with a very simple idea.
            What matters is what you do with it.
          </p>
        </div>

        <div className="projects-list">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className="project-card-number">
                {project.number}
              </div>

              <ProjectVisual
                accent={project.accent}
                image={project.image}
              />

              <div className="project-card-content">
                <div className="project-card-topline">
                  <span>{project.category}</span>
                  <span>{project.status}</span>
                </div>

                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <div className="project-card-bottom">
                  <span>{project.platform}</span>

                  <span className="project-arrow">
                    VIEW PROJECT
                    <span>↗</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-closing">
        <span className="projects-eyebrow">THE HORIZON</span>

        <h2>
          THIS IS ONLY
          <span>THE BEGINNING.</span>
        </h2>

        <p>
          We're building a studio around experimentation, memorable
          gameplay, and ideas worth taking further.
        </p>
      </section>
    </main>
  );
}