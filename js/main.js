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


/* ===============================
   FLOATING BUY BUTTON
================================ */
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
  "DON'T DROP ME",
  'OK OK STOP',
  'WHY ARE YOU LIKE THIS'
];
let textIndex = 0;

/* ===== START DRAG ===== */
const startDrag = (e) => {
  if (!e.touches) {
    e.preventDefault();
  }

  isDragging = true;
  dragged = false;

  buyBtn.classList.add('dragging');
  buyBtn.style.position = 'fixed';

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
  const maxX = window.innerWidth  - buyBtn.offsetWidth  - padding;
  const maxY = window.innerHeight - buyBtn.offsetHeight - padding;

  const rect = buyBtn.getBoundingClientRect();
  buyBtn.style.left   = `${rect.left}px`;
  buyBtn.style.top    = `${rect.top}px`;
  buyBtn.style.right  = 'auto';
  buyBtn.style.bottom = 'auto';

  const finalX = Math.random() * maxX;
  const finalY = Math.random() * maxY;

  const steps = 7;
  const waypoints = [];

  for (let i = 1; i <= steps; i++) {
    const progress = i / (steps + 1);

    const baseX = rect.left + (finalX - rect.left) * progress;
    const baseY = rect.top  + (finalY - rect.top)  * progress;

    const swing = 220 * Math.sin(progress * Math.PI);
    const side  = i % 2 === 0 ? 1 : -1;

    const wx = Math.min(Math.max(padding, baseX + side * swing), maxX);
    const wy = Math.min(Math.max(padding, baseY + (Math.random() - 0.5) * 80), maxY);

    waypoints.push({ x: wx, y: wy });
  }

  waypoints.push({ x: finalX, y: finalY });

  const texts = ['👀', 'heh', 'lol', '...', 'nope', 'bye', 'lmao', "CAN'T CATCH ME 🦆"];
  const stepDuration = 600;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      waypoints.forEach((point, index) => {
        setTimeout(() => {
          const isLast = index === waypoints.length - 1;

          buyBtn.style.transition = isLast
            ? `left 0.7s cubic-bezier(0.25, 1.4, 0.5, 1), top 0.7s cubic-bezier(0.25, 1.4, 0.5, 1)`
            : `left 500ms cubic-bezier(0.4, 0, 0.2, 1), top 500ms cubic-bezier(0.4, 0, 0.2, 1)`;

          buyBtn.style.left = `${point.x}px`;
          buyBtn.style.top  = `${point.y}px`;

          if (texts[index]) buyBtn.innerText = texts[index];

        }, index * stepDuration);
      });

      setTimeout(() => {
        buyBtn.style.transition = '';
        if (!isDragging) buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
      }, waypoints.length * stepDuration + 800);

    });
  });
};

/* ===== EVENTS ===== */
buyBtn.addEventListener('mousedown', startDrag);
buyBtn.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', function(e) {
  if (isDragging) {
    e.preventDefault();
    drag(e);
  }
}, { passive: false });

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

/* Hover / first tap triggers run-away */
buyBtn.addEventListener('mouseenter', escapeOnce);
buyBtn.addEventListener('touchend', (e) => {
  if (!dragged && !hasEscaped) {
    e.preventDefault();
    escapeOnce();
  }
}, { once: true });


/* ===============================
   FAKE BUYS
================================ */
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

const emojis = ["🦆🔥", "🚀", "💰", "🐳", "⚡"];
const ticker = document.getElementById("buyTicker");

function randomBuy() {
  const name = names[Math.floor(Math.random() * names.length)];
  const amount = (Math.random() * 4 + 0.1).toFixed(2);
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  document.querySelector(".ticker-message").innerHTML =
    `<strong>${name}</strong> just bought <strong>${amount} SOL</strong> of $PNLope ${emoji}`;

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
   PROFILE GENERATOR
================================ */

const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const baseDuck = document.getElementById('baseDuck');

let imageReady = false;

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

generateBtn.disabled = true;

baseDuck.complete
  ? (imageReady = true, generateBtn.disabled = false)
  : baseDuck.onload = () => { imageReady = true; generateBtn.disabled = false; };


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


/* ===============================
   FACE METRICS
================================ */

function getFaceMetrics() {
  const w = canvas.width;
  const h = canvas.height;
  return {
    centerX:    w * 0.5,
    centerY:    h * 0.5,
    eyeY:       h * 0.38,
    eyeOffsetX: w * 0.14,
    mouthY:     h * 0.52,
    headTopY:   h * 0.10,
    neckY:      h * 0.60,
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
    ctx.fillRect(0, 0, W, H);
  }

  if (rarity === "rare") {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, randomColor());
    gradient.addColorStop(1, randomColor());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }

  if (rarity === "legendary") {
    const gradient = ctx.createRadialGradient(W/2, H/2, 50, W/2, H/2, 600);
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(0.5, "#ff8c00");
    gradient.addColorStop(1, "black");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return rarity;
}


/* ===============================
   BASE IMAGE
================================ */

function drawDuck() {
  ctx.drawImage(baseDuck, 0, 0, W, H);
}


/* ===============================
   JACKET
================================ */

function drawJacket(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY + 90);

  const width = 620 * FACE.scale;
  const height = 340 * FACE.scale;

  const baseColor = randomColor();

  const grad = ctx.createLinearGradient(-width/2, -height, width/2, height);
  grad.addColorStop(0, lighten(baseColor, 25));
  grad.addColorStop(0.5, baseColor);
  grad.addColorStop(1, darken(baseColor, 35));

  ctx.fillStyle = grad;
  ctx.fillRect(-width/2, -120, width, height);

  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 25; i++) {
    const x = (Math.random() - 0.5) * width;
    const y = (Math.random() - 0.5) * height;
    const fold = ctx.createLinearGradient(x, y, x + 80, y + 40);
    fold.addColorStop(0, "rgba(0,0,0,0.6)");
    fold.addColorStop(1, "transparent");
    ctx.fillStyle = fold;
    ctx.fillRect(x, y, 120, 60);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = darken(baseColor, 20);
  ctx.fillRect(-120, -120, 240, 120);

  ctx.restore();
}


