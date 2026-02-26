/* CA COPY */
document.getElementById('copy-ca').onclick = () => {
  navigator.clipboard.writeText('Sol11111111111');
};

/* ===============================
   SECRET VAULT (EASTER EGG)
================================ */
function unlockVault() {
  const vault = document.getElementById("secret");
  if (!vault) return;

  vault.style.display = "block";
  vault.scrollIntoView({ behavior: "smooth" });
}


/* ===============================
   BACKGROUND MUSIC TOGGLE
================================ */
(() => {
  const music = document.getElementById("bg-music");
  const toggle = document.querySelector(".music-toggle");

  if (!music || !toggle) return;

  music.volume = 0.35;

  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      toggle.classList.add("playing");
    } else {
      music.pause();
      toggle.classList.remove("playing");
    }
  });
})();

/* BUY TEXT ROTATION */
const buyTexts = [
  'APE OR REGRET',
  'THIS IS YOUR SIGN',
  'ZOO ESCAPE PHASE',
  'CATCH ME!'
];
let i = 0;
setInterval(() => {
  i = (i + 1) % buyTexts.length;
  document.getElementById('floatingBuy').innerText = buyTexts[i];
}, 2500);


/* Floating Buy */
const buyBtn = document.getElementById('floatingBuy');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let dragged = false;
let hasEscaped = false;

const normalTexts = [
  'APE OR REGRET',
  'THIS IS YOUR SIGN',
  'ZOO ESCAPE PHASE',
  'CATCH ME!'
];
const draggingTexts = [
  'DON’T DROP ME',
  'OK OK STOP',
  'WHY ARE YOU LIKE THIS'
];
let textIndex = 0;

/* ===== START DRAG ===== */
const startDrag = (e) => {

  // Desktop: prevent default
  if (!e.touches) {
    e.preventDefault();
  }

  isDragging = true;
  dragged = false;
  
  buyBtn.classList.add('dragging');
  buyBtn.style.position = 'fixed';

  // random text while dragging
  buyBtn.innerText =
    draggingTexts[Math.floor(Math.random() * draggingTexts.length)];

  const rect = buyBtn.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
};

/* ===== DRAGGING ===== */
const drag = (e) => {
  if (!isDragging) return;
  dragged = true;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const padding = 10;
  const maxX = window.innerWidth - buyBtn.offsetWidth - padding;
  const maxY = window.innerHeight - buyBtn.offsetHeight - padding;

  let left = clientX - offsetX;
  let top = clientY - offsetY;

  left = Math.min(Math.max(padding, left), maxX);
  top = Math.min(Math.max(padding, top), maxY);

  buyBtn.style.left = `${left}px`;
  buyBtn.style.top = `${top}px`;
  buyBtn.style.right = 'auto';
  buyBtn.style.bottom = 'auto';
};

/* ===== STOP DRAG ===== */
const stopDrag = () => {
  if (!isDragging) return;
  isDragging = false;
  buyBtn.classList.remove('dragging');

  // restore normal rotating text
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
};

/* ===== ROTATING TEXT ===== */
setInterval(() => {
  if (isDragging) return;
  textIndex++;
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
}, 2500);

/* ===== SAFE CLICK ===== */
buyBtn.addEventListener('click', function(e) {

  // Only block click on desktop if it was dragged
  if (dragged) {
    e.preventDefault();
  }

  dragged = false;
});

/* ===== RUN AWAY ONCE ===== */
const escapeOnce = () => {
  if (hasEscaped || isDragging) return;
  hasEscaped = true;

  const padding = 20;
  const maxX = window.innerWidth - buyBtn.offsetWidth - padding;
  const maxY = window.innerHeight - buyBtn.offsetHeight - padding;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  buyBtn.style.left = `${randomX}px`;
  buyBtn.style.top = `${randomY}px`;
  buyBtn.style.right = 'auto';
  buyBtn.style.bottom = 'auto';

  buyBtn.innerText = 'CAN’T CATCH ME 🦆';

  setTimeout(() => {
    if (!isDragging) buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
  }, 1500);
};

/* ===== EVENTS ===== */
buyBtn.addEventListener('mousedown', startDrag);
buyBtn.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', function(e) {
  if (isDragging) {
    e.preventDefault(); // stop scroll
    drag(e);
  }
}, { passive: false });

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

/* Hover / first tap triggers run-away */
buyBtn.addEventListener('mouseenter', escapeOnce);
buyBtn.addEventListener('touchstart', escapeOnce, { once: true });

/* FAKE BUYS */
const names = [
  "DegenWhale",
  "0xLord",
  "MoonFarmer",
  "EggHunter",
  "0x6e",
  "QuackTrader",
  "HODLord",
  "SneakyWhale",
  "Elon Musk"
];

const ticker = document.getElementById("buyTicker");

function randomBuy() {
  const name = names[Math.floor(Math.random() * names.length)];
  const amount = (Math.random() * 4 + 0.1).toFixed(2);
  const emojis = ["🦆🔥", "🚀", "💰", "🐳", "⚡"];

document.querySelector(".ticker-message").innerHTML =
  `<strong>${name}</strong> just bought <strong>${amount} SOL</strong> of $PNLope 🚀`;

  ticker.classList.add("show");

  setTimeout(() => {
    ticker.classList.remove("show");
  }, 3500);
}

setTimeout(() => {
  randomBuy();
  setInterval(randomBuy, 5500);
}, 2000);


