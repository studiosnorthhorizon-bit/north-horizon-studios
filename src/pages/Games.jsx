import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const games = [
  {
    title: "Skybound",
    category: "Mobile · Adventure",
    status: "In Development",
    description:
      "A fast, vertical platforming adventure where every jump takes you somewhere new.",
    image:
      "/assets/home/skybound.png",
  },
  {
    title: "Memory Tiles",
    category: "Mobile · Puzzle",
    status: "In Development",
    description:
      "A simple memory game that gets increasingly challenging as your score climbs.",
    image:
      "/assets/home/memory-tiles.png",
  },
  {
    title: "Kakeru",
    category: "Mobile · Endless Runner",
    status: "In Development",
    description:
      "Run, react and survive. A fast-paced endless runner built for quick sessions.",
    image:
      "/assets/home/kakeru.png",
  },
  {
    title: "Predictable",
    category: "Mobile · Puzzle",
    status: "In Development",
    description:
      "A deceptively simple puzzle game designed to make you think twice.",
    image:
      "/assets/home/predictable.png",
  },
];

function GameRow({ game, index }) {
  return (
    <article className={`games-page-row ${index % 2 !== 0 ? "reverse" : ""}`}>
      <div className="games-page-image">
        <img src={game.image} alt={game.title} loading="lazy" decoding="async" />

        <div className="games-page-image-overlay" />

        <span className="game-number">
          0{index + 1}
        </span>
      </div>

      <div className="games-page-info">
        <div className="eyebrow">{game.status}</div>

        <h2>{game.title}</h2>

        <div className="game-category">
          {game.category}
        </div>

        <p>{game.description}</p>

        <button className="game-details-button">
          Coming Soon
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function Games() {
  return (
    <main className="games-page">

      {/* PAGE HERO */}

      <section className="games-page-hero">
        <div className="games-page-hero-background" />
        <div className="games-page-hero-overlay" />

        <div className="games-page-hero-content">
          <div className="eyebrow">
            NORTH HORIZON STUDIOS
          </div>

          <h1>
            GAMES
            <br />
            WE'RE
            <br />
            BUILDING.
          </h1>

          <p>
            Original games built with curiosity, experimentation
            and a lot of late nights.
          </p>
        </div>
      </section>

      {/* INTRO */}

      <section className="games-intro">
        <div className="eyebrow">
          OUR CURRENT PROJECTS
        </div>

        <h2>
          SMALL TEAM.
          <br />
          BIG IDEAS.
        </h2>

        <p>
          We're building a collection of original games across
          mobile and web. Some are experiments, some are bigger
          ambitions — all of them start with one simple question:
          can we make something people genuinely enjoy playing?
        </p>
      </section>

      {/* GAMES */}

      <section className="games-list">
        {games.map((game, index) => (
          <GameRow
            key={game.title}
            game={game}
            index={index}
          />
        ))}
      </section>

      {/* ARCADE CTA */}

      <section className="games-arcade-cta">
        <div>
          <div className="eyebrow">
            WANT SOMETHING TO PLAY NOW?
          </div>

          <h2>
            TRY THE
            <br />
            ARCADE.
          </h2>
        </div>

        <Link to="/arcade" className="button button-light">
          Play Arcade
          <ArrowRight size={17} />
        </Link>
      </section>

    </main>
  );
}