/* ===============================
   CHAIN
================================ */

function drawChain(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.neckY);

  const radius = 120 * FACE.scale;
  const type = Math.floor(Math.random() * 6);

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

  if (type === 0) {
    ctx.beginPath();
    ctx.arc(0, radius, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  if (type === 1) {
    ctx.fillRect(-40, radius - 40, 80, 80);
  }

  if (type === 2) {
    ctx.beginPath();
    ctx.moveTo(0, radius - 50);
    ctx.lineTo(50, radius + 50);
    ctx.lineTo(-50, radius + 50);
    ctx.closePath();
    ctx.fill();
  }

  if (type === 3) {
    ctx.beginPath();
    ctx.arc(0, radius, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  if (type === 4) {
    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.arc(0, radius, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  if (type === 5) {
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(-60, radius - 60, 120, 120);
  }

  ctx.restore();
}


/* ===============================
   HAT
================================ */

function drawHat(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.headTopY - 40);

  const scale = FACE.scale * 1.2;
  const type = Math.floor(Math.random() * 8);
  const color = randomColor();

  function shadedDome(radius) {
    const grad = ctx.createRadialGradient(-60, -40, 20, 0, 80, radius);
    grad.addColorStop(0, "#ffffffaa");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, darken(color, 40));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 120, radius, Math.PI, 0);
    ctx.fill();
  }

  if (type === 0) shadedDome(220 * scale);
  if (type === 1) {
    ctx.fillStyle = color;
    ctx.fillRect(-80, 0, 160, 180);
    ctx.fillRect(-160, 180, 320, 35);
  }
  if (type === 2) {
    ctx.fillStyle = color;
    ctx.fillRect(-320, 120, 640, 40);
    shadedDome(200 * scale);
  }
  if (type === 3) {
    ctx.fillStyle = color;
    ctx.fillRect(-160, 60, 320, 120);
  }
  if (type === 4) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 120, 260, 170, 0, Math.PI, 0);
    ctx.fill();
  }
  if (type === 5) shadedDome(260 * scale);
  if (type === 6) {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(-200, 80, 400, 140);
    for (let i = -180; i <= 180; i += 90) {
      ctx.beginPath();
      ctx.moveTo(i, 80);
      ctx.lineTo(i + 45, 0);
      ctx.lineTo(i + 90, 80);
      ctx.fill();
    }
  }
  if (type === 7) {
    ctx.fillStyle = color;
    ctx.fillRect(-180, 100, 360, 45);
  }

  ctx.restore();
}


/* ===============================
   SUNGLASSES
================================ */

function drawSunglasses(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX, FACE.eyeY);

  const type = Math.floor(Math.random() * 7);
  const w = 100 * FACE.scale;
  const h = 55 * FACE.scale;

  const lens = ctx.createLinearGradient(-w, -h, w, h);
  lens.addColorStop(0, "#ffffffaa");
  lens.addColorStop(0.3, "#222");
  lens.addColorStop(0.7, "#000");
  lens.addColorStop(1, "#ffffff88");

  ctx.fillStyle = lens;

  if (type === 0) {
    ctx.fillRect(-w - 30, -h/2, w, h);
    ctx.fillRect(30, -h/2, w, h);
  }
  if (type === 1) {
    ctx.beginPath();
    ctx.ellipse(-w/1.2, 0, w/1.5, h/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w/1.2, 0, w/1.5, h/2, 0, 0, Math.PI*2);
    ctx.fill();
  }
  if (type === 2) ctx.fillRect(-w, -h/3, w*2, h/1.5);
  if (type === 3) {
    ctx.beginPath();
    ctx.arc(-w/1.2, 0, h/1.2, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w/1.2, 0, h/1.2, 0, Math.PI*2);
    ctx.fill();
  }
  if (type === 4) ctx.fillRect(-w, -h/2, w*2, h);
  if (type === 5) ctx.fillRect(-w/2, -h/2, w, h);
  if (type === 6) ctx.fillRect(-w*1.2, -h/2, w*2.4, h);

  ctx.restore();
}


/* ===============================
   CIGAR
================================ */

function drawCigar(FACE) {
  ctx.save();
  ctx.translate(FACE.centerX + 190 * FACE.scale, FACE.mouthY);

  const length = 140 * FACE.scale;

  const grad = ctx.createLinearGradient(0, 0, length, 0);
  grad.addColorStop(0, "#8b5a2b");
  grad.addColorStop(1, "#3e2412");

  ctx.fillStyle = grad;
  ctx.fillRect(0, -12, length, 28);

  ctx.fillStyle = "#ccc";
  ctx.fillRect(length - 10, -12, 10, 28);

  const ember = ctx.createRadialGradient(length, 2, 5, length, 2, 25);
  ember.addColorStop(0, "yellow");
  ember.addColorStop(0.5, "red");
  ember.addColorStop(1, "transparent");

  ctx.fillStyle = ember;
  ctx.beginPath();
  ctx.arc(length, 2, 25, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}


/* ===============================
   VIGNETTE
================================ */

function drawVignette() {
  ctx.save();

  const vignette = ctx.createRadialGradient(W/2, H/2, 200, W/2, H/2, 600);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.4)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}


/* ===============================
   GENERATE
================================ */

function generatePFP() {
  if (!imageReady) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);

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


/* ===============================
   REVEAL ON SCROLL
================================ */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));

}
