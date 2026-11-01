// Récits : carnet de santé et histoire en chapitres.
window.Recits = (function () {
  const O = window.Outils, esc = O.esc, fmt = O.fmt;
  const R = { D: null };
  const now = () => parseInt(R.D.identite.lunes) || 0;
  const num = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));

  /* ---------- carnet de santé ---------- */
  const TYPES = {
    maladie: { label: "Maladie", ico: "🤒", cls: "mal" },
    blessure: { label: "Blessure", ico: "🩹", cls: "bles" },
    convalescence: { label: "Convalescence", ico: "🌿", cls: "conv" },
    autre: { label: "Autre", ico: "✚", cls: "autre" },
  };
  const GRAV = { legere: "Légère", moyenne: "Moyenne", grave: "Grave" };
  const sFil = { t: "" };
  R.filter = sFil;
  const ongoing = (e) => e.en_cours === "oui";
  const span = (e) => { const a = num(e.lune_debut), b = ongoing(e) ? now() : num(e.lune_fin); return { a, b: b == null ? a : b }; };
  const dur = (e) => { const s = span(e); return s.a == null ? null : Math.max(0, s.b - s.a); };
  const when = (e) => { const s = span(e); if (s.a == null) return "Lune inconnue"; return ongoing(e) ? `Depuis la lune ${s.a} · en cours` : s.b === s.a ? `Lune ${s.a}` : `Lunes ${s.a} → ${s.b}`; };
  const hasSeq = (e) => e.sequelles === "oui";

  function entry(e, n) {
    const t = TYPES[e.type] || TYPES.autre, d = dur(e);
    return `<article class="care care-${t.cls} tilt rv" style="--i:${n % 5}" id="care-${n}">
      <span class="tape"></span>
      <header><span class="care-ico" aria-hidden="true">${t.ico}</span>
        <div><div class="chips"><span class="tag care-t">${t.label}</span>${e.gravite && GRAV[e.gravite] ? `<span class="tag soft">Gravité : ${GRAV[e.gravite]}</span>` : ""}${ongoing(e) ? '<span class="tag live">● En cours</span>' : '<span class="tag alive">✓ Guérie</span>'}${e.confinee === "oui" ? '<span class="tag soft">🏕 Tanière du guérisseur</span>' : ""}</div>
        <h3>${esc(e.titre || t.label)}</h3></div></header>
      <p class="care-when"><b>${esc(when(e))}</b>${d ? ` · <span>${d} lune${d > 1 ? "s" : ""}</span>` : ""}</p>
      <dl class="care-dl">
        ${e.cause ? `<div><dt>Pourquoi ?</dt><dd>${fmt(e.cause)}</dd></div>` : ""}
        ${e.soins ? `<div><dt>Soins</dt><dd>${fmt(e.soins)}</dd></div>` : ""}
        ${e.confinee === "oui" ? `<div><dt>Convalescence</dt><dd>${fmt(e.confinement_texte || "Confinée dans la tanière du guérisseur le temps de se rétablir.")}</dd></div>` : ""}
      </dl>
      <p class="care-seq ${hasSeq(e) ? "yes" : "no"}">${hasSeq(e) ? `<b>⚠ Séquelles</b> ${fmt(e.sequelles_texte || "")}` : "<b>✓ Aucune séquelle</b>"}</p>
      ${e.notes ? `<p class="care-notes">${fmt(e.notes)}</p>` : ""}</article>`;
  }

  function strip(list) {
    const end = Math.max(now(), ...list.map((e) => span(e).b || 0), 1);
    const pos = (v) => ((v / end) * 100).toFixed(2);
    const marks = []; const step = Math.max(1, Math.ceil(end / 10));
    for (let v = 0; v <= end; v += step) marks.push(v);
    return `<div class="strip rv" aria-label="Frise des soins, lune par lune"><div class="strip-bar">
      ${list.map((e, i) => { const s = span(e); if (s.a == null) return ""; const t = TYPES[e.type] || TYPES.autre; return `<a class="seg seg-${t.cls}" href="#/elle/sante" data-go="care-${i}" style="left:${pos(s.a)}%;width:max(${(((s.b - s.a) || 0.35) / end * 100).toFixed(2)}%,14px)" title="${esc(e.titre || t.label)} · ${esc(when(e))}"><i>${t.ico}</i></a>`; }).join("")}
      <span class="strip-now" style="left:${pos(now())}%"></span></div>
      <div class="strip-axis">${marks.map((v) => `<span style="left:${pos(v)}%">${v} l.</span>`).join("")}</div></div>`;
  }

  R.pageSante = function () {
    const all = (R.D.sante || []).map((e, i) => Object.assign({ _i: i }, e));
    const list = all.filter((e) => !sFil.t || (sFil.t === "sequelles" ? hasSeq(e) : e.type === sFil.t));
    const cur = all.filter(ongoing);
    const lunesMal = all.reduce((a, e) => a + (dur(e) || 0), 0), seq = all.filter(hasSeq).length;
    const confinee = all.filter((e) => e.confinee === "oui").length;
    const tabs = [["", `Tout (${all.length})`], ["maladie", "🤒 Maladies"], ["blessure", "🩹 Blessures"], ["convalescence", "🌿 Convalescences"], ["sequelles", "⚠ Avec séquelles"]];
    const head = `<div class="care-now rv ${cur.length ? "sick" : "well"}">${cur.length ? `<span class="big-ico">🩹</span><div><b>En ce moment</b><p>${cur.map((e) => esc(e.titre || (TYPES[e.type] || TYPES.autre).label)).join(" · ")}</p></div>` : `<span class="big-ico">🐸</span><div><b>En pleine forme !</b><p>Aucun souci de santé en cours pour Petit Bison. Robuste comme un bison, comme elle aime le dire.</p></div>`}</div>
      <div class="glance care-stats"><div class="gl rv"><b data-count="${all.length}">0</b><span>soins notés</span></div><div class="gl rv" style="--i:1"><b data-count="${lunesMal}">0</b><span>lunes de soins</span></div><div class="gl rv" style="--i:2"><b data-count="${confinee}">0</b><span>séjours à la tanière</span></div><div class="gl rv" style="--i:3"><b data-count="${seq}">0</b><span>séquelle${seq > 1 ? "s" : ""}</span></div></div>`;
    return `<section class="wrap page">${R.head("Elle", "Carnet de santé", "Maladies, blessures et convalescences de Petit Bison : quand, pourquoi, comment elle a été soignée, et ce qu'il en reste.")}
      ${head}
      ${all.length ? `${strip(all)}<nav class="vues rv" aria-label="Filtrer le carnet">${tabs.map((t) => `<a href="#/elle/sante" data-care="${t[0]}" class="${sFil.t === t[0] ? "on" : ""}">${t[1]}</a>`).join("")}</nav>
      <div class="care-list">${list.length ? list.map((e) => entry(e, e._i)).join("") : '<p class="empty rv">Rien dans cette catégorie.</p>'}</div>` : `<p class="empty rv">Le carnet est vide : aucune maladie ni blessure notée pour le moment. Elles apparaîtront ici dès qu'elles seront ajoutées depuis le dashboard.</p>`}
    </section>`;
  };

  /* ---------- histoire en chapitres ---------- */
  const BLOCKS = {
    paragraphe: (b, ctx) => `<p class="bk-p${ctx.first ? " drop" : ""} rv">${fmt(b.texte)}</p>`,
    intertitre: (b) => `<h3 class="bk-h rv">${esc(b.texte)}</h3>`,
    citation: (b) => `<blockquote class="bk-q rv"><p>${fmt(b.texte)}</p>${b.auteur ? `<cite>— ${esc(b.auteur)}</cite>` : ""}</blockquote>`,
    encart: (b) => `<aside class="bk-note rv"><b>${esc(b.titre || "À retenir")}</b><p>${fmt(b.texte)}</p></aside>`,
    liste: (b) => `<ul class="bk-l rv">${String(b.texte || "").split("\n").filter((x) => x.trim()).map((x) => `<li>${fmt(x.replace(/^[-•*]\s*/, ""))}</li>`).join("")}</ul>`,
    image: (b) => (O.safeSrc(b.image) ? `<figure class="bk-i rv"><button type="button" class="zoom" data-zoom="${esc(b.image)}" data-cap="${esc(b.legende || "")}"><img src="${esc(b.image)}" alt="${esc(b.legende || "")}" loading="lazy" decoding="async"></button>${b.legende ? `<figcaption>${esc(b.legende)}</figcaption>` : ""}</figure>` : ""),
    separateur: () => `<div class="bk-sep rv" aria-hidden="true"><i></i><i></i><i></i></div>`,
  };
  const lunesLabel = (c) => { const a = num(c.lune_debut), b = num(c.lune_fin); if (a == null) return ""; return b == null || b === a ? `Lune ${a}` : `Lunes ${a} → ${b}`; };

  R.pageHistoire = function () {
    const ch = [...(R.D.histoire || [])].sort((a, b) => (num(a.lune_debut) || 0) - (num(b.lune_debut) || 0));
    if (!ch.length) return `<section class="wrap page">${R.head("Elle", "Histoire", "Sa vie, chapitre après chapitre.")}<p class="empty rv">Aucun chapitre pour le moment.</p></section>`;
    const end = Math.max(now(), ...ch.map((c) => num(c.lune_fin) ?? num(c.lune_debut) ?? 0), 1);
    const nav = `<nav class="chap-nav rv" aria-label="Chapitres">${ch.map((c, i) => { const a = num(c.lune_debut) || 0, b = num(c.lune_fin) ?? a; return `<a href="#/elle/histoire" data-go="chap-${i}" style="--l:${(a / end * 100).toFixed(1)}%"><span class="cn-n">${i + 1}</span><span class="cn-t">${esc(c.titre)}</span><small>${esc(lunesLabel(c))}</small></a>`; }).join("")}</nav>`;
    const body = ch.map((c, i) => {
      const blocs = (c.blocs || []);
      let seenP = false;
      const html = blocs.map((b) => { const f = BLOCKS[b.type] || BLOCKS.paragraphe; const first = b.type === "paragraphe" && !seenP; if (b.type === "paragraphe") seenP = true; return f(b, { first }); }).join("");
      const words = blocs.map((b) => String(b.texte || "")).join(" ").split(/\s+/).filter(Boolean).length;
      return `<section class="chap" id="chap-${i}"><header class="chap-h rv"><span class="chap-num">Chapitre ${i + 1}</span><h2>${esc(c.titre)}</h2><div class="chips"><span class="tag">${esc(lunesLabel(c))}</span>${words > 120 ? `<span class="tag soft">≈ ${Math.max(1, Math.round(words / 200))} min de lecture</span>` : ""}</div>${c.accroche ? `<p class="chap-hook">${fmt(c.accroche)}</p>` : ""}</header><div class="chap-body">${html}</div></section>`;
    }).join("");
    return `<section class="wrap page">${R.head("Elle", "Histoire", "Sa vie, chapitre après chapitre.")}${nav}<div class="chaps">${body}</div></section>`;
  };

  return R;
})();