/* ===============================
   PROFILE GENERATOR (STABLE)
================================ */

const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const baseDuck = new Image();
baseDuck.crossOrigin = "anonymous";
baseDuck.src = "assets/Profile.png"; // change if needed

let imageReady = false;

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.disabled = true;

baseDuck.onload = function () {
  imageReady = true;
  generateBtn.disabled = false;
  console.log("Duck loaded successfully");
};

/* ===============================
   UTILITIES
================================ */

function randomColor() {
  return `hsl(${Math.random() * 360}, 70%, 55%)`;
}

function lighten(color, percent) {
  return color.replace("55%", `${55 + percent}%`);
}

function darken(color, percent) {
  return color.replace("55%", `${55 - percent}%`);
}

function getFaceMetrics() {
  const w = canvas.width;
  const h = canvas.height;

  return {
    centerX: w * 0.5,
    centerY: h * 0.5,
    eyeY: h * 0.45,
    eyeOffsetX: w * 0.14,
    mouthY: h * 0.62,
    headTopY: h * 0.28,
    neckY: h * 0.72,
    scale: w / 800
  };
}

/* ===============================
   BACKGROUND
================================ */

function drawBackground() {
  const roll = Math.random();
  let rarity;

  if (roll < 0.7) rarity = "common";
  else if (roll < 0.93) rarity = "rare";
  else rarity = "legendary";

  if (rarity === "common") {
    const colors = ["#87CEEB", "#FFB6C1", "#98FB98", "#FFD580"];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, 0, 800, 800);
  }

  if (rarity === "rare") {
    const gradient = ctx.createLinearGradient(0, 0, 800, 800);
    gradient.addColorStop(0, randomColor());
    gradient.addColorStop(1, randomColor());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);
  }

  if (rarity === "legendary") {
    const gradient = ctx.createRadialGradient(400, 400, 50, 400, 400, 600);
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(0.5, "#ff8c00");
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);

    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(Math.random() * 800, Math.random() * 800, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return rarity;
}

/* ===============================
   BASE IMAGE
================================ */

function drawDuck() {
  ctx.drawImage(baseDuck, 0, 0, 800, 800);
}

/* ===============================
   JACKET
================================ */

function drawJacket(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY + 80);

  const width = 600 * FACE.scale;
  const height = 300 * FACE.scale;

  const base = ctx.createLinearGradient(0, -height, 0, height);
  const color = randomColor();
  base.addColorStop(0, lighten(color, 30));
  base.addColorStop(1, darken(color, 30));

  ctx.fillStyle = base;
  ctx.fillRect(-width / 2, -100, width, height);

  ctx.restore();
}

/* ===============================
   CHAIN
================================ */

function drawChain(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY);

  const radius = 170 * FACE.scale;

  const gold = ctx.createLinearGradient(0, -radius, 0, radius);
  gold.addColorStop(0, "#fff8c6");
  gold.addColorStop(0.5, "#ffd700");
  gold.addColorStop(1, "#b8860b");

  ctx.strokeStyle = gold;
  ctx.lineWidth = 18 * FACE.scale;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI);
  ctx.stroke();

  ctx.fillStyle = gold;

  ctx.beginPath();
  ctx.arc(0, radius, 45 * FACE.scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ===============================
   HAT
================================ */

function drawHat(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.headTopY - 30);

  const scale = FACE.scale * 1.2;
  ctx.fillStyle = randomColor();

  ctx.beginPath();
  ctx.arc(0, 100, 220 * scale, Math.PI, 0);
  ctx.fill();

  ctx.restore();
}

/* ===============================
   SUNGLASSES
================================ */

function drawSunglasses(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.eyeY);

  const w = 130 * FACE.scale;
  const h = 80 * FACE.scale;

  const metal = ctx.createLinearGradient(-w, -h, w, h);
  metal.addColorStop(0, "#fff");
  metal.addColorStop(0.3, "#999");
  metal.addColorStop(0.6, "#000");
  metal.addColorStop(1, "#fff");

  ctx.fillStyle = metal;

  ctx.fillRect(-w - 20, -h / 2, w, h);
  ctx.fillRect(20, -h / 2, w, h);

  ctx.restore();
}

/* ===============================
   CIGAR
================================ */

function drawCigar(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX + 180 * FACE.scale, FACE.mouthY);

  const length = 120 * FACE.scale;

  ctx.fillStyle = "#7a4b25";
  ctx.fillRect(0, -10, length, 25);

  ctx.restore();
}

/* ===============================
   VIGNETTE
================================ */

function drawVignette() {
  ctx.save();

  const vignette = ctx.createRadialGradient(
    400, 400, 200,
    400, 400, 600
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.4)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 800, 800);

  ctx.restore();
}

/* ===============================
   GENERATE
================================ */

function generatePFP() {
  if (!imageReady) return;

  // 🔥 Prevent transform stacking bug
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawDuck();

  const FACE = getFaceMetrics();

  drawJacket(FACE);
  drawChain(FACE);
  drawHat(FACE);
  drawSunglasses(FACE);
  drawCigar(FACE);

  drawVignette();
}

generateBtn.addEventListener("click", generatePFP);

/* ===============================
   DOWNLOAD
================================ */

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pnlope-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

let shineOffset = -800;

function animateShine() {
  shineOffset += 5;

  if (shineOffset > 800) shineOffset = -800;

  requestAnimationFrame(animateShine);
}
animateShine();

/* REVEAL */
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => observer.observe(el));




