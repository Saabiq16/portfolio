/* ============================================================
   main.js — Saabiq U A portfolio
   All data arrays are at the top. Add projects/roles here
   without touching index.html.
   ============================================================ */

// ============================================================
// DATA — edit this section to add or update content
// ============================================================

const PROJECTS = [
  {
    id: "booth-multiplier",
    title: "Radix-4 Modified Booth Multiplier with Carry Lookahead Adder",
    period: "Jan 2026 – Apr 2026",
    tags: ["Verilog", "Vivado", "Yosys", "OpenLane", "SKY130A"],
    // PLACEHOLDER: Replace null with a relative path to a screenshot
    // e.g. "assets/booth-multiplier-layout.png"
    image: null,
    imageLabel: "Layout / waveform screenshot to be added",
    summary:
      "8-bit signed Booth multiplier with 16-bit CLA, taken from RTL to GDSII on SKY130A at 70% core utilisation.",
    highlights: ["6.76 ns post-route delay", "0 DRC / LVS errors"],
    excerpt:
      "8-bit signed multiplier using radix-4 Modified Booth encoding, carry-save partial-product reduction, and a 16-bit carry lookahead adder. Implemented in Verilog with RTL synthesis, timing analysis, and full RTL-to-GDSII flow.",
    detail: [
      "Designed an 8-bit signed multiplier using radix-4 Modified Booth partial-product generation, carry-save adder (CSA) reduction tree, and a 16-bit carry lookahead adder for the final addition.",
      "Performed RTL synthesis and timing analysis in Vivado, reviewing resource utilization and the critical path.",
      "Completed the RTL-to-GDSII physical implementation using OpenLane on the SKY130A 130 nm PDK at 70% target core utilization. Post-route combinational path delay: 6.76 ns. Zero DRC and LVS errors.",
    ],
    link: "https://github.com/Saabiq16/radix4-booth-multiplier-cla",
  },
  {
    id: "async-fifo",
    title: "Asynchronous FIFO Tapeout",
    period: "Jan 2025 – Sep 2025",
    tags: ["Verilog", "CDC", "OpenLane", "SKY130A"],
    // PLACEHOLDER: Replace null with a relative path to a screenshot
    // e.g. "assets/async-fifo-gdsii.png"
    image: null,
    imageLabel: "Layout / waveform screenshot to be added",
    summary:
      "Parameterized async FIFO with Gray-code CDC, verified end-to-end and submitted to the Tiny Tapeout Sky25A Shuttle.",
    highlights: ["Tiny Tapeout Sky25A", "Gray-code CDC"],
    excerpt:
      "Parameterized asynchronous FIFO with Gray-coded read/write pointers and two-stage synchronizers for clock-domain crossing, submitted to the Tiny Tapeout Sky25A Shuttle as part of the CEG Fabless Initiative.",
    detail: [
      "Designed a parameterized asynchronous FIFO using Gray-coded read and write pointers with two-stage synchronizers for safe clock-domain crossing (CDC).",
      "Wrote Verilog RTL and testbenches covering full/empty flag detection, read/write operations, reset behavior, and CDC corner cases.",
      "Completed the full RTL-to-GDSII flow using OpenLane on the SKY130A 130 nm PDK: synthesis, floorplanning, placement, routing, physical verification (DRC and LVS), and final GDSII generation.",
      "Submitted to the Tiny Tapeout Sky25A Shuttle as part of the CEG Fabless Initiative, Anna University.",
    ],
    link: "https://github.com/Saabiq16/async-fifo",
    shuttle: "Tiny Tapeout Sky25A · CEG Fabless Initiative",
  },
];

const EXPERIENCE = [
  {
    period: "May 2025 – Aug 2025",
    role: "RISC-V Design Intern",
    org: "CEG Fabless, Anna University — in collaboration with Vyoma Systems and SHAKTI Processor Group, IIT Madras",
    bullets: [
      "Worked with RISC-V architecture and ISA, writing and testing assembly programs for arithmetic, control-flow, and memory operations using the UptickPro simulation framework.",
      "Implemented L1 I-Cache and D-Cache replacement-policy RTL using FIFO and LFU policies and verified the implementations against SHAKTI processor benchmarks.",
      "Analyzed processor and cache behavior through simulation and debugging, identifying performance-relevant behavioral differences between replacement policies.",
    ],
  },
];

