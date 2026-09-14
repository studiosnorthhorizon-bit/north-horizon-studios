import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const games = [
  {
    title: "Skybound",
    category: "Mobile · Adventure",
    status: "In Development",
    description:
      "Skybound is a vertical platforming adventure built around movement, timing and progression. Players climb through a series of increasingly ambitious environments, with each area introducing a new part of the journey. The project is designed to make every jump feel purposeful while giving players a reason to keep climbing and discover what comes next.",
    image:
      "/assets/home/skybound.png",
  },
  {
    title: "Memory Tiles",
    category: "Mobile · Puzzle",
    status: "In Development",
    description:
      "Memory Tiles is a focused puzzle experience built around observation and recall. Players study a sequence of tiles and attempt to reproduce it correctly as the challenge develops. The game keeps its core idea simple while gradually asking players to improve their concentration, memory and consistency.",
    image:
      "/assets/home/memory-tiles.png",
  },
  {
    title: "Kakeru",
    category: "Mobile · Endless Runner",
    status: "In Development",
    description:
      "Kakeru is an endless runner focused on quick reactions, timing and survival. Players move through an ever changing environment while avoiding obstacles and trying to continue their run for as long as possible. The project is designed around short sessions that are easy to start and difficult to master.",
    image:
      "/assets/home/kakeru.png",
  },
  {
    title: "Predictable",
    category: "Mobile · Puzzle",
    status: "In Development",
    description:
      "Predictable is a puzzle game built around observation, decision making and learning from mistakes. Its simple presentation hides challenges that encourage players to think carefully before making their next move. The project explores how a straightforward idea can become increasingly engaging through thoughtful puzzle design.",
    image:
      "/assets/home/predictable.png",
  },
];

function GameRow({ game, index }) {
  return (
    <article className={`games-page-row ${index % 2 !== 0 ? "reverse" : ""}`}>
      <div className="games-page-image">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          decoding="async"
        />

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

        <span className="game-details-label">COMING SOON</span>
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
            BUILDING
          </h1>

          <p>
            North Horizon Studios develops original games across mobile and
            web, exploring different genres, mechanics and ways to create
            memorable play experiences.
          </p>
        </div>
      </section>

      {/* INTRO */}

      <section className="games-intro">
        <div className="eyebrow">
          OUR CURRENT PROJECTS
        </div>

        <h2>
          SMALL TEAM
          <br />
          BIG IDEAS
        </h2>

        <p>
          We are building a growing collection of original games across mobile
          and web. Our projects range from platforming adventures and puzzle
          experiences to endless runners and experimental ideas. Each project
          gives us an opportunity to explore a different style of gameplay
          while learning more about what makes an experience enjoyable,
          approachable and worth returning to.
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
            WANT SOMETHING TO PLAY NOW
          </div>

          <h2>
            TRY THE
            <br />
            ARCADE
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