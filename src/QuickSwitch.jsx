import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";
import "./QuickSwitch.css";

const MODES = {
  EASY: {
    label: "EASY",
    speed: 2.8,
    spawnDelay: 180,
    obstacleHeight: 48,
  },
  NORMAL: {
    label: "NORMAL",
    speed: 3.5,
    spawnDelay: 180,
    obstacleHeight: 50,
  },
  HARD: {
    label: "HARD",
    speed: 4.4,
    spawnDelay: 180,
    obstacleHeight: 52,
  },
  INSANE: {
    label: "INSANE",
    speed: 5.5,
    spawnDelay: 180,
    obstacleHeight: 54,
  },
};

const PLAYER_HEIGHT = 42;
const PLAYER_WIDTH_RATIO = 0.28;
const PLAYER_BOTTOM = 48;

const LANE_GAP = 34;
const LANE_SIDE_PADDING = 34;
const MAX_OBSTACLES = 2;
const MIN_OBSTACLE_GAP = 250;
const SPAWN_CHECK_DELAY = 180;

function QuickSwitch() {
  const [mode, setMode] = useState("EASY");
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("quickSwitchHighScore")) || 0;
    } catch {
      return 0;
    }
  });

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [reviveAvailable, setReviveAvailable] = useState(true);

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const spawnRef = useRef(null);

  const gameRef = useRef({
    running: false,
    playerLane: 0,
    obstacles: [],
    score: 0,
    lastTime: 0,
    elapsed: 0,
    mode: "EASY",
  });

  const currentMode = MODES[mode];

  const saveHighScore = useCallback((value) => {
    setHighScore((previous) => {
      if (value > previous) {
        try {
          localStorage.setItem("quickSwitchHighScore", String(value));
        } catch {
          // Ignore storage errors.
        }
        return value;
      }
      return previous;
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const getLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const availableWidth =
      width - LANE_SIDE_PADDING * 2 - LANE_GAP;

    const laneWidth = availableWidth / 2;

    return {
      width,
      height,
      laneWidth,
      leftLaneX: LANE_SIDE_PADDING,
      rightLaneX:
        LANE_SIDE_PADDING + laneWidth + LANE_GAP,
    };
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const layout = getLayout();
    if (!layout) return;

    const {
      width,
      height,
      laneWidth,
      leftLaneX,
      rightLaneX,
    } = layout;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = gameRef.current;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#070707";
    ctx.fillRect(0, 0, width, height);

    // Lanes
    const laneXs = [leftLaneX, rightLaneX];

    laneXs.forEach((laneX, laneIndex) => {
      const active = game.playerLane === laneIndex;

      ctx.fillStyle = active
        ? "rgba(255,255,255,0.026)"
        : "rgba(255,255,255,0.012)";

      ctx.fillRect(laneX, 0, laneWidth, height);

      ctx.strokeStyle = active
        ? "rgba(255,255,255,0.13)"
        : "rgba(255,255,255,0.055)";

      ctx.lineWidth = 1;
      ctx.strokeRect(
        laneX + 0.5,
        0.5,
        laneWidth - 1,
        height - 1
      );
    });

    // Center divider
    ctx.fillStyle = "rgba(255,255,255,0.055)";
    ctx.fillRect(
      leftLaneX + laneWidth,
      0,
      LANE_GAP,
      height
    );

    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(
      leftLaneX + laneWidth + LANE_GAP / 2 - 1,
      0,
      2,
      height
    );

    // Asteroid obstacles
    game.obstacles.forEach((obstacle) => {
      const laneX =
        obstacle.lane === 0 ? leftLaneX : rightLaneX;

      const asteroidSize = Math.min(
        laneWidth * 0.34,
        obstacle.height
      );

      const centerX =
        laneX + laneWidth / 2;

      const centerY =
        obstacle.y + obstacle.height / 2;

      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(255,255,255,0.16)";

      ctx.beginPath();

      const points = [
        [-0.50, -0.16],
        [-0.34, -0.45],
        [0.02, -0.50],
        [0.42, -0.32],
        [0.50, 0.08],
        [0.28, 0.44],
        [-0.12, 0.50],
        [-0.45, 0.30],
      ];

      points.forEach(([px, py], index) => {
        const x = centerX + px * asteroidSize;
        const y = centerY + py * asteroidSize;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.closePath();

      ctx.fillStyle = "#8d8d8d";
      ctx.fill();

      ctx.shadowBlur = 0;

      ctx.strokeStyle = "#d5d5d5";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const craters = [
        [-0.20, -0.17, 0.10],
        [0.20, -0.08, 0.075],
        [0.06, 0.25, 0.115],
        [-0.28, 0.20, 0.055],
      ];

      craters.forEach(([cx, cy, radius]) => {
        ctx.beginPath();

        ctx.arc(
          centerX + cx * asteroidSize,
          centerY + cy * asteroidSize,
          radius * asteroidSize,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "#5b5b5b";
        ctx.fill();

        ctx.strokeStyle = "#a8a8a8";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.beginPath();

      ctx.arc(
        centerX - asteroidSize * 0.08,
        centerY - asteroidSize * 0.34,
        asteroidSize * 0.045,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#c6c6c6";
      ctx.fill();
    });

    // Spaceship player
    const playerLane = game.playerLane;

    const laneX =
      playerLane === 0 ? leftLaneX : rightLaneX;

    const shipWidth = Math.min(
      laneWidth * 0.32,
      58
    );

    const shipHeight = shipWidth * 1.18;

    const centerX =
      laneX + laneWidth / 2;

    const playerY =
      height - PLAYER_BOTTOM - shipHeight;

    // Engine glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255,255,255,0.42)";

    ctx.beginPath();
    ctx.moveTo(centerX, playerY);
    ctx.lineTo(
      centerX - shipWidth * 0.46,
      playerY + shipHeight * 0.82
    );
    ctx.lineTo(
      centerX,
      playerY + shipHeight * 0.66
    );
    ctx.lineTo(
      centerX + shipWidth * 0.46,
      playerY + shipHeight * 0.82
    );
    ctx.closePath();

    ctx.fillStyle = "#ededed";
    ctx.fill();

    ctx.shadowBlur = 0;

    // Wings
    ctx.beginPath();
    ctx.moveTo(
      centerX - shipWidth * 0.10,
      playerY + shipHeight * 0.40
    );
    ctx.lineTo(
      centerX - shipWidth * 0.54,
      playerY + shipHeight * 0.78
    );
    ctx.lineTo(
      centerX - shipWidth * 0.16,
      playerY + shipHeight * 0.70
    );
    ctx.closePath();

    ctx.fillStyle = "#bcbcbc";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(
      centerX + shipWidth * 0.10,
      playerY + shipHeight * 0.40
    );
    ctx.lineTo(
      centerX + shipWidth * 0.54,
      playerY + shipHeight * 0.78
    );
    ctx.lineTo(
      centerX + shipWidth * 0.16,
      playerY + shipHeight * 0.70
    );
    ctx.closePath();

    ctx.fillStyle = "#bcbcbc";
    ctx.fill();

    // Cockpit
    ctx.beginPath();
    ctx.moveTo(
      centerX,
      playerY + shipHeight * 0.16
    );
    ctx.lineTo(
      centerX - shipWidth * 0.13,
      playerY + shipHeight * 0.42
    );
    ctx.lineTo(
      centerX + shipWidth * 0.13,
      playerY + shipHeight * 0.42
    );
    ctx.closePath();

    ctx.fillStyle = "#171717";
    ctx.fill();

    // Engine
    ctx.beginPath();
    ctx.moveTo(
      centerX - shipWidth * 0.12,
      playerY + shipHeight * 0.70
    );
    ctx.lineTo(
      centerX,
      playerY + shipHeight * 0.98
    );
    ctx.lineTo(
      centerX + shipWidth * 0.12,
      playerY + shipHeight * 0.70
    );
    ctx.closePath();

    ctx.fillStyle = "#ffffff";
    ctx.fill();

  }, [getLayout]);

  const clearAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const clearSpawnTimer = useCallback(() => {
    if (spawnRef.current) {
      clearTimeout(spawnRef.current);
      spawnRef.current = null;
    }
  }, []);

  const finishGame = useCallback(() => {
    const game = gameRef.current;

    if (!game.running) return;

    game.running = false;

    clearAnimation();
    clearSpawnTimer();

    setRunning(false);
    setGameOver(true);

    saveHighScore(game.score);
  }, [clearAnimation, clearSpawnTimer, saveHighScore]);

  const spawnObstacle = useCallback(() => {
    const game = gameRef.current;

    if (!game.running || game.obstacles.length >= MAX_OBSTACLES) {
      return false;
    }

    const config = MODES[game.mode];

    const lastObstacle = game.obstacles[game.obstacles.length - 1];

    // Never stack asteroids too close vertically. The gap is based on the
    // current speed so the player always has a real window to switch lanes.
    const speedMultiplier = Math.min(2.7, 1 + game.elapsed / 14000);
    const currentSpeed = config.speed * speedMultiplier;
    const requiredGap = Math.max(
      MIN_OBSTACLE_GAP,
      currentSpeed * 34
    );

    if (lastObstacle) {
      const lastBottom = lastObstacle.y + lastObstacle.height;
      if (lastBottom < requiredGap) {
        return false;
      }
    }

    // Pick a completely random lane for every asteroid.
    const nextLane = Math.random() < 0.5 ? 0 : 1;

    game.obstacles.push({
      lane: nextLane,
      y: -config.obstacleHeight - 12,
      height: config.obstacleHeight,
      counted: false,
    });

    return true;
  }, []);

  const scheduleNextObstacle = useCallback(() => {
    const game = gameRef.current;

    if (!game.running || spawnRef.current) {
      return;
    }

    spawnRef.current = setTimeout(() => {
      spawnRef.current = null;

      if (!game.running) return;

      const spawned = spawnObstacle();

      // Check frequently, but spawn only when the current asteroids leave
      // enough vertical breathing room. This keeps the field to 1–2 asteroids
      // without the old 1–2 second dead period.
      if (!spawned || game.obstacles.length < MAX_OBSTACLES) {
        scheduleNextObstacle();
      }
    }, SPAWN_CHECK_DELAY);
  }, [spawnObstacle]);

  const gameLoop = useCallback(
    (timestamp) => {
      const game = gameRef.current;

      if (!game.running) {
        drawGame();
        return;
      }

      if (!game.lastTime) {
        game.lastTime = timestamp;
      }

      const delta =
        Math.min(timestamp - game.lastTime, 40) / 16.67;

      game.lastTime = timestamp;

      const config = MODES[game.mode];

      // Speed continuously increases as the run continues.
      // The pace ramps much harder than the previous version, but the
      // obstacle spacing scales with it so the game stays readable.
      game.elapsed += delta * (1000 / 60);

      const speedMultiplier = Math.min(
        2.7,
        1 + game.elapsed / 14000
      );

      const currentSpeed =
        config.speed * speedMultiplier;

      const layout = getLayout();

      if (!layout) return;

      const { height } = layout;

      if (game.obstacles.length > 0) {
        const playerY =
          height - PLAYER_BOTTOM - PLAYER_HEIGHT;

        const playerBottom =
          playerY + PLAYER_HEIGHT;

        let passedCount = 0;
        let collision = false;

        game.obstacles.forEach((obstacle) => {
          obstacle.y += currentSpeed * delta;

          const obstacleTop = obstacle.y;
          const obstacleBottom =
            obstacle.y + obstacle.height;

          const verticalOverlap =
            obstacleBottom >= playerY &&
            obstacleTop <= playerBottom;

          if (
            obstacle.lane === game.playerLane &&
            verticalOverlap
          ) {
            collision = true;
            return;
          }

          if (
            !obstacle.counted &&
            obstacleTop > playerBottom
          ) {
            obstacle.counted = true;
            passedCount += 1;
          }
        });

        if (collision) {
          finishGame();
          return;
        }

        if (passedCount > 0) {
          game.score += passedCount;

          setScore(game.score);
          saveHighScore(game.score);
        }

        // Remove only asteroids that are fully off-screen.
        game.obstacles =
          game.obstacles.filter(
            (obstacle) =>
              obstacle.y <= height
          );

        // Once an asteroid leaves the screen, allow the scheduler to
        // introduce the next one when the spacing window is safe.
        if (game.running && game.obstacles.length < MAX_OBSTACLES) {
          scheduleNextObstacle();
        }
      }

      drawGame();

      if (game.running) {
        animationRef.current =
          requestAnimationFrame(gameLoop);
      }
    },
    [
      drawGame,
      finishGame,
      getLayout,
      saveHighScore,
      scheduleNextObstacle,
    ]
  );

  const switchLane = useCallback(() => {
    const game = gameRef.current;

    if (!game.running || watchingAd) return;

    game.playerLane =
      game.playerLane === 0 ? 1 : 0;

    drawGame();
  }, [drawGame, watchingAd]);

  const startGame = useCallback(() => {
    clearAnimation();
    clearSpawnTimer();

    const game = gameRef.current;

    game.running = true;
    game.playerLane = Math.random() < 0.5 ? 0 : 1;
    game.obstacles = [];
    game.score = 0;
    game.lastTime = 0;
    game.elapsed = 0;
    game.mode = mode;

    setScore(0);
    setRunning(true);
    setGameOver(false);
    setWatchingAd(false);
    setReviveAvailable(true);

    resizeCanvas();
    drawGame();

    // Short starting delay before the first random obstacle.
    spawnRef.current = setTimeout(() => {
      spawnRef.current = null;

      if (!game.running) return;

      spawnObstacle();
      scheduleNextObstacle();
    }, 500);

    animationRef.current =
      requestAnimationFrame(gameLoop);
  }, [
    clearAnimation,
    clearSpawnTimer,
    drawGame,
    gameLoop,
    mode,
    resizeCanvas,
    spawnObstacle,
  ]);

  const handleWatchAd = useCallback(() => {
    if (!reviveAvailable || watchingAd) return;

    setWatchingAd(true);

    const game = gameRef.current;

    clearAnimation();
    clearSpawnTimer();

    // Development rewarded-ad simulation.
    setTimeout(() => {
      game.running = true;
      game.lastTime = 0;
      game.obstacles = [];

      // Give the player a random safe lane.
      game.playerLane =
        Math.random() < 0.5 ? 0 : 1;

      setRunning(true);
      setGameOver(false);
      setWatchingAd(false);
      setReviveAvailable(false);

      drawGame();

      // Start a fresh random obstacle after the revive.
      spawnRef.current = setTimeout(() => {
        spawnRef.current = null;

        if (!game.running) return;

        spawnObstacle();
        scheduleNextObstacle();
      }, 500);

      animationRef.current =
        requestAnimationFrame(gameLoop);
    }, 1400);
  }, [
    clearAnimation,
    clearSpawnTimer,
    drawGame,
    gameLoop,
    reviveAvailable,
    scheduleNextObstacle,
    spawnObstacle,
    watchingAd,
  ]);

  const handleRestart = useCallback(() => {
    startGame();
  }, [startGame]);

  const changeMode = useCallback(
    (nextMode) => {
      if (running || watchingAd) return;

      clearSpawnTimer();

      setMode(nextMode);
      setScore(0);
      setGameOver(false);
      setReviveAvailable(true);

      gameRef.current.mode = nextMode;
      gameRef.current.obstacles = [];
      gameRef.current.elapsed = 0;
    },
    [clearSpawnTimer, running, watchingAd]
  );

  const toggleFullscreen = useCallback(async () => {
    if (!wrapperRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await wrapperRef.current.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      setFullscreen((previous) => !previous);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    drawGame();

    const handleResize = () => {
      resizeCanvas();
      drawGame();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawGame, resizeCanvas]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(
        document.fullscreenElement === wrapperRef.current
      );

      resizeCanvas();
      drawGame();
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
  }, [drawGame, resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = () => {
      switchLane();
    };

    canvas.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      canvas.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [switchLane]);

  useEffect(() => {
    return () => {
      clearAnimation();
      clearSpawnTimer();
    };
  }, [clearAnimation, clearSpawnTimer]);

  return (
    <main className="quick-switch-page">
      <div className="quick-switch-layout">
        <section className="quick-switch-info">
          <p className="quick-switch-eyebrow">
            REFLEX • ACTION
          </p>

          <h1>Quick Switch</h1>

          <p className="quick-switch-subtitle">
            Switch lanes. Stay alive.
          </p>

          <div className="quick-switch-desktop-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>

          <div className="quick-switch-description">
            <p>
              Obstacles are coming fast. Tap anywhere
              to switch between the two lanes.
            </p>

            <p>
              Every obstacle chooses a random lane.
              React before it reaches you.
            </p>
          </div>
        </section>

        <section className="quick-switch-game-column">
          <div
            ref={wrapperRef}
            className={`quick-switch-game-wrapper ${
              fullscreen ? "quick-switch-fullscreen" : ""
            }`}
          >
            <div className="quick-switch-topbar">
              <div>
                <span>SCORE</span>
                <strong>{score}</strong>
              </div>

              <div>
                <span>BEST</span>
                <strong>{highScore}</strong>
              </div>

              <button
                type="button"
                className="quick-switch-fullscreen-button"
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

            <div className="quick-switch-stage">
              <canvas
                ref={canvasRef}
                className="quick-switch-canvas"
              />

              {!running &&
                !gameOver &&
                !watchingAd && (
                  <div className="quick-switch-overlay">
                    <p className="quick-switch-overlay-kicker">
                      READY?
                    </p>

                    <h2>Quick Switch</h2>

                    <p>
                      Tap anywhere to switch lanes.
                    </p>

                    <button
                      type="button"
                      className="quick-switch-primary-button"
                      onClick={startGame}
                    >
                      PLAY
                    </button>
                  </div>
                )}

              {gameOver && (
                <div className="quick-switch-overlay">
                  <p className="quick-switch-overlay-kicker">
                    RUN OVER
                  </p>

                  <h2>{score}</h2>

                  <p>
                    You survived {score} obstacles.
                  </p>

                  <div className="quick-switch-overlay-actions">
                    {reviveAvailable && (
                      <button
                        type="button"
                        className="quick-switch-reward-button"
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
                      className="quick-switch-primary-button"
                      onClick={handleRestart}
                    >
                      <RotateCcw size={15} />
                      PLAY AGAIN
                    </button>
                  </div>
                </div>
              )}

              {watchingAd && (
                <div className="quick-switch-ad-loading">
                  <div className="quick-switch-ad-spinner" />
                  <span>WATCHING AD</span>
                </div>
              )}

              {running && !watchingAd && (
                <div className="quick-switch-switch-hint">
                  TAP TO SWITCH
                </div>
              )}
            </div>

            {fullscreen && (
              <div className="quick-switch-fullscreen-ad">
                <span>ADVERTISEMENT</span>
                <div>AD SPACE</div>
              </div>
            )}
          </div>

          {!fullscreen && (
            <div className="quick-switch-inline-ad">
              <span>ADVERTISEMENT</span>
              <div>AD SPACE</div>
            </div>
          )}

          <section className="quick-switch-controls">
            <div className="quick-switch-mode-heading">
              <span>DIFFICULTY</span>
              <small>{currentMode.label}</small>
            </div>

            <div className="quick-switch-mode-buttons">
              {Object.keys(MODES).map((modeName) => (
                <button
                  key={modeName}
                  type="button"
                  className={`quick-switch-mode ${
                    mode === modeName ? "active" : ""
                  }`}
                  disabled={running || watchingAd}
                  onClick={() => changeMode(modeName)}
                >
                  <strong>
                    {MODES[modeName].label}
                  </strong>

                  <span>
                    {modeName === "EASY" && "SLOW"}
                    {modeName === "NORMAL" && "MEDIUM"}
                    {modeName === "HARD" && "FAST"}
                    {modeName === "INSANE" && "EXTREME"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="quick-switch-mobile-description">
            <p>
              Obstacles are coming fast. Tap anywhere
              to switch between the two lanes.
            </p>

            <p>
              Every obstacle chooses a random lane.
              React before it reaches you.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}

export default QuickSwitch;
