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
    return s;
  }
  return { migrate, esc, fmt, safeSrc, safeLink, norm, slug, initials, hue };
})();
