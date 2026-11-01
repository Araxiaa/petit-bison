// Effets : brume + lucioles vertes (ses yeux), lueur du curseur, inclinaison des cartes, révélations au scroll, mascotte pixel-art.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const isNight = () => root.dataset.theme === "night";
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---- particules ---- */
  const cv = document.getElementById("fx");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, parts = [], raf = 0;

  function make() {
    const n = Math.min(60, Math.round((W * H) / 30000));
    parts = Array.from({ length: n }, () => ({
      x: rnd(0, W), y: rnd(0, H), r: rnd(1.5, 5), vy: rnd(0.1, 0.45), sw: rnd(0.4, 1.5),
      ph: rnd(0, 6.28), kind: Math.random() < 0.4 ? "leaf" : "mote", tw: rnd(0.6, 2),
    }));
  }
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(d, 0, 0, d, 0, 0); make();
  }
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    const night = isNight(), s = t / 1000;
    for (const p of parts) {
      if (night) { // lucioles vertes qui montent dans la brume
        const a = 0.2 + 0.8 * Math.abs(Math.sin(s * p.tw + p.ph));
        ctx.fillStyle = `rgba(150,220,80,${a * 0.9})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.45, 0, 6.28); ctx.fill();
        ctx.fillStyle = `rgba(150,220,80,${a * 0.13})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.4, 0, 6.28); ctx.fill();
        p.y -= p.vy * 0.2; p.x += Math.sin(s * 0.3 + p.ph) * 0.12;
      } else { // feuilles / poussières dorées
        p.y += p.vy; p.x += Math.sin(s * p.sw + p.ph) * 0.45;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(s * p.sw + p.ph) * 0.9);
        if (p.kind === "leaf") {
          ctx.fillStyle = "rgba(134,197,64,.34)";
          ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.9, p.r * 0.8, 0, 0, 6.28); ctx.fill();
        } else {
          ctx.fillStyle = "rgba(200,128,63,.38)";
          ctx.beginPath(); ctx.arc(0, 0, p.r * 0.7, 0, 6.28); ctx.fill();
        }
        ctx.restore();
      }
      if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); }
      if (p.y < -20) { p.y = H + 20; p.x = rnd(0, W); }
    }
    raf = requestAnimationFrame(frame);
  }
  size(); addEventListener("resize", size);
  if (!reduce) {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame);
    });
  }

  /* ---- lueur du curseur + parallaxe ---- */
  const glow = document.querySelector(".glow");
  let mx = innerWidth / 2, my = innerHeight / 2, ticking = false;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (ticking || reduce) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      glow.style.transform = `translate(${mx - 250}px, ${my - 250}px)`;
      root.style.setProperty("--px", (mx / innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--py", (my / innerHeight - 0.5).toFixed(3));
    });
  }, { passive: true });

  /* ---- inclinaison des cartes ---- */
  document.addEventListener("pointermove", (e) => {
    if (reduce || e.pointerType === "touch") return;
    const el = e.target.closest && e.target.closest(".tilt");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", ((0.5 - y) * 7).toFixed(2) + "deg");
    el.style.setProperty("--ry", ((x - 0.5) * 9).toFixed(2) + "deg");
    el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    const el = e.target.closest && e.target.closest(".tilt");
    if (el && !el.contains(e.relatedTarget)) { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }
  });

  /* ---- révélations au scroll + compteurs ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-count]").forEach(count);
      if (en.target.hasAttribute("data-count")) count(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = Number(el.dataset.count) || 0;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1300;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---- mascotte pixel-art : traverse l'écran, s'assoit, regarde le curseur ---- */
  const mEl = document.getElementById("mascot");
  const mImg = mEl.querySelector("img");
  let mCfg = null, mTimer = 0, mState = "off";
  const SIZE = 108;
  const pose = (src, flip) => { if (mImg.getAttribute("src") !== src) mImg.src = src; mImg.style.transform = flip ? "scaleX(-1)" : ""; };

  function walk() {
    if (mState === "off") return;
    mState = "walk";
    const ltr = Math.random() < 0.5, dur = rnd(14, 22);
    mEl.style.transition = "none";
    mEl.style.transform = `translateX(${ltr ? -SIZE * 1.5 : W + SIZE * 0.5}px)`;
    pose(mCfg.marche, ltr);
    mEl.classList.add("walking");
    mEl.hidden = false;
    void mEl.offsetWidth;
    mEl.style.transition = `transform ${dur}s linear`;
    mEl.style.transform = `translateX(${ltr ? W + SIZE * 0.5 : -SIZE * 1.5}px)`;
    // s'assoit un instant au milieu du trajet
    const stopAt = rnd(0.3, 0.6) * dur * 1000;
    clearTimeout(mTimer);
    mTimer = setTimeout(() => {
      if (mState !== "walk") return;
      const cur = getComputedStyle(mEl).transform;
      const x = new DOMMatrixReadOnly(cur).m41;
      mEl.style.transition = "none"; mEl.style.transform = `translateX(${x}px)`;
      mEl.classList.remove("walking"); mState = "sit";
      pose(mCfg.assis, false);
      mTimer = setTimeout(() => {
        pose(mCfg.assis, false);
        mState = "walk2";
        const rest = ltr ? W + SIZE * 0.5 - x : x + SIZE * 1.5;
        mEl.classList.add("walking"); pose(mCfg.marche, ltr);
        void mEl.offsetWidth;
        mEl.style.transition = `transform ${rest / 55}s linear`;
        mEl.style.transform = `translateX(${ltr ? W + SIZE * 0.5 : -SIZE * 1.5}px)`;
        mTimer = setTimeout(() => { mState = "idle"; mEl.hidden = true; mTimer = setTimeout(walk, rnd(6000, 14000)); }, (rest / 55) * 1000 + 100);
      }, rnd(4000, 7000));
    }, stopAt);
  }
  mEl.addEventListener("pointerenter", () => { if (mState === "sit") pose(mCfg.regard, false); });
  mEl.addEventListener("pointerleave", () => { if (mState === "sit") pose(mCfg.assis, false); });

  window.FX = {
    observe(scope = document) {
      scope.querySelectorAll(".rv, .stat, [data-count]").forEach((el) => {
        if (reduce) { el.classList.add("in"); el.querySelectorAll("[data-count]").forEach(count); if (el.dataset.count) count(el); return; }
        io.observe(el);
      });
    },
    mascot(cfg, on) {
      clearTimeout(mTimer);
      if (!on || reduce || !cfg.marche) { mState = "off"; mEl.hidden = true; return; }
      mCfg = cfg;
      mEl.style.pointerEvents = "auto";
      if (mState === "off") { mState = "idle"; mTimer = setTimeout(walk, 2500); }
    },
  };
})();
