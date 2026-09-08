import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gamepad2,
  Users,
  Leaf,
  Globe2,
  ChevronRight,
} from "lucide-react";

const games = [
  {
    title: "Skybound",
    subtitle: "A vertical adventure",
    image: "/assets/home/skybound.png",
  },
  {
    title: "Memory Tiles",
    subtitle: "Test your mind",
    image: "/assets/home/memory-tiles.png",
  },
  {
    title: "Kakeru",
    subtitle: "Keep running",
    image: "/assets/home/kakeru.png",
  },
  {
    title: "Predictable",
    subtitle: "Rage. Solve. Repeat.",
    image: "/assets/home/predictable.png",
  },
];

const arcadeGames = [
  {
    title: "Button Chaos",
    image: "/assets/arcade/button-chaos.png",
  },
  {
    title: "Color Drop",
    image: "/assets/arcade/color-drop.png",
  },
  {
    title: "Stack It",
    image: "/assets/arcade/stack-it.png",
  },
  {
    title: "Perfect Tap",
    image: "/assets/arcade/perfect-tap.png",
  },
];

function GameCard({ game }) {
  return (
    <Link to="/games" className="game-card">
      <img
        src={game.image}
        alt={game.title}
        loading="lazy"
        decoding="async"
      />

      <div className="game-card-overlay" />

      <div className="game-card-content">
        <h3>{game.title}</h3>
        <p>{game.subtitle}</p>
      </div>
    </Link>
  );
}

function Value({ icon, title, text }) {
  return (
    <div className="value-card">
      <div className="value-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO */}

      <section className="hero">
        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow">
            GAMES FOR A BRIGHTER TOMORROW
          </div>

          <h1>
            WE BUILD
            <br />
            WORLDS
            <br />
            PEOPLE WANT
            <br />
            TO COME BACK TO.
          </h1>

          <p className="hero-description">
            North Horizon Studios is an independent game studio
            creating original games across mobile, web and beyond.
            We're a small team with big dreams — building games
            that are fun, creative and made for everyone.
          </p>

          <div className="hero-buttons">
            <Link to="/games" className="button button-light">
              Explore Our Games
              <ArrowRight size={17} />
            </Link>

            <Link to="/arcade" className="button button-outline">
              Play Arcade
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED GAMES */}

      <section className="section featured-section">
        <div className="section-header">
          <div className="eyebrow">
            FEATURED IN DEVELOPMENT
          </div>

          <button className="round-button">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game.title} game={game} />
          ))}
        </div>
      </section>

      {/* ARCADE */}

      <section className="section arcade-section">
        <div className="arcade-copy">
          <div className="eyebrow">PLAY INSTANTLY</div>

          <h2>
            NORTH HORIZON
            <br />
            ARCADE
          </h2>

          <p>
            A collection of free browser games made by us.
            No downloads, no sign ups — just click and play.
            New games added regularly.
          </p>

          <Link to="/arcade" className="button button-light">
            Play Arcade
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="arcade-showcase">
          {arcadeGames.map((game, index) => (
            <Link
              to="/arcade"
              key={game.title}
              className={`arcade-card arcade-card-${index}`}
            >
              <img
                src={game.image}
                alt={game.title}
                loading="lazy"
                decoding="async"
              />

              <span>{game.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUES */}

      <section className="section values-section">
        <div className="eyebrow centered">
          OUR VALUES
        </div>

        <h2 className="section-title centered">
          MORE THAN JUST GAMES
        </h2>

        <div className="values-grid">
          <Value
            icon={<Gamepad2 />}
            title="Creativity First"
            text="We love experimenting and bringing fresh ideas to life."
          />

          <Value
            icon={<Users />}
            title="Built For Everyone"
            text="Games should be fun, accessible and inclusive."
          />

          <Value
            icon={<Leaf />}
            title="A Positive Impact"
            text="We believe games can do good — for people, communities and the world around us."
          />

          <Value
            icon={<Globe2 />}
            title="A Global Perspective"
            text="We're a small studio, but our vision is global."
          />
        </div>
      </section>

      {/* MISSION */}

      <section className="mission-section">
        <div className="mission-background" />

        <div className="mission-content">
          <div>
            <div className="eyebrow">OUR MISSION</div>

            <h2>
              TO CREATE MEANINGFUL
              <br />
              ENTERTAINMENT THAT INSPIRES,
              <br />
              CONNECTS AND MAKES A
              <br />
              POSITIVE IMPACT.
            </h2>
          </div>

          <div className="mission-copy">
            <p>
              We're here to build more than just games.
              We want to create experiences that people remember,
              communities that grow, and a brighter future through play.
            </p>

            <Link to="/about" className="button button-light">
              Learn More About Us
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}