const LEADERSHIP = [
  {
    role: "Head of Coverage",
    org: "PIXELS, CEG",
    period: "Jul 2026 – Present",
    abbr: "HC",
  },
  {
    role: "Head of Editing",
    org: "PIXELS, CEG",
    period: "Jul 2025 – Jul 2026",
    abbr: "HE",
  },
  {
    role: "Junior Head of Editing",
    org: "PIXELS, CEG",
    period: "May 2024 – Jul 2025",
    abbr: "JE",
  },
  {
    role: "Webmaster",
    org: "IEEE EDS, CEG",
    period: "Mar 2025 – Dec 2025",
    abbr: "WM",
  },
  {
    role: "Department Representative",
    org: "DECE, CEG",
    period: "Aug 2025 – Jul 2026",
    abbr: "DR",
  },
];

const PIPELINE_STAGES = [
  {
    id: "IF",
    label: "IF",
    desc: "Instruction Fetch: reads the next instruction from instruction memory using the program counter.",
  },
  {
    id: "ID",
    label: "ID",
    desc: "Instruction Decode: decodes opcode and funct fields, reads source registers, generates immediate values.",
  },
  {
    id: "EX",
    label: "EX",
    desc: "Execute: ALU computes results; hardware multiplier performs multiplication; branch target is resolved.",
  },
  {
    id: "MEM",
    label: "MEM",
    desc: "Memory Access: load and store instructions read from or write to data memory.",
  },
  {
    id: "WB",
    label: "WB",
    desc: "Write Back: results from ALU, multiplier, or data memory are written back to the destination register.",
  },
];

// ============================================================
// UTILITIES
// ============================================================

/**
 * Returns an element by selector, throws if not found.
 * @param {string} sel
 * @param {Element} [root=document]
 */
function q(sel, root = document) {
  return root.querySelector(sel);
}

function qAll(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k.startsWith("data-")) e.dataset[k.slice(5)] = v;
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (typeof c === "string") e.insertAdjacentHTML("beforeend", c);
    else if (c) e.append(c);
  }
  return e;
}

// ============================================================
// NAV — highlight active section & mobile menu
// ============================================================

function initNav() {
  const toggle = q(".nav-toggle");
  const navLinks = q(".nav-links");

  toggle?.addEventListener("click", () => {
    const open = toggle.classList.toggle("open");
    navLinks.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close on link click
  qAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle?.classList.remove("open");
      navLinks?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Active section highlighting via IntersectionObserver
  const sections = qAll("section[id]");
  const navAnchors = qAll(".nav-links a");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));
}

// ============================================================
// CURSOR GLOW
// ============================================================

function initCursorGlow() {
  // Only on pointer-fine devices (desktop mice)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const glow = q("#cursor-glow");
  if (!glow) return;

  let mx = -100,
    my = -100;
  let animFrame;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!animFrame) {
      animFrame = requestAnimationFrame(() => {
        glow.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        glow.style.opacity = "1";
        animFrame = null;
      });
    }
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}

// ============================================================
// HERO CANVAS — circuit trace grid
// ============================================================

