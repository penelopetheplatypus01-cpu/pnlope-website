/* ===============================
   BACKGROUND MUSIC + THEME SWITCHER
   with particle effects + slide-in exclusive sections
================================ */
(() => {
  const music   = document.getElementById("bg-music");
  const toggle  = document.getElementById("musicToggle");
  const picker  = document.getElementById("trackPicker");
  const ALL_THEMES = ["theme-pond", "theme-escape"];

  if (!music || !toggle) return;

  music.volume = 0.35;

  let particleContainer = null;

  function clearParticles() {
    if (particleContainer) { particleContainer.remove(); particleContainer = null; }
  }

  function createBubbles() {
    clearParticles();
    particleContainer = document.createElement("div");
    particleContainer.id = "theme-particles";
    for (let i = 0; i < 22; i++) {
      const b = document.createElement("div");
      b.className = "bubble-particle";
      const size = 8 + Math.random() * 28;
      b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;bottom:-${size}px;--dur:${5+Math.random()*8}s;--delay:-${Math.random()*10}s;--drift:${(Math.random()-.5)*80}px;`;
      particleContainer.appendChild(b);
    }
    document.body.appendChild(particleContainer);
  }

  function createStars() {
    clearParticles();
    particleContainer = document.createElement("div");
    particleContainer.id = "theme-particles";
    for (let i = 0; i < 80; i++) {
      const s = document.createElement("div");
      s.className = "star-particle";
      const size = 1 + Math.random() * 2.5;
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;top:${Math.random()*100}vh;--dur:${2+Math.random()*4}s;--delay:-${Math.random()*6}s;`;
      particleContainer.appendChild(s);
    }
    for (let i = 0; i < 5; i++) {
      const ss = document.createElement("div");
      ss.className = "shooting-star";
      ss.style.cssText = `left:${60+Math.random()*40}vw;top:${Math.random()*40}vh;--dur:${3+Math.random()*4}s;--delay:${i*2.5+Math.random()*3}s;`;
      particleContainer.appendChild(ss);
    }
    document.body.appendChild(particleContainer);
  }

  // ── Show / hide exclusive sections ──
  function updateExclusiveSections(theme) {
    const sectionDefault = document.getElementById("section-default");
    const sectionPond    = document.getElementById("section-pond");
    const sectionEscape  = document.getElementById("section-escape");

    // Hide the slide-in ones first
    [sectionPond, sectionEscape].forEach(s => {
      if (s) s.classList.remove("visible");
    });

    // Handle default section (uses display:block/none via CSS, no slide needed)
    // CSS already handles it via body class — nothing to do here

    // Slide in the matching theme section after a beat
    setTimeout(() => {
      if (theme === "theme-pond"   && sectionPond)   sectionPond.classList.add("visible");
      if (theme === "theme-escape" && sectionEscape) sectionEscape.classList.add("visible");
    }, 250);
  }

  // ── Hero image map — update "platypus.png" to your actual default filename ──
  const heroImages = {
    "":             "assets/platypus.png",
    "theme-pond":   "assets/Pond_vibes.png",
    "theme-escape": "assets/Zoo_escape.png",
  };

  function switchHeroImage(theme) {
    const heroImg = document.querySelector(".hero img");
    if (!heroImg) return;
    const newSrc = heroImages[theme] ?? heroImages[""];

    // Fade out → swap src → fade in
    heroImg.style.transition = "opacity 0.35s ease";
    heroImg.style.opacity    = "0";
    setTimeout(() => {
      heroImg.src = newSrc;
      heroImg.onload = () => { heroImg.style.opacity = "1"; };
      setTimeout(() => { heroImg.style.opacity = "1"; }, 120); // fallback for cached
    }, 350);
  }

  // ── Apply theme + particles + hero image + exclusive section ──
  function applyTheme(theme) {
    document.body.classList.remove(...ALL_THEMES);

    if (theme === "theme-pond") {
      document.body.classList.add("theme-pond");
      createBubbles();
    } else if (theme === "theme-escape") {
      document.body.classList.add("theme-escape");
      createStars();
    } else {
      clearParticles();
    }

    switchHeroImage(theme);
    updateExclusiveSections(theme);
  }

  // ── Toggle picker ──
  toggle.addEventListener("click", () => {
    const isOpen = picker.classList.toggle("open");
    if (!isOpen) {
      if (music.paused) {
        music.play().catch(() => {});
        toggle.classList.add("playing");
      } else {
        music.pause();
        toggle.classList.remove("playing");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !picker.contains(e.target)) {
      picker.classList.remove("open");
    }
  });

  // ── Track buttons ──
  document.querySelectorAll(".track-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const src   = btn.dataset.src;
      const theme = btn.dataset.theme;

      document.querySelectorAll(".track-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      music.pause();
      music.src = src;
      music.load();
      music.play().catch(() => {});
      toggle.classList.add("playing");

      applyTheme(theme);
      picker.classList.remove("open");
    });
  });

})();