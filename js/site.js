(function () {
  const C = window.SITE_CONFIG, O = window.Outils, L = window.Liens, R = window.Recits;
  const { esc, fmt, safeSrc, norm } = O;
  const $ = (s, r = document) => r.querySelector(s);
  const app = $("#app");
  const CACHE = "pb-content-v2";
  const isArr = Array.isArray;
  let D = null;

  /* ---------- données : cache instantané + rafraîchissement en arrière-plan ---------- */
  function merge(saved) {
    const base = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
    saved = O.migrate(saved);
    if (saved && typeof saved === "object") {
      for (const k of Object.keys(saved)) {
        if (isArr(base[k]) !== isArr(saved[k])) continue;
        base[k] = isArr(saved[k]) || typeof saved[k] !== "object" ? saved[k] : Object.assign(base[k] || {}, saved[k]);
      }
    }
    return base;
  }
  const cached = () => { try { return JSON.parse(localStorage.getItem(CACHE)); } catch (e) { return null; } };
  async function fetchRemote() {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch(`${C.SUPABASE_URL}/rest/v1/${C.TABLE}?id=eq.${encodeURIComponent(C.CONTENT_ID)}&select=data`, { headers: { apikey: C.SUPABASE_KEY }, signal: ctl.signal });
      if (!r.ok) return null;
      const rows = await r.json();
      return rows[0] && rows[0].data ? rows[0].data : null;
    } catch (e) { return null; } finally { clearTimeout(to); }
  }

  /* ---------- éléments communs ---------- */
  const has = (v) => (isArr(v) ? v.length > 0 : !!v);
  const quote = (q) => (q ? `<blockquote class="rv">“${fmt(q)}”</blockquote>` : "");
  const paras = (arr) => (arr || []).filter(Boolean).map((p, i) => `<p class="rv" style="--i:${i}">${fmt(p)}</p>`).join("");
  const subh = (t) => `<h2 class="sub-h rv">${esc(t)}</h2>`;
  const empty = (t) => `<p class="empty rv">${esc(t)}</p>`;
  // Texte long : la première phrase devient un chapô, le reste se déplie.
  const split = (t) => { const m = String(t || "").match(/^(.{20,260}?[.!?…])(\s+)([\s\S]+)$/); return m && t.length > 260 ? [m[1], m[3]] : [t, ""]; };
  const words = (t) => String(t || "").split(/\s+/).filter(Boolean).length;
  const ICO = { good: "🌿", flaw: "🔥" };
  const cards = (items, cls = "", ico = "") =>
    `<div class="grid ${cls}">${(items || []).map((i, n) => { const [a, b] = split(i.texte); return `<article class="card tilt rv" style="--i:${n % 6}">${ico || ICO[cls] ? `<span class="card-ico" aria-hidden="true">${ico || ICO[cls]}</span>` : ""}<h3>${esc(i.titre)}</h3><p class="chapo">${fmt(a)}</p>${b ? `<details><summary><span class="more-t">Lire la suite</span><span class="less-t">Replier</span></summary><p>${fmt(b)}</p></details>` : ""}</article>`; }).join("")}</div>`;
  const readTime = (arr) => { const w = arr.reduce((a, x) => a + words(typeof x === "string" ? x : x.texte), 0); return w > 150 ? `<p class="read rv">≈ ${Math.max(1, Math.round(w / 200))} min de lecture</p>` : ""; };
  L.head = (kicker, h, sub = "") =>
    `<header class="page-head"><span class="kicker rv">${esc(kicker)}</span><h1 class="rv" style="--i:1">${esc(h)}</h1>${sub ? `<p class="lead rv" style="--i:2">${esc(sub)}</p>` : ""}</header>`;
  L.subTabs = () => "";
  R.head = L.head;

  /* ---------- navigation ---------- */
  const SUBS_ELLE = [["apercu", "Aperçu"], ["caractere", "Caractère"], ["gouts", "Goûts & habitudes"], ["physique", "Physique"], ["sante", "Carnet de santé"], ["histoire", "Histoire"], ["convictions", "Convictions"]];
  const SUBS_ENT = [["famille", "Famille"], ["relations", "Relations"]];
  const NAV = [
    { id: "", label: "Accueil", href: "#/" },
    { id: "elle", label: "Elle", href: "#/elle/apercu", subs: SUBS_ELLE },
    { id: "entourage", label: "Entourage", href: "#/entourage/famille", subs: SUBS_ENT },
    { id: "fils", label: "Fils RP", href: "#/fils" },
    { id: "galerie", label: "Galerie", href: "#/galerie" },
  ];
  function buildNav() {
    $("#menu").innerHTML = NAV.map((n) => `<a href="${n.href}" data-r="${n.id}">${n.label}</a>`).join("");
    $("#volet-nav").innerHTML = NAV.map((n) => `<div class="v-sec"><a class="v-main" href="${n.href}">${n.label}</a>${(n.subs || []).map((s) => `<a href="#/${n.id}/${s[0]}">${s[1]}</a>`).join("")}</div>`).join("");
  }
  function markNav(r, sub) {
    document.querySelectorAll("#menu a").forEach((a) => a.classList.toggle("on", a.dataset.r === r));
    const sec = NAV.find((n) => n.id === r), bar = $("#sous");
    if (sec && sec.subs) {
      bar.innerHTML = sec.subs.map((s) => `<a href="#/${r}/${s[0]}" class="${s[0] === sub ? "on" : ""}">${s[1]}</a>`).join("");
      bar.hidden = false;
    } else bar.hidden = true;
    document.body.classList.toggle("has-sub", !bar.hidden);
  }

  /* ---------- accueil ---------- */
  function pageHome() {
    const i = D.identite, R = D.reglages || {};
    let n0 = 0;
    const letters = i.nom.split(" ").map((w) => `<span class="w">${[...w].map((c) => `<span class="ch" style="--n:${n0++}">${esc(c)}</span>`).join("")}</span>`).join('<span class="sp"> </span>');
    const traits = [...(D.caractere.qualites || []), ...(D.caractere.defauts || [])].map((t) => t.titre);
    const marquee = [...traits, ...traits].map((t) => `<span>${esc(t)}</span><i></i>`).join("");
    const people = L.all();
    const nFils = (D.fils || []).length;
    const portals = [
      ["#/elle/apercu", "Elle", "Caractère, goûts, physique, histoire et convictions de la petite tornade de l'Ombre.", "🌿", `${SUBS_ELLE.length} rubriques`],
      ["#/entourage/famille", "Entourage", "Sa famille et ses relations : photos, avis datés, tableau et constellation.", "🐸", `${people.length} liens`],
      ["#/fils", "Fils RP", "Toutes ses scènes, avec le lien direct vers le fil Discord.", "💬", `${nFils} fil${nFils > 1 ? "s" : ""}`],
      ["#/galerie", "Galerie", "Illustrations et pixel-art de Petit Bison.", "🖼️", `${D.galerie.length} images`],
    ];
    const q = D.caractere.qualites || [], d = D.caractere.defauts || [];
    const fils = (D.fils || []).slice(0, 3);
    return `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-text">
          <span class="kicker rv">Clan de l'Ombre · ${esc(i.rang)} · ${esc(i.lunes)}</span>
          <h1 class="big" aria-label="${esc(i.nom)}">${letters}</h1>
          <p class="sub rv" style="--i:3">${esc(i.sous_titre)}</p>
          ${quote(i.citation)}
          <div class="cta rv" style="--i:4">
            <a class="btn primary" href="#/elle/apercu">Découvrir Petit Bison</a>
            <a class="btn ghost" href="#/entourage/famille">Son entourage</a>
          </div>
          <div class="stats">
            <div class="stat"><span>PV</span><div class="bar"><i style="--w:${Math.min(100, Number(i.pv))}%"></i></div><b data-count="${Number(i.pv) || 0}">0</b></div>
            <div class="stat pa"><span>PA</span><div class="bar"><i style="--w:${Math.min(100, Number(i.pa) * 10)}%"></i></div><b data-count="${Number(i.pa) || 0}">0</b></div>
          </div>
        </div>
        <figure class="portrait">
          <div class="aura"></div><div class="blob"></div>
          <div class="cat"><img src="${esc(safeSrc(i.image) || "assets/bison-saute.webp")}" alt="${esc(i.nom)}, chaton écaille de tortue aux yeux vert prairie" width="900" height="597" fetchpriority="high"></div>
          <span class="sticker"><b data-count="${parseInt(i.lunes) || 0}">0</b>lunes</span>
          <span class="spot s1"></span><span class="spot s2"></span><span class="spot s3"></span>
        </figure>
      </div>
      <a class="scroll-hint" href="#portals" onclick="document.getElementById('portals').scrollIntoView({behavior:'smooth'});return false">défiler ↓</a>
    </section>

    <div class="marquee" aria-hidden="true"><div class="track">${marquee}</div></div>

    <section class="wrap glance">
      <div class="gl rv"><b data-count="${parseInt(i.lunes) || 0}">0</b><span>lunes</span></div>
      <div class="gl rv" style="--i:1"><b data-count="${(D.famille || []).length}">0</b><span>en famille</span></div>
      <div class="gl rv" style="--i:2"><b data-count="${(D.relations || []).length}">0</b><span>relations</span></div>
      <div class="gl rv" style="--i:3"><b data-count="${nFils}">0</b><span>fils RP</span></div>
    </section>

    <section class="wrap traits">
      <div class="rv"><span class="kicker">Petit Bison, c'est…</span><h2 class="h-big">Un cœur, des pattes, <em>des défauts</em></h2></div>
      <div class="trait-box rv">
        <div class="trait-cols">
          <div><h3>Ses qualités</h3><div class="chips" id="tq">${q.map((t, n) => `<button type="button" class="chip good" data-t="q${n}">${esc(t.titre)}</button>`).join("")}</div></div>
          <div><h3>Ses défauts</h3><div class="chips" id="td">${d.map((t, n) => `<button type="button" class="chip flaw" data-t="d${n}">${esc(t.titre)}</button>`).join("")}</div></div>
        </div>
        <div class="trait-panel" id="trait-panel" aria-live="polite"><p class="muted">Touche un trait pour lire ce qu'il dit d'elle.</p></div>
      </div>
    </section>

    <section id="portals" class="wrap portals">
      ${portals.map((p, n) => `<a class="portal tilt rv" style="--i:${n}" href="${p[0]}"><span class="p-ico">${p[3]}</span><h2>${p[1]}</h2><p>${p[2]}</p><em>${p[4]}</em><span class="arrow">→</span></a>`).join("")}
    </section>

    <section class="wrap manifesto">
      ${safeSrc(i.image2) ? `<img class="rv sit" src="${esc(safeSrc(i.image2))}" alt="${esc(i.nom)} assise, la queue en panache" loading="lazy" decoding="async" width="900" height="566">` : ""}
      <div class="rv"><span class="kicker">${esc(R.accroche_accueil || "En quelques mots")}</span>
      <p class="big-quote">${fmt((D.caractere.description || [""])[0])}</p><a class="btn ghost" href="#/elle/caractere">Lire son caractère</a></div>
    </section>

    ${people.length || fils.length ? `<section class="wrap home-duo">
      ${people.length ? `<div><span class="kicker rv">Son entourage</span><div class="faces rv">${people.slice(0, 8).map((r) => `<a href="${L.href(r)}" title="${esc(r.nom)} — ${esc(r.lien)}">${L.avatar(r, "md")}</a>`).join("")}</div><a class="more rv" href="#/entourage/famille">Voir toute la famille et les relations →</a></div>` : ""}
      ${fils.length ? `<div><span class="kicker rv">Derniers fils RP</span><ul class="mini-fils rv">${fils.map((f) => `<li><span class="status ${/^en cours/i.test(f.statut || "") ? "live" : ""}">${esc(f.statut || "")}</span> ${O.safeLink(f.lien) ? `<a href="${esc(f.lien)}" target="_blank" rel="noopener noreferrer">${esc(f.titre)} ↗</a>` : esc(f.titre)}</li>`).join("")}</ul><a class="more rv" href="#/fils">Tous les fils →</a></div>` : ""}
    </section>` : ""}`;
  }

  /* ---------- elle ---------- */
  function pagePerso(sub) {
    sub = SUBS_ELLE.some((s) => s[0] === sub) ? sub : "apercu";
    const i = D.identite;
    if (sub === "sante") return R.pageSante();
    if (sub === "histoire") return R.pageHistoire();
    let body = "";
    if (sub === "apercu") {
      const facts = [["Lunes", i.lunes], ["Clan", i.clan], ["Rang", i.rang], ["Sexe", i.sexe + (i.note_sexe ? " · " + i.note_sexe : "")], ["Orientation", i.orientation], ["Taille", i.taille], ["Poids", i.poids], ["Joueur·se", i.pseudo_joueur]].filter((f) => f[1]);
      body = `<dl class="facts">${facts.map((f, n) => `<div class="tilt rv" style="--i:${n}"><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("")}</dl>
        ${subh("Nomenclature")}
        <ol class="names">${(D.noms || []).map((n, k) => `<li class="tilt rv" style="--i:${k}"><span class="step">${esc(n.etape)}</span><strong>${esc(n.nom)}</strong>${n.texte ? `<p>${fmt(n.texte)}</p>` : ""}</li>`).join("")}</ol>`;
    } else if (sub === "caractere") {
      const c = D.caractere;
      body = `${readTime(c.description)}<div class="prose">${paras(c.description)}</div>${subh("Qualités")}${cards(c.qualites, "good")}${subh("Défauts")}${cards(c.defauts, "flaw")}`;
    } else if (sub === "gouts") {
      const g = D.gouts;
      body = `${subh("Ce qu'elle aime")}${cards(g.aime, "good", "🐸")}${subh("Ce qu'elle déteste")}${cards(g.deteste, "flaw", "🐿️")}${subh("Ses peurs")}${cards(g.peurs, "", "🌫️")}${subh("Ses habitudes")}${cards(g.habitudes, "good", "🐾")}`;
    } else if (sub === "physique") {
      const p = D.physique, h = p.handicap || {}, a = p.accessoires || {};
      body = `${readTime(p.description)}<div class="prose">${paras(p.description)}</div>${subh("Points forts")}${cards(p.forts, "good")}${subh("Points faibles")}${cards(p.faibles, "flaw")}
        ${has(h.points) || h.intro ? subh("Handicap") + quote(h.citation) + (h.intro ? `<p class="rv">${fmt(h.intro)}</p>` : "") + `<ul class="list">${(h.points || []).map((x) => `<li class="rv">${fmt(x)}</li>`).join("")}</ul>` : ""}
        ${has(a.points) ? subh("Accessoires") + quote(a.citation) + cards(a.points) : ""}
        ${has(p.cicatrices) ? subh("Cicatrices") + `<div class="prose">${paras(p.cicatrices)}</div>` : ""}`;
    } else {
      const v = D.convictions, cl = v.clan || {}, ac = v.autres_clans || {}, et = v.etoiles || {};
      body = `${subh("Relation au clan")}${quote(cl.citation)}<div class="prose">${paras(cl.paragraphes)}</div>
        ${subh("Avis sur les autres clans")}<p class="rv prose">${fmt(ac.intro)}</p>${cards((ac.clans || []).map((x) => ({ titre: x.nom, texte: x.texte })))}
        ${subh("Croyance — Clan des Étoiles")}${quote(et.citation)}<div class="prose">${paras(et.paragraphes)}</div>`;
    }
    return `<section class="wrap page">${L.head("Elle", SUBS_ELLE.find((s) => s[0] === sub)[1], sub === "apercu" ? i.sous_titre : "")}${body}</section>`;
  }

  /* ---------- galerie + visionneuse ---------- */
  const galS = { c: "" };
  function pageGalerie() {
    const g = D.galerie.filter((x) => safeSrc(x.image));
    const cats = [...new Set(g.map((x) => x.categorie).filter(Boolean))];
    const list = g.filter((x) => !galS.c || x.categorie === galS.c);
    return `<section class="wrap page">${L.head("Illustrations", "Galerie", "Petit Bison en images.")}
      ${cats.length > 1 ? `<nav class="vues rv">${[["", "Tout"], ...cats.map((c) => [c, c])].map((t) => `<a href="#/galerie" data-c="${esc(t[0])}" class="${galS.c === t[0] ? "on" : ""}">${esc(t[1])}</a>`).join("")}</nav>` : ""}
      ${list.length ? `<div class="masonry">${list.map((x, k) => `<figure class="shot tilt rv" style="--i:${k % 6}" data-k="${k}"><img src="${esc(safeSrc(x.image))}" alt="${esc(x.titre)}" loading="lazy" decoding="async"><figcaption>${esc(x.titre)}</figcaption></figure>`).join("")}</div>` : empty("La galerie est vide pour le moment.")}</section>`;
  }
  let lbIndex = 0, lbList = [];
  function lb(k) {
    const b = $("#lightbox"); lbIndex = (k + lbList.length) % lbList.length;
    const x = lbList[lbIndex];
    $("img", b).src = safeSrc(x.image); $("img", b).alt = x.titre;
    $("figcaption", b).textContent = [x.titre, x.description].filter(Boolean).join(" — ");
    b.classList.toggle("single", lbList.length < 2);
    b.hidden = false; document.body.classList.add("noscroll");
  }
  const lbClose = () => { $("#lightbox").hidden = true; document.body.classList.remove("noscroll"); };
  $("#lightbox").addEventListener("click", (e) => {
    if (e.target.matches(".lb-close") || e.target.id === "lightbox") lbClose();
    if (e.target.matches(".prev")) lb(lbIndex - 1);
    if (e.target.matches(".next")) lb(lbIndex + 1);
  });
  addEventListener("keydown", (e) => {
    if ($("#lightbox").hidden) return;
    if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lb(lbIndex - 1); if (e.key === "ArrowRight") lb(lbIndex + 1);
  });

  /* ---------- recherche ( / ou Ctrl+K ) ---------- */
  const dlg = $("#search"), sq = $("#search-q"), sl = $("#search-list");
  let sIndex = [], sSel = 0;
  function buildIndex() {
    const t = [];
    SUBS_ELLE.forEach((s) => t.push({ t: s[1], k: "Elle", h: `#/elle/${s[0]}` }));
    SUBS_ENT.forEach((s) => t.push({ t: s[1], k: "Entourage", h: `#/entourage/${s[0]}` }));
    t.push({ t: "Fils RP", k: "Page", h: "#/fils" }, { t: "Galerie", k: "Page", h: "#/galerie" });
    const addT = (arr, sub, k) => (arr || []).forEach((x) => x.titre && t.push({ t: x.titre, k, h: `#/elle/${sub}` }));
    addT(D.caractere.qualites, "caractere", "Qualité"); addT(D.caractere.defauts, "caractere", "Défaut");
    ["aime", "deteste", "peurs", "habitudes"].forEach((g) => addT(D.gouts[g], "gouts", "Goûts"));
    t.push({ t: "Carnet de santé", k: "Elle", h: "#/elle/sante" });
    (D.sante || []).forEach((e) => e.titre && t.push({ t: e.titre, k: "Santé", h: "#/elle/sante" }));
    (D.histoire || []).forEach((c) => c.titre && t.push({ t: c.titre, k: "Histoire · " + (c.lune_debut ?? ""), h: "#/elle/histoire" }));
    addT(D.physique.forts, "physique", "Point fort"); addT(D.physique.faibles, "physique", "Point faible");
    (D.famille || []).forEach((r) => t.push({ t: r.nom, k: "Famille · " + r.lien, h: L.href(r) }));
    (D.relations || []).forEach((r) => t.push({ t: r.nom, k: "Relation · " + r.lien, h: L.href(r) }));
    (D.fils || []).forEach((f) => t.push({ t: f.titre, k: "Fil RP", h: "#/fils" }));
    (D.galerie || []).forEach((g) => t.push({ t: g.titre, k: "Galerie", h: "#/galerie" }));
    sIndex = t.map((x) => Object.assign(x, { n: norm(x.t + " " + x.k) }));
  }
  function showSearch() {
    const q = norm(sq.value.trim());
    const res = (q ? sIndex.filter((x) => q.split(/\s+/).every((w) => x.n.includes(w))) : sIndex.slice(0, 8)).slice(0, 12);
    sSel = 0;
    sl.innerHTML = res.length ? res.map((x, n) => `<li role="option" class="${n ? "" : "on"}"><a href="${x.h}"><strong>${esc(x.t)}</strong><span>${esc(x.k)}</span></a></li>`).join("") : '<li class="none">Rien ne correspond…</li>';
  }
  function openSearch() { if (!D) return; buildIndex(); sq.value = ""; showSearch(); dlg.showModal(); sq.focus(); }
  $("#search-btn").addEventListener("click", openSearch);
  sq.addEventListener("input", showSearch);
  sl.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  sq.addEventListener("keydown", (e) => {
    const items = [...sl.querySelectorAll("li:not(.none)")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (!items.length) return;
      sSel = (sSel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((li, n) => li.classList.toggle("on", n === sSel)); items[sSel].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && items[sSel]) { location.hash = items[sSel].querySelector("a").getAttribute("href"); dlg.close(); }
  });
  addEventListener("keydown", (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName);
    if ((e.key === "/" && !typing && !dlg.open) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); openSearch(); }
  });

  /* ---------- routeur ---------- */
  let first = true, token = 0;
  async function route(silent) {
    if (!D) return;
    let parts = (location.hash.replace(/^#\/?/, "") || "").split("/").map(decodeURIComponent);
    if (parts[0] === "personnage") parts[0] = "elle";
    if (parts[0] === "relations") parts = ["entourage", "relations", parts[1] || ""];
    const [r = "", a = "", b = ""] = parts;
    let html, after = () => {}, sub = a;
    if (r === "elle") {
      html = pagePerso(a); sub = SUBS_ELLE.some((s) => s[0] === a) ? a : "apercu";
    } else if (r === "entourage") {
      if (a === "relations") { const v = L.pageRelations(b); html = v.html; after = () => L.bind(v.vue); }
      else if (a === "chat") { html = L.pageFiche(b); sub = (L.all().find((x) => O.slug(x.nom) === b) || {})._fam ? "famille" : "relations"; }
      else { html = L.pageFamille(); sub = "famille"; after = () => L.bind(); }
    } else if (r === "fils") { html = L.pageFils(); after = () => L.bind(); }
    else if (r === "galerie") { html = pageGalerie(); after = () => { const gl = D.galerie.filter((x) => safeSrc(x.image)).filter((x) => !galS.c || x.categorie === galS.c); lbList = gl; document.querySelectorAll(".shot").forEach((s) => s.addEventListener("click", () => lb(Number(s.dataset.k)))); }; }
    else if (r === "" || r === "accueil") { html = pageHome(); after = bindHome; }
    else { html = pageHome(); after = bindHome; }

    const my = ++token;
    if (!first && !silent) { app.classList.add("leave"); await new Promise((res) => setTimeout(res, 180)); if (my !== token) return; }
    first = false;
    const y = scrollY;
    app.innerHTML = html; app.classList.remove("leave");
    if (!silent) app.classList.add("enter");
    document.body.dataset.page = r || "home";
    document.body.classList.remove("menu-open"); $("#burger").setAttribute("aria-expanded", "false");
    markNav(r === "accueil" ? "" : r, sub); silent ? scrollTo(0, y) : scrollTo(0, 0); after(); buildToc(); FX.observe(app);
    if (!silent) setTimeout(() => app.classList.remove("enter"), 700);
    const names = { elle: "Elle", entourage: "Entourage", fils: "Fils RP", galerie: "Galerie" };
    document.title = (names[r] ? names[r] + " — " : "") + D.identite.nom;
  }

  // « Sur cette page » : puces vers les intertitres des pages longues
  function buildToc() {
    const hs = [...app.querySelectorAll(".sub-h")], head = app.querySelector(".page-head");
    if (hs.length < 3 || !head) return;
    hs.forEach((h, i) => (h.id = "s-" + i));
    const nav = document.createElement("nav"); nav.className = "toc rv"; nav.setAttribute("aria-label", "Sur cette page");
    nav.innerHTML = "<span>Sur cette page</span>" + hs.map((h, i) => `<a href="${esc(location.hash || "#/")}" data-go="s-${i}">${esc(h.textContent)}</a>`).join("");
    head.after(nav);
  }

  function bindHome() {
    const panel = $("#trait-panel"); if (!panel) return;
    const items = { q: D.caractere.qualites || [], d: D.caractere.defauts || [] };
    document.querySelectorAll(".chip[data-t]").forEach((c) => c.addEventListener("click", () => {
      document.querySelectorAll(".chip.on").forEach((x) => x.classList.remove("on")); c.classList.add("on");
      const it = items[c.dataset.t[0]][Number(c.dataset.t.slice(1))];
      panel.innerHTML = `<h3>${esc(it.titre)}</h3><p>${fmt(it.texte)}</p>`;
      panel.classList.remove("pop"); void panel.offsetWidth; panel.classList.add("pop");
    }));
  }

  /* ---------- clics globaux ---------- */
  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (z) { lbList = [{ image: z.dataset.zoom, titre: z.dataset.cap || "", description: "" }]; lb(0); return; }
    const row = e.target.closest("tr[data-href]");
    if (row && !e.target.closest("a")) { location.hash = row.dataset.href; return; }
    const fs = e.target.closest("[data-s]");
    if (fs) { e.preventDefault(); L.filState.s = fs.dataset.s; route(true); return; }
    const go = e.target.closest("[data-go]");
    if (go) { e.preventDefault(); const t = document.getElementById(go.dataset.go); if (t) { t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash"); } return; }
    const hc = e.target.closest("[data-care]");
    if (hc) { e.preventDefault(); R.filter.t = hc.dataset.care; route(true); return; }
    const gc = e.target.closest("[data-c]");
    if (gc) { e.preventDefault(); galS.c = gc.dataset.c; route(true); }
  });

  /* ---------- interface ---------- */
  $("#burger").addEventListener("click", () => {
    const o = document.body.classList.toggle("menu-open"); $("#burger").setAttribute("aria-expanded", o);
  });
  const themeBtn = $("#theme");
  const setTheme = (t) => { document.documentElement.dataset.theme = t; themeBtn.textContent = t === "night" ? "☀" : "☾"; try { localStorage.setItem("pb-theme", t); } catch (e) {} };
  setTheme(document.documentElement.dataset.theme === "night" ? "night" : "day");
  themeBtn.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "night" ? "day" : "night"));
  // taille du texte (A / A+ / A++)
  const FS = [1, 1.12, 1.25]; let fi = 0;
  try { fi = Math.min(2, Number(localStorage.getItem("pb-fs")) || 0); } catch (e) {}
  const setFs = () => { document.documentElement.style.setProperty("--fs", FS[fi]); $("#fontsize").textContent = ["Aa", "Aa+", "Aa++"][fi]; try { localStorage.setItem("pb-fs", fi); } catch (e) {} };
  $("#fontsize").addEventListener("click", () => { fi = (fi + 1) % 3; setFs(); }); setFs();
  addEventListener("scroll", () => $("#nav").classList.toggle("stuck", scrollY > 20), { passive: true });
  addEventListener("hashchange", () => route());

  function apply(d) {
    D = d; L.D = d; R.D = d;
    const RG = D.reglages || {};
    $("#credits").textContent = D.identite.credits || "";
    $("#foot-text").textContent = RG.texte_pied || "Personnage créé par";
    document.querySelectorAll(".brand-name").forEach((b) => (b.textContent = D.identite.nom));
    FX.mascot({ marche: safeSrc(RG.sprite_marche), assis: safeSrc(RG.sprite_assis), regard: safeSrc(RG.sprite_regard) }, RG.mascotte !== "non" && RG.mascotte !== false);
  }
  buildNav();
  const c0 = cached();
  apply(merge(c0)); route();
  fetchRemote().then((remote) => {
    if (!remote) return;
    const same = c0 && JSON.stringify(c0) === JSON.stringify(remote);
    try { localStorage.setItem(CACHE, JSON.stringify(remote)); } catch (e) {}
    if (!same) { apply(merge(remote)); route(true); }
  });
})();