function initHeroCanvas() {
  const canvas = q("#hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const BLUE = "#1E6BFF";
  const GRID = 40;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = "rgba(30,107,255,0.25)";
    for (let x = 0; x <= W; x += GRID) {
      for (let y = 0; y <= H; y += GRID) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Horizontal traces (random subset)
    ctx.strokeStyle = "rgba(30,107,255,0.18)";
    ctx.lineWidth = 1;
    const rng = seededRNG(42);

    for (let y = GRID; y < H; y += GRID) {
      let x = 0;
      while (x < W) {
        const len = (Math.floor(rng() * 6) + 1) * GRID;
        if (rng() > 0.45) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(Math.min(x + len, W), y);
          ctx.stroke();
        }
        x += len;
      }
    }

    // Vertical traces (random subset)
    for (let x = GRID; x < W; x += GRID) {
      let y = 0;
      while (y < H) {
        const len = (Math.floor(rng() * 4) + 1) * GRID;
        if (rng() > 0.6) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, Math.min(y + len, H));
          ctx.stroke();
        }
        y += len;
      }
    }

    // Glow vias
    ctx.fillStyle = BLUE;
    const glowPoints = [
      [3 * GRID, 4 * GRID],
      [8 * GRID, 2 * GRID],
      [14 * GRID, 5 * GRID],
      [6 * GRID, 7 * GRID],
      [11 * GRID, 3 * GRID],
    ];
    glowPoints.forEach(([gx, gy]) => {
      if (gx < W && gy < H) {
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 30);
        grad.addColorStop(0, "rgba(30,107,255,0.5)");
        grad.addColorStop(1, "rgba(30,107,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = BLUE;
        ctx.beginPath();
        ctx.arc(gx, gy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // Simple seeded PRNG for deterministic layout
  function seededRNG(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  resize();
  window.addEventListener("resize", resize);
}

// ============================================================
// TYPEWRITER
// ============================================================

function initTypewriter() {
  const el2 = q("#typewriter");
  if (!el2) return;

  const text = "VLSI and ASIC design  |  RTL  |  Computer architecture";
  let i = 0;

  function type() {
    if (i <= text.length) {
      el2.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 400 : 38);
    }
  }

  // Delay start until after page paint
  setTimeout(type, 800);
}

// ============================================================
// SCROLL FADE-IN
// ============================================================

function initScrollFade() {
  const items = qAll(".fade-in");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((item) => io.observe(item));
}

// ============================================================
// PIPELINE SVG (featured project)
// ============================================================

function initPipeline() {
  const svg = q("#pipeline-svg");
  const tooltip = q("#pipeline-tooltip");
  if (!svg || !tooltip) return;

  const NS = "http://www.w3.org/2000/svg";
  const W = 700;
  const H = 110;
  const stageW = 90;
  const stageH = 54;
  const regW = 24;
  const regH = 36;
  const stageY = (H - stageH) / 2;
  const regY = (H - regH) / 2;

  // Total width: 5 stages + 4 registers + arrows between
  // Layout: arrow→stage→reg→arrow→stage→...
  const arrowLen = 16;
  const gap = 2;
  const totalW =
    5 * stageW + 4 * regW + 4 * (2 * arrowLen + 2 * gap) + 2 * arrowLen;

  svg.setAttribute("viewBox", `0 0 ${totalW} ${H}`);

  // Arrow marker
  const defs = document.createElementNS(NS, "defs");
  const marker = document.createElementNS(NS, "marker");
  marker.setAttribute("id", "arr");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const poly = document.createElementNS(NS, "polygon");
  poly.setAttribute("points", "0 0, 6 3, 0 6");
  poly.setAttribute("fill", "#1E6BFF");
  marker.append(poly);
  defs.append(marker);
  svg.append(defs);

  const REGISTER_LABELS = ["IF/ID", "ID/EX", "EX/MEM", "MEM/WB"];

  let cursor = arrowLen; // start after first arrow

  PIPELINE_STAGES.forEach((stage, idx) => {
    // Draw stage block
    const g = document.createElementNS(NS, "g");
    g.classList.add("pipe-stage");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", stage.id + " stage");

    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", cursor);
    rect.setAttribute("y", stageY);
    rect.setAttribute("width", stageW);
    rect.setAttribute("height", stageH);
    rect.setAttribute("rx", "4");

    const text2 = document.createElementNS(NS, "text");
    text2.setAttribute("x", cursor + stageW / 2);
    text2.setAttribute("y", stageY + stageH / 2 + 5);
    text2.setAttribute("text-anchor", "middle");
    text2.textContent = stage.label;

    g.append(rect, text2);

    function showDesc() {
      qAll(".pipe-stage").forEach((s) => s.classList.remove("active"));
      g.classList.add("active");
      tooltip.textContent = stage.desc;
    }

    g.addEventListener("mouseenter", showDesc);
    g.addEventListener("focus", showDesc);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") showDesc();
    });

    svg.append(g);
    cursor += stageW;

    if (idx < 4) {
      // Arrow stage→reg
      const arrLine1 = document.createElementNS(NS, "line");
      arrLine1.setAttribute("x1", cursor);
      arrLine1.setAttribute("y1", H / 2);
      arrLine1.setAttribute("x2", cursor + arrowLen - 2);
      arrLine1.setAttribute("y2", H / 2);
      arrLine1.classList.add("pipe-arrow");
      svg.append(arrLine1);
      cursor += arrowLen;

      // Register
      const rg = document.createElementNS(NS, "g");
      rg.classList.add("pipe-reg");
      const rRect = document.createElementNS(NS, "rect");
      rRect.setAttribute("x", cursor);
      rRect.setAttribute("y", regY);
      rRect.setAttribute("width", regW);
      rRect.setAttribute("height", regH);
      rRect.setAttribute("rx", "2");
      const rText = document.createElementNS(NS, "text");
      rText.setAttribute("x", cursor + regW / 2);
      rText.setAttribute("y", regY + regH / 2 + 3);
      rText.setAttribute("text-anchor", "middle");
      rText.setAttribute(
        "style",
        "fill:#8A92A6;font-family:JetBrains Mono,monospace;font-size:8px"
      );
      // Rotate label
      rText.setAttribute(
        "transform",
        `rotate(-90, ${cursor + regW / 2}, ${regY + regH / 2})`
      );
      rText.textContent = REGISTER_LABELS[idx];
      rg.append(rRect, rText);
      svg.append(rg);
      cursor += regW;

      // Arrow reg→next stage
      const arrLine2 = document.createElementNS(NS, "line");
      arrLine2.setAttribute("x1", cursor);
      arrLine2.setAttribute("y1", H / 2);
      arrLine2.setAttribute("x2", cursor + arrowLen - 2);
      arrLine2.setAttribute("y2", H / 2);
      arrLine2.classList.add("pipe-arrow");
      svg.append(arrLine2);
      cursor += arrowLen;
    }
  });
}

// ============================================================
// PROJECTS — render cards and modals
// ============================================================

function renderProjects() {
  const grid = q("#projects-grid");
  if (!grid) return;

  PROJECTS.forEach((proj) => {
    // Card
    const card = el(
      "article",
      { class: "project-card fade-in", role: "button", tabindex: "0" },
      buildProjectCard(proj)
    );

    card.addEventListener("click", () => openModal(proj));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(proj);
      }
    });

    grid.append(card);
  });
}

