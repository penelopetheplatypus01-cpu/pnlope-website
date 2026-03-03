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

  // ── Smooth curved escape using Web Animations API + cubic-bezier spline ──
  // Generate a flowing S-curve path with many fine steps so CSS transitions
  // blend into a true curve rather than a visible zigzag.

  const startX = rect.left;
  const startY = rect.top;
  const finalX = clamp(Math.random() * maxX, padding, maxX);
  const finalY = clamp(Math.random() * maxY, padding, maxY);

  // Two bezier control points for the overall arc (offset perpendicularly)
  const dx = finalX - startX;
  const dy = finalY - startY;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  // Perpendicular direction
  const perpX = -dy / len;
  const perpY =  dx / len;
  // Random curve bulge amount and direction
  const bulge   = (Math.random() * 0.5 + 0.4) * Math.min(maxX, maxY) * 0.45;
  const bulgeDir = Math.random() < 0.5 ? 1 : -1;
  // Add a secondary wobble for the S shape
  const wobble  = bulge * 0.4;

  // Sample many points along a cubic bezier with an added sine wobble
  // P0=start, P1=ctrl1, P2=ctrl2, P3=final
  const cp1x = startX + dx * 0.25 + perpX * bulge * bulgeDir;
  const cp1y = startY + dy * 0.25 + perpY * bulge * bulgeDir;
  const cp2x = startX + dx * 0.75 - perpX * bulge * bulgeDir;
  const cp2y = startY + dy * 0.75 - perpY * bulge * bulgeDir;

  const totalSteps  = 28;
  const totalMs     = 2200;
  const stepMs      = totalMs / totalSteps;

  // Cubic bezier point at t
  const bezier = (t) => {
    const mt = 1 - t;
    return {
      x: mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*finalX,
      y: mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*finalY,
    };
  };

  const waypoints = [];
  for (let i = 1; i <= totalSteps; i++) {
    const t  = i / totalSteps;
    const pt = bezier(t);
    // Add gentle sine wobble perpendicular to path for organic feel
    const wAmt = Math.sin(t * Math.PI * 3) * wobble * (1 - t); // fades out
    waypoints.push({
      x: clamp(pt.x + perpX * wAmt, padding, maxX),
      y: clamp(pt.y + perpY * wAmt, padding, maxY),
      t,
    });
  }

  const texts = ['👀','heh','lol','...','nope','bye','lmao',"CAN'T CATCH ME 🦆"];

  requestAnimationFrame(() => requestAnimationFrame(() => {
    waypoints.forEach(({ x, y, t }, index) => {
      setTimeout(() => {
        const isLast   = index === waypoints.length - 1;
        // Smooth easing: ease-out on last step, ease-in-out elsewhere
        const ease = isLast
          ? 'cubic-bezier(0.22,1,0.36,1)'
          : 'cubic-bezier(0.45,0,0.55,1)';
        buyBtn.style.transition = `left ${stepMs+20}ms ${ease}, top ${stepMs+20}ms ${ease}`;
        buyBtn.style.left = `${x}px`;
        buyBtn.style.top  = `${y}px`;

        // Show text labels only at a few keypoints
        const labelAt = [0, 4, 9, 15, 20, 24, 27];
        const li = labelAt.indexOf(index);
        if (li !== -1 && texts[li]) buyBtn.innerText = texts[li];
      }, index * stepMs);
    });

    setTimeout(() => {
      buyBtn.style.transition = '';
      if (!isDragging) buyBtn.innerText = normalTexts[textIndex % normalTexts.length];
    }, totalSteps * stepMs + 800);
  }));
};

buyBtn.addEventListener('mousedown',  startDrag);
buyBtn.addEventListener('mouseenter', escapeOnce);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup',   stopDrag);

buyBtn.addEventListener('touchstart', (e) => {
  // First touch on mobile — escape instead of drag
  if (!hasEscaped) {
    escapeOnce();
    return; // don't start drag on first touch
  }
  startDrag(e);
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (isDragging) { e.preventDefault(); drag(e); }
}, { passive: false });
document.addEventListener('touchend', stopDrag);



/* ===============================
   MEME GALLERY AUTO-SCROLL
   Duplicates cards for seamless infinite loop
================================ */
(() => {
  const grid = document.getElementById('memeGrid');
  if (!grid) return;

  // Wait for images to settle then clone
  window.addEventListener('load', () => {
    // Remove cards that failed to load
    grid.querySelectorAll('.meme-card img').forEach(img => {
      img.addEventListener('error', () => {
        img.closest('.meme-card').remove();
      });
    });

    // Clone all visible cards and append for seamless loop
    setTimeout(() => {
      const originals = [...grid.querySelectorAll('.meme-card')];
      originals.forEach((card, i) => {
        const clone = card.cloneNode(true);
        // Store original index so lightbox knows which card to open
        clone.dataset.originalIndex = i;
        clone.classList.add('meme-clone');
        grid.appendChild(clone);
      });
    }, 300);
  });
})();

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
    [...grid.querySelectorAll('.meme-card:not(.meme-clone)')]
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

  // Attach click to original cards
  grid.querySelectorAll('.meme-card:not(.meme-clone)').forEach(card => {
    card.addEventListener('click', () => open(card));
  });

  // Clones are appended after load — use event delegation on grid
  grid.addEventListener('click', e => {
    const clone = e.target.closest('.meme-clone');
    if (!clone) return;
    // Map clone back to its original card by index
    const idx = parseInt(clone.dataset.originalIndex ?? -1);
    if (idx < 0) return;
    cards = getCards();
    const originals = cards.filter(c => !c.classList.contains('meme-clone'));
    if (originals[idx]) open(originals[idx]);
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