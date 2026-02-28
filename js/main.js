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
   FLOATING BUY BUTTON
================================ */
const buyBtn = document.getElementById('floatingBuy');

let isDragging  = false;
let offsetX     = 0;
let offsetY     = 0;
let dragged     = false;
let hasEscaped  = false;
let dragMoved   = false; // distinguishes tap vs actual drag on mobile

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

/* ── helpers ── */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const getClientPos = (e) => ({
  x: e.touches ? e.touches[0].clientX : e.clientX,
  y: e.touches ? e.touches[0].clientY : e.clientY,
});

const getMaxPos = () => ({
  maxX: window.innerWidth  - buyBtn.offsetWidth  - 10,
  maxY: window.innerHeight - buyBtn.offsetHeight - 10,
});

/* ── snap button to its current visual position before dragging ── */
const anchorPosition = () => {
  const rect = buyBtn.getBoundingClientRect();
  buyBtn.style.left     = `${rect.left}px`;
  buyBtn.style.top      = `${rect.top}px`;
  buyBtn.style.right    = 'auto';
  buyBtn.style.bottom   = 'auto';
  buyBtn.style.position = 'fixed';
};


/* ===== START DRAG ===== */
const startDrag = (e) => {
  if (!e.touches) e.preventDefault();

  isDragging = true;
  dragged    = false;
  dragMoved  = false;

  anchorPosition();
  buyBtn.classList.add('dragging');
  buyBtn.innerText = draggingTexts[Math.floor(Math.random() * draggingTexts.length)];

  const { x, y } = getClientPos(e);
  const rect = buyBtn.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
};


/* ===== DRAGGING ===== */
const drag = (e) => {
  if (!isDragging) return;

  dragged   = true;
  dragMoved = true;

  const { x, y }       = getClientPos(e);
  const { maxX, maxY } = getMaxPos();

  buyBtn.style.left = `${clamp(x - offsetX, 10, maxX)}px`;
  buyBtn.style.top  = `${clamp(y - offsetY, 10, maxY)}px`;
};


/* ===== STOP DRAG ===== */
const stopDrag = (e) => {
  if (!isDragging) return;
  isDragging = false;
  buyBtn.classList.remove('dragging');
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];

  // Finger lifted without moving = tap, allow navigation
  if (e && e.type === 'touchend' && !dragMoved) {
    dragged = false;
  }
};


/* ===== ROTATING TEXT ===== */
setInterval(() => {
  if (isDragging) return;
  textIndex++;
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
}, 2500);


/* ===== SAFE CLICK ===== */
buyBtn.addEventListener('click', (e) => {
  if (dragged) e.preventDefault();
  dragged = false;
});


/* ===== RUN AWAY ONCE — DESKTOP HOVER ONLY ===== */
const escapeOnce = () => {
  // Never trigger from touch events — only mouseenter fires this
  if (hasEscaped || isDragging) return;
  hasEscaped = true;

  const padding        = 20;
  const { maxX, maxY } = getMaxPos();
  const rect           = buyBtn.getBoundingClientRect();

  anchorPosition();

  const finalX = clamp(Math.random() * maxX, padding, maxX);
  const finalY = clamp(Math.random() * maxY, padding, maxY);

  const steps     = 7;
  const waypoints = [];

  for (let i = 1; i <= steps; i++) {
    const progress = i / (steps + 1);
    const baseX    = rect.left + (finalX - rect.left) * progress;
    const baseY    = rect.top  + (finalY - rect.top)  * progress;
    const swing    = 220 * Math.sin(progress * Math.PI);
    const side     = i % 2 === 0 ? 1 : -1;
    waypoints.push({
      x: clamp(baseX + side * swing, padding, maxX),
      y: clamp(baseY + (Math.random() - 0.5) * 80, padding, maxY),
    });
  }
  waypoints.push({ x: finalX, y: finalY });

  const texts       = ['👀', 'heh', 'lol', '...', 'nope', 'bye', 'lmao', "CAN'T CATCH ME 🦆"];
  const stepDuration = 600;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      waypoints.forEach((point, index) => {
        setTimeout(() => {
          const isLast = index === waypoints.length - 1;
          buyBtn.style.transition = isLast
            ? `left 0.7s cubic-bezier(0.25,1.4,0.5,1), top 0.7s cubic-bezier(0.25,1.4,0.5,1)`
            : `left 500ms cubic-bezier(0.4,0,0.2,1), top 500ms cubic-bezier(0.4,0,0.2,1)`;

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


/* ===== BIND ALL EVENTS ===== */

// — Desktop —
buyBtn.addEventListener('mousedown', startDrag);
buyBtn.addEventListener('mouseenter', escapeOnce); // escape on hover only, never on touch
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// — Mobile: drag works, escape does NOT fire —
buyBtn.addEventListener('touchstart', startDrag, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault(); // prevents page scroll while dragging button
    drag(e);
  }
}, { passive: false });

document.addEventListener('touchend', stopDrag);


/* ===============================
   FAKE BUYS
================================ */
const names = [
  "DegenWhale", "0xLord", "MoonFarmer", "EggHunter",
  "0x6e", "QuackTrader", "HODLord", "SneakyWhale", "Elon Musk"
];
const emojis = ["🦆🔥", "🚀", "💰", "🐳", "⚡"];
const ticker  = document.getElementById("buyTicker");

function randomBuy() {
  const name   = names[Math.floor(Math.random() * names.length)];
  const amount = (Math.random() * 4 + 0.1).toFixed(2);
  const emoji  = emojis[Math.floor(Math.random() * emojis.length)];

  document.querySelector(".ticker-message").innerHTML =
    `<strong>${name}</strong> just bought <strong>${amount} SOL</strong> of $PNLope ${emoji}`;

  ticker.classList.add("show");
  setTimeout(() => ticker.classList.remove("show"), 3500);
}

setTimeout(() => {
  randomBuy();
  setInterval(randomBuy, 5500);
}, 2000);


/* ===============================
   REVEAL ON SCROLL
================================ */
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));