function buildProjectCard(proj) {
  // Image area: use proj.image if present, otherwise render styled placeholder
  let imgArea;
  if (proj.image) {
    // Real image — lazy-loaded
    imgArea = `
      <div class="project-img-slot project-img-slot--photo">
        <img
          src="${proj.image}"
          alt="${proj.title} screenshot"
          class="project-img"
          loading="lazy"
        />
      </div>`;
  } else {
    // Styled placeholder: dark panel + faint grid + initials + label
    // Derive initials from the project id (first letters of each word, max 3)
    const initials = proj.title
      .split(" ")
      .filter((w) => /^[A-Z0-9]/.test(w))
      .slice(0, 3)
      .map((w) => w[0])
      .join("");
    imgArea = `
      <div class="project-img-slot" role="img" aria-label="${proj.imageLabel}">
        <span class="proj-initials" aria-hidden="true">${initials}</span>
        <span class="proj-placeholder-label" aria-hidden="true">Layout / waveform screenshot to be added</span>
      </div>`;
  }

  const highlights = (proj.highlights || [])
    .map((h) => `<span class="highlight-chip">${h}</span>`)
    .join("");

  const tags = proj.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  return `
    ${imgArea}
    <div class="project-body">
      <p class="project-meta mono">${proj.period}${proj.shuttle ? " &middot; " + proj.shuttle : ""}</p>
      <h3 class="project-title">${proj.title}</h3>
      <p class="project-summary">${proj.summary}</p>
      ${highlights ? `<div class="highlight-chips">${highlights}</div>` : ""}
      <div class="tags">${tags}</div>
      <span class="project-view-link" aria-hidden="true">
        View details
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </span>
    </div>
  `;
}

