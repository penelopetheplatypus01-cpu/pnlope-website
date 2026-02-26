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


/* Profile Generator */
const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");
const baseDuck = new Image();
baseDuck.src = "assets/Profile.png"; // adjust if needed

let imageReady = false;

baseDuck.onload = function() {
  imageReady = true;
  console.log("Duck loaded successfully");
};

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

baseDuck.crossOrigin = "anonymous";

function randomColor() {
  return `hsl(${Math.random()*360}, 70%, 55%)`;
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

    // sparkle effect
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(Math.random() * 800, Math.random() * 800, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return rarity;
}

function drawJacket(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY + 60);

  const width = 560 * FACE.scale;
  const height = 260 * FACE.scale;

  // Base color
  const jacketGradient = ctx.createLinearGradient(0, -height, 0, height);
  jacketGradient.addColorStop(0, randomColor());
  jacketGradient.addColorStop(1, "#111");

  ctx.fillStyle = jacketGradient;
  ctx.fillRect(-width/2, -80, width, height);
  // Stitch lines
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;

for (let i = -250; i <= 250; i += 30) {
  ctx.beginPath();
  ctx.moveTo(i, -60);
  ctx.lineTo(i, 180);
  ctx.stroke();
}
  // Cloth texture overlay
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
      (Math.random() - 0.5) * width,
      (Math.random() - 0.5) * height,
      2,
      2
    );
  }
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawChain(FACE) {

  const type = Math.floor(Math.random() * 4);
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

  // Pendant variations
  if (type === 0) {
    ctx.beginPath();
    ctx.arc(0, radius, 45 * FACE.scale, 0, Math.PI * 2);
    ctx.fill();
  }

  if (type === 1) {
    ctx.fillRect(-40, radius - 40, 80, 80);
  }

  if (type === 2) {
    ctx.beginPath();
    ctx.moveTo(0, radius - 50);
    ctx.lineTo(40, radius + 40);
    ctx.lineTo(-40, radius + 40);
    ctx.closePath();
    ctx.fill();
  }

  if (type === 3) {
    ctx.beginPath();
    ctx.arc(0, radius, 30 * FACE.scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.arc(0, radius, 15 * FACE.scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHat(FACE) {

  const style = Math.floor(Math.random() * 3);

  ctx.save();
  ctx.translate(FACE.centerX, FACE.headTopY - 20);

  const radius = 220 * FACE.scale;

  // 3D dome gradient
  const dome = ctx.createRadialGradient(
    -60, -60, 50,
    0, 0, radius
  );

  dome.addColorStop(0, "#ffffff");
  dome.addColorStop(0.2, randomColor());
  dome.addColorStop(1, "#111");

  ctx.fillStyle = dome;

  ctx.beginPath();
  ctx.arc(0, 80, radius, Math.PI, 0);
  ctx.fill();

  // Brim
  ctx.fillStyle = "#111";
  ctx.fillRect(-radius - 20, 130, radius * 2 + 40, 35);

  ctx.restore();
}


function drawSunglasses(FACE) {
  if (Math.random() > 0.85) return;

  ctx.save();
  ctx.translate(FACE.centerX, FACE.eyeY);

  const lensWidth = 140 * FACE.scale;
  const lensHeight = 80 * FACE.scale;

  // Metallic reflection gradient
  const lensGradient = ctx.createLinearGradient(
    -lensWidth, -lensHeight,
    lensWidth, lensHeight
  );
  lensGradient.addColorStop(0, "#ffffff");
  lensGradient.addColorStop(0.2, "#999");
  lensGradient.addColorStop(0.5, "#000");
  lensGradient.addColorStop(0.8, "#666");
  lensGradient.addColorStop(1, "#ffffff");

  ctx.fillStyle = lensGradient;

  // Left lens
  ctx.fillRect(-lensWidth - 20, -lensHeight / 2, lensWidth, lensHeight);

  // Right lens
  ctx.fillRect(20, -lensHeight / 2, lensWidth, lensHeight);

  ctx.globalAlpha = 0.3;

const sweep = ctx.createLinearGradient(
  shineOffset, 0,
  shineOffset + 200, 0
);
sweep.addColorStop(0, "transparent");
sweep.addColorStop(0.5, "white");
sweep.addColorStop(1, "transparent");

ctx.fillStyle = sweep;
ctx.fillRect(-300, -60, 600, 120);

ctx.globalAlpha = 1;
  // Bridge
  ctx.fillRect(-20, -10, 40, 20);

  ctx.restore();
}

function drawCigar(FACE) {

  ctx.save();
  ctx.translate(FACE.centerX + 180 * FACE.scale, FACE.mouthY);

  const length = 120 * FACE.scale;

  // Body gradient
  const cigarGrad = ctx.createLinearGradient(0, 0, length, 0);
  cigarGrad.addColorStop(0, "#7a4b25");
  cigarGrad.addColorStop(1, "#3e2412");

  ctx.fillStyle = cigarGrad;
  ctx.fillRect(0, -10, length, 25);

  // Ember glow
  const ember = ctx.createRadialGradient(length, 2, 5, length, 2, 20);
  ember.addColorStop(0, "yellow");
  ember.addColorStop(0.5, "red");
  ember.addColorStop(1, "transparent");

  ctx.fillStyle = ember;
  ctx.beginPath();
  ctx.arc(length, 2, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


function addShadow(blur = 20, offsetX = 0, offsetY = 8, color = "rgba(0,0,0,0.5)") {
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowColor = color;
}

function clearShadow() {
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// subtle vignette
const vignette = ctx.createRadialGradient(400,400,200,400,400,600);
vignette.addColorStop(0,"rgba(0,0,0,0)");
vignette.addColorStop(1,"rgba(0,0,0,0.4)");
ctx.fillStyle = vignette;
ctx.fillRect(0,0,800,800);

function drawDuck() {
  if (!imageReady) return;
  ctx.drawImage(baseDuck, 0, 0, 800, 800);
}

function generatePFP() {

  ctx.clearRect(0, 0, 800, 800);

  const rarity = drawBackground();  // BACKGROUND FIRST
  const FACE = getFaceMetrics();
  drawDuck(FACE);       // your base image
  drawJacket(FACE);     // jacket under chain
  drawChain(FACE);
  drawHat(FACE);
  drawSunglasses(FACE);
  drawCigar(FACE);
  
  console.log("Background rarity:", rarity);
}


generateBtn.addEventListener("click", generatePFP);

downloadBtn.addEventListener("click", () => {
  try {
    const link = document.createElement("a");
    link.download = "pnlope-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("Generate image first.");
  }
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













