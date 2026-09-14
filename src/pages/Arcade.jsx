import { Link } from "react-router-dom";
import { ArrowRight, Gamepad2, Zap } from "lucide-react";

const games = [
  {
    title: "Color Drop",
    description:
      "Match the falling colors and change your ball at the right moment. The challenge becomes faster as you progress, testing your reactions and ability to make quick decisions.",
    category: "Arcade",
    difficulty: "Easy",
    status: "NEW",
    image: "/assets/arcade/color-drop.png",
  },
  {
    title: "Button Chaos",
    description:
      "Tap the correct button before the timer disappears. The game gradually increases the pressure, turning a simple interaction into a fast reflex challenge.",
    category: "Reflex",
    difficulty: "Medium",
    status: "NEW",
    image: "/assets/arcade/button-chaos.png",
  },
  {
    title: "Perfect Tap",
    description:
      "Time each tap as accurately as possible and hit the target zone. Every successful round makes the timing more demanding, rewarding focus and precision.",
    category: "Reflex",
    difficulty: "Medium",
    status: "",
    image: "/assets/arcade/perfect-tap.png",
  },
  {
    title: "Stack It",
    description:
      "Drop each moving floor onto the tower and build as high as you can. Careful timing helps keep the structure balanced while mistakes can bring the whole tower down.",
    category: "Skill",
    difficulty: "Easy",
    status: "",
    image: "/assets/arcade/stack-it.png",
  },
  {
    title: "Memory Rush",
    description:
      "Watch the sequence, remember the pattern and reproduce it correctly. Each round tests your concentration and memory while the board becomes more challenging.",
    category: "Puzzle",
    difficulty: "Hard",
    status: "",
    image: "/assets/arcade/memory-rush.png",
  },
  {
    title: "Quick Switch",
    description:
      "Move between two lanes to avoid incoming obstacles. The game combines quick decisions with increasing speed and challenges you to survive for as long as possible.",
    category: "Reflex",
    difficulty: "Hard",
    status: "",
    image: "/assets/arcade/quick-switch.png",
  },
];

function ArcadeGameCard({ game }) {
  const gamePath =
    game.title === "Color Drop"
      ? "/arcade/color-drop"
      : game.title === "Button Chaos"
        ? "/arcade/button-chaos"
        : game.title === "Stack It"
          ? "/arcade/stack-it"
          : game.title === "Perfect Tap"
            ? "/arcade/perfect-tap"
            : game.title === "Memory Rush"
              ? "/arcade/memory-rush"
              : game.title === "Quick Switch"
                ? "/arcade/quick-switch"
                : "/arcade";

  return (
    <Link to={gamePath} className="arcade-game-card">
      <div className="arcade-game-image">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          decoding="async"
        />

        <div className="arcade-game-overlay" />

        {game.status && (
          <span className="arcade-game-status">
            {game.status}
          </span>
        )}

        <span className="arcade-play">
          PLAY
          <ArrowRight size={15} />
        </span>
      </div>

      <div className="arcade-game-info">
        <div className="arcade-game-meta">
          <span>{game.category}</span>
          <span>{game.difficulty}</span>
        </div>

        <h3>{game.title}</h3>

        <p>{game.description}</p>
      </div>
    </Link>
  );
}

export default function Arcade() {
  return (
    <main className="arcade-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="arcade-page-hero">
        <div className="arcade-page-hero-background" />

        <div className="arcade-page-hero-overlay" />

        <div className="arcade-page-hero-content">

          <div className="arcade-hero-icon">
            <Gamepad2 size={24} />
          </div>

          <div className="eyebrow">
            NORTH HORIZON STUDIOS
          </div>

          <h1>
            NORTH
            <br />
            HORIZON
            <br />
            ARCADE
          </h1>

          <p>
            Free browser games made by North Horizon Studios.
            <br />
            No downloads. No sign ups. Just play.
          </p>

        </div>

        <div className="arcade-hero-note">
          <Zap size={16} />
          New games added regularly
        </div>
      </section>


      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="arcade-intro">

        <div>
          <div className="eyebrow">
            PLAY NOW
          </div>

          <h2>
            PICK A GAME
            <br />
            SEE HOW LONG
            <br />
            YOU LAST
          </h2>
        </div>

        <p>
          Welcome to the North Horizon Arcade, a growing collection of original
          browser games designed for quick and accessible play. The collection
          includes reflex challenges, puzzle games, timing tests and skill
          based experiences. Every game can be started directly in your browser
          without a download or account, making it easy to try something new
          whenever you have a few minutes to play.
        </p>

      </section>


      {/* =====================================================
          GAME GRID
          ===================================================== */}

      <section className="arcade-games-section">

        <div className="arcade-games-header">

          <div>
            <div className="eyebrow">
              ALL GAMES
            </div>

            <h2>
              CHOOSE YOUR
              <br />
              CHALLENGE
            </h2>
          </div>

          <div className="arcade-game-count">
            {games.length} GAMES
          </div>

        </div>

        <div className="arcade-games-grid">

          {games.map((game) => (
            <ArcadeGameCard
              key={game.title}
              game={game}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
          ===================================================== */}

      <section className="arcade-bottom-cta">

        <div className="eyebrow">
          MORE GAMES IN DEVELOPMENT
        </div>

        <h2>
          WE'RE JUST
          <br />
          GETTING STARTED
        </h2>

        <p>
          North Horizon Studios is continuing to build new browser games and
          experiment with new gameplay ideas. More finished experiences will
          join the Arcade as they are ready, giving players new challenges to
          discover and play.
        </p>

      </section>

    </main>
  );
}