import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Users, Leaf, Globe2 } from "lucide-react";

const featuredGames = [
  {
    name: "Skybound",
    sub: "A vertical adventure",
    image: "/assets/home/skybound.png",
  },
  {
    name: "Memory Tiles",
    sub: "Test your mind",
    image: "/assets/home/memory-tiles.png",
  },
  {
    name: "Kakeru",
    sub: "Keep running",
    image: "/assets/home/kakeru.png",
  },
  {
    name: "Predictable",
    sub: "Rage. Solve. Repeat.",
    image: "/assets/home/predictable.png",
  },
];

const arcadeGames = [
  {
    name: "Color Drop",
    image: "/assets/arcade/color-drop.png",
  },
  {
    name: "Button Chaos",
    image: "/assets/arcade/button-chaos.png",
  },
  {
    name: "Stack It",
    image: "/assets/arcade/stack-it.png",
  },
  {
    name: "Perfect Tap",
    image: "/assets/arcade/perfect-tap.png",
  },
];

const SLOT_POSITIONS = ["12%", "37%", "63%", "88%"];
const SLOT_ROTATIONS = [-8, -3, 6, 12];

function FeaturedCard({ game }) {
  return (
    <Link to="/games" className="home-featured-card">
      <img src={game.image} alt={game.name} />
      <div className="home-featured-overlay" />
      <div className="home-featured-copy">
        <h3>{game.name}</h3>
        <p>{game.sub}</p>
      </div>
    </Link>
  );
}

function DraggableArcadeCard({ game, index, onReorder }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const pointerStartX = useRef(0);
  const holdTimer = useRef(null);
  const didDrag = useRef(false);
  const activePointerId = useRef(null);

  const clearHoldTimer = useCallback(() => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    pointerStartX.current = event.clientX;
    activePointerId.current = event.pointerId;
    didDrag.current = false;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is not available in every browser.
    }

    clearHoldTimer();

    holdTimer.current = window.setTimeout(() => {
      didDrag.current = true;
      setDragging(true);
    }, 260);
  };

  const handlePointerMove = (event) => {
    if (activePointerId.current !== event.pointerId) return;

    const delta = event.clientX - pointerStartX.current;

    if (!dragging) {
      if (Math.abs(delta) > 8) {
        clearHoldTimer();
      }
      return;
    }

    event.preventDefault();
    setDragX(Math.max(-150, Math.min(150, delta)));
  };

  const finishPointer = (event) => {
    if (activePointerId.current !== event.pointerId) return;

    clearHoldTimer();

    const wasDragging = didDrag.current;

    if (wasDragging) {
      const moveBy = Math.max(
        -3,
        Math.min(3, Math.round(dragX / 105))
      );

      if (moveBy !== 0) {
        onReorder(index, moveBy);
      }

      event.preventDefault();
    }

    setDragging(false);
    setDragX(0);
    activePointerId.current = null;
  };

  const cancelPointer = () => {
    clearHoldTimer();
    setDragging(false);
    setDragX(0);
    activePointerId.current = null;
  };

  const handleClick = (event) => {
    if (didDrag.current) {
      event.preventDefault();
      event.stopPropagation();
    }

    didDrag.current = false;
  };

  return (
    <Link
      to="/arcade"
      className={`home-arcade-card ${dragging ? "is-dragging" : ""}`}
      style={{
        left: SLOT_POSITIONS[index],
        zIndex: dragging ? 20 : index + 1,
        transform: dragging
          ? `translateX(calc(-50% + ${dragX}px)) scale(1.04) rotate(0deg)`
          : `translateX(-50%) rotate(${SLOT_ROTATIONS[index]}deg)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={cancelPointer}
      onClick={handleClick}
    >
      <img src={game.image} alt={game.name} draggable="false" />
      <span>{game.name}</span>
    </Link>
  );
}

function ArcadePreview() {
  const [orderedGames, setOrderedGames] = useState(arcadeGames);

  const reorderCard = useCallback((fromIndex, moveBy) => {
    setOrderedGames((current) => {
      const toIndex = Math.max(
        0,
        Math.min(current.length - 1, fromIndex + moveBy)
      );

      if (toIndex === fromIndex) return current;

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return (
    <div className="home-arcade-stack">
      {orderedGames.map((game, index) => (
        <DraggableArcadeCard
          key={game.name}
          game={game}
          index={index}
          onReorder={reorderCard}
        />
      ))}
    </div>
  );
}

function Value({ icon, title, children }) {
  return (
    <article className="home-value">
      <div className="home-value-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-vignette" />

        <div className="home-hero-content">
          <div className="home-eyebrow">GAMES FOR A BRIGHTER TOMORROW</div>

          <h1>
            WE BUILD
            <br />
            WORLDS
            <br />
            PEOPLE WANT
            <br />
            TO COME BACK TO.
          </h1>

          <p className="home-hero-copy">
            North Horizon Studios is an independent game studio creating
            original games across mobile, web and beyond. We are a small team
            with big dreams, building games that are fun, creative and made
            for everyone.
          </p>

          <div className="home-actions">
            <Link className="home-button home-button-light" to="/projects">
              Explore Our Projects
            </Link>

            <Link className="home-button home-button-arcade" to="/arcade">
              Play Arcade Now
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-featured">
        <div className="home-section-head">
          <div className="home-eyebrow">FEATURED IN DEVELOPMENT</div>
        </div>

        <div className="home-featured-grid">
          {featuredGames.map((game) => (
            <FeaturedCard key={game.name} game={game} />
          ))}
        </div>
      </section>

      <section className="home-section home-arcade">
        <div className="home-arcade-copy">
          <div className="home-eyebrow">PLAY INSTANTLY</div>

          <h2>
            NORTH HORIZON
            <br />
            ARCADE
          </h2>

          <p>
            A collection of free browser games made by us. No downloads, no
            sign ups, just click and play. New games added regularly.
          </p>

          <Link className="home-button home-button-arcade" to="/arcade">
            Play Arcade Now
          </Link>
        </div>

        <ArcadePreview />
      </section>

      <section className="home-section home-values">
        <div className="home-eyebrow home-center">OUR VALUES</div>
        <h2 className="home-values-title">MORE THAN JUST GAMES</h2>

        <div className="home-values-grid">
          <Value
            icon={<Gamepad2 />}
            title="Creativity First"
          >
            We love experimenting and bringing fresh ideas to life.
          </Value>

          <Value
            icon={<Users />}
            title="Built For Everyone"
          >
            Games should be fun, accessible and inclusive.
          </Value>

          <Value
            icon={<Leaf />}
            title="A Positive Impact"
          >
            We believe games can do good, for people, communities and the
            world around us.
          </Value>

          <Value
            icon={<Globe2 />}
            title="A Global Perspective"
          >
            We are a small studio, but our vision is global.
          </Value>
        </div>
      </section>

      <section className="home-section home-mission">
        <div className="home-mission-bg" />

        <div className="home-mission-content">
          <div>
            <div className="home-eyebrow">OUR MISSION</div>

            <h2>
              TO CREATE MEANINGFUL
              <br />
              ENTERTAINMENT THAT INSPIRES,
              <br />
              CONNECTS AND MAKES A POSITIVE IMPACT.
            </h2>
          </div>

          <div className="home-mission-side">
            <p>
              We are here to build more than just games. We want to create
              experiences that people remember, communities that grow, and a
              brighter future through play.
            </p>

            <Link className="home-button home-button-light" to="/about">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
