
/* ============================================================
   LIVING SILICON ENGINE
   Saabiq U A — Engineering Portfolio

   One persistent Canvas.
   Multiple architecture-inspired simulation scenes.

   Scenes:
   CPU Pipeline | Memory Hierarchy | Physical Design
   RISC-V Datapath | FIFO | Cache | Digital Logic | Network

   These are illustrative simulations, not RTL execution traces.
   ============================================================ */

(() => {
  "use strict";

  const canvas = document.getElementById("ambient-system-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const mobile = window.matchMedia("(max-width: 768px)");

  const BLUE = "#2675FF";
  const CYAN = "#48D9FF";
  const RED = "#FF304F";
  const WHITE = "#E8EDF5";
  const MUTED = "#8994A8";

  let width = 0;
  let height = 0;
  let dpr = 1;

  let time = 0;
  let lastTime = 0;
  let frameId = null;
  let isVisible = true;

  let activeScene = "hero";
  let targetScene = "hero";

  let sceneBlend = 1;

  const particles = [];

  const SCENES = {
    hero: "cpu",
    about: "memory",
    skills: "physical",
    featured: "datapath",
    projects: "fifo",
    experience: "cache",
    education: "logic",
    leadership: "network",
    contact: "network"
  };

  /* ----------------------------------------------------------
     CANVAS RESIZE
  ---------------------------------------------------------- */

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();

  window.addEventListener("resize", resize, {
    passive: true
  });

  /* ----------------------------------------------------------
     SECTION DETECTION
  ---------------------------------------------------------- */

  const sections = document.querySelectorAll("section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (!visibleSections.length) return;

      const id = visibleSections[0].target.id;

      const nextScene = SCENES[id];

      if (nextScene && nextScene !== targetScene) {
        targetScene = nextScene;
        sceneBlend = 0;
      }
    },
    {
      threshold: [0.15, 0.35, 0.55, 0.75],
      rootMargin: "-12% 0px -12% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));

  /* ----------------------------------------------------------
     BASIC DRAWING HELPERS
  ---------------------------------------------------------- */

  function line(x1, y1, x2, y2, color, alpha = 0.3, lineWidth = 1) {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;

    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function glow(x, y, radius, color, alpha = 0.5) {
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );

    gradient.addColorStop(
      0,
      color
    );

    gradient.addColorStop(
      1,
      "transparent"
    );

    ctx.fillStyle = gradient;
    ctx.globalAlpha = alpha;

    ctx.fillRect(
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );

    ctx.globalAlpha = 1;
  }

  function node(x, y, color = BLUE, radius = 3) {
    glow(x, y, 16, color, 0.35);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();
  }

  function block(x, y, w, h, label, color = BLUE) {
    ctx.fillStyle = "rgba(12, 19, 34, 0.82)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    ctx.globalAlpha = 0.68;

    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    ctx.globalAlpha = 1;

    ctx.fillStyle = WHITE;
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.globalAlpha = 0.78;
    ctx.fillText(label, x + w / 2, y + h / 2);
    ctx.globalAlpha = 1;
  }

  function movingPulse(x1, y1, x2, y2, progress, color = CYAN) {
    const p = ((progress % 1) + 1) % 1;

    const x = x1 + (x2 - x1) * p;
    const y = y1 + (y2 - y1) * p;

    line(x1, y1, x2, y2, color, 0.12);

    glow(x, y, 22, color, 0.65);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();
  }

  function backgroundGrid() {
    const spacing = mobile.matches ? 65 : 48;

    ctx.fillStyle = "rgba(38, 117, 255, 0.13)";

    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  /* ----------------------------------------------------------
     RESPONSIVE DRAWING AREA
  ---------------------------------------------------------- */

  function getLayout() {
    const scale = Math.min(
      width / 1000,
      height / 700,
      1.15
    );

    return {
      scale,
      cx: width * 0.5,
      cy: height * 0.5
    };
  }

  /* ----------------------------------------------------------
     SCENE 1 — RISC-V CPU PIPELINE
  ---------------------------------------------------------- */

  function drawCPU() {
    const { cx, cy, scale } = getLayout();

    const stages = ["IF", "ID", "EX", "MEM", "WB"];

    const gap = 13 * scale;
    const w = 72 * scale;
    const h = 34 * scale;

    const total = stages.length * w + 4 * gap;

    const startX = cx - total / 2;
    const y = cy;

    stages.forEach((stage, i) => {
      const x = startX + i * (w + gap);

      block(
        x,
        y - h / 2,
        w,
        h,
        stage,
        i === 2 ? RED : BLUE
      );

      if (i < stages.length - 1) {
        const nextX = x + w + gap;

        line(
          x + w,
          y,
          nextX,
          y,
          BLUE,
          0.4
        );

        movingPulse(
          x + w,
          y,
          nextX,
          y,
          time * 0.55 + i * 0.22
        );
      }

      glow(
        x + w / 2,
        y,
        28,
        i === 2 ? RED : BLUE,
        0.16
      );
    });

    ctx.font = `${11 * scale}px monospace`;
    ctx.fillStyle = MUTED;
    ctx.textAlign = "center";

    ctx.fillText(
      "INSTRUCTION PIPELINE",
      cx,
      y - 68 * scale
    );

    const lowerY = y + 100 * scale;

    block(
      cx - 90 * scale,
      lowerY,
      180 * scale,
      40 * scale,
      "REGISTER FILE",
      CYAN
    );

    line(
      cx,
      y + 25 * scale,
      cx,
      lowerY,
      CYAN,
      0.25
    );

    movingPulse(
      cx,
      y + 25 * scale,
      cx,
      lowerY,
      time * 0.35
    );
  }

  /* ----------------------------------------------------------
     SCENE 2 — MEMORY HIERARCHY
  ---------------------------------------------------------- */

  function drawMemory() {
    const { cx, cy, scale } = getLayout();

    const boxes = [
      { label: "CPU", w: 90, color: RED },
      { label: "L1 CACHE", w: 110, color: BLUE },
      { label: "L2 CACHE", w: 110, color: CYAN },
      { label: "MAIN MEMORY", w: 140, color: MUTED }
    ];

    const gap = 18 * scale;
    const total = boxes.reduce(
      (sum, item) => sum + item.w * scale,
      0
    ) + gap * 3;

    let x = cx - total / 2;

    const y = cy;

    boxes.forEach((item, i) => {
      const w = item.w * scale;
      const h = 42 * scale;

      block(
        x,
        y - h / 2,
        w,
        h,
        item.label,
        item.color
      );

      if (i < boxes.length - 1) {
        const nextX = x + w + gap;

        line(
          x + w,
          y,
          nextX,
          y,
          BLUE,
          0.35
        );

        movingPulse(
          x + w,
          y,
          nextX,
          y,
          time * (0.3 + i * 0.1) + i * 0.3
        );
      }

      x += w + gap;
    });

    const hit = Math.sin(time * 0.8) > 0;

    ctx.fillStyle = hit ? CYAN : RED;
    ctx.font = `${12 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      hit ? "CACHE HIT" : "CACHE MISS",
      cx,
      y + 85 * scale
    );

    glow(
      cx,
      y + 80 * scale,
      35,
      hit ? CYAN : RED,
      0.22
    );
  }

  /* ----------------------------------------------------------
     SCENE 3 — PHYSICAL DESIGN / CELL ROUTING
  ---------------------------------------------------------- */

  function drawPhysical() {
    const { cx, cy, scale } = getLayout();

    const size = 250 * scale;
    const cell = 25 * scale;

    const startX = cx - size / 2;
    const startY = cy - size / 2;

    const columns = Math.floor(size / cell);

    for (let row = 0; row < columns; row++) {
      for (let col = 0; col < columns; col++) {
        const occupied =
          (row * 7 + col * 11) % 5 !== 0;

        if (!occupied) continue;

        const x = startX + col * cell;
        const y = startY + row * cell;

        const color =
          (row + col) % 7 === 0 ? RED : BLUE;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.12 + 0.06 * Math.sin(time + col);

        ctx.fillRect(
          x + 2,
          y + 2,
          cell - 5,
          cell - 5
        );

        ctx.globalAlpha = 1;
      }
    }

    // Horizontal routing tracks
    for (let i = 0; i < 5; i++) {
      const y = startY + (i + 1) * size / 6;

      line(
        startX - 25 * scale,
        y,
        startX + size + 25 * scale,
        y,
        i % 2 ? RED : BLUE,
        0.28,
        1.1
      );

      const progress = (time * 0.25 + i * 0.2) % 1;

      movingPulse(
        startX - 25 * scale,
        y,
        startX + size + 25 * scale,
        y,
        progress,
        i % 2 ? RED : CYAN
      );
    }

    // Vertical routing tracks
    for (let i = 0; i < 5; i++) {
      const x = startX + (i + 1) * size / 6;

      line(
        x,
        startY - 25 * scale,
        x,
        startY + size + 25 * scale,
        BLUE,
        0.22
      );
    }

    ctx.fillStyle = MUTED;
    ctx.font = `${11 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      "STANDARD CELL PLACEMENT / ROUTING",
      cx,
      startY + size + 55 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE 4 — RISC-V DATAPATH
  ---------------------------------------------------------- */

  function drawDatapath() {
    const { cx, cy, scale } = getLayout();

    const positions = [
      [cx - 230 * scale, cy - 40 * scale, "REG FILE"],
      [cx - 90 * scale, cy - 40 * scale, "MUX"],
      [cx + 35 * scale, cy - 40 * scale, "ALU"],
      [cx + 175 * scale, cy - 40 * scale, "RESULT"]
    ];

    positions.forEach(([x, y, label], i) => {
      const w = 90 * scale;
      const h = 42 * scale;

      block(
        x,
        y,
        w,
        h,
        label,
        i === 2 ? RED : BLUE
      );

      if (i < positions.length - 1) {
        const nextX = positions[i + 1][0];

        line(
          x + w,
          y + h / 2,
          nextX,
          y + h / 2,
          CYAN,
          0.35
        );

        movingPulse(
          x + w,
          y + h / 2,
          nextX,
          y + h / 2,
          time * 0.45 + i * 0.24
        );
      }
    });

    // Register feedback path
    const left = positions[0][0];
    const right = positions[3][0] + 90 * scale;
    const baseY = cy + 115 * scale;

    line(
      right,
      cy - 19 * scale,
      right,
      baseY,
      RED,
      0.3
    );

    line(
      right,
      baseY,
      left + 45 * scale,
      baseY,
      RED,
      0.3
    );

    line(
      left + 45 * scale,
      baseY,
      left + 45 * scale,
      cy + 3 * scale,
      RED,
      0.3
    );

    movingPulse(
      right,
      baseY,
      left + 45 * scale,
      baseY,
      time * 0.25,
      RED
    );

    ctx.fillStyle = MUTED;
    ctx.font = `${10 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      "DATA PATH / FEEDBACK",
      cx,
      baseY + 35 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE 5 — ASYNCHRONOUS FIFO
  ---------------------------------------------------------- */

  function drawFIFO() {
    const { cx, cy, scale } = getLayout();

    const count = 8;
    const w = 31 * scale;
    const gap = 5 * scale;

    const total = count * w + (count - 1) * gap;

    const startX = cx - total / 2;
    const y = cy - 15 * scale;

    const writePointer =
      Math.floor(time * 0.7) % count;

    const readPointer =
      Math.floor(time * 0.35) % count;

    for (let i = 0; i < count; i++) {
      const x = startX + i * (w + gap);

      const color =
        i === writePointer ? RED :
        i === readPointer ? CYAN :
        BLUE;

      block(
        x,
        y,
        w,
        38 * scale,
        String(i),
        color
      );
    }

    ctx.font = `${10 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillStyle = RED;
    ctx.fillText(
      "WRITE CLOCK",
      cx - 100 * scale,
      y - 45 * scale
    );

    ctx.fillStyle = CYAN;
    ctx.fillText(
      "READ CLOCK",
      cx + 100 * scale,
      y - 45 * scale
    );

    // Independent clock indicators
    const writeClock = Math.sin(time * 2.2) > 0;
    const readClock = Math.sin(time * 1.3) > 0;

    node(
      cx - 100 * scale,
      y - 25 * scale,
      writeClock ? RED : MUTED,
      4 * scale
    );

    node(
      cx + 100 * scale,
      y - 25 * scale,
      readClock ? CYAN : MUTED,
      4 * scale
    );

    ctx.fillStyle = MUTED;
    ctx.fillText(
      "GRAY POINTERS / CDC",
      cx,
      y + 85 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE 6 — CACHE REPLACEMENT
  ---------------------------------------------------------- */

  function drawCache() {
    const { cx, cy, scale } = getLayout();

    const count = 4;
    const w = 70 * scale;
    const gap = 12 * scale;

    const total = count * w + (count - 1) * gap;
    const startX = cx - total / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * (w + gap);
      const active = Math.floor(time * 0.65) % count === i;

      block(
        x,
        cy - 20 * scale,
        w,
        50 * scale,
        `WAY ${i}`,
        active ? RED : BLUE
      );

      if (active) {
        glow(
          x + w / 2,
          cy,
          35 * scale,
          RED,
          0.35
        );
      }
    }

    ctx.fillStyle = WHITE;
    ctx.font = `${11 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      Math.floor(time * 0.65) % 2 === 0
        ? "FIFO REPLACEMENT"
        : "LFU REPLACEMENT",
      cx,
      cy + 85 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE 7 — DIGITAL LOGIC
  ---------------------------------------------------------- */

  function drawLogic() {
    const { cx, cy, scale } = getLayout();

    const input = Math.floor(time * 1.4) % 16;

    const a = (input >> 0) & 1;
    const b = (input >> 1) & 1;
    const c = (input >> 2) & 1;

    const andOut = a & b;
    const xorOut = a ^ b;
    const orOut = xorOut | c;

    const x1 = cx - 160 * scale;
    const x2 = cx - 35 * scale;
    const x3 = cx + 95 * scale;

    const y1 = cy - 55 * scale;
    const y2 = cy + 55 * scale;

    block(x1, y1, 65 * scale, 35 * scale, `A = ${a}`, CYAN);
    block(x1, y2, 65 * scale, 35 * scale, `B = ${b}`, CYAN);

    block(x2, y1, 75 * scale, 35 * scale, "AND", BLUE);
    block(x2, y2, 75 * scale, 35 * scale, "XOR", RED);

    block(x3, cy - 17 * scale, 75 * scale, 35 * scale, "OR", BLUE);

    block(
      cx + 220 * scale,
      cy - 17 * scale,
      70 * scale,
      35 * scale,
      `Y = ${orOut}`,
      CYAN
    );

    line(
      x1 + 65 * scale,
      y1 + 17 * scale,
      x2,
      y1 + 17 * scale,
      BLUE
    );

    line(
      x1 + 65 * scale,
      y2 + 17 * scale,
      x2,
      y2 + 17 * scale,
      RED
    );

    line(
      x2 + 75 * scale,
      y2 + 17 * scale,
      x3,
      cy,
      RED
    );

    line(
      x3 + 75 * scale,
      cy,
      cx + 220 * scale,
      cy,
      CYAN
    );

    ctx.fillStyle = MUTED;
    ctx.font = `${10 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      `AND OUT = ${andOut}  |  XOR OUT = ${xorOut}`,
      cx,
      cy + 125 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE 8 — NETWORK INTERCONNECT
  ---------------------------------------------------------- */

  function drawNetwork() {
    const { cx, cy, scale } = getLayout();

    const count = 8;
    const radius = 125 * scale;

    const points = [];

    for (let i = 0; i < count; i++) {
      const angle =
        (Math.PI * 2 * i) / count +
        Math.PI / 8;

      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }

    points.forEach((point, i) => {
      const next = points[(i + 1) % count];

      line(
        point.x,
        point.y,
        next.x,
        next.y,
        BLUE,
        0.28
      );

      node(
        point.x,
        point.y,
        i % 2 === 0 ? BLUE : RED,
        4 * scale
      );

      movingPulse(
        point.x,
        point.y,
        next.x,
        next.y,
        time * 0.35 + i * 0.17
      );

      line(
        point.x,
        point.y,
        cx,
        cy,
        CYAN,
        0.12
      );
    });

    node(cx, cy, CYAN, 8 * scale);

    ctx.fillStyle = WHITE;
    ctx.font = `${11 * scale}px monospace`;
    ctx.textAlign = "center";

    ctx.fillText(
      "INTERCONNECT NETWORK",
      cx,
      cy + 175 * scale
    );
  }

  /* ----------------------------------------------------------
     SCENE DISPATCHER
  ---------------------------------------------------------- */

  const renderers = {
    cpu: drawCPU,
    memory: drawMemory,
    physical: drawPhysical,
    datapath: drawDatapath,
    fifo: drawFIFO,
    cache: drawCache,
    logic: drawLogic,
    network: drawNetwork
  };

  /* ----------------------------------------------------------
     FRAME RENDERER
  ---------------------------------------------------------- */

  function render(delta) {
    if (!isVisible) return;

    const dt = Math.min(delta / 1000, 0.04);

    if (!reducedMotion) {
      time += dt;
    }

    ctx.clearRect(0, 0, width, height);

    backgroundGrid();

    // Smooth scene transition
    if (sceneBlend < 1) {
      sceneBlend = Math.min(1, sceneBlend + dt * 1.2);

      if (sceneBlend >= 1) {
        activeScene = targetScene;
      }
    }

    const renderer = renderers[targetScene];

    if (renderer) {
      ctx.save();

      const fade = reducedMotion ? 1 : Math.min(1, sceneBlend * 1.6);

      ctx.globalAlpha = fade;

      renderer();

      ctx.restore();
    }

    // Small persistent technical status marker
    ctx.fillStyle = MUTED;
    ctx.font = "10px monospace";
    ctx.textAlign = "right";

    ctx.globalAlpha = 0.45;

    ctx.fillText(
      `SYS.ACTIVE // ${targetScene.toUpperCase()}`,
      width - 24,
      height - 22
    );

    ctx.globalAlpha = 1;
  }

  /* ----------------------------------------------------------
     ANIMATION LOOP
  ---------------------------------------------------------- */

  function animate(timestamp) {
    if (!isVisible) {
      frameId = null;
      return;
    }

    const delta = lastTime
      ? timestamp - lastTime
      : 16;

    lastTime = timestamp;

    render(delta);

    if (!reducedMotion) {
      frameId = requestAnimationFrame(animate);
    } else {
      frameId = null;
    }
  }

  function start() {
    if (frameId !== null || !isVisible) return;

    lastTime = 0;

    frameId = requestAnimationFrame(animate);
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  /* ----------------------------------------------------------
     TAB VISIBILITY — SAVE RESOURCES
  ---------------------------------------------------------- */

  document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden;

    if (isVisible) {
      start();
    } else {
      stop();
    }
  });

  /* ----------------------------------------------------------
     INITIALIZE
  ---------------------------------------------------------- */

  if (reducedMotion) {
    render(0);
  } else {
    start();
  }

  console.info(
    "[Living Silicon] Background simulation initialized."
  );

})();
