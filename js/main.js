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

// ── Detect mobile/touch once at load ──
const IS_MOBILE = window.innerWidth <= 768 || navigator.maxTouchPoints > 0;

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
  // On mobile, don't allow drag — just let it be a normal link
  if (IS_MOBILE) return;

  if (!e.touches) e.preventDefault();

  isDragging = true;
  dragged = false;

  buyBtn.classList.add('dragging');
  buyBtn.style.position = 'fixed';
  buyBtn.innerText = draggingTexts[Math.floor(Math.random() * draggingTexts.length)];

  const rect = buyBtn.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
};

/* ===== DRAGGING ===== */
const drag = (e) => {
  if (!isDragging || IS_MOBILE) return;
  dragged = true;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const padding = 10;
  const maxX = window.innerWidth  - buyBtn.offsetWidth  - padding;
  const maxY = window.innerHeight - buyBtn.offsetHeight - padding;

  let left = Math.min(Math.max(padding, clientX - offsetX), maxX);
  let top  = Math.min(Math.max(padding, clientY - offsetY), maxY);

  buyBtn.style.left   = `${left}px`;
  buyBtn.style.top    = `${top}px`;
  buyBtn.style.right  = 'auto';
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
  if (dragged) e.preventDefault();
  dragged = false;
});

/* ===== RUN AWAY ONCE — DESKTOP ONLY ===== */
const escapeOnce = () => {
  // Never run on mobile — this is what was causing the bug
  if (IS_MOBILE || hasEscaped || isDragging) return;
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
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// Touch drag — only register on desktop
if (!IS_MOBILE) {
  buyBtn.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      e.preventDefault();
      drag(e);
    }
  }, { passive: false });
  document.addEventListener('touchend', stopDrag);

  // Hover / first tap triggers run-away — DESKTOP ONLY
  buyBtn.addEventListener('mouseenter', escapeOnce);
  buyBtn.addEventListener('touchend', (e) => {
    if (!dragged && !hasEscaped) {
      e.preventDefault();
      escapeOnce();
    }
  }, { once: true });
}


/* ===============================
   FAKE BUYS
================================ */
const names = [
  "DegenWhale", "0xLord", "MoonFarmer", "EggHunter",
  "0x6e", "QuackTrader", "HODLord", "SneakyWhale", "Elon Musk"
];

const emojis = ["🦆🔥", "🚀", "💰", "🐳", "⚡"];
const ticker = document.getElementById("buyTicker");

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