// ============================================================
// MODALS
// ============================================================

const overlay = q("#modal-overlay");
const modalBox = q("#modal-box");

function openModal(proj) {
  if (!overlay || !modalBox) return;

  const detailHTML = proj.detail
    .map((d) => `<p>${d}</p>`)
    .join("");
  const tags = proj.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  modalBox.innerHTML = `
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <p class="modal-meta">${proj.period}${proj.shuttle ? " · " + proj.shuttle : ""}</p>
    <h3 class="modal-title">${proj.title}</h3>
    <div class="tags" style="margin-bottom:1.2rem">${tags}</div>
    <div class="modal-body">${detailHTML}</div>
    <a class="modal-link" href="${proj.link}" target="_blank" rel="noopener noreferrer">
      View on GitHub
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
  `;

  q(".modal-close", modalBox).addEventListener("click", closeModal);
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  q(".modal-close", modalBox).focus();
}

function closeModal() {
  overlay?.classList.remove("open");
  document.body.style.overflow = "";
}

function initModals() {
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ============================================================
// EXPERIENCE — render timeline
// ============================================================

function renderExperience() {
  const timeline = q("#timeline");
  if (!timeline) return;

  EXPERIENCE.forEach((exp) => {
    const bullets = exp.bullets
      .map((b) => `<li>${b}</li>`)
      .join("");

    const entry = el(
      "div",
      { class: "timeline-entry fade-in" },
      `<p class="timeline-period mono">${exp.period}</p>
       <h3 class="timeline-role">${exp.role}</h3>
       <p class="timeline-org muted">${exp.org}</p>
       <ul class="timeline-bullets">${bullets}</ul>`
    );

    timeline.append(entry);
  });
}

// ============================================================
// LEADERSHIP — render list
// ============================================================

function renderLeadership() {
  const list = q("#leadership-list");
  if (!list) return;

  LEADERSHIP.forEach((item) => {
    const div = el(
      "div",
      { class: "leadership-item fade-in" },
      `<div class="leadership-icon" aria-hidden="true">${item.abbr}</div>
       <div>
         <p class="leadership-role">${item.role}</p>
         <p class="leadership-org muted">${item.org}</p>
         <p class="leadership-period mono">${item.period}</p>
       </div>`
    );
    list.append(div);
  });
}

// ============================================================
// ABOUT — conditional photo
// ============================================================

function initAboutPhoto() {
  // PLACEHOLDER: The photo is loaded from assets/photo.jpeg
  // If the file does not exist on the server, this block hides itself cleanly.
  const img = q("#about-photo");
  if (!img) return;

  img.addEventListener("error", () => {
    const wrap = q(".about-photo-wrap");
    if (wrap) wrap.style.display = "none";
    // Expand text column to fill space
    const grid = q(".about-grid");
    if (grid) grid.style.gridTemplateColumns = "1fr";
  });
}

// ============================================================
// HERO LAYOUT IMAGE / SVG FALLBACK
// ============================================================

function initHeroLayout() {
  const img = q("#hero-layout-img");
  const fallback = q("#hero-layout-fallback");
  if (!img || !fallback) return;

  img.addEventListener("error", () => {
    img.style.display = "none";
    fallback.style.display = "block";
  });
  img.addEventListener("load", () => {
    img.style.display = "block";
    fallback.style.display = "none";
  });
}

// ============================================================
// BOOT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCursorGlow();
  initHeroCanvas();
  initHeroLayout();
  initTypewriter();
  initScrollFade();
  initPipeline();
  renderProjects();
  renderExperience();
  renderLeadership();
  initModals();
  initAboutPhoto();
});
