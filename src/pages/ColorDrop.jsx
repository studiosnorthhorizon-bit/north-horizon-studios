import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RotateCcw } from "lucide-react";

const COLORS = [
  {
    name: "RED",
    value: "#ff4d4d",
  },
  {
    name: "BLUE",
    value: "#4d8dff",
  },
  {
    name: "GREEN",
    value: "#45d483",
  },
  {
    name: "YELLOW",
    value: "#ffd84d",
  },
  {
    name: "PURPLE",
    value: "#b56cff",
  },
];

const MODES = [
  {
    name: "EASY",
    colors: 2,
  },
  {
    name: "NORMAL",
    colors: 3,
  },
  {
    name: "HARD",
    colors: 4,
  },
  {
    name: "INSANE",
    colors: 5,
  },
];

/*
============================================================
GAME SETTINGS
============================================================
*/

const WALL_SPACING = 450;

const STARTING_SPEED = 1.8;

const SPEED_INCREASE = 0.001;

const WALL_HEIGHT = 58;

const FIRST_WALL_DELAY = 400;

const HIGH_SCORE_PREFIX =
  "north_horizon_color_drop_highscore_";


/*
============================================================
COLOR DROP
============================================================
*/

export default function ColorDrop() {
  const canvasRef = useRef(null);

  const gameContainerRef =
    useRef(null);

  const animationRef =
    useRef(null);

  const [mode, setMode] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [highScore, setHighScore] =
    useState(0);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [rewardUsed, setRewardUsed] =
    useState(false);

  const [rewardLoading, setRewardLoading] =
    useState(false);


  /*
  ============================================================
  CURRENT COLORS
  ============================================================
  */

  const currentColors =
    COLORS.slice(
      0,
      MODES[mode].colors
    );


  /*
  ============================================================
  GAME STATE
  ============================================================
  */

  const gameRef = useRef({
    player: {
      x: 0,
      y: 0,
      radius: 18,
      colorIndex: 0,
    },

    walls: [],

    score: 0,

    speed: STARTING_SPEED,

    lastSpawn: 0,

    lastTime: 0,

    running: false,
  });


  /*
  ============================================================
  HIGH SCORE
  ============================================================
  */

  const getHighScore = () => {
    try {
      const saved =
        localStorage.getItem(
          HIGH_SCORE_PREFIX +
            MODES[mode].name
        );

      return saved
        ? Number(saved)
        : 0;
    } catch {
      return 0;
    }
  };


  const saveHighScore = (
    value
  ) => {
    try {
      localStorage.setItem(
        HIGH_SCORE_PREFIX +
          MODES[mode].name,
        String(value)
      );
    } catch {
      // Local storage may be unavailable.
    }
  };


  /*
  ============================================================
  LOAD HIGH SCORE
  ============================================================
  */

  useEffect(() => {
    setHighScore(
      getHighScore()
    );
  }, [mode]);


  /*
  ============================================================
  TRAVEL TIME
  ============================================================
  */

  function getTravelTime(
    speed,
    distance
  ) {
    const safeSpeed =
      Math.max(
        speed,
        0.1
      );

    return (
      (
        distance /
        safeSpeed
      ) *
      16.67
    );
  }


  /*
  ============================================================
  RESET GAME
  ============================================================
  */

  const resetGame = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const width =
      canvas.width;

    const height =
      canvas.height;

    const now =
      performance.now();


    /*
    First wall appears quickly.
    */

    const firstWallTime =
      now -
      (
        getTravelTime(
          STARTING_SPEED,
          WALL_SPACING
        ) -
        FIRST_WALL_DELAY
      );


    gameRef.current = {
      player: {
        x: width / 2,

        y: height - 120,

        radius: 18,

        colorIndex: 0,
      },

      walls: [],

      score: 0,

      speed: STARTING_SPEED,

      lastSpawn:
        firstWallTime,

      lastTime:
        now,

      running: true,
    };


    setScore(0);

    setGameOver(false);

    setRewardUsed(false);

    setRewardLoading(false);

    setPlaying(true);
  };


  /*
  ============================================================
  END GAME
  ============================================================
  */

  const endGame = () => {
    const finalScore =
      gameRef.current.score;


    /*
    Save high score if necessary.
    */

    const previousHighScore =
      getHighScore();


    if (
      finalScore >
      previousHighScore
    ) {
      saveHighScore(
        finalScore
      );

      setHighScore(
        finalScore
      );
    }


    gameRef.current.running =
      false;

    setPlaying(false);

    setGameOver(true);

    setRewardLoading(false);
  };


  /*
  ============================================================
  CHANGE COLOR
  ============================================================
  */

  const changeColor = () => {
    if (
      !gameRef.current.running
    ) {
      return;
    }


    const player =
      gameRef.current.player;


    player.colorIndex =
      (
        player.colorIndex + 1
      ) %
      currentColors.length;
  };


  /*
  ============================================================
  SPAWN WALL
  ============================================================
  */

  const spawnWall = (
    timestamp
  ) => {
    const game =
      gameRef.current;


    /*
    The distance between walls is ALWAYS
    WALL_SPACING.

    Speed only determines how quickly
    that distance is travelled.
    */

    const travelTime =
      getTravelTime(
        game.speed,
        WALL_SPACING
      );


    if (
      timestamp -
        game.lastSpawn <
      travelTime
    ) {
      return;
    }


    game.lastSpawn =
      timestamp;


    const colorIndex =
      Math.floor(
        Math.random() *
          currentColors.length
      );


    game.walls.push({
      y: -WALL_HEIGHT,

      height: WALL_HEIGHT,

      colorIndex,

      counted: false,
    });
  };


  /*
  ============================================================
  UPDATE GAME
  ============================================================
  */

  const updateGame = (
    timestamp
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;


    const game =
      gameRef.current;


    if (!game.running) {
      return;
    }


    /*
    Delta time.
    */

    const delta =
      Math.min(
        timestamp -
          game.lastTime,
        32
      ) / 16.67;


    game.lastTime =
      timestamp;


    /*
    ==========================================================
    SPEED PROGRESSION
    ==========================================================

    Only speed increases.

    Wall spacing stays fixed.
    ==========================================================
    */

    game.speed +=
      SPEED_INCREASE *
      delta;


    /*
    Spawn walls.
    */

    spawnWall(timestamp);


    /*
    Move walls.
    */

    game.walls.forEach(
      (wall) => {
        wall.y +=
          game.speed *
          delta;
      }
    );


    /*
    ==========================================================
    PLAYER
    ==========================================================
    */

    const player =
      game.player;


    /*
    ==========================================================
    COLLISION
    ==========================================================
    */

    for (
      const wall of game.walls
    ) {
      const playerTop =
        player.y -
        player.radius;

      const playerBottom =
        player.y +
        player.radius;

      const wallTop =
        wall.y;

      const wallBottom =
        wall.y +
        wall.height;


      const touchingWall =
        playerBottom >=
          wallTop &&
        playerTop <=
          wallBottom;


      if (touchingWall) {
        const sameColor =
          player.colorIndex ===
          wall.colorIndex;


        if (!sameColor) {
          endGame();

          return;
        }
      }


      /*
      ========================================================
      SCORE
      ========================================================
      */

      if (
        !wall.counted &&
        wall.y >
          player.y +
            player.radius
      ) {
        wall.counted = true;

        game.score += 1;

        setScore(
          game.score
        );


        /*
        Update high score live.
        */

        const currentHigh =
          getHighScore();


        if (
          game.score >
          currentHigh
        ) {
          saveHighScore(
            game.score
          );

          setHighScore(
            game.score
          );
        }
      }
    }


    /*
    ==========================================================
    REMOVE OLD WALLS
    ==========================================================
    */

    game.walls =
      game.walls.filter(
        (wall) =>
          wall.y <
          canvas.height + 100
      );
  };


  /*
  ============================================================
  DRAW GAME
  ============================================================
  */

  const drawGame = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;


    const ctx =
      canvas.getContext(
        "2d"
      );


    const width =
      canvas.width;

    const height =
      canvas.height;

    const game =
      gameRef.current;


    /*
    ==========================================================
    BACKGROUND
    ==========================================================
    */

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    const background =
      ctx.createLinearGradient(
        0,
        0,
        0,
        height
      );


    background.addColorStop(
      0,
      "#080b0f"
    );


    background.addColorStop(
      1,
      "#11161c"
    );


    ctx.fillStyle =
      background;


    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /*
    ==========================================================
    GRID
    ==========================================================
    */

    ctx.strokeStyle =
      "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    for (
      let x = 0;
      x < width;
      x += 40
    ) {
      ctx.beginPath();

      ctx.moveTo(
        x,
        0
      );

      ctx.lineTo(
        x,
        height
      );

      ctx.stroke();
    }


    for (
      let y = 0;
      y < height;
      y += 40
    ) {
      ctx.beginPath();

      ctx.moveTo(
        0,
        y
      );

      ctx.lineTo(
        width,
        y
      );

      ctx.stroke();
    }


    /*
    ==========================================================
    WALLS
    ==========================================================
    */

    game.walls.forEach(
      (wall) => {

        const color =
          currentColors[
            wall.colorIndex
          ].value;


        /*
        Main wall.
        */

        ctx.fillStyle =
          color;

        ctx.globalAlpha =
          0.88;


        ctx.fillRect(
          0,
          wall.y,
          width,
          wall.height
        );


        ctx.globalAlpha =
          1;


        /*
        Top highlight.
        */

        ctx.fillStyle =
          "rgba(255,255,255,0.18)";


        ctx.fillRect(
          0,
          wall.y,
          width,
          3
        );


        /*
        Bottom glow.
        */

        ctx.shadowBlur =
          18;

        ctx.shadowColor =
          color;

        ctx.fillStyle =
          color;

        ctx.globalAlpha =
          0.35;


        ctx.fillRect(
          0,
          wall.y +
            wall.height -
            4,
          width,
          4
        );


        ctx.globalAlpha =
          1;

        ctx.shadowBlur =
          0;
      }
    );


    /*
    ==========================================================
    PLAYER
    ==========================================================
    */

    const playerColor =
      currentColors[
        game.player.colorIndex
      ].value;


    ctx.shadowBlur =
      30;

    ctx.shadowColor =
      playerColor;


    ctx.beginPath();


    ctx.arc(
      game.player.x,
      game.player.y,
      game.player.radius,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      playerColor;


    ctx.fill();


    ctx.shadowBlur =
      0;


    /*
    Inner highlight.
    */

    ctx.beginPath();


    ctx.arc(
      game.player.x,
      game.player.y,
      game.player.radius -
        6,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "#ffffff";


    ctx.globalAlpha =
      0.2;


    ctx.fill();


    ctx.globalAlpha =
      1;
  };


  /*
  ============================================================
  GAME LOOP
  ============================================================
  */

  const gameLoop = (
    timestamp
  ) => {

    updateGame(
      timestamp
    );


    drawGame();


    if (
      gameRef.current.running
    ) {
      animationRef.current =
        requestAnimationFrame(
          gameLoop
        );
    }
  };


  /*
  ============================================================
  INPUT
  ============================================================
  */

  const handleGameInput = (
    event
  ) => {
    /*
    Use one pointer event for both mouse and touch.

    The old implementation listened to both
    touchstart AND click. On iPhone, one tap could
    therefore trigger the color change twice.
    */

    if (event.cancelable) {
      event.preventDefault();
    }

    if (!playing) {
      return;
    }

    changeColor();
  };


  /*
  ============================================================
  FULLSCREEN
  ============================================================
  */

  const toggleFullscreen =
    async () => {

      const container =
        gameContainerRef.current;


      if (!container) {
        return;
      }


      /*
      If native fullscreen is active, exit it.
      */
      if (document.fullscreenElement) {

        try {
          await document.exitFullscreen();
        } catch {
          setIsFullscreen(false);
        }

        return;
      }


      /*
      If the mobile CSS fallback is active, the browser
      fullscreen element will be null. In that case,
      explicitly exit the fallback instead of trying to
      enter fullscreen again.
      */
      if (isFullscreen) {
        setIsFullscreen(false);
        return;
      }


      /*
      Desktop / Android browsers that support the
      Fullscreen API get true browser fullscreen.
      */
      if (
        document.fullscreenEnabled &&
        typeof container.requestFullscreen ===
          "function"
      ) {

        try {
          await container.requestFullscreen();
          return;
        } catch {
          /*
          Fall through to the CSS fullscreen
          fallback below.
          */
        }
      }


      /*
      iPhone and other browsers without reliable
      Fullscreen API support use an immersive
      fixed-position fallback instead.
      */
      setIsFullscreen(true);
    };


  /*
  ============================================================
  FULLSCREEN STATE
  ============================================================
  */

  useEffect(() => {

    const handleFullscreenChange =
      () => {

        setIsFullscreen(
          Boolean(
            document.fullscreenElement
          )
        );


        /*
        Resize the canvas after entering/
        leaving fullscreen.
        */

        setTimeout(() => {

          const canvas =
            canvasRef.current;

          const container =
            canvas?.parentElement;


          if (
            !canvas ||
            !container
          ) {
            return;
          }


          const rect =
            container.getBoundingClientRect();


          canvas.width =
            Math.max(
              1,
              Math.floor(
                rect.width
              )
            );


          canvas.height =
            Math.max(
              1,
              Math.floor(
                rect.height
              )
            );


          if (
            !gameRef.current.running
          ) {

            gameRef.current.player.x =
              canvas.width / 2;

            gameRef.current.player.y =
              canvas.height - 120;
          }


          drawGame();

        }, 100);
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


  /*
  ============================================================
  MOBILE FULLSCREEN FALLBACK
  ============================================================
  */

  useEffect(() => {

    if (!isFullscreen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }


    /* Prevent the page behind the game from scrolling. */
    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style.overflow;


    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";


    /* Recalculate the canvas after the fixed layout is applied. */
    const resizeTimer = setTimeout(() => {

      window.dispatchEvent(
        new Event("resize")
      );

    }, 80);


    return () => {

      clearTimeout(resizeTimer);

      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

    };

  }, [isFullscreen]);


  /*
  ============================================================
  RESIZE CANVAS
  ============================================================
  */

  useEffect(() => {

    const canvas =
      canvasRef.current;


    if (!canvas) {
      return;
    }


    const resizeCanvas =
      () => {

        const container =
          canvas.parentElement;


        if (!container) {
          return;
        }


        const rect =
          container.getBoundingClientRect();


        canvas.width =
          Math.max(
            1,
            Math.floor(
              rect.width
            )
          );


        canvas.height =
          Math.max(
            1,
            Math.floor(
              rect.height
            )
          );


        if (
          !gameRef.current.running
        ) {

          gameRef.current.player.x =
            canvas.width / 2;


          gameRef.current.player.y =
            canvas.height - 120;
        }


        drawGame();
      };


    resizeCanvas();


    window.addEventListener(
      "resize",
      resizeCanvas
    );


    window.addEventListener(
      "orientationchange",
      resizeCanvas
    );


    return () => {

      window.removeEventListener(
        "resize",
        resizeCanvas
      );


      window.removeEventListener(
        "orientationchange",
        resizeCanvas
      );


      cancelAnimationFrame(
        animationRef.current
      );
    };

  }, []);


  /*
  ============================================================
  START GAME LOOP
  ============================================================
  */

  useEffect(() => {

    if (!playing) {
      return;
    }


    gameRef.current.running =
      true;


    gameRef.current.lastTime =
      performance.now();


    animationRef.current =
      requestAnimationFrame(
        gameLoop
      );


    return () => {

      cancelAnimationFrame(
        animationRef.current
      );

    };

  }, [
    playing,
    mode
  ]);


  /*
  ============================================================
  REWARDED AD
  ============================================================

  DEVELOPMENT VERSION

  This currently simulates the rewarded ad.

  When the real H5 rewarded ad is connected,
  the callback will call continueAfterReward().
  ============================================================
  */

  const continueAfterReward =
    () => {

      const canvas =
        canvasRef.current;


      if (!canvas) {
        return;
      }


      const game =
        gameRef.current;


      /*
      Keep the score.

      Remove all existing walls so the player
      isn't immediately killed again.
      */

      game.walls = [];


      game.player.x =
        canvas.width / 2;


      game.player.y =
        canvas.height - 120;


      /*
      Keep current speed.

      The difficulty continues from where
      the player died.
      */

      game.lastSpawn =
        performance.now();


      game.lastTime =
        performance.now();


      game.running =
        true;


      setRewardUsed(true);

      setRewardLoading(false);

      setGameOver(false);

      setPlaying(true);
    };


  const watchRewardedAd =
    () => {

      if (
        rewardLoading ||
        rewardUsed
      ) {
        return;
      }


      setRewardLoading(true);


      /*
      ----------------------------------------------------------
      TEMPORARY DEVELOPMENT SIMULATION
      ----------------------------------------------------------

      Replace this timeout with the real rewarded
      advertisement callback later.

      IMPORTANT:
      We don't want to give the player the reward
      until the real ad provider confirms the
      rewarded ad has completed.
      ----------------------------------------------------------
      */

      setTimeout(() => {

        continueAfterReward();

      }, 1500);
    };


  /*
  ============================================================
  MODE CHANGE
  ============================================================
  */

  const changeMode = (
    index
  ) => {

    if (playing) {
      setPlaying(false);
    }


    setMode(index);

    setScore(0);

    setGameOver(false);

    setRewardUsed(false);

    setRewardLoading(false);
  };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (
    <main className="color-drop-page">


      {/* =====================================================
          GAME AREA
          ===================================================== */}

      <section className="color-drop-layout">


        {/* ===================================================
            INFORMATION
            =================================================== */}

        <aside className="color-drop-info">

          <div className="eyebrow">
            NORTH HORIZON ARCADE
          </div>


          <h1>
            COLOR
            <br />
            DROP
          </h1>


          <p>
            Change your color
            and pass through
            the walls. Match
            the color or the
            run ends.
          </p>


          <div className="color-drop-instructions">

            <div>
              <span>
                01
              </span>

              TAP TO CHANGE COLOR
            </div>


            <div>
              <span>
                02
              </span>

              MATCH THE WALL COLOR
            </div>


            <div>
              <span>
                03
              </span>

              SURVIVE AS LONG AS POSSIBLE
            </div>

          </div>


          {/* =================================================
              DESKTOP BANNER AD
              ================================================= */}

          <div className="color-drop-ad color-drop-ad-desktop">

            <span>
              ADVERTISEMENT
            </span>


            <div>
              AD SPACE
            </div>

          </div>

        </aside>


        {/* ===================================================
            GAME
            =================================================== */}

        <div
          ref={gameContainerRef}
          className={
            isFullscreen
              ? "color-drop-game-wrapper color-drop-fullscreen"
              : "color-drop-game-wrapper"
          }
        >


          {/* =================================================
              GAME TOP CONTROLS
              ================================================= */}

          <div className="color-drop-game-controls">

            <div className="color-drop-score">

              <span>
                SCORE
              </span>


              <strong>
                {score}
              </strong>

            </div>


            <div className="color-drop-high-score">

              <span>
                BEST
              </span>


              <strong>
                {highScore}
              </strong>

            </div>


            <button
              type="button"
              className="color-drop-fullscreen-button"
              onClick={
                toggleFullscreen
              }
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >

              {isFullscreen ? (
                <Minimize
                  size={17}
                />
              ) : (
                <Maximize
                  size={17}
                />
              )}

            </button>

          </div>


          {/* =================================================
              CANVAS
              ================================================= */}

          <div className="color-drop-canvas-container">

            <canvas
              ref={canvasRef}
              onPointerDown={
                handleGameInput
              }
            />


            {/* =================================================
                START / GAME OVER
                ================================================= */}

            {!playing && (

              <div className="color-drop-overlay">

                {gameOver ? (

                  <>

                    <div className="eyebrow">
                      GAME OVER
                    </div>


                    <h2>
                      {score}
                    </h2>


                    <p>
                      FINAL SCORE
                    </p>


                    {score >=
                      highScore &&
                      score > 0 && (

                      <div className="color-drop-new-record">
                        NEW HIGH SCORE
                      </div>

                    )}


                    {/* =======================================
                        REWARDED AD
                        ======================================= */}

                    {!rewardUsed && (

                      <button
                        type="button"
                        className="color-drop-reward-button"
                        onClick={
                          watchRewardedAd
                        }
                        disabled={
                          rewardLoading
                        }
                      >

                        {rewardLoading
                          ? "LOADING AD..."
                          : "WATCH AD • CONTINUE"}

                      </button>

                    )}


                    {rewardUsed && (

                      <div className="color-drop-reward-used">
                        CONTINUE USED
                      </div>

                    )}


                    {/* =======================================
                        PLAY AGAIN
                        ======================================= */}

                    <button
                      type="button"
                      className="color-drop-start-button color-drop-secondary-button"
                      onClick={
                        resetGame
                      }
                      disabled={
                        rewardLoading
                      }
                    >

                      <RotateCcw
                        size={16}
                      />

                      PLAY AGAIN

                    </button>

                  </>

                ) : (

                  <>

                    <div className="eyebrow">
                      READY
                    </div>


                    <h2>
                      COLOR
                      <br />
                      DROP
                    </h2>


                    <button
                      type="button"
                      className="color-drop-start-button color-drop-primary-button"
                      onClick={
                        resetGame
                      }
                    >
                      START GAME
                    </button>

                  </>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              FULLSCREEN BANNER AD
              ================================================= */}

          {isFullscreen && (

            <div className="color-drop-fullscreen-ad">

              <span>
                ADVERTISEMENT
              </span>

              <div>
                AD SPACE
              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            OUTSIDE FULLSCREEN BANNER AD
            =================================================== */}

        {!isFullscreen && (

          <div className="color-drop-ad color-drop-inline-ad">

            <span>
              ADVERTISEMENT
            </span>


            <div>
              AD SPACE
            </div>

          </div>

        )}

      {/* =====================================================
          DIFFICULTY
          ===================================================== */}

      <section className="color-drop-modes">

        <div className="eyebrow">
          DIFFICULTY
        </div>


        <div className="color-drop-mode-buttons">

          {MODES.map(
            (
              item,
              index
            ) => (

              <button
                type="button"
                key={
                  item.name
                }
                className={
                  mode ===
                  index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeMode(
                    index
                  )
                }
              >

                {item.name}


                <span>
                  {item.colors}{" "}
                  COLORS
                </span>

              </button>

            )
          )}

        </div>

      </section>


      </section>


      {/* =====================================================
          BOTTOM AD
          ===================================================== */}

      <div className="color-drop-ad color-drop-ad-bottom">

        <span>
          ADVERTISEMENT
        </span>


        <div>
          AD SPACE
        </div>

      </div>

    </main>
  );
}