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

const FACE = {
  centerX: 400,
  centerY: 400,
  eyeY: 360,
  eyeOffsetX: 120,
  mouthY: 490,
  headTopY: 230,
  neckY: 600
};

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

function drawJacket() {

  if (Math.random() > 0.85) return;

  const style = Math.floor(Math.random() * 3);

  ctx.save();
  ctx.translate(FACE.centerX, 680);
  ctx.fillRect(-280, -80, 560, 250);
  addShadow(35);

  // gradient for 3D fabric
  const fabric = ctx.createLinearGradient(0, -200, 0, 200);
  fabric.addColorStop(0, randomColor());
  fabric.addColorStop(1, "#111");

  ctx.fillStyle = fabric;

  if (style === 0) {
    // Hoodie
    ctx.beginPath();
    ctx.moveTo(-260, -120);
    ctx.lineTo(260, -120);
    ctx.lineTo(300, 200);
    ctx.lineTo(-300, 200);
    ctx.closePath();
    ctx.fill();
  }

  if (style === 1) {
    // Leather jacket
    ctx.fillRect(-280, -100, 560, 300);

    ctx.fillStyle = "black";
    ctx.fillRect(-20, -100, 40, 300);
  }

  if (style === 2) {
    // Blazer
    ctx.fillRect(-240, -100, 480, 260);

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0, -100);
    ctx.lineTo(100, 100);
    ctx.lineTo(-100, 100);
    ctx.fill();
  }

  clearShadow();
  ctx.restore();
}

function drawChain() {
  if (Math.random() > 0.7) return;

  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY);
  addShadow(25);

  // Gold chain
  const gold = ctx.createLinearGradient(0, -50, 0, 200);
  gold.addColorStop(0, "#fff4a3");
  gold.addColorStop(0.5, "#ffd700");
  gold.addColorStop(1, "#b8860b");

  ctx.strokeStyle = gold;
  ctx.lineWidth = 18;

  ctx.beginPath();
  ctx.arc(0, 0, 170, 0, Math.PI);
  ctx.stroke();

  // Pendant
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(0, 170, 45, 0, Math.PI * 2);
  ctx.fill();

  // Inner shine
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.arc(-10, 150, 15, 0, Math.PI * 2);
  ctx.fill();

  clearShadow();
  ctx.restore();
}

function drawHat() {
  if (Math.random() > 0.8) return;

  ctx.save();
  ctx.translate(FACE.centerX, FACE.headTopY);
  addShadow(30);

  const gradient = ctx.createLinearGradient(0, -100, 0, 100);
  gradient.addColorStop(0, randomColor());
  gradient.addColorStop(1, "#222");

  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.arc(0, 60, 220, Math.PI, 0);
  ctx.fill();

  ctx.fillRect(-250, 110, 500, 40);

  clearShadow();
  ctx.restore();
}

function drawSunglasses() {
  if (Math.random() > 0.85) return;

  const style = Math.floor(Math.random() * 3);
  const tilt = (Math.random() - 0.5) * 0.1;

  ctx.save();
  ctx.translate(FACE.centerX, FACE.eyeY);
  ctx.rotate(tilt);
  addShadow(20);

  const lensGradient = ctx.createLinearGradient(-80, -40, 80, 40);
  lensGradient.addColorStop(0, "#222");
  lensGradient.addColorStop(1, "#000");

  ctx.fillStyle = lensGradient;

  if (style === 0) {
    ctx.fillRect(-180, -40, 140, 80);
    ctx.fillRect(40, -40, 140, 80);
    ctx.fillRect(-40, -10, 80, 20);
  }

  if (style === 1) {
    ctx.beginPath();
    ctx.arc(-90, 0, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(90, 0, 60, 0, Math.PI * 2);
    ctx.fill();
  }

  if (style === 2) {
    ctx.fillRect(-200, -35, 400, 70);
  }

  clearShadow();
  ctx.restore();
}

function drawCigar() {
  if (Math.random() > 0.8) return;

  ctx.save();
  ctx.translate(FACE.centerX + 160, FACE.mouthY);
  addShadow(10);

  ctx.fillStyle = "#5c3b1e";
  ctx.fillRect(0, 0, 100, 22);

  ctx.fillStyle = "red";
  ctx.fillRect(85, 0, 15, 22);

  clearShadow();
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

  drawDuck();       // your base image
  drawJacket();     // jacket under chain
  drawChain();
  drawHat();
  drawSunglasses();
  drawCigar();

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










