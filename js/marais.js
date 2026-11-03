// Le Marais : les relations de Petit Bison, comme un marais de brume.
//  • chaque relation est un nénuphar ; Petit Bison saute de l'un à l'autre
//  • 🐸 = elle aime (1 à 3)   🐿️ = elle n'aime pas (1 à 3)   🦬 = respect   ✨ = aux étoiles
//  • la brume cache ce qu'elle ne sait pas encore : plus son avis est tranché, plus elle voit clair
//  • le curseur de lunes remonte le temps : les nénuphars apparaissent, les grenouilles arrivent, la brume se lève
window.Marais = (function () {
  const O = window.Outils, esc = O.esc, fmt = O.fmt;
  const W = 1000, H = 640, CX = 500, CY = 322;
  const ZONES = {
    nid: { band: [88, 124], cap: 7, off: 0.5, label: "le nid" },
    camp: { band: [172, 232], cap: 11, off: 0.95, label: "le camp de l'Ombre" },
    dela: { band: [268, 300], cap: 14, off: 0.2, label: "au-delà de la brume" },
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function mount(host, L) {
    const D = L.D, list = L.all();
    const clan = D.identite.clan || "Clan de l'Ombre";
    const now = parseInt(D.identite.lunes) || 0;
    const ages = list.flatMap((r) => (r.phases || []).map((p) => Number(p.age) || 0));
    const maxM = Math.max(now, ...ages, 0);
    if (!list.length) { host.innerHTML = '<p class="empty">Le marais est désert pour le moment : les nénuphars apparaîtront dès que des relations seront ajoutées depuis le dashboard.</p>'; return; }

    /* ---------- placement : la géographie dit « à quel monde il appartient » ---------- */
    const zoneOf = (r) => (r._fam ? "nid" : O.norm(r.groupe) === O.norm(clan) ? "camp" : "dela");
    const pos = new Map();
    Object.keys(ZONES).forEach((z) => {
      const zs = ZONES[z], arr = list.filter((r) => zoneOf(r) === z).sort((a, b) => O.norm(a.nom).localeCompare(O.norm(b.nom)));
      const rings = Math.max(1, Math.ceil(arr.length / zs.cap));
      arr.forEach((r, j) => {
        const ring = j % rings, idx = Math.floor(j / rings), inRing = Math.ceil((arr.length - ring) / rings);
        const t = rings === 1 ? 0.5 : ring / (rings - 1), ry = zs.band[0] + (zs.band[1] - zs.band[0]) * t;
        const ang = -Math.PI / 2 + zs.off + (idx / Math.max(1, inRing)) * Math.PI * 2 + ring * 0.4 + ((O.hue(r.nom) % 100) / 100 - 0.5) * 0.18;
        pos.set(r, { x: clamp(CX + ry * 1.5 * Math.cos(ang), 78, W - 78), y: clamp(CY + ry * Math.sin(ang), 70, H - 84), z });
      });
    });

    /* ---------- l'état d'une relation à une lune donnée ---------- */
    const phases = (r) => L.phasesOf(r);
    const at = (r, m) => { let cur = null; phases(r).forEach((p) => { if ((Number(p.age) || 0) <= m) cur = p; }); return cur; };
    const deathMoon = (r) => {
      if (r.deces !== "" && r.deces != null && !isNaN(Number(r.deces))) return Number(r.deces);
      const ph = phases(r), mort = ph.find((p) => p.appreciation === "mort");
      if (mort) return Number(mort.age) || 0;
      return r.vivant === "non" ? (ph.length ? Number(ph[ph.length - 1].age) || 0 : 0) : Infinity;
    };
    function stateAt(r, m) {
      const cur = at(r, m);
      if (!cur) return { met: false };
      const dead = m >= deathMoon(r);
      let p = cur;
      if (p.appreciation === "mort") p = phases(r).filter((x) => x.appreciation !== "mort" && (Number(x.age) || 0) <= m).pop() || { appreciation: "neutre" };
      const a = L.appr(p.appreciation), n = a.n || 0;
      return { met: true, dead, p, cur, n, f: Math.max(0, n), s: Math.max(0, -n), rs: L.resp(p), fog: n === 0 ? 0.88 : [0, 0.2, 0.12, 0.05][Math.abs(n)] };
    }

    /* ---------- le décor ---------- */
    let reeds = "";
    [[16, 8], [34, 6], [52, 7], [70, 5], [88, 6], [W - 16, 8], [W - 36, 6], [W - 56, 7], [W - 74, 5], [W - 92, 6], [150, 4], [W - 150, 4]].forEach(([x, k], i) => {
      const h = 70 + ((i * 37) % 60), bend = ((i * 53) % 24) - 12;
      reeds += `<g class="reed" style="--d:${(i * 0.7) % 5}s;--s:${5 + (i % 4)}s;--a:${1.4 + (i % 3) * 0.6}deg"><path d="M${x} ${H + 4} Q${x + bend * 0.2} ${H - h * 0.6} ${x + bend} ${H - h}" fill="none" stroke-width="3" stroke-linecap="round"/>${i % 2 ? `<ellipse cx="${x + bend}" cy="${H - h - 14}" rx="5" ry="15" class="head"/>` : ""}</g>`;
    });
    const zones = Object.keys(ZONES).map((z, i) => {
      const r = [150, 262, 330][i];
      return `<ellipse class="zone z-${z}" cx="${CX}" cy="${CY}" rx="${r * 1.5}" ry="${r}"/>`;
    }).reverse().join("");
    const zoneLabels = `<text class="zl" x="${CX}" y="${CY - 150 + 20}" text-anchor="middle">${ZONES.nid.label}</text><text class="zl" x="${CX}" y="${CY - 262 + 20}" text-anchor="middle">${ZONES.camp.label}</text><text class="zl" x="${CX}" y="${CY - 322 + 22}" text-anchor="middle">${ZONES.dela.label}</text>`;
    const stones = list.map((r, i) => { const q = pos.get(r); return `<path class="stones" data-i="${i}" d="M${CX} ${CY + 10} Q${(CX + q.x) / 2} ${(CY + q.y) / 2 + 26} ${q.x.toFixed(1)} ${q.y.toFixed(1)}"/>`; }).join("");
    const pads = list.map((r, i) => {
      const q = pos.get(r), src = O.safeSrc(r.image), rot = ((O.hue(r.nom) * 7) % 360);
      return `<g class="pad" data-i="${i}" tabindex="0" role="button" aria-label="${esc(r.nom)}, ${esc(r.lien)}" transform="translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})"><g class="pad-in">
        <ellipse class="pshadow" cx="4" cy="12" rx="56" ry="24"/>
        <g class="lily" transform="rotate(${rot % 40 - 20})"><ellipse class="leaf" rx="54" ry="27"/><path class="notch" d="M0 0 L${54 * Math.cos((rot * Math.PI) / 180)} ${27 * Math.sin((rot * Math.PI) / 180)} L${54 * Math.cos(((rot + 14) * Math.PI) / 180)} ${27 * Math.sin(((rot + 14) * Math.PI) / 180)}Z"/><path class="vein" d="M-30 0 H30 M0 -15 V15"/></g>
        <clipPath id="mp${i}"><circle cy="-22" r="29"/></clipPath>
        ${src ? `<image href="${esc(src)}" x="-29" y="-51" width="58" height="58" clip-path="url(#mp${i})" preserveAspectRatio="xMidYMid slice"/>` : `<circle cy="-22" r="29" fill="hsl(${O.hue(r.nom)} 38% 58%)"/><text class="mono" y="-14" text-anchor="middle">${esc(O.initials(r.nom))}</text>`}
        <circle class="ph-ring" cy="-22" r="29"/>
        <g class="frogs">${[0, 1, 2].map((k) => `<g class="fr f${k + 1}" transform="translate(${-52 + k * 14} ${6 - k * 9})"><text class="e" style="--d:${k * 0.4}s">🐸</text></g>`).join("")}</g>
        <g class="squirrels">${[0, 1, 2].map((k) => `<g class="sq s${k + 1}" transform="translate(${34 + k * 12} ${-16 - k * 10})"><text class="e" style="--d:${k * 0.5}s">🐿️</text></g>`).join("")}</g>
        <text class="bison" x="22" y="-46">🦬</text><text class="star" x="-6" y="-62">✨</text>
        <text class="nm" y="46" text-anchor="middle">${esc(r.nom)}</text>
        <title>${esc(r.nom)} — ${esc(r.lien)}</title></g>
        <ellipse class="mist" rx="82" ry="56" cy="-10" fill="url(#mfog)"/></g>`;
    }).join("");

    host.innerHTML = `
    <div class="marais">
      <figure class="marais-scene">
        <span class="tape"></span>
        <svg id="msvg" viewBox="0 0 ${W} ${H}" role="group" aria-label="Le marais de ${esc(D.identite.nom)} : chaque nénuphar est une relation">
          <defs>
            <radialGradient id="mfog"><stop offset="0" stop-color="#f4f1e6" stop-opacity=".95"/><stop offset=".55" stop-color="#f4f1e6" stop-opacity=".6"/><stop offset="1" stop-color="#f4f1e6" stop-opacity="0"/></radialGradient>
            <radialGradient id="mwater" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="var(--w1)"/><stop offset="1" stop-color="var(--w3)"/></radialGradient>
          </defs>
          <rect width="${W}" height="${H}" fill="url(#mwater)"/>
          ${zones}${zoneLabels}${stones}
          <g class="drift d1"><ellipse cx="180" cy="130" rx="300" ry="70" fill="url(#mfog)"/></g><g class="drift d2"><ellipse cx="820" cy="470" rx="320" ry="80" fill="url(#mfog)"/></g>
          <g class="log"><ellipse cx="${CX}" cy="${CY + 22}" rx="78" ry="34" class="log-b"/><ellipse cx="${CX - 22}" cy="${CY + 14}" rx="18" ry="7" class="moss"/><ellipse cx="${CX + 30}" cy="${CY + 26}" rx="22" ry="8" class="moss"/></g>
          ${pads}
          <image id="mcat" href="assets/sprite-regard.png" width="64" height="67" x="-32" y="-64" transform="translate(${CX} ${CY + 18})"/>
          <text class="nm me-nm" x="${CX}" y="${CY + 66}" text-anchor="middle">${esc(D.identite.nom)}</text>
          ${reeds}
          <g id="splashg"><circle id="splash" r="16"/></g>
        </svg>
        <figcaption>Le marais de ${esc(D.identite.nom)} — touche un nénuphar !</figcaption>
      </figure>
      <aside class="marais-note" id="mnote" aria-live="polite"></aside>
    </div>
    ${maxM > 0 ? `<div class="moon-bar">
      <button type="button" class="btn small" id="mplay">▶ Rejouer sa vie</button>
      <div class="moon-track"><img class="moon-cat" id="mmoon" src="assets/sprite-marche.png" alt="" width="40" height="39"><input type="range" id="mrange" min="0" max="${maxM}" step="1" value="${maxM}" aria-label="Lune du marais"></div>
      <output id="mout" class="moon-out"></output>
    </div>` : ""}
    <div class="legend marais-legend"><span class="lg"><b class="h">🐸</b><em>grenouilles : elle aime (1 à 3)</em></span><span class="lg"><b class="h">🐿️</b><em>écureuils : elle n'aime pas (1 à 3)</em></span><span class="lg"><b class="h">🌫️</b><em>brume épaisse : pas d'avis tranché. Plus elle a un avis net, plus elle voit clair !</em></span><span class="lg"><b class="h">🦬</b><em>respect de bison</em></span><span class="lg"><b class="h">✨</b><em>aux étoiles</em></span></div>
    <p class="muted center">Au centre, son nid et sa famille. Plus loin, le camp de l'Ombre, puis ceux d'au-delà de la brume. Passe le curseur pour dissiper la brume.</p>`;

    /* ---------- vivant ---------- */
    const svg = host.querySelector("#msvg"), cat = host.querySelector("#mcat"), note = host.querySelector("#mnote");
    const padEls = [...svg.querySelectorAll(".pad")], stoneEls = [...svg.querySelectorAll(".stones")];
    const range = host.querySelector("#mrange"), out = host.querySelector("#mout"), moonCat = host.querySelector("#mmoon"), play = host.querySelector("#mplay");
    let moon = maxM, sel = -1, catPos = { x: CX, y: CY + 18 }, timer = 0;

    function update(m, animate) {
      moon = m;
      list.forEach((r, i) => {
        const st = stateAt(r, m), el = padEls[i];
        el.classList.toggle("met", st.met); el.classList.toggle("dead", !!st.dead);
        el.dataset.fr = st.met && !st.dead ? st.f : 0; el.dataset.sq = st.met && !st.dead ? st.s : 0; el.dataset.rs = st.met && st.rs && !st.dead ? 1 : 0;
        el.style.setProperty("--fog", st.met ? (st.dead ? 0.35 : st.fog) : 1);
        stoneEls[i].style.opacity = st.met ? (st.dead ? 0.18 : 0.75) : 0;
      });
      if (range) { range.value = m; const pct = maxM ? m / maxM : 1; if (moonCat) moonCat.style.left = `calc(${pct * 100}% - ${pct * 40}px)`; range.style.setProperty("--p", pct * 100 + "%"); }
      if (out) out.textContent = m === now ? `Lune ${m} · aujourd'hui` : `Lune ${m}`;
      renderNote();
    }

    function renderNote() {
      if (sel < 0) { note.innerHTML = `<span class="tape"></span><h3>Bienvenue dans la brume !</h3><p>Touche un nénuphar : <b>${esc(D.identite.nom)}</b> saute dessus pour te présenter ${list.length > 1 ? "l'un de ses " + list.length + " liens" : "son lien"}.</p>${maxM ? "<p class=\"muted\">Et fais glisser le curseur des lunes pour voir comment tout a changé…</p>" : ""}`; return; }
      const r = list[sel], st = stateAt(r, moon), src = O.safeSrc(r.image);
      const hops = phases(r).map((p) => `<li class="${(Number(p.age) || 0) <= moon ? "on" : ""}"><b>${esc(p.age)}</b>${esc(L.appr(p.appreciation).glyph)}${L.resp(p) ? O.BISON : ""}</li>`).join("");
      note.innerHTML = `<span class="tape"></span>
        <div class="mn-head">${L.avatar(r, "md")}<div><h3>${esc(r.nom)}</h3><p class="muted">${esc(r.lien)}${r.groupe ? " · " + esc(r.groupe) : ""}</p><div class="chips"><span class="tag ${r.type === "PJ" ? "pj" : ""}">${esc(r.type || "PNJ")}</span>${st.dead ? '<span class="tag dead">✨ aux étoiles</span>' : '<span class="tag alive">● vivant·e</span>'}</div></div></div>
        ${st.met ? `<p class="mn-avis"><span>À la lune ${moon}</span>${L.badge(st.p.appreciation, st.rs)} <em>${esc(L.appr(st.p.appreciation).label)}${st.rs ? " · respect de bison" : ""}</em></p>${st.cur.description ? `<p class="mn-txt">${fmt(st.cur.description)}</p>` : ""}` : `<p class="mn-txt">Petit Bison ne le·la connaît pas encore à la lune ${moon}… <em>(son nénuphar est encore caché dans la brume)</em></p>`}
        ${hops ? `<ol class="hops" aria-label="Ses avis au fil des lunes">${hops}</ol>` : ""}
        <a class="btn small primary" href="${L.href(r)}">Ouvrir sa fiche →</a>`;
    }

    /* ---------- le saut de nénuphar en nénuphar ---------- */
    function hop(to, done) {
      const from = { ...catPos }, dur = reduce ? 1 : 650 + Math.hypot(to.x - from.x, to.y - from.y) * 0.6, t0 = performance.now();
      cancelAnimationFrame(hop.raf);
      (function step(t) {
        const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const x = from.x + (to.x - from.x) * e, y = from.y + (to.y - from.y) * e - Math.sin(k * Math.PI) * 74;
        const sq = 1 + Math.sin(k * Math.PI) * 0.12;
        cat.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(2 - sq).toFixed(3)} ${sq.toFixed(3)})`);
        if (k < 1) hop.raf = requestAnimationFrame(step); else { catPos = { ...to }; cat.setAttribute("transform", `translate(${to.x} ${to.y})`); done && done(); }
      })(t0);
    }
    function splash(x, y) {
      svg.querySelector("#splashg").setAttribute("transform", `translate(${x} ${y + 14})`);
      const s = svg.querySelector("#splash"); s.classList.remove("go"); void s.getBoundingClientRect(); s.classList.add("go");
    }
    function select(i) {
      sel = i; padEls.forEach((p, k) => p.classList.toggle("sel", k === i));
      const q = pos.get(list[i]);
      hop({ x: q.x, y: q.y - 6 }, () => { splash(q.x, q.y); });
      renderNote();
    }
    padEls.forEach((el, i) => {
      el.addEventListener("click", () => select(i));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); } });
    });
    cat.addEventListener("click", () => { sel = -1; padEls.forEach((p) => p.classList.remove("sel")); hop({ x: CX, y: CY + 18 }); renderNote(); });

    /* ---------- la brume se dissipe sous le curseur ---------- */
    let raf = 0, mx = 0, my = 0;
    svg.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (raf || reduce) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const m = svg.getScreenCTM(); if (!m) return;
        const inv = m.inverse(), pt = new DOMPoint(mx, my).matrixTransform(inv);
        padEls.forEach((el, i) => { const q = pos.get(list[i]); el.style.setProperty("--rv", clamp(1 - Math.hypot(pt.x - q.x, pt.y - q.y) / 170, 0, 1).toFixed(2)); });
      });
    }, { passive: true });
    svg.addEventListener("pointerleave", () => padEls.forEach((el) => el.style.setProperty("--rv", 0)));

    /* ---------- remonter le temps ---------- */
    if (range) {
      range.addEventListener("input", () => { clearInterval(timer); play.textContent = "▶ Rejouer sa vie"; update(Number(range.value)); });
      play.addEventListener("click", () => {
        if (timer) { clearInterval(timer); timer = 0; play.textContent = "▶ Rejouer sa vie"; return; }
        let m = 0; update(0); play.textContent = "❚❚ Pause";
        timer = setInterval(() => { m++; if (m > maxM) { clearInterval(timer); timer = 0; play.textContent = "▶ Rejouer sa vie"; return; } update(m); }, 1100);
      });
    }
    update(maxM);
    host._marais = { stop() { clearInterval(timer); cancelAnimationFrame(hop.raf); } };
  }
  return { mount };
})();
