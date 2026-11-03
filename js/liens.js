// Entourage : famille, relations (le Marais et les polaroïds), fiche détaillée et fils RP.
window.Liens = (function () {
  const O = window.Outils, esc = O.esc, fmt = O.fmt;
  const L = { D: null };
  const isArr = Array.isArray;

  /* ---------- appréciations ---------- */
  const APP = O.APP;
  const appr = (k) => (k === "respect" ? APP.neutre : APP[k] || APP.neutre);
  const resp = (p) => !!p && (p.respect === "oui" || p.appreciation === "respect");
  const badge = (k, rs) => `<span class="appr appr-${appr(k).g}" title="${esc(appr(k).label)}${rs ? " · respect de bison" : ""}"><b class="h">${appr(k).glyph}</b>${rs ? `<b class="h s" title="Respect de bison">${O.BISON}</b>` : ""}</span>`;
  const badgeP = (p) => badge(p.appreciation, resp(p));
  const phasesOf = (r) => [...(r.phases || [])].sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0));
  const latest = (r) => { const p = phasesOf(r); return p[p.length - 1] || { age: "", appreciation: "neutre", description: "" }; };
  const dead = (r) => r.vivant === "non" || latest(r).appreciation === "mort";
  const num = (k) => (appr(k).n === null ? 0 : appr(k).n);
  function trend(r) {
    const p = phasesOf(r).filter((x) => appr(x.appreciation).n !== null);
    if (p.length < 2) return { sym: "—", cls: "flat", d: 0, txt: "Stable" };
    const d = appr(p[p.length - 1].appreciation).n - appr(p[p.length - 2].appreciation).n;
    return d > 0 ? { sym: "▲", cls: "up", d, txt: "S'améliore" } : d < 0 ? { sym: "▼", cls: "down", d, txt: "Se dégrade" } : { sym: "＝", cls: "flat", d, txt: "Stable" };
  }
  const all = () => (L.D.famille || []).map((r) => Object.assign({}, r, { _fam: true })).concat(L.D.relations || []);
  const href = (r) => `#/entourage/chat/${O.slug(r.nom)}`;
  const nowMoon = () => parseInt(L.D.identite.lunes) || 0;
  const rcolor = (r) => `hsl(${O.hue(r.nom)} 52% 46%)`;

  /* ---------- photos ---------- */
  function avatar(r, cls = "") {
    const src = O.safeSrc(r.image);
    const d = dead(r) ? " dead" : "";
    return src
      ? `<span class="avatar ${cls}${d}"><img src="${esc(src)}" alt="${esc(r.nom)}" loading="lazy" decoding="async"></span>`
      : `<span class="avatar mono ${cls}${d}" style="--hue:${O.hue(r.nom)}">${esc(O.initials(r.nom))}</span>`;
  }
  const typeTag = (r) => `<span class="tag ${r.type === "PJ" ? "pj" : ""}">${esc(r.type || "PNJ")}</span>`;
  const lifeTag = (r) => (dead(r) ? '<span class="tag dead">🕊 Décédé·e</span>' : '<span class="tag alive">● Vivant·e</span>');

  /* ---------- filtres ---------- */
  const S = { q: "", groupe: "", type: "", vivant: "", grp: "", sort: "nom", dir: 1 };
  L.state = S;
  function filtered(list) {
    const q = O.norm(S.q.trim());
    return list.filter((r) => {
      if (S.groupe && r.groupe !== S.groupe) return false;
      if (S.type && (r.type || "PNJ") !== S.type) return false;
      if (S.vivant && (S.vivant === "non") !== dead(r)) return false;
      if (S.grp === "respect" ? !resp(latest(r)) : S.grp && appr(latest(r).appreciation).g !== S.grp) return false;
      return !q || O.norm([r.nom, r.lien, r.groupe, r.rang, r.joueur].join(" ")).includes(q);
    });
  }
  function filterBar(list) {
    const groups = [...new Set(list.map((r) => r.groupe).filter(Boolean))];
    const sel = (id, opts, cur, all) => `<select id="${id}" aria-label="${all}"><option value="">${all}</option>${opts.map((o) => `<option value="${esc(o[0])}" ${o[0] === cur ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select>`;
    return `<div class="filters rv">
      <input id="rq" type="search" placeholder="Rechercher un nom, un clan, un rang…" value="${esc(S.q)}">
      ${sel("rc", groups.map((c) => [c, c]), S.groupe, "Tous clans / groupes")}
      ${sel("rt", [["PNJ", "PNJ"], ["PJ", "PJ (joueur·se)"]], S.type, "PNJ & PJ")}
      ${sel("rv", [["oui", "Vivant·e·s"], ["non", "Décédé·e·s"]], S.vivant, "Vivant·e ou non")}
      ${sel("rg", [["pos", "🐸 Apprécié·e·s"], ["neg", "🐿️ Aversion"], ["neutre", "🌫️ Dans la brume"], ["respect", "🦬 Respect de bison"]], S.grp, "Tous les avis")}
    </div>`;
  }
  const legend = () => `<div class="legend rv">${[["pos3", "Apprécié·e (1 à 3 grenouilles)"], ["neg3", "Aversion (1 à 3 écureuils)"], ["neutre", "Dans la brume : pas d'avis tranché"]].map((l) => `<span class="lg"><b class="h">${APP[l[0]].glyph}</b><em>${l[2] || l[1]}</em></span>`).join("")}<span class="lg"><b class="h">${O.BISON}</b><em>Respect de bison (en plus)</em></span><span class="lg"><b class="h">✨</b><em>Aux étoiles</em></span></div>`;

  /* ---------- cartes ---------- */
  function polaroid(r, n = 0) {
    const l = latest(r), t = trend(r);
    return `<a class="polaroid tilt rv${dead(r) ? " is-dead" : ""}" style="--i:${n % 8};--r:${((n * 37) % 5) - 2}deg" href="${href(r)}">
      <span class="tape"></span>${avatar(r, "ph")}
      <div class="pol-body"><h3>${esc(r.nom)}</h3><p class="muted">${esc(r.lien)}${r.groupe ? " · " + esc(r.groupe) : ""}</p>
      <div class="rel-foot">${badgeP(l)}<span class="trend ${t.cls}" title="${t.txt}">${t.sym}</span>${typeTag(r)}${dead(r) ? '<span class="tag dead">🕊</span>' : ""}</div></div></a>`;
  }
  const cartes = (list) => (list.length ? `<div class="polas">${list.map(polaroid).join("")}</div>` : `<p class="empty rv">Aucune relation ne correspond.</p>`);

  /* ---------- pages ---------- */
  const VUES = [["marais", "Le Marais"], ["cartes", "Les polaroïds"]];
  L.pageRelations = function (vue) {
    vue = VUES.some((v) => v[0] === vue) ? vue : "marais";
    const list = L.D.relations || [];
    const tabs = `<nav class="vues rv" aria-label="Façon de voir les relations">${VUES.map((v) => `<a href="#/entourage/relations/${v[0]}" class="${v[0] === vue ? "on" : ""}">${v[1]}</a>`).join("")}</nav>`;
    const body = vue === "marais"
      ? '<div id="marais-host"></div>'
      : list.length ? filterBar(list) + legend() + `<div id="rel-out">${cartes(filtered(list))}</div>` : `<p class="empty rv">Aucune relation hors famille pour le moment — elles apparaîtront ici dès qu'elles seront ajoutées depuis le dashboard.</p>`;
    return { vue, html: `<section class="wrap page">${L.head("Entourage", "Relations", "Chaque lien est daté : Petit Bison les voit changer au fil des lunes.")}${tabs}${body}</section>` };
  };
  L.refresh = function () {
    const out = document.getElementById("rel-out"); if (!out) return;
    out.innerHTML = cartes(filtered(L.D.relations || []));
    window.FX && FX.observe(out);
  };

  L.pageFamille = function () {
    const fam = L.D.famille || [];
    const by = (p) => fam.filter((r) => (r.place || guess(r)) === p);
    function guess(r) { const l = O.norm(r.lien); return /(mere|pere|baba|papa|maman|parent|grand|oncle|tante)/.test(l) ? "ascendant" : /(frere|soeur|fratrie|jumeau|jumelle)/.test(l) ? "fratrie" : /(fils|fille|enfant|petit-)/.test(l) ? "descendant" : "autre"; }
    const node = (r, n) => `<a class="fnode tilt rv${dead(r) ? " is-dead" : ""}" style="--i:${n}" href="${href(r)}">${avatar(r, "md")}<strong>${esc(r.nom)}</strong><span class="muted">${esc(r.lien)}</span><span class="rel-foot">${badgeP(latest(r))}${dead(r) ? '<span class="tag dead">🕊</span>' : ""}</span></a>`;
    const row = (title, arr) => (arr.length ? `<div class="tier"><h3 class="tier-t rv">${title}</h3><div class="tier-row">${arr.map(node).join("")}</div></div>` : "");
    const me = `<div class="fnode me tilt rv"><span class="avatar md"><img src="assets/sprite-regard.png" alt="" class="px"></span><strong>${esc(L.D.identite.nom)}</strong><span class="muted">${esc(L.D.identite.lunes)}</span></div>`;
    const infos = (L.D.famille_infos || []).filter((i) => i.titre);
    return `<section class="wrap page">${L.head("Entourage", "Famille", "Ceux qui l'ont vue naître, et ceux avec qui elle partage son nid.")}${L.subTabs(["entourage", "famille"])}
      ${fam.length ? `<div class="tree">${row("Parents & ascendants", by("ascendant"))}<div class="tier"><h3 class="tier-t rv">Elle & sa fratrie</h3><div class="tier-row">${me}${by("fratrie").map(node).join("")}</div></div>${row("Descendance", by("descendant"))}${row("Autres liens de famille", by("autre"))}</div>` : `<p class="empty rv">Aucun membre de la famille pour le moment.</p>`}
      ${infos.length ? `<h2 class="sub-h rv">Lignée & mentorat</h2><div class="grid">${infos.map((i, n) => `<article class="card tilt rv" style="--i:${n}"><h3>${esc(i.titre)}</h3><p>${fmt(i.texte)}</p></article>`).join("")}</div>` : ""}
      ${fam.length ? `<p class="center rv" style="margin-top:46px"><a class="btn ghost" href="#/entourage/relations/marais">Voir la famille dans le Marais →</a></p>` : ""}</section>`;
  };

  L.pageFiche = function (id) {
    const r = all().find((x) => O.slug(x.nom) === id);
    if (!r) return `<section class="wrap page">${L.head("Entourage", "Introuvable")}<p class="center"><a class="btn" href="#/entourage/relations">← Toutes les relations</a></p></section>`;
    const ph = phasesOf(r), l = latest(r), t = trend(r), src = O.safeSrc(r.image);
    const back = r._fam ? ["#/entourage/famille", "← Toute la famille"] : ["#/entourage/relations", "← Toutes les relations"];
    const fils = (L.D.fils || []).filter((f) => (f.participants || []).some((p) => O.norm(p) === O.norm(r.nom)));
    return `<section class="wrap page">
      <a class="back rv" href="${back[0]}">${back[1]}</a>
      <header class="fiche rv">
        <figure class="big-pola ${dead(r) ? "is-dead" : ""}"><span class="tape"></span>${src ? `<button type="button" class="zoom" data-zoom="${esc(src)}" data-cap="${esc(r.nom)}" aria-label="Agrandir la photo de ${esc(r.nom)}">${avatar(r, "xl")}</button>` : avatar(r, "xl")}<figcaption>${esc(r.nom)}</figcaption></figure>
        <div class="fiche-txt"><span class="kicker">${esc(r.lien)}</span><h1>${esc(r.nom)}</h1>
          <div class="chips">${lifeTag(r)}${typeTag(r)}${r.type === "PJ" && r.joueur ? `<span class="tag soft">Joué·e par ${esc(r.joueur)}</span>` : ""}${r.groupe ? `<span class="tag soft">${esc(r.groupe)}</span>` : ""}${r.rang ? `<span class="tag soft">${esc(r.rang)}</span>` : ""}</div>
          <div class="avis-now"><span>Avis actuel</span>${badgeP(l)}<em>${esc(appr(l.appreciation).label)}${resp(l) ? " · respect de bison" : ""}</em><span class="trend ${t.cls}" title="${t.txt}">${t.sym} ${t.txt}</span></div>
          ${r.notes ? `<p class="notes">${fmt(r.notes)}</p>` : ""}</div>
      </header>
      <h2 class="sub-h rv">De nénuphar en nénuphar</h2>
      <ol class="hops big rv" aria-label="Évolution de l'avis">${ph.map((p) => `<li><b>Lune ${esc(p.age)}</b><span>${esc(appr(p.appreciation).glyph)}${resp(p) ? O.BISON : ""}</span><small>${esc(appr(p.appreciation).label)}</small></li>`).join("")}</ol>
      <ol class="timeline phases">${ph.map((p) => `<li class="rv"><span class="dot age">${esc(p.age)}<small>lunes</small></span>
        <div class="phase tilt"><div class="phase-top">${badgeP(p)}<span class="muted">${esc(appr(p.appreciation).label)}${resp(p) ? " · respect de bison" : ""}</span></div><p>${fmt(p.description)}</p></div></li>`).join("")}</ol>
      ${fils.length ? `<h2 class="sub-h rv">Fils RP ensemble</h2><div class="grid fils">${fils.map(filCard).join("")}</div>` : ""}
    </section>`;
  };

  /* ---------- fils RP ---------- */
  const statKey = (f) => (f.statut || "").toLowerCase().replace("é", "e");
  function filCard(f, k = 0) {
    const live = statKey(f).startsWith("en cours"), link = O.safeLink(f.lien);
    return `<article class="card fil tilt rv${link ? " has-link" : ""}" style="--i:${k % 6}">
      <div class="fil-top"><span class="status ${live ? "live" : ""}">${live ? "● " : ""}${esc(f.statut || "—")}</span>${f.lunes !== "" && f.lunes != null ? `<span class="muted">${esc(f.lunes)} lunes</span>` : ""}</div>
      <h3>${esc(f.titre)}</h3><p>${fmt(f.description)}</p>
      ${(f.participants || []).length ? `<div class="chips">${f.participants.map((p) => { const rel = all().find((x) => O.norm(x.nom) === O.norm(p)); return rel ? `<a class="tag soft" href="${href(rel)}">${esc(p)}</a>` : `<span class="tag soft">${esc(p)}</span>`; }).join("")}</div>` : ""}
      ${link ? `<a class="btn discord" href="${esc(link)}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.3 5.3A17 17 0 0 0 15.100 4l-.2.4a15.700 15.700 0 0 1 3.700 1.800 14.500 14.500 0 0 0-13.200 0A15.700 15.700 0 0 1 9.100 4.400L8.900 4A17 17 0 0 0 4.700 5.300C2 9.300 1.300 13.200 1.600 17a17 17 0 0 0 5.200 2.600l1.100-1.800a11 11 0 0 1-1.700-.8l.4-.3a12.100 12.100 0 0 0 10.800 0l.4.3a11 11 0 0 1-1.700.8l1.100 1.800a17 17 0 0 0 5.200-2.600c.4-4.400-.7-8.300-3.100-11.700zM8.700 14.700c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2zm6.600 0c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2z"/></svg>Ouvrir le fil sur Discord</a>` : `<span class="muted nolink">Pas de lien Discord renseigné</span>`}</article>`;
  }
  const filS = { s: "", q: "" };
  L.filState = filS;
  L.pageFils = function () {
    const n = (s) => (L.D.fils || []).filter((f) => statKey(f).startsWith(s)).length;
    const tabs = [["", `Tous (${(L.D.fils || []).length})`], ["en cours", `En cours (${n("en cours")})`], ["termine", `Terminés (${n("termine")})`]];
    return `<section class="wrap page">${L.head("Role-play", "Fils RP", "Toutes les scènes de Petit Bison, avec le lien direct vers le fil Discord.")}
      <nav class="vues rv">${tabs.map((t) => `<a href="#/fils" data-s="${t[0]}" class="${filS.s === t[0] ? "on" : ""}">${t[1]}</a>`).join("")}</nav>
      <div class="filters rv"><input id="fq" type="search" placeholder="Rechercher un fil, un participant…" value="${esc(filS.q)}"></div>
      <div id="fil-out">${L.filList()}</div></section>`;
  };
  L.filList = function () {
    const q = O.norm(filS.q.trim());
    const list = (L.D.fils || []).filter((f) => (!filS.s || statKey(f).startsWith(filS.s)) && (!q || O.norm([f.titre, f.description, (f.participants || []).join(" ")].join(" ")).includes(q)));
    return list.length ? `<div class="grid fils">${list.map(filCard).join("")}</div>` : `<p class="empty rv">${(L.D.fils || []).length ? "Aucun fil ne correspond." : "Aucun fil pour le moment — ils apparaîtront ici dès qu'ils seront ajoutés depuis le dashboard."}</p>`;
  };

  /* ---------- interactions ---------- */
  L.bind = function () {
    const g = (id) => document.getElementById(id);
    const on = (id, key) => g(id) && (g(id).onchange = (e) => { S[key] = e.target.value; L.refresh(); });
    if (g("rq")) g("rq").oninput = (e) => { S.q = e.target.value; L.refresh(); };
    on("rc", "groupe"); on("rt", "type"); on("rv", "vivant"); on("rg", "grp");
    if (g("fq")) g("fq").oninput = (e) => { filS.q = e.target.value; g("fil-out").innerHTML = L.filList(); FX.observe(g("fil-out")); };
    if (g("marais-host") && window.Marais) window.Marais.mount(g("marais-host"), L);
  };

  L.badge = badge; L.avatar = avatar; L.all = all; L.latest = latest; L.dead = dead; L.href = href; L.filCard = filCard; L.polaroid = polaroid; L.appr = appr; L.badgeP = badgeP; L.resp = resp; L.phasesOf = phasesOf;
  return L;
})();
