/* ===============================
   CA COPY
================================ */
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
let dragMoved   = false;

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

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const getClientPos = (e) => ({
  x: e.touches ? e.touches[0].clientX : e.clientX,
  y: e.touches ? e.touches[0].clientY : e.clientY,
});

const getMaxPos = () => ({
  maxX: window.innerWidth  - buyBtn.offsetWidth  - 10,
  maxY: window.innerHeight - buyBtn.offsetHeight - 10,
});

const anchorPosition = () => {
  const rect = buyBtn.getBoundingClientRect();
  buyBtn.style.left     = `${rect.left}px`;
  buyBtn.style.top      = `${rect.top}px`;
  buyBtn.style.right    = 'auto';
  buyBtn.style.bottom   = 'auto';
  buyBtn.style.position = 'fixed';
};

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

const drag = (e) => {
  if (!isDragging) return;
  dragged   = true;
  dragMoved = true;
  const { x, y }       = getClientPos(e);
  const { maxX, maxY } = getMaxPos();
  buyBtn.style.left = `${clamp(x - offsetX, 10, maxX)}px`;
  buyBtn.style.top  = `${clamp(y - offsetY, 10, maxY)}px`;
};

const stopDrag = (e) => {
  if (!isDragging) return;
  isDragging = false;
  buyBtn.classList.remove('dragging');
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
  if (e && e.type === 'touchend' && !dragMoved) dragged = false;
};

setInterval(() => {
  if (isDragging) return;
  textIndex++;
  buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
}, 2500);

buyBtn.addEventListener('click', (e) => {
  if (dragged) e.preventDefault();
  dragged = false;
});

const escapeOnce = () => {
  if (hasEscaped || isDragging) return;
  hasEscaped = true;

  const padding        = 20;
  const { maxX, maxY } = getMaxPos();
  const rect           = buyBtn.getBoundingClientRect();

  anchorPosition();

  const finalX = clamp(Math.random() * maxX, padding, maxX);
  const finalY = clamp(Math.random() * maxY, padding, maxY);
  const steps  = 7;
  const waypoints = [];

  for (let i = 1; i <= steps; i++) {
    const progress = i / (steps + 1);
    const baseX    = rect.left + (finalX - rect.left) * progress;
    const baseY    = rect.top  + (finalY - rect.top)  * progress;
    const swing    = 220 * Math.sin(progress * Math.PI);
    const side     = i % 2 === 0 ? 1 : -1;
    waypoints.push({
      x: clamp(baseX + side * swing,             padding, maxX),
      y: clamp(baseY + (Math.random() - 0.5)*80, padding, maxY),
    });
  }
  waypoints.push({ x: finalX, y: finalY });

  const texts       = ['👀','heh','lol','...','nope','bye','lmao',"CAN'T CATCH ME 🦆"];
  const stepDuration = 600;

  requestAnimationFrame(() => requestAnimationFrame(() => {
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
  }));
};

buyBtn.addEventListener('mousedown',  startDrag);
buyBtn.addEventListener('mouseenter', escapeOnce);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup',   stopDrag);

buyBtn.addEventListener('touchstart', startDrag, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (isDragging) { e.preventDefault(); drag(e); }
}, { passive: false });
document.addEventListener('touchend', stopDrag);


/* ===============================
   MEME GALLERY LIGHTBOX
================================ */
(() => {
  const grid    = document.getElementById('memeGrid');
  const lb      = document.getElementById('memeLightbox');
  const lbImg   = document.getElementById('memeLbImg');
  const lbLabel = document.getElementById('memeLbLabel');
  const lbCount = document.getElementById('memeLbCounter');
  const lbClose = document.getElementById('memeLbClose');
  const lbPrev  = document.getElementById('memeLbPrev');
  const lbNext  = document.getElementById('memeLbNext');

  if (!grid || !lb) return;

  // Hide cards where image fails to load
  grid.querySelectorAll('.meme-card img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.meme-card').style.display = 'none';
    });
  });

  const getCards = () =>
    [...grid.querySelectorAll('.meme-card')]
      .filter(c => c.style.display !== 'none');

  let cards   = [];
  let current = 0;

  window.addEventListener('load', () => { cards = getCards(); });
  cards = getCards();

  const show = (i) => {
    cards   = getCards();
    current = (i + cards.length) % cards.length;
    const card  = cards[current];
    const img   = card.querySelector('img');
    lbImg.src           = img.src;
    lbLabel.textContent = card.dataset.label || '';
    lbCount.textContent = `${current + 1} / ${cards.length}`;
  };

  const open = (card) => {
    cards   = getCards();
    current = cards.indexOf(card);
    if (current === -1) return;
    show(current);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  grid.querySelectorAll('.meme-card').forEach(card => {
    card.addEventListener('click', () => open(card));
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });



/* ── Meme Gallery: drag-to-scroll on desktop ── */
(() => {
  const slider = document.getElementById('memeGrid');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', e => {
    // Don't activate drag if clicking a card to open lightbox
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => { isDown = false; });
  slider.addEventListener('mouseup', () => { isDown = false; });
  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
})();
  // Swipe support in lightbox
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? show(current + 1) : show(current - 1);
  });
})();


/* ===============================
   FAKE BUYS
================================ */
const names  = ["DegenWhale","0xLord","MoonFarmer","EggHunter","0x6e","QuackTrader","HODLord","SneakyWhale","Elon Musk"];
const emojis = ["🦆🔥","🚀","💰","🐳","⚡"];
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
