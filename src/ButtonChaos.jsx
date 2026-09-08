import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import "./ButtonChaos.css";

const BUTTONS = [
  { id: "red", label: "RED", color: "#ff4d5a" },
  { id: "blue", label: "BLUE", color: "#4d8dff" },
  { id: "green", label: "GREEN", color: "#38d39f" },
  { id: "yellow", label: "YELLOW", color: "#ffd447" },
];

const MODES = [
  { name: "EASY", startTime: 1500, minTime: 720, decrease: 18 },
  { name: "NORMAL", startTime: 1250, minTime: 560, decrease: 20 },
  { name: "HARD", startTime: 1000, minTime: 430, decrease: 21 },
  { name: "INSANE", startTime: 800, minTime: 320, decrease: 22 },
];

const HIGH_SCORE_KEY = "north-horizon-button-chaos-high-score";

function getRandomTarget(previousId = null) {
  const available = BUTTONS.filter((button) => button.id !== previousId);
  return available[Math.floor(Math.random() * available.length)];
}

function ButtonChaos() {
  const [modeIndex, setModeIndex] = useState(0);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const saved = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    return Number.isFinite(saved) ? saved : 0;
  });
  const [target, setTarget] = useState(BUTTONS[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].startTime);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rewardUsed, setRewardUsed] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const gameRef = useRef({
    running: false,
    score: 0,
    target: BUTTONS[0],
    deadline: 0,
    duration: MODES[0].startTime,
    lastTargetId: null,
  });

  const gameContainerRef = useRef(null);

  const currentMode = MODES[modeIndex];

  const saveBest = useCallback((value) => {
    setBest((previous) => {
      if (value <= previous) return previous;

      localStorage.setItem(HIGH_SCORE_KEY, String(value));
      return value;
    });
  }, []);

  const chooseNextTarget = useCallback((currentTargetId) => {
    const next = getRandomTarget(currentTargetId);

    gameRef.current.target = next;
    gameRef.current.lastTargetId = next.id;

    setTarget(next);

    return next;
  }, []);

  const startGame = useCallback(() => {
    const now = performance.now();
    const config = MODES[modeIndex];
    const firstTarget = getRandomTarget();

    gameRef.current.running = true;
    gameRef.current.score = 0;
    gameRef.current.duration = config.startTime;
    gameRef.current.deadline = now + config.startTime;
    gameRef.current.target = firstTarget;
    gameRef.current.lastTargetId = firstTarget.id;

    setScore(0);
    setTimeLeft(config.startTime);
    setTarget(firstTarget);
    setStatus("playing");
    setRewardUsed(false);
  }, [modeIndex]);

  const endGame = useCallback(() => {
    if (!gameRef.current.running) return;

    gameRef.current.running = false;

    const finalScore = gameRef.current.score;

    saveBest(finalScore);
    setScore(finalScore);
    setStatus("gameover");
  }, [saveBest]);

  const handleButtonPress = useCallback(
    (button) => {
      if (!gameRef.current.running) return;

      if (button.id !== gameRef.current.target.id) {
        endGame();
        return;
      }

      const nextScore = gameRef.current.score + 1;
      const config = MODES[modeIndex];

      gameRef.current.score = nextScore;

      gameRef.current.duration = Math.max(
        config.minTime,
        config.startTime - nextScore * config.decrease
      );

      gameRef.current.deadline =
        performance.now() + gameRef.current.duration;

      setScore(nextScore);
      setTimeLeft(gameRef.current.duration);

      chooseNextTarget(button.id);
    },
    [chooseNextTarget, endGame, modeIndex]
  );

  useEffect(() => {
    let animationFrame;

    const tick = (now) => {
      if (gameRef.current.running) {
        const remaining = Math.max(
          0,
          gameRef.current.deadline - now
        );

        setTimeLeft(remaining);

        if (remaining <= 0) {
          endGame();
        }
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [endGame]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);

    return () => {
      clearTimeout(timer);

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow =
        previousHtmlOverflow;
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFullscreen(false);
      }

      return;
    }

    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }

    const element = gameContainerRef.current;

    if (
      element &&
      document.fullscreenEnabled &&
      typeof element.requestFullscreen === "function"
    ) {
      try {
        await element.requestFullscreen();
        return;
      } catch {
        // Fall through to CSS fullscreen fallback.
      }
    }

    setIsFullscreen(true);
  };

  const handleModeChange = (index) => {
    if (gameRef.current.running) return;

    setModeIndex(index);

    const config = MODES[index];

    setTimeLeft(config.startTime);
  };

  const handleRewardedContinue = () => {
    if (
      status !== "gameover" ||
      rewardUsed ||
      isWatchingAd
    ) {
      return;
    }

    setIsWatchingAd(true);

    // Development placeholder.
    // Replace with the real rewarded-ad callback later.
    setTimeout(() => {
      const config = MODES[modeIndex];
      const now = performance.now();
      const continuedScore = gameRef.current.score;

      gameRef.current.running = true;
      gameRef.current.score = continuedScore;

      gameRef.current.duration = Math.max(
        config.minTime,
        config.startTime -
          continuedScore * config.decrease
      );

      gameRef.current.deadline =
        now + gameRef.current.duration;

      gameRef.current.target = getRandomTarget(
        gameRef.current.target.id
      );

      setTarget(gameRef.current.target);
      setScore(continuedScore);
      setTimeLeft(gameRef.current.duration);
      setStatus("playing");
      setRewardUsed(true);
      setIsWatchingAd(false);
    }, 1500);
  };

  const progress =
    gameRef.current.running &&
    gameRef.current.duration > 0
      ? Math.max(
          0,
          Math.min(
            1,
            timeLeft / gameRef.current.duration
          )
        )
      : status === "idle"
        ? 1
        : 0;

  const secondsLeft = timeLeft / 1000;

  const timerUrgent =
    gameRef.current.running &&
    timeLeft <= Math.min(600, gameRef.current.duration * 0.4);

  return (
    <main
      className={`button-chaos-page ${
        isFullscreen
          ? "button-chaos-page-fullscreen"
          : ""
      }`}
    >
      <div className="button-chaos-layout">

        {/* INFO */}

        <aside className="button-chaos-info">
          <p className="button-chaos-eyebrow">
            NORTH HORIZON ARCADE
          </p>

          <h1>
            BUTTON
            <br />
            CHAOS.
          </h1>

          <p className="button-chaos-subtitle">
            Four buttons. One target. No mistakes.
          </p>

          <div className="button-chaos-desktop-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>

          <div className="button-chaos-description">
            <p>
              Match the target with the correct button
              before the timer runs out. Every correct
              tap makes the next decision faster.
            </p>

            <p>
              One wrong button ends the run. How long
              can you keep up?
            </p>
          </div>
        </aside>

        {/* GAME */}

        <section
          ref={gameContainerRef}
          className={`button-chaos-game-wrapper ${
            isFullscreen
              ? "button-chaos-fullscreen"
              : ""
          }`}
        >
          <div className="button-chaos-topbar">

            <div>
              <span>SCORE</span>
              <strong>{score}</strong>
            </div>

            <div>
              <span>BEST</span>
              <strong>{best}</strong>
            </div>

            <button
              className="button-chaos-fullscreen-button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize size={19} />
              ) : (
                <Maximize size={19} />
              )}
            </button>

          </div>

          <div className="button-chaos-stage">

            <div className="button-chaos-target-area">

              <span className="button-chaos-target-label">
                TAP THIS
              </span>

              <div
                className="button-chaos-target"
                style={{
                  "--target-color": target.color,
                }}
              >
                <span>{target.label}</span>
              </div>

              {/* TIMER */}

              <div
                className={`button-chaos-time-display ${
                  timerUrgent
                    ? "button-chaos-time-urgent"
                    : ""
                }`}
              >
                <span>TIME LEFT</span>

                <strong>
                  {secondsLeft.toFixed(2)}
                  <small>s</small>
                </strong>
              </div>

              <div className="button-chaos-timer">
                <div
                  className="button-chaos-timer-track"
                  style={{
                    "--timer-color": target.color,
                  }}
                >
                  <div
                    className={`button-chaos-timer-fill ${
                      timerUrgent
                        ? "button-chaos-timer-urgent"
                        : ""
                    }`}
                    style={{
                      transform: `scaleX(${progress})`,
                      backgroundColor:
                        target.color,
                    }}
                  />
                </div>
              </div>

            </div>

            {/* BUTTONS */}

            <div className="button-chaos-buttons">
              {BUTTONS.map((button) => (
                <button
                  key={button.id}
                  className="button-chaos-button"
                  style={{
                    "--button-color": button.color,
                  }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleButtonPress(button);
                  }}
                >
                  <span>{button.label}</span>
                </button>
              ))}
            </div>

            {/* OVERLAY */}

            {status !== "playing" && (
              <div className="button-chaos-overlay">

                {status === "idle" && (
                  <>
                    <p className="button-chaos-overlay-kicker">
                      REACTION TEST
                    </p>

                    <h2>READY?</h2>

                    <p>
                      Tap the matching button before
                      the timer disappears.
                    </p>

                    <button
                      className="button-chaos-primary-button"
                      onClick={startGame}
                    >
                      START GAME
                    </button>
                  </>
                )}

                {status === "gameover" && (
                  <>
                    <p className="button-chaos-overlay-kicker">
                      RUN OVER
                    </p>

                    <h2>{score}</h2>

                    <p>
                      {score > 0
                        ? "Good run. Can you beat your best?"
                        : "You were a little too slow."}
                    </p>

                    <div className="button-chaos-overlay-actions">

                      <button
                        className="button-chaos-primary-button"
                        onClick={startGame}
                      >
                        <RotateCcw size={17} />
                        PLAY AGAIN
                      </button>

                      <button
                        className="button-chaos-reward-button"
                        onClick={handleRewardedContinue}
                        disabled={
                          rewardUsed || isWatchingAd
                        }
                      >
                        {isWatchingAd
                          ? "WATCHING AD..."
                          : rewardUsed
                            ? "CONTINUE USED"
                            : "WATCH AD • CONTINUE"}
                      </button>

                    </div>
                  </>
                )}

              </div>
            )}

          </div>

          {isFullscreen && (
            <div className="button-chaos-fullscreen-ad">
              <span>ADVERTISEMENT</span>
              <div>AD SPACE</div>
            </div>
          )}

        </section>

        {!isFullscreen && (
          <div className="button-chaos-inline-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>
        )}

        {/* DIFFICULTY */}

        <section className="button-chaos-controls">

          <div className="button-chaos-mode-heading">
            <span>DIFFICULTY</span>
            <small>{currentMode.name}</small>
          </div>

          <div className="button-chaos-mode-buttons">
            {MODES.map((mode, index) => (
              <button
                key={mode.name}
                className={
                  index === modeIndex
                    ? "button-chaos-mode active"
                    : "button-chaos-mode"
                }
                onClick={() =>
                  handleModeChange(index)
                }
                disabled={gameRef.current.running}
              >
                <strong>{mode.name}</strong>
                <span>{mode.startTime} MS</span>
              </button>
            ))}
          </div>

        </section>

        {/* MOBILE DESCRIPTION */}

        <section className="button-chaos-mobile-description">
          <p>
            Match the target with the correct button
            before the timer runs out. Every correct
            tap makes the next decision faster.
          </p>

          <p>
            One wrong button ends the run. How long
            can you keep up?
          </p>
        </section>

      </div>
    </main>
  );
}

export default ButtonChaos;