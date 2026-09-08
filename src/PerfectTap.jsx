import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";
import "./PerfectTap.css";

const MODES = {
  EASY: {
    label: "EASY",
    speed: 900,
    zone: 24,
    shrink: 1.2,
  },
  NORMAL: {
    label: "NORMAL",
    speed: 760,
    zone: 20,
    shrink: 1.35,
  },
  HARD: {
    label: "HARD",
    speed: 630,
    zone: 16,
    shrink: 1.5,
  },
  INSANE: {
    label: "INSANE",
    speed: 520,
    zone: 12,
    shrink: 1.7,
  },
};

const MIN_ZONE = 7;

function PerfectTap() {
  const [mode, setMode] = useState("EASY");
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(
        localStorage.getItem("perfectTapHighScore")
      ) || 0;
    } catch {
      return 0;
    }
  });

  const [streak, setStreak] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [perfect, setPerfect] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [watchingAd, setWatchingAd] = useState(false);
  const [reviveAvailable, setReviveAvailable] =
    useState(true);

  const [markerPosition, setMarkerPosition] =
    useState(0);

  const [targetPosition, setTargetPosition] =
    useState(50);

  const [targetWidth, setTargetWidth] =
    useState(MODES.EASY.zone);

  const gameRef = useRef({
    running: false,
    lastFrame: 0,
    direction: 1,
    speed: MODES.EASY.speed,
    markerPosition: 0,
    targetPosition: 50,
    targetWidth: MODES.EASY.zone,
    score: 0,
    streak: 0,
  });

  const frameRef = useRef(null);
  const wrapperRef = useRef(null);

  const currentMode = MODES[mode];

  const saveHighScore = useCallback((value) => {
    setHighScore((previous) => {
      if (value > previous) {
        try {
          localStorage.setItem(
            "perfectTapHighScore",
            String(value)
          );
        } catch {
          // Ignore storage errors.
        }

        return value;
      }

      return previous;
    });
  }, []);

  const stopGameLoop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  /*
   * Starts only the movement loop.
   * This is separate from startGame so that
   * the rewarded revive can continue the
   * existing score and streak.
   */
  const startGameLoop = useCallback(() => {
    stopGameLoop();

    const game = gameRef.current;

    game.running = true;
    game.lastFrame = performance.now();

    const animate = (timestamp) => {
      if (!game.running) {
        return;
      }

      const delta =
        timestamp - game.lastFrame;

      game.lastFrame = timestamp;

      const difficultyMultiplier =
        1 + game.score * 0.018;

      const movement =
        (delta / game.speed) *
        100 *
        difficultyMultiplier;

      let nextPosition =
        game.markerPosition;

      if (game.direction === 1) {
        nextPosition += movement;
      } else {
        nextPosition -= movement;
      }

      if (nextPosition >= 100) {
        nextPosition = 100;
        game.direction = -1;
      }

      if (nextPosition <= 0) {
        nextPosition = 0;
        game.direction = 1;
      }

      game.markerPosition = nextPosition;

      setMarkerPosition(nextPosition);

      frameRef.current =
        requestAnimationFrame(animate);
    };

    frameRef.current =
      requestAnimationFrame(animate);
  }, [stopGameLoop]);

  const createNextTarget = useCallback(() => {
    const game = gameRef.current;

    let nextTarget =
      12 + Math.random() * 76;

    if (
      Math.abs(
        nextTarget - game.markerPosition
      ) < 18
    ) {
      nextTarget =
        game.markerPosition < 50
          ? 62 + Math.random() * 25
          : 13 + Math.random() * 25;
    }

    nextTarget = Math.max(
      game.targetWidth / 2,
      Math.min(
        100 - game.targetWidth / 2,
        nextTarget
      )
    );

    game.targetPosition = nextTarget;

    setTargetPosition(nextTarget);
    setTargetWidth(game.targetWidth);
  }, []);

  const startGame = useCallback(() => {
    stopGameLoop();

    const game = gameRef.current;

    game.running = true;
    game.direction = 1;
    game.speed = currentMode.speed;
    game.markerPosition = 0;
    game.targetPosition =
      18 + Math.random() * 64;
    game.targetWidth = currentMode.zone;
    game.score = 0;
    game.streak = 0;

    setScore(0);
    setStreak(0);
    setGameOver(false);
    setPerfect(false);
    setWatchingAd(false);
    setReviveAvailable(true);

    setMarkerPosition(0);
    setTargetPosition(game.targetPosition);
    setTargetWidth(game.targetWidth);

    startGameLoop();
  }, [
    currentMode.speed,
    currentMode.zone,
    startGameLoop,
    stopGameLoop,
  ]);

  const finishGame = useCallback(() => {
    const game = gameRef.current;

    game.running = false;

    stopGameLoop();

    setRunning(false);
    setGameOver(true);
    setPerfect(false);

    saveHighScore(game.score);
  }, [saveHighScore, stopGameLoop]);

  const handleTap = useCallback(() => {
    const game = gameRef.current;

    if (!game.running || watchingAd) {
      return;
    }

    const marker = game.markerPosition;
    const target = game.targetPosition;
    const width = game.targetWidth;

    const distance = Math.abs(
      marker - target
    );

    if (distance <= width / 2) {
      const isPerfect =
        distance <= Math.max(
          3.5,
          width * 0.18
        );

      game.score += isPerfect ? 2 : 1;
      game.streak += 1;

      const nextWidth = Math.max(
        MIN_ZONE,
        currentMode.zone -
          game.score * currentMode.shrink
      );

      game.targetWidth = nextWidth;

      setScore(game.score);
      setStreak(game.streak);
      setTargetWidth(nextWidth);
      setPerfect(isPerfect);

      createNextTarget();

      window.setTimeout(() => {
        setPerfect(false);
      }, 260);

      saveHighScore(game.score);

      return;
    }

    finishGame();
  }, [
    createNextTarget,
    currentMode.shrink,
    currentMode.zone,
    finishGame,
    saveHighScore,
    watchingAd,
  ]);

  const handleStart = useCallback(() => {
    setRunning(true);
    startGame();
  }, [startGame]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setRunning(true);
    startGame();
  }, [startGame]);

  /*
   * REWARDED AD REVIVE
   *
   * This currently simulates an ad.
   * Later this timeout will be replaced
   * by the real rewarded-ad completion
   * callback.
   */
  const handleWatchAd = useCallback(() => {
    if (!reviveAvailable || watchingAd) {
      return;
    }

    setWatchingAd(true);

    window.setTimeout(() => {
      const game = gameRef.current;

      game.running = true;

      /*
       * Give the player a fresh target while
       * preserving their score and streak.
       */
      game.targetWidth = Math.max(
        MIN_ZONE,
        currentMode.zone -
          game.score * currentMode.shrink
      );

      game.targetPosition =
        20 + Math.random() * 60;

      game.direction =
        game.markerPosition >= 50
          ? -1
          : 1;

      setTargetWidth(game.targetWidth);
      setTargetPosition(game.targetPosition);

      setGameOver(false);
      setRunning(true);
      setWatchingAd(false);

      /*
       * One revive per run.
       */
      setReviveAvailable(false);

      startGameLoop();
    }, 1400);
  }, [
    currentMode.shrink,
    currentMode.zone,
    reviveAvailable,
    startGameLoop,
    watchingAd,
  ]);

  const changeMode = useCallback(
    (nextMode) => {
      stopGameLoop();

      gameRef.current.running = false;

      setMode(nextMode);
      setRunning(false);
      setGameOver(false);
      setPerfect(false);
      setWatchingAd(false);
      setReviveAvailable(true);

      const nextConfig = MODES[nextMode];

      gameRef.current.speed =
        nextConfig.speed;

      gameRef.current.targetWidth =
        nextConfig.zone;

      gameRef.current.score = 0;
      gameRef.current.streak = 0;
      gameRef.current.markerPosition = 0;
      gameRef.current.targetPosition = 50;

      setScore(0);
      setStreak(0);
      setMarkerPosition(0);
      setTargetPosition(50);
      setTargetWidth(nextConfig.zone);
    },
    [stopGameLoop]
  );

  const toggleFullscreen = useCallback(
    async () => {
      if (!wrapperRef.current) {
        return;
      }

      try {
        if (!document.fullscreenElement) {
          await wrapperRef.current.requestFullscreen();
          setFullscreen(true);
        } else {
          await document.exitFullscreen();
          setFullscreen(false);
        }
      } catch {
        setFullscreen(
          (previous) => !previous
        );
      }
    },
    []
  );

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(
        document.fullscreenElement ===
          wrapperRef.current
      );
    };

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      stopGameLoop();
    };
  }, [stopGameLoop]);

  const targetLeft =
    targetPosition - targetWidth / 2;

  return (
    <main className="perfect-tap-page">
      <div className="perfect-tap-layout">

        {/* LEFT INFORMATION */}
        <section className="perfect-tap-info">
          <p className="perfect-tap-eyebrow">
            REFLEX • TIMING
          </p>

          <h1>Perfect Tap</h1>

          <p className="perfect-tap-subtitle">
            Your timing gets tighter with every
            round.
          </p>

          <div className="perfect-tap-desktop-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>

          <div className="perfect-tap-description">
            <p>
              Tap when the moving marker lands
              inside the target zone.
            </p>

            <p>
              Every successful tap makes the
              challenge faster and the target
              smaller.
            </p>
          </div>
        </section>

        {/* GAME */}
        <section className="perfect-tap-game-column">
          <div
            ref={wrapperRef}
            className={`perfect-tap-game-wrapper ${
              fullscreen
                ? "perfect-tap-fullscreen"
                : ""
            }`}
          >

            {/* TOP BAR */}
            <div className="perfect-tap-topbar">
              <div>
                <span>SCORE</span>
                <strong>{score}</strong>
              </div>

              <div>
                <span>BEST</span>
                <strong>{highScore}</strong>
              </div>

              <div>
                <span>STREAK</span>
                <strong>{streak}</strong>
              </div>

              <button
                type="button"
                className="perfect-tap-fullscreen-button"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
              >
                {fullscreen ? (
                  <Minimize size={17} />
                ) : (
                  <Maximize size={17} />
                )}
              </button>
            </div>

            {/* STAGE */}
            <div
              className="perfect-tap-stage"
              onPointerDown={
                running && !watchingAd
                  ? handleTap
                  : undefined
              }
            >

              {/* START SCREEN */}
              {!running && !gameOver && (
                <div className="perfect-tap-overlay">
                  <p className="perfect-tap-overlay-kicker">
                    READY?
                  </p>

                  <h2>Perfect Tap</h2>

                  <p>
                    Tap the marker when it enters
                    the target zone.
                  </p>

                  <button
                    type="button"
                    className="perfect-tap-primary-button"
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={handleStart}
                  >
                    PLAY
                  </button>
                </div>
              )}

              {/* GAME OVER */}
              {gameOver && (
                <div className="perfect-tap-overlay">
                  <p className="perfect-tap-overlay-kicker">
                    RUN OVER
                  </p>

                  <h2>{score}</h2>

                  <p>
                    {score === highScore
                      ? "New personal best."
                      : "Can you beat your best?"}
                  </p>

                  <div className="perfect-tap-overlay-actions">

                    {reviveAvailable && (
                      <button
                        type="button"
                        className="perfect-tap-reward-button"
                        disabled={watchingAd}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                        }}
                        onClick={handleWatchAd}
                      >
                        {watchingAd
                          ? "LOADING AD..."
                          : "WATCH AD • CONTINUE"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="perfect-tap-primary-button"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={handleRestart}
                    >
                      <RotateCcw size={15} />
                      PLAY AGAIN
                    </button>

                  </div>
                </div>
              )}

              {/* AD LOADING OVERLAY */}
              {watchingAd && (
                <div className="perfect-tap-ad-loading">
                  <div className="perfect-tap-ad-spinner" />
                  <span>WATCHING AD</span>
                </div>
              )}

              {/* PLAY AREA */}
              {running && !watchingAd && (
                <div className="perfect-tap-play-area">

                  <div className="perfect-tap-instruction">
                    TAP WHEN THE MARKER IS INSIDE
                  </div>

                  <div className="perfect-tap-track">

                    <div
                      className="perfect-tap-target-zone"
                      style={{
                        left: `${targetLeft}%`,
                        width: `${targetWidth}%`,
                      }}
                    />

                    <div
                      className={`perfect-tap-marker ${
                        perfect
                          ? "perfect-tap-marker-perfect"
                          : ""
                      }`}
                      style={{
                        left: `${markerPosition}%`,
                      }}
                    />

                  </div>

                  <div
                    className={`perfect-tap-feedback ${
                      perfect
                        ? "perfect-tap-feedback-visible"
                        : ""
                    }`}
                  >
                    PERFECT
                  </div>

                  <div className="perfect-tap-score-hint">
                    {streak > 1
                      ? `${streak} × STREAK`
                      : "TIMING IS EVERYTHING"}
                  </div>

                </div>
              )}

            </div>

            {/* FULLSCREEN AD */}
            {fullscreen && (
              <div className="perfect-tap-fullscreen-ad">
                <span>ADVERTISEMENT</span>
                <div>AD SPACE</div>
              </div>
            )}

          </div>

          {/* INLINE AD */}
          {!fullscreen && (
            <div className="perfect-tap-inline-ad">
              <span>ADVERTISEMENT</span>
              <div>AD SPACE</div>
            </div>
          )}

          {/* DIFFICULTY */}
          <section className="perfect-tap-controls">
            <div className="perfect-tap-mode-heading">
              <span>DIFFICULTY</span>
              <small>
                {currentMode.label}
              </small>
            </div>

            <div className="perfect-tap-mode-buttons">
              {Object.keys(MODES).map(
                (modeName) => (
                  <button
                    key={modeName}
                    type="button"
                    className={`perfect-tap-mode ${
                      mode === modeName
                        ? "active"
                        : ""
                    }`}
                    disabled={running || watchingAd}
                    onClick={() =>
                      changeMode(modeName)
                    }
                  >
                    <strong>
                      {MODES[modeName].label}
                    </strong>

                    <span>
                      {modeName === "EASY" &&
                        "WIDE TARGET"}

                      {modeName === "NORMAL" &&
                        "FASTER"}

                      {modeName === "HARD" &&
                        "TIGHT"}

                      {modeName === "INSANE" &&
                        "BRUTAL"}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>

          {/* MOBILE DESCRIPTION */}
          <section className="perfect-tap-mobile-description">
            <p>
              Tap when the moving marker lands
              inside the target zone.
            </p>

            <p>
              Every successful tap makes the
              challenge faster and the target
              smaller.
            </p>
          </section>

        </section>
      </div>
    </main>
  );
}

export default PerfectTap;