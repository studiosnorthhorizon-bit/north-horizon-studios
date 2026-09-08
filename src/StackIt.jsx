import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, RotateCcw } from "lucide-react";
import "./StackIt.css";

const MODES = [
  { name: "EASY", swingSpeed: 0.00155, blockSize: 88, collapseOffset: 0.74 },
  { name: "NORMAL", swingSpeed: 0.0019, blockSize: 82, collapseOffset: 0.72 },
  { name: "HARD", swingSpeed: 0.00225, blockSize: 76, collapseOffset: 0.70 },
  { name: "INSANE", swingSpeed: 0.0026, blockSize: 70, collapseOffset: 0.68 },
];

const HIGH_SCORE_PREFIX = "north_horizon_stack_it_highscore_";

const BASE_SIZE = 96;
const MIN_OVERLAP = 4;
const SWING_AMPLITUDE = 0.78;
const SWING_LENGTH = 205;
const MAX_TOWER_FLOORS = 120;

export default function StackIt() {
  const canvasRef = useRef(null);
  const gameContainerRef = useRef(null);
  const animationRef = useRef(null);
  const lastFrameRef = useRef(0);
  const backgroundImagesRef = useRef({
    sky: null,
    ground: null,
  });

  useEffect(() => {
    const urls = {
      sky: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2400&q=90",
      ground: "https://images.unsplash.com/photo-1589779346304-ab55e476daeb?auto=format&fit=crop&w=2400&q=90",
    };

    Object.entries(urls).forEach(([key, src]) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        backgroundImagesRef.current[key] = image;
      };
      image.src = src;
    });
  }, []);

  const [mode, setMode] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rewardUsed, setRewardUsed] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);

  const gameRef = useRef({
    craneX: 0,
    swingPhase: 0,
    swingSide: -1,
    swingLength: SWING_LENGTH,
    movingFloor: null,
    placedFloors: [],
    score: 0,

    // Balance is gameplay state, but it is NOT rendered as a rotation of the
    // entire building. It is used to create a controlled wobble and collapse.
    balance: 0,
    wobble: 0,

    collapsing: false,
    collapseProgress: 0,
    collapsePieces: [],

    running: false,
    renderWidth: 800,
    renderHeight: 650,
    dpr: 1,
    cameraOffset: 0,
    lastTime: 0,
  });

  const getHighScore = () => {
    try {
      const value = localStorage.getItem(
        HIGH_SCORE_PREFIX + MODES[mode].name
      );
      return value ? Number(value) : 0;
    } catch {
      return 0;
    }
  };

  const saveHighScore = (value) => {
    try {
      localStorage.setItem(
        HIGH_SCORE_PREFIX + MODES[mode].name,
        String(value)
      );
    } catch {
      // Storage may be unavailable.
    }
  };

  useEffect(() => {
    setHighScore(getHighScore());
  }, [mode]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const game = gameRef.current;

    game.renderWidth = width;
    game.renderHeight = height;
    game.dpr = dpr;

    if (!game.running && game.placedFloors.length === 0) {
      game.craneX = width * 0.58;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getGeometry = () => {
    const game = gameRef.current;
    const width = game.renderWidth || 800;
    const height = game.renderHeight || 650;

    const baseSize = Math.min(BASE_SIZE, width * 0.28);
    const towerBottom = height - 38;
    const baseTop = towerBottom - baseSize;
    const craneY = 88;
    const craneMastX = width - Math.min(82, width * 0.15);
    // Keep the trolley directly above the center of the base.
    const cranePivotX = width / 2;
    const swingLength = Math.min(175, width * 0.19);

    return {
      width,
      height,
      baseSize,
      towerBottom,
      baseTop,
      craneY,
      craneMastX,
      cranePivotX,
      swingLength,
    };
  };

  const getCameraOffset = () => {
    const game = gameRef.current;
    const geometry = getGeometry();

    if (game.placedFloors.length === 0) {
      return 0;
    }

    const topFloor = game.placedFloors[game.placedFloors.length - 1];

    // Move the camera after EVERY successful placement. Keep the newest
    // completed cube comfortably below the score area while the crane and
    // HUD remain locked to the screen. This prevents the tower from
    // crowding/overlapping the next cube as it grows upward.
    const desiredTopScreenY = Math.min(470, geometry.height * 0.72);
    return Math.max(0, desiredTopScreenY - topFloor.y);
  };

  const configureCrane = () => {
    const geometry = getGeometry();
    const game = gameRef.current;

    game.swingLength = geometry.swingLength;
    game.swingPhase = game.swingSide < 0
      ? -Math.PI / 2
      : Math.PI / 2;

    const angle = SWING_AMPLITUDE * Math.sin(game.swingPhase);
    game.craneX = geometry.cranePivotX + Math.sin(angle) * game.swingLength;
  };

  const createMovingFloor = () => {
    const geometry = getGeometry();
    const config = MODES[mode];
    const game = gameRef.current;

    game.swingSide *= -1;
    game.swingLength = geometry.swingLength;
    game.swingPhase = game.swingSide < 0
      ? -Math.PI / 2
      : Math.PI / 2;

    const angle = SWING_AMPLITUDE * Math.sin(game.swingPhase);
    const x = geometry.cranePivotX + Math.sin(angle) * game.swingLength;
    const y = geometry.craneY + Math.cos(angle) * game.swingLength;

    game.craneX = x;

    const support = game.placedFloors.length
      ? game.placedFloors[game.placedFloors.length - 1]
      : {
          x: geometry.width / 2,
          size: geometry.baseSize,
          y: geometry.baseTop,
        };

    game.movingFloor = {
      x,
      y,
      width: config.blockSize,
      height: config.blockSize,
      dropping: false,
      fallSpeed: 0,
      dropTargetY: support.y - config.blockSize,
    };
  };

  const resetGame = () => {
    const game = gameRef.current;
    const geometry = getGeometry();

    game.placedFloors = [];
    game.score = 0;
    game.balance = 0;
    game.wobble = 0;
    game.collapsing = false;
    game.collapseProgress = 0;
    game.collapsePieces = [];
    game.running = true;
    game.cameraOffset = 0;
    game.lastTime = performance.now();

    game.swingSide = -1;
    configureCrane();
    createMovingFloor();

    setScore(0);
    setGameOver(false);
    setPlaying(true);
    setRewardUsed(false);
    setRewardLoading(false);
  };

  const startCollapse = () => {
    const game = gameRef.current;

    if (game.collapsing) return;

    game.running = false;
    game.collapsing = true;
    game.collapseProgress = 0;

    // Every floor gets its own starting position. The collapse animation begins
    // from the tower that was actually built instead of drawing a second tower.
    game.collapsePieces = game.placedFloors.map((floor, index) => ({
      ...floor,
      startX: floor.x,
      startY: floor.y,
      direction:
        index % 2 === 0
          ? -1
          : 1,
      rotation:
        (index % 2 === 0 ? -1 : 1) *
        (0.05 + Math.random() * 0.04),
      drift:
        24 +
        Math.min(70, index * 1.5) +
        Math.random() * 18,
      drop:
        40 +
        index * 3.5,
    }));

    setPlaying(false);
    setGameOver(true);

    if (game.score > getHighScore()) {
      saveHighScore(game.score);
      setHighScore(game.score);
    }
  };

  const endGame = () => {
    startCollapse();
  };

  const dropFloor = () => {
    const game = gameRef.current;

    if (
      !game.running ||
      !game.movingFloor ||
      game.movingFloor.dropping ||
      game.collapsing
    ) {
      return;
    }

    // While hanging, the cube is positioned in screen space with the crane.
    // Convert it to world space at the exact moment of release so the camera
    // can keep following the tower without moving the crane/cube unexpectedly.
    game.movingFloor.y -= game.cameraOffset;
    game.movingFloor.dropping = true;
    game.movingFloor.fallSpeed = 0;
  };

  const placeFloor = () => {
    const game = gameRef.current;
    const moving = game.movingFloor;
    if (!moving) return;

    const geometry = getGeometry();
    const config = MODES[mode];

    const support = game.placedFloors.length
      ? game.placedFloors[game.placedFloors.length - 1]
      : {
          x: geometry.width / 2,
          size: geometry.baseSize,
          y: geometry.baseTop,
        };

    const centerOffset = moving.x - support.x;
    const overlap = moving.width - Math.abs(centerOffset);
    const overlapRatio = Math.max(0, overlap / moving.width);
    const normalizedOffset = Math.min(1.5, Math.abs(centerOffset) / moving.width);

    // The entire cube stays intact. Its overhang is what creates instability.
    if (overlap <= MIN_OVERLAP) {
      endGame();
      return;
    }

    const newFloor = {
      x: moving.x,
      y: support.y - moving.height,
      width: moving.width,
      height: moving.height,
      overhang: normalizedOffset,
    };

    game.placedFloors.push(newFloor);
    game.score += 1;

    game.balance = Math.min(1.5,
      game.balance * 0.72 + normalizedOffset * 1.15
    );

    game.wobble = Math.min(1.5,
      normalizedOffset * 1.8 + game.balance * 0.55
    );

    setScore(game.score);

    if (game.score > getHighScore()) {
      saveHighScore(game.score);
      setHighScore(game.score);
    }

    // The block remains whole. Collapse only happens when its overhang is
    // large enough to make the structure genuinely unstable.
    if (normalizedOffset > config.collapseOffset) {
      endGame();
      return;
    }

    if (game.placedFloors.length >= MAX_TOWER_FLOORS) {
      endGame();
      return;
    }

    createMovingFloor();
  };

  const updateCamera = () => {
    const game = gameRef.current;

    if (game.placedFloors.length === 0) {
      game.cameraOffset = 0;
      return;
    }

    const target = getCameraOffset();

    // Smooth camera movement so the tower does not jump when a floor lands.
    game.cameraOffset += (target - game.cameraOffset) * 0.24;
  };

  const updateGame = (delta) => {
    const game = gameRef.current;
    const geometry = getGeometry();

    if (game.collapsing) {
      game.collapseProgress = Math.min(
        1,
        game.collapseProgress + delta * 0.00165
      );
      updateCamera();
      return;
    }

    if (!game.running || !game.movingFloor) return;

    const config = MODES[mode];

    if (!game.movingFloor.dropping) {
      game.swingPhase += config.swingSpeed * delta;

      const angle = SWING_AMPLITUDE * Math.sin(game.swingPhase);
      game.craneX = geometry.cranePivotX + Math.sin(angle) * game.swingLength;
      game.movingFloor.x = game.craneX;
      game.movingFloor.y = geometry.craneY + Math.cos(angle) * game.swingLength;
    } else {
      game.movingFloor.fallSpeed += delta * 0.0022;
      game.movingFloor.y += game.movingFloor.fallSpeed * delta;

      if (game.movingFloor.y >= game.movingFloor.dropTargetY) {
        game.movingFloor.y = game.movingFloor.dropTargetY;
        game.movingFloor.dropping = false;
        placeFloor();
      }
    }

    game.wobble = Math.max(0, game.wobble - delta * 0.00055);
    game.balance = Math.max(0, game.balance - delta * 0.00006);

    updateCamera();
  };

  const seededValue = (seed) => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  const drawBuildingFloor = (ctx, floor, index, isMoving = false, yOffset = 0) => {
    const x = floor.x - floor.width / 2;
    const y = floor.y + yOffset;
    const w = floor.width;
    const h = floor.height;

    ctx.save();

    // Realistic concrete / stone facade with subtle tonal variation.
    const facade = ctx.createLinearGradient(x, y, x + w, y + h);
    facade.addColorStop(0, "#8a939b");
    facade.addColorStop(0.08, "#66717b");
    facade.addColorStop(0.52, "#3d474f");
    facade.addColorStop(1, "#20282e");
    ctx.fillStyle = facade;
    ctx.fillRect(x, y, w, h);

    // Concrete slab edges.
    ctx.fillStyle = "rgba(245,248,250,0.22)";
    ctx.fillRect(x, y, w, 3);
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(x, y + h - 5, w, 5);

    // Subtle facade panels / vertical structural columns.
    const columnW = Math.max(4, w * 0.055);
    const columnGap = Math.max(26, w * 0.31);
    for (let cx = x + columnGap; cx < x + w - 2; cx += columnGap) {
      ctx.fillStyle = "rgba(215,222,228,0.10)";
      ctx.fillRect(cx, y + 4, columnW, h - 9);
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(cx + columnW, y + 4, 2, h - 9);
    }

    // Recessed window bays with frames, reflections and varied lights.
    const cols = Math.max(2, Math.floor((w - 18) / 23));
    const rows = 3;
    const windowW = Math.max(9, Math.min(16, (w - 26) / cols - 5));
    const windowH = Math.max(10, Math.min(16, (h - 25) / rows - 3));
    const usableGap = cols > 1 ? (w - 24 - cols * windowW) / (cols - 1) : 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const wx = x + 12 + col * (windowW + usableGap);
        const wy = y + 8 + row * (windowH + 4);
        if (wx + windowW > x + w - 7) continue;

        const seed = index * 31 + row * 11 + col * 7;
        const lit = seededValue(seed) > 0.57;

        ctx.fillStyle = "rgba(10,16,21,0.78)";
        ctx.fillRect(wx - 1, wy - 1, windowW + 2, windowH + 2);

        const glass = ctx.createLinearGradient(wx, wy, wx, wy + windowH);
        glass.addColorStop(0, lit ? "#d7dde0" : "#5d6d78");
        glass.addColorStop(0.5, lit ? "#aeb9bf" : "#34444f");
        glass.addColorStop(1, lit ? "#78858d" : "#1d2a32");
        ctx.fillStyle = glass;
        ctx.fillRect(wx, wy, windowW, windowH);

        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillRect(wx + 1, wy + 1, Math.max(1, windowW * 0.22), windowH - 2);

        ctx.strokeStyle = "rgba(0,0,0,0.30)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wx + windowW / 2, wy);
        ctx.lineTo(wx + windowW / 2, wy + windowH);
        ctx.stroke();
      }
    }

    // Corner columns and a recessed lower service band make the cube read as a
    // real building module rather than a generic game rectangle.
    ctx.fillStyle = "rgba(220,226,231,0.14)";
    ctx.fillRect(x + 4, y + 4, 3, h - 8);
    ctx.fillRect(x + w - 7, y + 4, 3, h - 8);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x + 8, y + h - 15, w - 16, 5);

    if (index % 4 === 1 && w > 64) {
      // Occasional balcony rail for visual variation.
      ctx.strokeStyle = "rgba(225,230,234,0.34)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + w * 0.58, y + h - 19, w * 0.25, 10);
      for (let i = 1; i < 4; i += 1) {
        const bx = x + w * 0.58 + (w * 0.25 * i) / 4;
        ctx.beginPath();
        ctx.moveTo(bx, y + h - 19);
        ctx.lineTo(bx, y + h - 9);
        ctx.stroke();
      }
    }

    if (isMoving) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(220,230,236,0.24)";
      ctx.strokeStyle = "rgba(255,255,255,0.48)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  const drawCrane = (ctx, geometry, movingFloorScreenY) => {
    const game = gameRef.current;
    const mastX = geometry.craneMastX;
    const boomY = geometry.craneY - 30;
    const trolleyX = geometry.cranePivotX;
    const blockX = game.craneX;

    ctx.save();

    // Crane mast sits at the RIGHT edge, like a real tower crane.
    ctx.strokeStyle = "#59636a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(mastX, boomY);
    ctx.lineTo(mastX, geometry.height + 40);
    ctx.stroke();

    // Mast lattice.
    ctx.strokeStyle = "rgba(55,65,71,0.78)";
    ctx.lineWidth = 1.2;
    for (let y = boomY + 10; y < geometry.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(mastX - 8, y);
      ctx.lineTo(mastX + 8, y + 28);
      ctx.moveTo(mastX + 8, y);
      ctx.lineTo(mastX - 8, y + 28);
      ctx.stroke();
    }

    // Main jib extends from the side toward the center of the screen.
    ctx.fillStyle = "#69747b";
    ctx.fillRect(
      trolleyX,
      boomY - 5,
      Math.max(0, mastX - trolleyX),
      10
    );

    // Jib truss.
    ctx.strokeStyle = "rgba(230,235,238,0.55)";
    ctx.lineWidth = 1;
    for (let x = trolleyX + 12; x < mastX - 8; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, boomY + 5);
      ctx.lineTo(x + 13, boomY + 22);
      ctx.lineTo(x + 26, boomY + 5);
      ctx.stroke();
    }

    // Counter-jib and counterweight.
    ctx.fillStyle = "#4c575e";
    ctx.fillRect(mastX, boomY - 4, 70, 8);
    ctx.fillStyle = "#30383d";
    ctx.fillRect(mastX + 30, boomY - 18, 30, 14);

    // Trolley is directly above the BASE CENTER.
    ctx.fillStyle = "#343e44";
    ctx.fillRect(trolleyX - 10, boomY - 2, 20, 10);
    ctx.fillStyle = "#aeb7bc";
    ctx.fillRect(trolleyX - 6, boomY + 7, 12, 3);

    // Suspended cable follows the swinging load.
    ctx.strokeStyle = "rgba(247,249,250,0.92)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(trolleyX, boomY + 10);
    ctx.lineTo(blockX, movingFloorScreenY);
    ctx.stroke();

    ctx.fillStyle = "#dce2e5";
    ctx.beginPath();
    ctx.arc(blockX, movingFloorScreenY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#dce2e5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(blockX, movingFloorScreenY + 5, 5, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  };

  const drawCollapse = (ctx) => {
    const game = gameRef.current;
    const progress = game.collapseProgress;
    const geometry = getGeometry();

    game.collapsePieces.forEach((piece, index) => {
      const fallX =
        piece.startX +
        piece.direction *
          piece.drift *
          progress *
          (0.7 + index * 0.015);

      const fallY =
        piece.startY +
        piece.drop * progress +
        progress * progress * (100 + index * 2);

      const rotation =
        piece.rotation *
        progress *
        (1.5 + index * 0.01);

      ctx.save();
      ctx.translate(fallX, fallY + game.cameraOffset);
      ctx.rotate(rotation);
      drawBuildingFloor(
        ctx,
        {
          ...piece,
          x: 0,
          y: 0,
        },
        index
      );
      ctx.restore();
    });

    // Remove unused geometry reference without changing the visual result.
    void geometry;
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const game = gameRef.current;
    const geometry = getGeometry();
    const dpr = game.dpr || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, geometry.width, geometry.height);

    // -----------------------------
    // REAL-WORLD BACKGROUND
    // -----------------------------
    // The camera moves vertically. Background layers follow that movement
    // vertically as well; they never slide sideways because of camera motion.
    const skyImage = backgroundImagesRef.current.sky;
    const groundImage = backgroundImagesRef.current.ground;

    const sky = ctx.createLinearGradient(0, 0, 0, geometry.height);
    sky.addColorStop(0, "#9bb2c3");
    sky.addColorStop(0.55, "#7890a1");
    sky.addColorStop(1, "#5c7180");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, geometry.width, geometry.height);

    // ONE fixed sky image. It stays pinned to the screen while the world
    // (ground + tower) moves vertically underneath it.
    if (skyImage && skyImage.complete) {
      const scale = Math.max(
        geometry.width / skyImage.width,
        geometry.height / skyImage.height
      );
      const sw = skyImage.width * scale;
      const sh = skyImage.height * scale;
      const sx = (geometry.width - sw) / 2;
      const sy = (geometry.height - sh) / 2;

      ctx.save();
      ctx.globalAlpha = 0.98;
      ctx.drawImage(skyImage, sx, sy, sw, sh);
      ctx.restore();
    }

    const haze = ctx.createLinearGradient(
      0,
      geometry.height * 0.25,
      0,
      geometry.height * 0.90
    );
    haze.addColorStop(0, "rgba(255,255,255,0)");
    haze.addColorStop(0.68, "rgba(255,255,255,0.04)");
    haze.addColorStop(1, "rgba(24,31,35,0.22)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, geometry.width, geometry.height);

    // REAL CONCRETE GROUND. Unlike the sky, this is part of the world, so
    // it moves DOWN as the camera climbs. The image is repeated vertically
    // so the texture remains visible during the early camera movement.
    const groundY = geometry.towerBottom + game.cameraOffset * 0.92;

    if (groundImage && groundImage.complete && groundY < geometry.height + 320) {
      const areaH = 260;
      const scale = Math.max(
        geometry.width / groundImage.width,
        areaH / groundImage.height
      );
      const gw = groundImage.width * scale;
      const gh = groundImage.height * scale;
      const gx = (geometry.width - gw) / 2;

      ctx.save();
      ctx.globalAlpha = 0.96;
      for (let y = groundY; y < geometry.height + gh; y += gh - 2) {
        ctx.drawImage(groundImage, gx, y, gw, gh);
      }
      ctx.restore();
    } else if (groundY < geometry.height) {
      const ground = ctx.createLinearGradient(0, groundY, 0, geometry.height);
      ground.addColorStop(0, "#8d9295");
      ground.addColorStop(1, "#4f5558");
      ctx.fillStyle = ground;
      ctx.fillRect(0, groundY, geometry.width, geometry.height - groundY);
    }

    if (groundY < geometry.height + 4) {
      ctx.strokeStyle = "rgba(235,239,241,0.32)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(geometry.width, groundY);
      ctx.stroke();
    }

    // -----------------------------
    // WORLD: base + completed tower
    // -----------------------------
    if (!game.collapsing) {
      ctx.save();
      ctx.translate(0, game.cameraOffset);

      // Base is a full building module, matching the hanging/placed blocks.
      // It stays fixed and never participates in the tower wobble.
      const baseX = geometry.width / 2;

      drawBuildingFloor(
        ctx,
        {
          x: baseX,
          y: geometry.baseTop,
          width: geometry.baseSize,
          height: geometry.baseSize,
        },
        0,
        false,
        0
      );

      // Concrete foundation shadow.
      ctx.fillStyle = "rgba(0,0,0,0.30)";
      ctx.fillRect(
        baseX - geometry.baseSize * 0.56,
        groundY - 7,
        geometry.baseSize * 1.12,
        7
      );

      // Wobble is deliberately subtle and local. Floors do not rotate as a
      // single rigid tower, so they cannot visually sink through the base.
      const time = performance.now();

      game.placedFloors.forEach((floor, index) => {
        const distanceFromTop =
          game.placedFloors.length - 1 - index;

        const wobbleAmount =
          index === 0
            ? 0
            : Math.min(1.5, game.wobble) *
              Math.min(8, 2 + distanceFromTop * 0.45);

        const wobbleY =
          Math.sin(
            time * 0.012 +
              index * 0.8
          ) *
          wobbleAmount;

        const wobbleX =
          Math.cos(
            time * 0.010 +
              index * 0.65
          ) *
          wobbleAmount *
          0.35;

        drawBuildingFloor(
          ctx,
          {
            ...floor,
            x: floor.x + wobbleX,
          },
          index,
          false,
          wobbleY
        );
      });

      ctx.restore();
    }

    // -----------------------------
    // MOVING FLOOR
    // -----------------------------
    if (
      game.movingFloor &&
      !game.collapsing
    ) {
      const movingFloorScreenY = game.movingFloor.dropping
        ? game.movingFloor.y + game.cameraOffset
        : game.movingFloor.y;

      drawCrane(
        ctx,
        geometry,
        movingFloorScreenY
      );

      if (game.movingFloor.dropping) {
        ctx.save();
        ctx.translate(0, game.cameraOffset);
      }

      drawBuildingFloor(
        ctx,
        game.movingFloor,
        game.placedFloors.length + 1,
        true
      );

      if (game.movingFloor.dropping) {
        ctx.restore();
      }
    } else {
      drawCrane(
        ctx,
        geometry,
        geometry.craneY + 120
      );
    }

    // -----------------------------
    // COLLAPSE
    // -----------------------------
    if (game.collapsing) {
      drawCollapse(ctx);
    }
  };

  const handleGameInput = (event) => {
    event.preventDefault();
    dropFloor();
  };

  const changeMode = (nextMode) => {
    if (nextMode === mode) return;
    if (gameRef.current.running) return;

    setMode(nextMode);
  };

  const watchRewardedAd = () => {
    if (rewardUsed || rewardLoading) return;

    setRewardLoading(true);

    // Development simulation. Replace with the real rewarded-ad callback later.
    window.setTimeout(() => {
      const game = gameRef.current;
      const geometry = getGeometry();

      game.collapsing = false;
      game.collapseProgress = 0;
      game.collapsePieces = [];
      game.running = true;
      game.lastTime = performance.now();

      game.wobble = 0;
      game.balance *= 0.45;

      const support = game.placedFloors.length
        ? game.placedFloors[game.placedFloors.length - 1]
        : {
            x: geometry.width / 2,
            size: geometry.baseSize,
            y: geometry.baseTop,
          };

      game.swingSide = -1;
      configureCrane();
      game.movingFloor = {
        x: game.craneX,
        y: geometry.craneY + Math.cos(SWING_AMPLITUDE * Math.sin(game.swingPhase)) * game.swingLength,
        width: MODES[mode].blockSize,
        height: MODES[mode].blockSize,
        dropping: false,
        fallSpeed: 0,
        dropTargetY: support.y - MODES[mode].blockSize,
      };

      configureCrane();

      setRewardUsed(true);
      setRewardLoading(false);
      setGameOver(false);
      setPlaying(true);
    }, 1500);
  };

  const toggleFullscreen = async () => {
    const container = gameContainerRef.current;

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

    if (
      document.fullscreenEnabled &&
      container &&
      typeof container.requestFullscreen === "function"
    ) {
      try {
        await container.requestFullscreen();
        return;
      } catch {
        // CSS fallback below.
      }
    }

    setIsFullscreen(true);
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootOverflow =
      root.style.overflow;
    const previousBodyOverflow =
      body.style.overflow;

    if (isFullscreen) {
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";
      window.setTimeout(resizeCanvas, 80);
    } else {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      window.setTimeout(resizeCanvas, 80);
    }

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    const loop = (time) => {
      const previous =
        lastFrameRef.current || time;

      const delta = Math.min(
        34,
        time - previous
      );

      lastFrameRef.current = time;

      updateGame(delta);
      drawGame();

      animationRef.current =
        requestAnimationFrame(loop);
    };

    animationRef.current =
      requestAnimationFrame(loop);

    return () =>
      cancelAnimationFrame(
        animationRef.current
      );
  }, [mode]);

  return (
    <main className="stack-it-page">
      <section className="stack-it-layout">
        <aside className="stack-it-info">
          <div className="eyebrow">
            NORTH HORIZON ARCADE
          </div>

          <h1>
            STACK
            <br />
            IT.
          </h1>

          <p>
            Drop each building floor onto the
            tower. Keep the structure balanced,
            survive the wobble and build as high
            as you can.
          </p>

          <div className="stack-it-instructions">
            <div>
              <span>01</span>
              TAP TO DROP THE FLOOR
            </div>

            <div>
              <span>02</span>
              KEEP THE BUILDING BALANCED
            </div>

            <div>
              <span>03</span>
              BUILD AS HIGH AS POSSIBLE
            </div>
          </div>

          <div className="stack-it-ad stack-it-ad-desktop">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>
        </aside>

        <div
          ref={gameContainerRef}
          className={
            isFullscreen
              ? "stack-it-game-wrapper stack-it-fullscreen"
              : "stack-it-game-wrapper"
          }
        >
          <div className="stack-it-game-controls">
            <div className="stack-it-score">
              <span>SCORE</span>
              <strong>{score}</strong>
            </div>

            <div className="stack-it-high-score">
              <span>BEST</span>
              <strong>{highScore}</strong>
            </div>

            <button
              type="button"
              className="stack-it-fullscreen-button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize size={17} />
              ) : (
                <Maximize size={17} />
              )}
            </button>
          </div>

          <div className="stack-it-canvas-container">
            <canvas
              ref={canvasRef}
              onPointerDown={handleGameInput}
              aria-label="Stack It game. Tap to drop the moving building floor."
            />

            {!playing && (
              <div className="stack-it-overlay">
                {gameOver ? (
                  <>
                    <div className="eyebrow">
                      GAME OVER
                    </div>

                    <h2>{score}</h2>

                    <p>FLOORS</p>

                    {score >= highScore &&
                      score > 0 && (
                        <div className="stack-it-new-record">
                          NEW HIGH SCORE
                        </div>
                      )}

                    {!rewardUsed && (
                      <button
                        type="button"
                        className="stack-it-reward-button"
                        onClick={watchRewardedAd}
                        disabled={rewardLoading}
                      >
                        {rewardLoading
                          ? "LOADING AD..."
                          : "WATCH AD • CONTINUE"}
                      </button>
                    )}

                    {rewardUsed && (
                      <div className="stack-it-reward-used">
                        CONTINUE USED
                      </div>
                    )}

                    <button
                      type="button"
                      className="stack-it-start-button stack-it-secondary-button"
                      onClick={resetGame}
                      disabled={rewardLoading}
                    >
                      <RotateCcw size={16} />
                      PLAY AGAIN
                    </button>
                  </>
                ) : (
                  <>
                    <div className="eyebrow">
                      READY?
                    </div>

                    <h2>
                      STACK
                      <br />
                      IT
                    </h2>

                    <button
                      type="button"
                      className="stack-it-start-button stack-it-primary-button"
                      onClick={resetGame}
                    >
                      START GAME
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isFullscreen && (
            <div className="stack-it-fullscreen-ad">
              <span>ADVERTISEMENT</span>
              <div>AD SPACE</div>
            </div>
          )}
        </div>

        {!isFullscreen && (
          <div className="stack-it-ad stack-it-inline-ad">
            <span>ADVERTISEMENT</span>
            <div>AD SPACE</div>
          </div>
        )}

        <section className="stack-it-modes">
          <div className="eyebrow">
            DIFFICULTY
          </div>

          <div className="stack-it-mode-buttons">
            {MODES.map((item, index) => (
              <button
                type="button"
                key={item.name}
                className={
                  mode === index ? "active" : ""
                }
                onClick={() =>
                  changeMode(index)
                }
                disabled={playing}
              >
                {item.name}

                <span>
                  {item.name === "EASY"
                    ? "GENTLE SWING"
                    : item.name === "NORMAL"
                      ? "STEADY SWING"
                      : item.name === "HARD"
                        ? "FAST SWING"
                        : "WILD SWING"}
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="stack-it-description">
        <div className="eyebrow">
          NORTH HORIZON ARCADE
        </div>

        <h2>STACK IT.</h2>

        <p>
          Build a tower one floor at a time.
          Time every drop, manage the wobble
          and see how high you can take the
          building.
        </p>
      </section>

      <div className="stack-it-ad stack-it-ad-bottom">
        <span>ADVERTISEMENT</span>
        <div>AD SPACE</div>
      </div>
    </main>
  );
}
