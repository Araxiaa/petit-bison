// Petits outils partagés entre le site et le dashboard.
window.Outils = (function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Mise en forme légère : **gras**  *italique*  ==surligné==  {{murmure}}  (le texte est d'abord échappé)
  const fmt = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    .replace(/\{\{(.+?)\}\}/g, '<span class="murmure">$1</span>')
    .replace(/\n/g, "<br>");
  const safeSrc = (u) => (/^(https?:\/\/|assets\/|\/)/.test(u || "") ? u : "");
  const safeLink = (u) => (/^https?:\/\//.test(u || "") ? u : "");
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const initials = (n) => String(n).split(/[\s'’-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = (n) => [...String(n)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
  // Anciennes sauvegardes : la famille était dans « relations » (+ « lignee », « clan »). On les convertit à la volée.
  function migrate(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const s = Object.assign({}, saved), def = window.DEFAULT_CONTENT || {};
    const up = (r) => Object.assign({ groupe: r.clan || "", vivant: (r.phases || []).some((p) => p.appreciation === "mort") ? "non" : "oui", notes: "", image: "" }, r);
    if (!s.famille && (s.lignee || Array.isArray(s.relations))) {
      const famNames = (def.famille || []).map((r) => norm(r.nom));
      const isFam = (r) => famNames.includes(norm(r.nom)) || /(mere|pere|baba|papa|maman|parent|frere|soeur|fratrie)/.test(norm(r.lien));
      const old = Array.isArray(s.relations) ? s.relations : [];
      const fam = old.filter(isFam).map((r) => Object.assign(up(r), { place: r.place || "" }));
      s.famille = fam.length ? fam : undefined;
      s.relations = old.filter((r) => !isFam(r));
      if (s.lignee && Array.isArray(s.lignee.autres)) s.famille_infos = s.lignee.autres;
      delete s.lignee;
      if (!s.famille) delete s.famille;
    }
    ["famille", "relations"].forEach((k) => { if (Array.isArray(s[k])) s[k] = s[k].map((r) => (r.groupe === undefined || r.vivant === undefined ? up(r) : r)); });
    // « respect » n'est plus un cran de l'échelle : c'est une nuance en plus (respect: "oui") sur un avis.
    ["famille", "relations"].forEach((k) => { if (Array.isArray(s[k])) s[k] = s[k].map((r) => Object.assign({}, r, { phases: (r.phases || []).map((p) => (p.appreciation === "respect" ? Object.assign({}, p, { appreciation: "neutre", respect: "oui" }) : p)) })); });
    // Ancienne histoire : une liste de phrases « 0 lune — Naissance. » devient une liste de chapitres.
    if (Array.isArray(s.histoire) && s.histoire.length && typeof s.histoire[0] === "string") {
      s.histoire = s.histoire.map((t) => { const m = String(t).match(/^\s*(\d+)\s*lunes?\s*[—:\-–]\s*(.*)$/); const n = m ? Number(m[1]) : 0, txt = m ? m[2] : String(t); return { titre: txt.replace(/[.\s]+$/, "").slice(0, 60) || "Chapitre", lune_debut: n, lune_fin: n, accroche: "", blocs: [{ type: "paragraphe", texte: txt }] }; });
    }
    return s;
  }
  // Échelle des avis, aux couleurs de Petit Bison : 🐸 (sa proie préférée) pour ce qu'elle aime, 🐿️ (l'écureuil, qu'elle déteste) pour l'aversion,
  // 🌫️ (la brume) pour le « ni l'un ni l'autre », ✨ pour les étoiles. Le respect (🦬) est une nuance en plus, ajoutable à n'importe quel avis.
  const POS = "🐸", NEG = "🐿️", FOG = "🌫️", BISON = "🦬";
  const APP = {
    pos1: { g: "pos", n: 1, glyph: POS, label: "Plutôt sympa" },
    pos2: { g: "pos", n: 2, glyph: POS + POS, label: "Bon·ne ami·e" },
    pos3: { g: "pos", n: 3, glyph: POS + POS + POS, label: "Coup de cœur" },
    neg1: { g: "neg", n: -1, glyph: NEG, label: "Bof" },
    neg2: { g: "neg", n: -2, glyph: NEG + NEG, label: "Pas fan" },
    neg3: { g: "neg", n: -3, glyph: NEG + NEG + NEG, label: "Beurk !" },
    neutre: { g: "neutre", n: 0, glyph: FOG, label: "Dans la brume" },
    mort: { g: "mort", n: null, glyph: "✨", label: "Aux étoiles" },
  };
  return { APP, BISON, migrate, esc, fmt, safeSrc, safeLink, norm, slug, initials, hue };
})();
