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
      "Predictable is a puzzle experience built around patience, precision and learning from each attempt. Its simple foundation creates increasingly challenging situations where players need to observe patterns, make decisions and understand what is coming next.",
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
      "Skybound is a vertical platforming adventure focused on movement, timing and progression. The journey takes players through six distinct worlds, with each environment introducing a new stage of the climb and expanding the adventure above the clouds.",
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
      "Memory Tiles is a minimalist memory challenge built around observation and recall. Players study a sequence of tiles and reproduce it correctly, testing concentration and consistency as they work through increasingly demanding rounds.",
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
      "Kakeru is an endless runner built around momentum, timing and quick reactions. Players move through an ongoing environment, avoid obstacles and try to extend their run as far as possible while the challenge continues to develop.",
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
      "North Horizon Arcade is our live collection of original browser games. The Arcade includes reflex challenges, puzzle games, timing tests and skill based experiences designed around simple controls, immediate feedback and short sessions that can be started directly from the web.",
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
            <span>WE'RE BUILDING</span>
          </h1>

          <p>
            Games, experiments and original ideas we're developing across
            mobile and web. Each project begins with a simple concept and
            develops through testing, iteration and play.
          </p>
        </div>

        <div className="projects-hero-meta">
          <span>05 PROJECTS</span>
          <span>2026, PRESENT</span>
        </div>
      </section>

      <section className="projects-list-section">
        <div className="projects-section-intro">
          <span>SELECTED WORK</span>

          <p>
            We believe great games can start with a very simple idea. What
            matters is how that idea develops through experimentation, design
            and the process of making something people genuinely enjoy.
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
          <span>THE BEGINNING</span>
        </h2>

        <p>
          We're building a studio around experimentation, memorable gameplay
          and original ideas worth taking further. Every project adds something
          new to what North Horizon can create next.
        </p>
      </section>
    </main>
  );
}