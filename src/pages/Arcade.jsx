import { Link } from "react-router-dom";
import { ArrowRight, Gamepad2, Zap } from "lucide-react";

const games = [
  {
    title: "Color Drop",
    description: "Match the falling colors. How long can you survive?",
    category: "Arcade",
    difficulty: "Easy",
    status: "NEW",
    image: "/assets/arcade/color-drop.png",
  },
  {
    title: "Button Chaos",
    description: "Tap the correct button before time runs out.",
    category: "Reflex",
    difficulty: "Medium",
    status: "NEW",
    image: "/assets/arcade/button-chaos.png",
  },
  {
    title: "Perfect Tap",
    description: "Your timing gets tighter with every round.",
    category: "Reflex",
    difficulty: "Medium",
    status: "",
    image: "/assets/arcade/perfect-tap.png",
  },
  {
    title: "Stack It",
    description: "Stack as high as you can without dropping everything.",
    category: "Skill",
    difficulty: "Easy",
    status: "",
    image: "/assets/arcade/stack-it.png",
  },
  {
    title: "Memory Rush",
    description: "Remember. Match. Repeat. The board gets harder.",
    category: "Puzzle",
    difficulty: "Hard",
    status: "",
    image: "/assets/arcade/memory-rush.png",
  },
  {
    title: "Quick Switch",
    description: "React faster than your brain can think.",
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
            ARCADE.
          </h1>

          <p>
            Free browser games. No downloads.
            <br />
            No sign-ups. Just play.
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
            PICK A GAME.
            <br />
            SEE HOW LONG
            <br />
            YOU LAST.
          </h2>
        </div>

        <p>
          Welcome to the North Horizon Arcade — a growing
          collection of small games designed to be played
          instantly in your browser.
        </p>

      </section>


      {/* =====================================================
          ADVERTISEMENT
          ===================================================== */}

      <div className="arcade-ad-container">

        <span>ADVERTISEMENT</span>

        <div className="arcade-ad-box">
          AD SPACE
        </div>

      </div>


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
              CHALLENGE.
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
          MORE COMING SOON
        </div>

        <h2>
          WE'RE JUST
          <br />
          GETTING STARTED.
        </h2>

        <p>
          New games are already being built.
          Check back soon for more.
        </p>

      </section>

    </main>
  );
}