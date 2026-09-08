import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";
import "./MemoryRush.css";

const MODES = {
  EASY: {
    label: "EASY",
    grid: 3,
    startLength: 3,
    showTime: 620,
  },
  NORMAL: {
    label: "NORMAL",
    grid: 4,
    startLength: 3,
    showTime: 540,
  },
  HARD: {
    label: "HARD",
    grid: 5,
    startLength: 4,
    showTime: 460,
  },
  INSANE: {
    label: "INSANE",
    grid: 6,
    startLength: 5,
    showTime: 390,
  },
};

function MemoryRush() {
  const [mode, setMode] = useState("EASY");

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(
        localStorage.getItem("memoryRushHighScore")
      ) || 0;
    } catch {
      return 0;
    }
  });

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [phase, setPhase] = useState("idle");
  const [activeTile, setActiveTile] = useState(null);
  const [selectedTiles, setSelectedTiles] = useState([]);

  const [fullscreen, setFullscreen] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [reviveAvailable, setReviveAvailable] = useState(true);

  const gameRef = useRef({
    running: false,
    phase: "idle",
    sequence: [],
    playerIndex: 0,
    round: 0,
    score: 0,
    grid: 3,
    showTime: 620,
  });

  const wrapperRef = useRef(null);
  const timersRef = useRef([]);

  const currentMode = MODES[mode];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timersRef.current = [];
  }, []);

  const saveHighScore = useCallback((value) => {
    setHighScore((previous) => {
      if (value > previous) {
        try {
          localStorage.setItem(
            "memoryRushHighScore",
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

  const randomSequence = useCallback(
    (length, totalTiles) => {
      const sequence = [];

      while (sequence.length < length) {
        const next =
          Math.floor(Math.random() * totalTiles);

        /*
         * Avoid the same tile twice in a row.
         */
        if (
          sequence.length === 0 ||
          sequence[sequence.length - 1] !== next
        ) {
          sequence.push(next);
        }
      }

      return sequence;
    },
    []
  );

  const showSequence = useCallback(
    (sequence, config) => {
      clearTimers();

      const game = gameRef.current;

      game.phase = "showing";
      game.playerIndex = 0;

      setPhase("showing");
      setSelectedTiles([]);
      setActiveTile(null);

      sequence.forEach((tile, index) => {
        const onTimer = setTimeout(() => {
          if (!game.running) {
            return;
          }

          setActiveTile(tile);

          const offTimer = setTimeout(() => {
            setActiveTile(null);
          }, config.showTime * 0.7);

          timersRef.current.push(offTimer);
        }, index * config.showTime);

        timersRef.current.push(onTimer);
      });

      const finishTimer = setTimeout(() => {
        if (!game.running) {
          return;
        }

        game.phase = "input";
        game.playerIndex = 0;

        setPhase("input");
        setActiveTile(null);
        setSelectedTiles([]);
      }, sequence.length * config.showTime);

      timersRef.current.push(finishTimer);
    },
    [clearTimers]
  );

  const beginRound = useCallback(
    (roundNumber, preserveScore = true) => {
      clearTimers();

      const game = gameRef.current;
      const config = MODES[mode];

      const totalTiles =
        config.grid * config.grid;

      const sequenceLength = config.startLength;

      const sequence = randomSequence(
        sequenceLength,
        totalTiles
      );

      game.sequence = sequence;
      game.playerIndex = 0;
      game.round = roundNumber;
      game.grid = config.grid;
      game.showTime = config.showTime;
      game.phase = "showing";

      if (!preserveScore) {
        game.score = 0;
        setScore(0);
      }

      setRound(roundNumber);
      setPhase("showing");
      setSelectedTiles([]);
      setActiveTile(null);

      showSequence(sequence, config);
    },
    [
      clearTimers,
      mode,
      randomSequence,
      showSequence,
    ]
  );

  const startGame = useCallback(() => {
    clearTimers();

    const game = gameRef.current;

    game.running = true;
    game.phase = "showing";
    game.score = 0;
    game.round = 1;
    game.playerIndex = 0;

    setScore(0);
    setRound(1);
    setRunning(true);
    setGameOver(false);
    setWatchingAd(false);
    setReviveAvailable(true);
    setSelectedTiles([]);
    setActiveTile(null);

    beginRound(1, false);
  }, [beginRound, clearTimers]);

  const finishGame = useCallback(() => {
    const game = gameRef.current;

    game.running = false;
    game.phase = "gameover";

    clearTimers();

    setRunning(false);
    setGameOver(true);
    setPhase("gameover");
    setActiveTile(null);

    saveHighScore(game.score);
  }, [clearTimers, saveHighScore]);

  const handleTileTap = useCallback(
    (tileIndex) => {
      const game = gameRef.current;

      if (
        !game.running ||
        game.phase !== "input" ||
        watchingAd
      ) {
        return;
      }

      const expected =
        game.sequence[game.playerIndex];

      if (tileIndex !== expected) {
        finishGame();
        return;
      }

      setSelectedTiles((previous) => [
        ...previous,
        tileIndex,
      ]);

      game.playerIndex += 1;

      /*
       * Whole sequence completed.
       */
      if (
        game.playerIndex >=
        game.sequence.length
      ) {
        game.score += game.round;

        setScore(game.score);
        saveHighScore(game.score);

        const nextRound =
          game.round + 1;

        const successTimer = setTimeout(() => {
          if (!game.running) {
            return;
          }

          beginRound(nextRound, true);
        }, 420);

        timersRef.current.push(successTimer);
      }
    },
    [
      beginRound,
      finishGame,
      saveHighScore,
      watchingAd,
    ]
  );

  /*
   * Rewarded-ad revive.
   *
   * This is intentionally a development simulation.
   * The timeout will later be replaced with the
   * real Google rewarded-ad completion callback.
   */
  const handleWatchAd = useCallback(() => {
    if (!reviveAvailable || watchingAd) {
      return;
    }

    setWatchingAd(true);

    clearTimers();

    const adTimer = setTimeout(() => {
      const game = gameRef.current;

      game.running = true;
      game.phase = "input";

      /*
       * Preserve the player's current score
       * and round. They get another chance at
       * the current sequence.
       */
      game.playerIndex = 0;

      setRunning(true);
      setGameOver(false);
      setPhase("input");
      setSelectedTiles([]);
      setActiveTile(null);
      setWatchingAd(false);

      /*
       * Only one revive per run.
       */
      setReviveAvailable(false);
    }, 1400);

    timersRef.current.push(adTimer);
  }, [
    clearTimers,
    reviveAvailable,
    watchingAd,
  ]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setRunning(true);
    startGame();
  }, [startGame]);

  const changeMode = useCallback(
    (nextMode) => {
      clearTimers();

      gameRef.current.running = false;
      gameRef.current.phase = "idle";

      const config = MODES[nextMode];

      gameRef.current.grid = config.grid;
      gameRef.current.showTime =
        config.showTime;

      setMode(nextMode);
      setScore(0);
      setRound(0);
      setRunning(false);
      setGameOver(false);
      setPhase("idle");
      setActiveTile(null);
      setSelectedTiles([]);
      setWatchingAd(false);
      setReviveAvailable(true);
    },
    [clearTimers]
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
      clearTimers();
    };
  }, [clearTimers]);

  const totalTiles =
    currentMode.grid * currentMode.grid;

  return (
    <main className="memory-rush-page">
      <div className="memory-rush-layout">

        {/* LEFT INFORMATION */}
        <section className="memory-rush-info">
          <p className="memory-rush-eyebrow">
            MEMORY • PUZZLE
          </p>

          <h1>Memory Rush</h1>

          <p className="memory-rush-subtitle">
            Watch carefully. Remember everything.
          </p>

          <div className="memory-rush-desktop-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>

          <div className="memory-rush-description">
            <p>
              Watch the sequence light up, then
              repeat it in exactly the same order.
            </p>

            <p>
              The sequence length stays fixed, but
              every round gets faster.
            </p>
          </div>
        </section>

        {/* GAME COLUMN */}
        <section className="memory-rush-game-column">
          <div
            ref={wrapperRef}
            className={`memory-rush-game-wrapper ${
              fullscreen
                ? "memory-rush-fullscreen"
                : ""
            }`}
          >

            {/* TOP BAR */}
            <div className="memory-rush-topbar">
              <div>
                <span>SCORE</span>
                <strong>{score}</strong>
              </div>

              <div>
                <span>BEST</span>
                <strong>{highScore}</strong>
              </div>

              <div>
                <span>ROUND</span>
                <strong>{round}</strong>
              </div>

              <button
                type="button"
                className="memory-rush-fullscreen-button"
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
            <div className="memory-rush-stage">

              {/* START SCREEN */}
              {!running && !gameOver && (
                <div className="memory-rush-overlay">
                  <p className="memory-rush-overlay-kicker">
                    READY?
                  </p>

                  <h2>Memory Rush</h2>

                  <p>
                    Watch the sequence. Then tap
                    every tile in order.
                  </p>

                  <button
                    type="button"
                    className="memory-rush-primary-button"
                    onClick={startGame}
                  >
                    PLAY
                  </button>
                </div>
              )}

              {/* GAME OVER */}
              {gameOver && (
                <div className="memory-rush-overlay">
                  <p className="memory-rush-overlay-kicker">
                    RUN OVER
                  </p>

                  <h2>{score}</h2>

                  <p>
                    You reached round {round}.
                  </p>

                  <div className="memory-rush-overlay-actions">

                    {reviveAvailable && (
                      <button
                        type="button"
                        className="memory-rush-reward-button"
                        disabled={watchingAd}
                        onClick={handleWatchAd}
                      >
                        {watchingAd
                          ? "LOADING AD..."
                          : "WATCH AD • CONTINUE"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="memory-rush-primary-button"
                      onClick={handleRestart}
                    >
                      <RotateCcw size={15} />
                      PLAY AGAIN
                    </button>

                  </div>
                </div>
              )}

              {/* AD LOADING */}
              {watchingAd && (
                <div className="memory-rush-ad-loading">
                  <div className="memory-rush-ad-spinner" />
                  <span>WATCHING AD</span>
                </div>
              )}

              {/* GAME GRID */}
              {running && !watchingAd && (
                <div className="memory-rush-play-area">

                  <div className="memory-rush-status">
                    {phase === "showing"
                      ? "WATCH THE SEQUENCE"
                      : "REPEAT THE SEQUENCE"}
                  </div>

                  <div
                    className="memory-rush-grid"
                    style={{
                      gridTemplateColumns: `repeat(${currentMode.grid}, 1fr)`,
                      gridTemplateRows: `repeat(${currentMode.grid}, 1fr)`,
                    }}
                  >
                    {Array.from({
                      length: totalTiles,
                    }).map((_, index) => {
                      const isActive =
                        activeTile === index;

                      const isSelected =
                        selectedTiles.includes(
                          index
                        );

                      return (
                        <button
                          key={index}
                          type="button"
                          className={`memory-rush-tile ${
                            isActive
                              ? "memory-rush-tile-active"
                              : ""
                          } ${
                            isSelected
                              ? "memory-rush-tile-selected"
                              : ""
                          }`}
                          disabled={
                            phase !== "input"
                          }
                          onClick={() =>
                            handleTileTap(index)
                          }
                          aria-label={`Memory tile ${
                            index + 1
                          }`}
                        >
                          {isSelected && (
                            <span>
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="memory-rush-hint">
                    {phase === "showing"
                      ? `SEQUENCE • ${
                          gameRef.current
                            .sequence.length
                        } TILES`
                      : `${
                          gameRef.current
                            .playerIndex + 1
                        } / ${
                          gameRef.current
                            .sequence.length
                        }`}
                  </div>

                </div>
              )}

            </div>

            {/* FULLSCREEN AD */}
            {fullscreen && (
              <div className="memory-rush-fullscreen-ad">
                <span>ADVERTISEMENT</span>
                <div>AD SPACE</div>
              </div>
            )}

          </div>

          {/* INLINE AD */}
          {!fullscreen && (
            <div className="memory-rush-inline-ad">
              <span>ADVERTISEMENT</span>
              <div>AD SPACE</div>
            </div>
          )}

          {/* DIFFICULTY */}
          <section className="memory-rush-controls">
            <div className="memory-rush-mode-heading">
              <span>DIFFICULTY</span>

              <small>
                {currentMode.label}
              </small>
            </div>

            <div className="memory-rush-mode-buttons">
              {Object.keys(MODES).map(
                (modeName) => (
                  <button
                    key={modeName}
                    type="button"
                    className={`memory-rush-mode ${
                      mode === modeName
                        ? "active"
                        : ""
                    }`}
                    disabled={
                      running || watchingAd
                    }
                    onClick={() =>
                      changeMode(modeName)
                    }
                  >
                    <strong>
                      {MODES[modeName].label}
                    </strong>

                    <span>
                      {modeName === "EASY" &&
                        "3 × 3"}

                      {modeName === "NORMAL" &&
                        "4 × 4"}

                      {modeName === "HARD" &&
                        "5 × 5"}

                      {modeName === "INSANE" &&
                        "6 × 6"}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>

          {/* MOBILE DESCRIPTION */}
          <section className="memory-rush-mobile-description">
            <p>
              Watch the sequence light up, then
              repeat it in exactly the same order.
            </p>

            <p>
              The sequence length stays fixed, but
              every round gets faster.
            </p>
          </section>

        </section>
      </div>
    </main>
  );
}

export default MemoryRush;