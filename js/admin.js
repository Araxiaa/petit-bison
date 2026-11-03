(function () {
  const C = window.SITE_CONFIG, O = window.Outils;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = O.esc;
  const DRAFT = "pb-draft";

  /* ---------- définitions des champs ---------- */
  const F = {
    text: (k, label, o) => ({ t: "text", k, label, ...o }),
    num: (k, label, o) => ({ t: "text", num: true, k, label, ...o }),
    area: (k, label, o) => ({ t: "area", k, label, ...o }),
    sel: (k, label, opts, o) => ({ t: "sel", k, label, opts, ...o }),
    yes: (k, label, o) => ({ t: "yes", k, label, ...o }),
    img: (k, label, o) => ({ t: "img", k, label, ...o }),
    tags: (k, label, o) => ({ t: "tags", k, label, ...o }),
    hearts: (k, label, o) => ({ t: "hearts", k, label, ...o }),
    paras: (k, label, o) => ({ t: "paras", k, label, ...o }),
    strs: (k, label, o) => ({ t: "paras", short: true, k, label, ...o }),
    group: (k, title, fields, o) => ({ t: "group", k, title, fields, ...o }),
    items: (k, label, fields, o) => ({ t: "items", k, label, fields, ...o }),
  };
  const APPS = Object.entries(O.APP).map(([k, v]) => [k, v.glyph]);
  const APP_LABEL = Object.fromEntries(Object.entries(O.APP).map(([k, v]) => [k, v.label]));
  const GROUPES = ["Clan de l'Ombre", "Clan du Vent", "Clan du Tonnerre", "Clan de la Rivière", "Solitaire", "Chat domestique"];

  const groupList = () => [...new Set([...GROUPES, ...[...(state.famille || []), ...(state.relations || [])].map((r) => r.groupe).filter(Boolean)])];
  const nameList = () => [...(state.famille || []), ...(state.relations || [])].map((r) => r.nom).filter(Boolean);
  const textCards = (k, label, o) => F.items(k, label, [F.text("titre", "Titre"), F.area("texte", "Texte")], o);

  const relFields = (fam) => [
    F.group("", "", [
      F.text("nom", "Nom", { ph: "Ex. Plume d'Aube" }),
      F.text("lien", "Lien avec Petit Bison", { ph: fam ? "Mère, frère, grand-père…" : "Ami·e, rival·e, mentor…" }),
    ], { bare: true, cols: true }),
    F.group("", "", [
      F.text("groupe", "Clan / groupe", { list: groupList, ph: "Clan de l'Ombre" }),
      F.text("rang", "Rang", { ph: "Chaton, guerrier…" }),
      F.sel("type", "Joué·e par", [["PNJ", "PNJ (personnage non joueur)"], ["PJ", "PJ (un·e joueur·se)"]], { refresh: true }),
      F.text("joueur", "Pseudo du / de la joueur·se", { show: (it) => it.type === "PJ", ph: "Pseudo Discord" }),
    ], { bare: true, cols: true }),
    ...(fam ? [F.sel("place", "Place dans l'arbre", [["", "Automatique (selon le lien)"], ["ascendant", "Parents & ascendants"], ["fratrie", "Fratrie"], ["descendant", "Descendance"], ["autre", "Autres liens de famille"]])] : []),
    F.yes("vivant", "Vivant·e", { refresh: true, offLabel: "Décédé·e ✨" }),
    F.num("deces", "Lune du décès (optionnel)", { show: (it) => it.vivant === "non", hint: "le nénuphar passe « aux étoiles » à cette lune" }),
    F.img("image", "Photo", { hint: "visible sur la fiche, en polaroïd et sur son nénuphar du Marais" }),
    F.area("notes", "Notes", { hint: "affichées sur la fiche (optionnel)", rows: 3 }),
    F.items("phases", "Évolution de l'avis (avis datés)", [
      F.group("", "", [F.num("age", "À la lune n°"), F.hearts("appreciation", "Avis de Petit Bison", { hint: "🐸 elle aime · 🐿️ elle n'aime pas · 🌫️ pas d'avis tranché" })], { bare: true, cols: true }),
      F.yes("respect", "Respect de bison 🦬 : en plus de l'avis, elle le·la respecte", { def: "non" }),
      F.area("description", "Ce qui s'est passé", { rows: 3 }),
    ], { sort: "age", sub: true, addLabel: "+ Ajouter un avis", sample: () => ({ age: parseInt(state.identite.lunes) || 0, appreciation: "neutre", description: "" }), sum: sumPhase }),
  ];
  const sumPhase = (it) => ({ title: `Lune ${it.age ?? "?"}`, sub: (it.description || "").slice(0, 80), badges: [`<span class="tag soft">${(O.APP[it.appreciation] || {}).glyph || ""}${it.respect === "oui" ? O.BISON : ""} ${esc(APP_LABEL[it.appreciation] || "")}</span>`] });
  const latestApp = (r) => { const p = [...(r.phases || [])].sort((a, b) => (a.age || 0) - (b.age || 0)); return (p[p.length - 1] || {}).appreciation; };
  const sumRel = (it) => ({
    title: it.nom || "(sans nom)", sub: [it.lien, it.groupe].filter(Boolean).join(" · "), thumb: it.image, mono: it.nom,
    badges: [`<span class="tag ${it.type === "PJ" ? "pj" : "soft"}">${esc(it.type || "PNJ")}</span>`, it.vivant === "non" ? '<span class="tag dead">🕊</span>' : "", latestApp(it) ? `<span class="tag soft">${(O.APP[latestApp(it)] || {}).glyph || ""}</span>` : ""],
  });
  const sumFil = (it) => ({ title: it.titre || "(sans titre)", sub: [it.statut, it.lunes !== "" && it.lunes != null ? it.lunes + " lunes" : ""].filter(Boolean).join(" · "), badges: [O.safeLink(it.lien) ? '<span class="tag" style="background:#5865f2;color:#fff">Discord ✓</span>' : '<span class="tag soft">sans lien</span>'] });
  const sumGal = (it) => ({ title: it.titre || "(sans titre)", sub: it.categorie || "", thumb: it.image, mono: it.titre });

  const BLOCK_TYPES = [["paragraphe", "¶ Paragraphe"], ["intertitre", "H Intertitre"], ["citation", "❝ Citation"], ["encart", "💡 Encart « À retenir »"], ["liste", "🐾 Liste à puces"], ["image", "🖼 Image"], ["separateur", "✦ Séparateur"]];
  const lunesTxt = (it) => (it.lune_fin === "" || it.lune_fin == null || it.lune_fin === it.lune_debut ? `Lune ${it.lune_debut ?? "?"}` : `Lunes ${it.lune_debut} → ${it.lune_fin}`);
  const sumChap = (it) => ({ title: it.titre || "(chapitre sans titre)", sub: lunesTxt(it) + (it.accroche ? " · " + it.accroche.slice(0, 50) : ""), badges: [`<span class="tag soft">${(it.blocs || []).length} bloc${(it.blocs || []).length > 1 ? "s" : ""}</span>`] });
  const sumBloc = (it) => ({ title: (BLOCK_TYPES.find((t) => t[0] === it.type) || ["", it.type])[1], sub: String(it.texte || it.legende || "").slice(0, 90) });
  const SANTE_T = { maladie: "🤒 Maladie", blessure: "🩹 Blessure", convalescence: "🌿 Convalescence", autre: "✚ Autre" };
  const sumSante = (it) => ({ title: it.titre || "(sans titre)", sub: `${SANTE_T[it.type] || ""} · ${it.en_cours === "oui" ? "depuis la lune " + it.lune_debut + " · en cours" : lunesTxt(it)}`, badges: [it.confinee === "oui" ? '<span class="tag soft">🏕 tanière</span>' : "", it.sequelles === "oui" ? '<span class="tag dead">⚠ séquelles</span>' : "", it.en_cours === "oui" ? '<span class="tag live">en cours</span>' : ""] });
  const SECTIONS = [
    { g: "Général", list: [
      { id: "vue", ic: "🏠", label: "Vue d'ensemble", title: "Vue d'ensemble", help: "Bienvenue ! Ici, tu contrôles tout le site de Petit Bison. Rien n'est publié tant que tu n'as pas cliqué sur « Enregistrer »." },
      { id: "identite", ic: "🪪", label: "Identité & accueil", help: "Les informations de base et les images de la page d'accueil.", defs: [F.group("identite", "", [
        F.group("", "Nom & accroche", [F.text("nom", "Nom"), F.text("sous_titre", "Sous-titre"), F.text("citation", "Citation d'accueil")], { bare: true, cols: true }),
        F.group("", "Images d'accueil", [F.img("image", "Pose principale (en haut de l'accueil)"), F.img("image2", "Seconde pose (section « en quelques mots »)")], { bare: true, cols: true }),
        F.group("", "Fiche", [F.text("lunes", "Âge (ex. « 5 lunes »)"), F.text("clan", "Clan"), F.text("rang", "Rang"), F.text("sexe", "Sexe"), F.text("note_sexe", "Note sur le sexe"), F.text("orientation", "Orientation"), F.num("pv", "PV"), F.num("pa", "PA"), F.text("taille", "Taille"), F.text("poids", "Poids"), F.text("pseudo_joueur", "Pseudo du joueur"), F.text("credits", "Crédits")], { bare: true, cols: true }),
      ], { bare: true })] },
      { id: "reglages", ic: "⚙️", label: "Réglages du site", help: "La mascotte pixel-art et quelques textes du site.", defs: [F.group("reglages", "", [
        F.yes("mascotte", "Afficher la petite mascotte pixel-art qui se promène sur le site", { hint: "elle marche, s'assoit, et lève le nez quand on la survole" }),
        F.group("", "Sprites de la mascotte", [F.img("sprite_marche", "En marche (regarde à gauche)"), F.img("sprite_assis", "Assise"), F.img("sprite_regard", "Nez en l'air")], { bare: true, cols: true }),
        F.group("", "Textes", [F.text("accroche_accueil", "Titre de la section d'accueil « En quelques mots »"), F.text("texte_pied", "Texte du pied de page")], { bare: true, cols: true }),
      ], { bare: true })] },
    ] },
    { g: "Personnage", list: [
      { id: "noms", ic: "🏷️", label: "Noms", help: "Nom de chaton, d'apprenti, d'adulte, de chef, d'ancien.", defs: [F.items("noms", "Noms", [F.text("etape", "Étape (Chaton, Apprenti…)"), F.text("nom", "Nom"), F.area("texte", "Explication", { rows: 3 })], { addLabel: "+ Ajouter une étape", sum: (it) => ({ title: it.nom || "—", sub: it.etape }) })] },
      { id: "caractere", ic: "💭", label: "Caractère", help: "Le portrait général, puis qualités et défauts. Ils s'affichent aussi sur l'accueil.", defs: [F.paras("caractere.description", "Description générale (un bloc = un paragraphe)"), textCards("caractere.qualites", "Qualités", { addLabel: "+ Ajouter une qualité" }), textCards("caractere.defauts", "Défauts", { addLabel: "+ Ajouter un défaut" })] },
      { id: "gouts", ic: "🍃", label: "Goûts & peurs", help: "Ce qu'elle aime, déteste, craint, et ses habitudes.", defs: [textCards("gouts.aime", "Ce qu'elle aime"), textCards("gouts.deteste", "Ce qu'elle déteste"), textCards("gouts.peurs", "Peurs & phobies"), textCards("gouts.habitudes", "Habitudes")] },
      { id: "physique", ic: "🐾", label: "Physique", help: "Description, points forts et faibles, handicap, accessoires, cicatrices. Les parties vides ne s'affichent pas.", defs: [F.paras("physique.description", "Description (un bloc = un paragraphe)"), textCards("physique.forts", "Points forts"), textCards("physique.faibles", "Points faibles"),
        F.group("physique.handicap", "Handicap", [F.text("citation", "Citation"), F.area("intro", "Introduction", { rows: 3 }), F.strs("points", "Points")]),
        F.group("physique.accessoires", "Accessoires", [F.text("citation", "Citation"), textCards("points", "Accessoires")]),
        F.paras("physique.cicatrices", "Cicatrices (un bloc = un paragraphe)")] },
      { id: "sante", ic: "🩹", label: "Carnet de santé", help: "Maladies, blessures, convalescences : quand, pourquoi, soins, séjour à la tanière du guérisseur, séquelles. Le site en tire une frise et des fiches de soins.", defs: [F.items("sante", "Entrées du carnet", [
        F.text("titre", "Titre", { ph: "Toux de brume, patte foulée…" }),
        F.group("", "", [F.sel("type", "Type", [["maladie", "🤒 Maladie"], ["blessure", "🩹 Blessure"], ["convalescence", "🌿 Convalescence"], ["autre", "✚ Autre"]]), F.sel("gravite", "Gravité", [["legere", "Légère"], ["moyenne", "Moyenne"], ["grave", "Grave"]])], { bare: true, cols: true }),
        F.group("", "", [F.num("lune_debut", "Lune du début"), F.num("lune_fin", "Lune de la fin", { show: (it) => it.en_cours !== "oui" })], { bare: true, cols: true }),
        F.yes("en_cours", "Toujours en cours", { def: "non", refresh: true }),
        F.area("cause", "Pourquoi ? (ce qui s'est passé)", { rows: 3 }),
        F.area("soins", "Soins reçus (herbes, guérisseur…)", { rows: 3 }),
        F.yes("confinee", "Confinée dans la tanière du guérisseur", { def: "non", refresh: true }),
        F.area("confinement_texte", "Détails du séjour à la tanière (combien de temps, pourquoi…)", { show: (it) => it.confinee === "oui", rows: 2 }),
        F.yes("sequelles", "Il reste des séquelles", { def: "non", refresh: true }),
        F.area("sequelles_texte", "Quelles séquelles ?", { show: (it) => it.sequelles === "oui", rows: 2 }),
        F.area("notes", "Notes (optionnel)", { rows: 2 }),
      ], { sum: sumSante, addLabel: "+ Ajouter une entrée au carnet", search: true, sample: () => ({ titre: "", type: "maladie", gravite: "legere", lune_debut: parseInt(state.identite.lunes) || 0, lune_fin: parseInt(state.identite.lunes) || 0, en_cours: "non", cause: "", soins: "", confinee: "non", confinement_texte: "", sequelles: "non", sequelles_texte: "", notes: "" }) })] },
      { id: "histoire", ic: "📜", label: "Histoire (chapitres)", help: "Découpe sa vie en chapitres, « de telle lune à telle lune ». Dans chaque chapitre, ajoute des blocs : paragraphes, intertitres, citations, encarts « À retenir », listes, images, séparateurs.", defs: [F.items("histoire", "Chapitres", [
        F.text("titre", "Titre du chapitre", { ph: "Les premières lunes" }),
        F.group("", "", [F.num("lune_debut", "De la lune"), F.num("lune_fin", "À la lune")], { bare: true, cols: true }),
        F.text("accroche", "Accroche (une phrase sous le titre)"),
        F.items("blocs", "Contenu du chapitre", [
          F.sel("type", "Type de bloc", BLOCK_TYPES, { refresh: true }),
          F.text("texte", "Intertitre", { show: (b) => b.type === "intertitre" }),
          F.area("texte", "Texte", { show: (b) => ["paragraphe", "citation", "encart"].includes(b.type), rows: 5 }),
          F.area("texte", "Points de la liste (un par ligne)", { show: (b) => b.type === "liste", rows: 4, plain: true }),
          F.text("auteur", "Qui parle ? (optionnel)", { show: (b) => b.type === "citation" }),
          F.text("titre", "Titre de l'encart", { show: (b) => b.type === "encart", ph: "À retenir" }),
          F.img("image", "Image", { show: (b) => b.type === "image" }),
          F.text("legende", "Légende", { show: (b) => b.type === "image" }),
        ], { sub: true, sum: sumBloc, addMenu: BLOCK_TYPES.map((t) => ["+ " + t[1].replace(/^\S+\s/, ""), { type: t[0] }]), blank: () => ({ type: "paragraphe", texte: "", titre: "", auteur: "", image: "", legende: "" }) }),
      ], { sort: "lune_debut", sum: sumChap, addLabel: "+ Ajouter un chapitre", sample: () => ({ titre: "", lune_debut: parseInt(state.identite.lunes) || 0, lune_fin: parseInt(state.identite.lunes) || 0, accroche: "", blocs: [{ type: "paragraphe", texte: "", titre: "", auteur: "", image: "", legende: "" }] }) })] },
      { id: "convictions", ic: "⭐", label: "Convictions", help: "Son rapport au clan, aux autres clans et au Clan des Étoiles.", defs: [
        F.group("convictions.clan", "Relation au clan", [F.text("citation", "Citation"), F.paras("paragraphes", "Texte")]),
        F.group("convictions.autres_clans", "Avis sur les autres clans", [F.area("intro", "Introduction"), F.items("clans", "Clans", [F.text("nom", "Clan"), F.area("texte", "Avis")], { sum: (it) => ({ title: it.nom || "—", sub: (it.texte || "").slice(0, 70) }) })]),
        F.group("convictions.etoiles", "Croyance (Clan des Étoiles)", [F.text("citation", "Citation"), F.paras("paragraphes", "Texte")])] },
    ] },
    { g: "Entourage", list: [
      { id: "famille", ic: "🏡", label: "Famille", help: "Parents, fratrie… Chaque membre a une photo, un statut (vivant·e ou non) et des avis datés. Ils forment l'arbre de la page Famille.", defs: [F.items("famille", "Membres de la famille", relFields(true), { sum: sumRel, addLabel: "+ Ajouter un membre de la famille", search: true, sample: () => ({ nom: "", lien: "", place: "", groupe: "Clan de l'Ombre", rang: "", type: "PNJ", joueur: "", vivant: "oui", image: "", notes: "", phases: [{ age: parseInt(state.identite.lunes) || 0, appreciation: "pos2", description: "" }] }) }), textCards("famille_infos", "Lignée, conjoint·e, descendance, mentorat…", { addLabel: "+ Ajouter une info" })] },
      { id: "relations", ic: "💞", label: "Relations", help: "Tous les autres chats : amis, rivaux, mentors… Pour faire évoluer un lien, ouvre la fiche et ajoute un « avis daté » : le site en tire le Marais : nénuphars, grenouilles, écureuils, brume, et le curseur des lunes.", defs: [F.items("relations", "Relations", relFields(false), { sum: sumRel, addLabel: "+ Ajouter une relation", search: true, sample: () => ({ nom: "", lien: "", groupe: "Clan de l'Ombre", rang: "", type: "PNJ", joueur: "", vivant: "oui", image: "", notes: "", phases: [{ age: parseInt(state.identite.lunes) || 0, appreciation: "neutre", description: "" }] }) })] },
    ] },
    { g: "Scènes & médias", list: [
      { id: "fils", ic: "✎", label: "Fils RP", help: "Colle le lien du fil Discord (clic droit sur le fil → « Copier le lien »). Il apparaît en bouton « Ouvrir le fil sur Discord » sur le site.", defs: [F.items("fils", "Fils RP", [
        F.text("titre", "Titre du fil"),
        F.text("lien", "Lien du fil Discord", { url: true, ph: "https://discord.com/channels/…", test: true }),
        F.group("", "", [F.sel("statut", "Statut", [["En cours", "En cours"], ["Terminé", "Terminé"]]), F.text("lunes", "Lune(s)", { ph: "4 ou 4–5" })], { bare: true, cols: true }),
        F.tags("participants", "Participants", { suggest: nameList, hint: "les noms qui correspondent à une fiche deviennent des liens" }),
        F.area("description", "Résumé", { rows: 3 }),
      ], { sum: sumFil, addLabel: "+ Ajouter un fil RP", search: true, sample: () => ({ titre: "", lien: "", participants: [], lunes: parseInt(state.identite.lunes) || 0, description: "", statut: "En cours" }) })] },
      { id: "galerie", ic: "🖼️", label: "Galerie", help: "Les images de la page Galerie. La catégorie crée des onglets de tri.", defs: [F.items("galerie", "Images", [F.text("titre", "Titre"), F.text("categorie", "Catégorie", { list: () => [...new Set((state.galerie || []).map((g) => g.categorie).filter(Boolean))], ph: "Illustrations, Pixel-art…" }), F.img("image", "Image"), F.area("description", "Légende", { rows: 2 })], { sum: sumGal, addLabel: "+ Ajouter une image", search: true })] },
    ] },
  ];
  const ALL = SECTIONS.flatMap((s) => s.list);

  /* ---------- état ---------- */
  let state = null, saved = "", tab = "vue";
  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  function ensure(obj, path, make) { // renvoie le parent et la clé finale, en créant les objets manquants
    const parts = path.split("."), last = parts.pop();
    let o = obj; parts.forEach((p) => { if (o[p] == null || typeof o[p] !== "object") o[p] = {}; o = o[p]; });
    if (o[last] == null) o[last] = make();
    return [o, last];
  }
  const quiet = (fn) => { const was = JSON.stringify(state) === saved; fn(); if (was) saved = JSON.stringify(state); }; // les champs vides créés à l'affichage ne comptent pas comme une modification
  let draftT;
  function touch() {
    const d = JSON.stringify(state) !== saved;
    $("state").className = "state " + (d ? "dirty" : "ok");
    $("state").textContent = d ? "● Modifications non enregistrées" : "● Tout est enregistré";
    $("btn-undo").disabled = !d;
    clearTimeout(draftT);
    draftT = setTimeout(() => { try { d ? localStorage.setItem(DRAFT, JSON.stringify({ at: Date.now(), data: state })) : localStorage.removeItem(DRAFT); } catch (e) {} }, 500);
  }
  addEventListener("beforeunload", (e) => { if (state && JSON.stringify(state) !== saved) { e.preventDefault(); e.returnValue = ""; } });
  function toast(msg, err) {
    const t = $("toast"); t.textContent = msg; t.className = "toast show" + (err ? " err" : "");
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = "toast"), 3400);
  }

  /* ---------- images ---------- */
  async function prepare(file) {
    if (!/^image\//.test(file.type)) throw new Error("ce fichier n'est pas une image");
    if (/gif|svg/.test(file.type)) return { blob: file, ext: file.type.includes("gif") ? "gif" : "svg", type: file.type };
    const bmp = await createImageBitmap(file), max = Math.max(bmp.width, bmp.height);
    if (file.type === "image/png" && max <= 400) return { blob: file, ext: "png", type: "image/png" }; // pixel-art : intact
    const k = Math.min(1, 1600 / max), cv = document.createElement("canvas");
    cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
    cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
    const blob = await new Promise((r) => cv.toBlob(r, "image/webp", 0.86));
    return { blob, ext: "webp", type: "image/webp" };
  }
  async function upload(file) {
    const p = await prepare(file);
    const path = `${Date.now()}-${O.slug(file.name.replace(/\.[^.]+$/, "")) || "image"}.${p.ext}`;
    const { error } = await sb.storage.from(C.BUCKET).upload(path, p.blob, { contentType: p.type, cacheControl: "31536000" });
    if (error) throw new Error(error.message);
    return sb.storage.from(C.BUCKET).getPublicUrl(path).data.publicUrl;
  }

  /* ---------- constructeurs de champs ---------- */
  const lab = (d) => `<span class="lab">${esc(d.label || "")}${d.hint ? `<em>— ${esc(d.hint)}</em>` : ""}</span>`;
  const setv = (obj, k, v, ctx) => { obj[k] = v; ctx.change(); };

  function build(d, obj, ctx) {
    const k = d.k;
    switch (d.t) {
      case "group": {
        const target = k ? ensure(obj, k, () => ({}))[0][k.split(".").pop()] : obj;
        const box = el("section", d.bare ? "" : "panel");
        if (!d.bare && d.title) box.append(el("h3", "", esc(d.title)));
        const inner = d.cols ? el("div", "row2") : box;
        d.fields.forEach((f) => { if (f.show && !f.show(target)) return; const n = build(f, target, ctx); if (n) inner.append(n); });
        if (d.cols) box.append(inner);
        return box;
      }
      case "text": {
        const [o, kk] = ensure(obj, k, () => (d.num ? 0 : ""));
        const w = el("label", "field"); w.innerHTML = lab(d);
        const i = el("input"); i.type = d.num ? "number" : d.url ? "url" : "text"; i.value = o[kk] ?? ""; if (d.ph) i.placeholder = d.ph;
        if (d.list) { const id = "dl" + Math.random().toString(36).slice(2, 7); i.setAttribute("list", id); const dl = el("datalist"); dl.id = id; dl.innerHTML = d.list().map((x) => `<option value="${esc(x)}">`).join(""); w.append(dl); }
        i.oninput = () => setv(o, kk, d.num ? Number(i.value) : i.value, ctx);
        w.append(i);
        if (d.test) { const b = el("button", "btn small", "Tester le lien ↗"); b.type = "button"; b.style.marginTop = "6px"; b.onclick = () => (O.safeLink(i.value) ? open(i.value, "_blank", "noopener") : toast("Colle d'abord un lien valide (https://…)", true)); w.append(b); }
        return w;
      }
      case "area": {
        const [o, kk] = ensure(obj, k, () => "");
        const w = el("label", "field"); w.innerHTML = lab(d);
        const ta = el("textarea"); ta.value = o[kk] ?? ""; ta.rows = d.rows || 4;
        const grow = () => { ta.style.height = "auto"; ta.style.height = Math.min(520, ta.scrollHeight + 4) + "px"; };
        ta.oninput = () => { setv(o, kk, ta.value, ctx); grow(); };
        if (!d.plain) {
          const bar = el("div", "fmt");
          [["B", "**", "Gras"], ["I", "*", "Italique"], ["≡", "==", "Surligné"], ["…", "{{", "Murmure"]].forEach(([t, m, title]) => {
            const b = el("button", "", `<span style="${t === "I" ? "font-style:italic" : ""}">${t}</span>`); b.type = "button"; b.title = title;
            b.onmousedown = (e) => e.preventDefault();
            b.onclick = () => { const a = ta.selectionStart, z = ta.selectionEnd, close = m === "{{" ? "}}" : m; ta.setRangeText(m + (ta.value.slice(a, z) || "texte") + close, a, z, "select"); ta.dispatchEvent(new Event("input")); ta.focus(); };
            bar.append(b);
          });
          w.append(bar);
        }
        w.append(ta); setTimeout(grow, 0);
        return w;
      }
      case "sel": {
        const [o, kk] = ensure(obj, k, () => (d.opts[0] || [""])[0]);
        const w = el("label", "field"); w.innerHTML = lab(d);
        const s = el("select"), list = d.opts.some((x) => x[0] === o[kk]) ? d.opts : [[o[kk], o[kk]], ...d.opts];
        s.innerHTML = list.map((x) => `<option value="${esc(x[0])}">${esc(x[1])}</option>`).join(""); s.value = o[kk] ?? "";
        s.onchange = () => { setv(o, kk, s.value, ctx); if (d.refresh) ctx.redraw(); };
        w.append(s); return w;
      }
      case "yes": {
        const [o, kk] = ensure(obj, k, () => d.def || "oui");
        const w = el("div", "field"); w.innerHTML = d.hint ? lab({ label: "", hint: d.hint }) : "";
        const l = el("label", "switch"), i = el("input"); i.type = "checkbox"; i.checked = o[kk] !== "non";
        const t = el("span", "", esc(d.label)); const sw = el("i");
        const sync = () => { t.textContent = i.checked || !d.offLabel ? d.label : d.offLabel; };
        i.onchange = () => { setv(o, kk, i.checked ? "oui" : "non", ctx); sync(); if (d.refresh) ctx.redraw(); }; sync();
        l.append(i, sw, t); w.append(l); return w;
      }
      case "hearts": {
        const [o, kk] = ensure(obj, k, () => "neutre");
        const w = el("div", "field"); w.innerHTML = lab(d);
        const box = el("div", "hearts");
        APPS.filter((a) => a[0] !== "mort" || o[kk] === "mort").forEach(([v, h]) => {
          if (v === "neutre") box.append(el("span", "hsep", "|"));
          const b = el("button", v === o[kk] ? "on" : "", `${h} <small>${APP_LABEL[v]}</small>`); b.type = "button";
          b.onclick = () => { o[kk] = v; box.querySelectorAll("button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); ctx.change(); };
          box.append(b);
        });
        w.append(box); return w;
      }
      case "img": {
        const [o, kk] = ensure(obj, k, () => "");
        const w = el("div", "field"); w.innerHTML = lab(d);
        const row = el("div", "imgf"), th = el("div", "thumb"), btns = el("div", "btns");
        const show = () => { th.innerHTML = o[kk] ? `<img src="${esc(o[kk])}" alt="" class="${/\.png$/.test(o[kk]) ? "px" : ""}">` : "Aucune image"; rm.hidden = !o[kk]; };
        const file = el("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
        const pick = el("button", "btn small primary", "Choisir une image"); pick.type = "button";
        const rm = el("button", "btn small", "Retirer"); rm.type = "button";
        const url = el("input"); url.type = "url"; url.placeholder = "…ou colle l'adresse d'une image (https://…)"; url.className = "urlin"; url.value = /^https?:/.test(o[kk] || "") ? o[kk] : "";
        const send = async (f) => { try { pick.textContent = "Envoi…"; o[kk] = await upload(f); url.value = o[kk]; ctx.change(); show(); toast("Image envoyée ✓"); } catch (e) { toast("Envoi impossible : " + e.message, true); } finally { pick.textContent = "Choisir une image"; } };
        pick.onclick = () => file.click(); file.onchange = () => file.files[0] && send(file.files[0]);
        rm.onclick = () => { o[kk] = ""; url.value = ""; show(); ctx.change(); };
        url.onchange = () => { o[kk] = url.value.trim(); show(); ctx.change(); };
        ["dragenter", "dragover"].forEach((ev) => w.addEventListener(ev, (e) => { e.preventDefault(); w.classList.add("drop"); }));
        ["dragleave", "drop"].forEach((ev) => w.addEventListener(ev, () => w.classList.remove("drop")));
        w.addEventListener("drop", (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) send(f); });
        btns.append(pick, rm, file); row.append(th, btns, url); w.append(row); show(); return w;
      }
      case "tags": {
        const [o, kk] = ensure(obj, k, () => []);
        const w = el("div", "field"); w.innerHTML = lab(d);
        const box = el("div", "tags"), i = el("input"); i.type = "text"; i.placeholder = "Ajouter un nom, puis Entrée";
        if (d.suggest) { const id = "dl" + Math.random().toString(36).slice(2, 7); i.setAttribute("list", id); const dl = el("datalist"); dl.id = id; dl.innerHTML = d.suggest().map((x) => `<option value="${esc(x)}">`).join(""); w.append(dl); }
        const draw = () => { box.querySelectorAll(".tag").forEach((x) => x.remove()); o[kk].forEach((t, n) => { const c = el("span", "tag soft", `${esc(t)} `); const x = el("button", "", "×"); x.type = "button"; x.title = "Retirer"; x.onclick = () => { o[kk].splice(n, 1); draw(); ctx.change(); }; c.append(x); box.insertBefore(c, i); }); };
        const add = () => { const v = i.value.replace(/,$/, "").trim(); if (v && !o[kk].includes(v)) { o[kk].push(v); ctx.change(); } i.value = ""; draw(); };
        i.onkeydown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } if (e.key === "Backspace" && !i.value && o[kk].length) { o[kk].pop(); draw(); ctx.change(); } };
        i.onchange = add; box.append(i); w.append(box); draw(); return w;
      }
      case "paras": {
        const [o, kk] = ensure(obj, k, () => []);
        const arr = o[kk], w = el("div", "field paras"); w.innerHTML = lab(d);
        const draw = () => {
          w.querySelectorAll(".p, .add").forEach((x) => x.remove());
          arr.forEach((txt, i) => {
            const row = el("div", "p"), holder = { [i]: txt };
            const sub = build({ t: "area", k: String(i), label: "", rows: d.rows || (d.short ? 1 : 5), plain: d.short, short: d.short }, arr, Object.assign({}, ctx, { change: () => ctx.change() }));
            sub.style.flex = "1"; sub.style.marginBottom = "0";
            const m = el("div", "mini");
            const mb = (t, fn, cls = "") => { const b = el("button", cls, t); b.type = "button"; b.onclick = fn; m.append(b); };
            mb("↑", () => { if (i) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; draw(); ctx.change(); } });
            mb("↓", () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; draw(); ctx.change(); } });
            mb("🗑", () => { if (!txt && !arr[i] || confirm("Supprimer ce bloc ?")) { arr.splice(i, 1); draw(); ctx.change(); } }, "del");
            row.append(sub, m); w.append(row);
          });
          const a = el("button", "add", d.addLabel || "+ Ajouter un paragraphe"); a.type = "button"; a.onclick = () => { arr.push(""); draw(); ctx.change(); }; w.append(a);
        };
        draw(); return w;
      }
      case "items": return buildItems(d, obj, ctx);
    }
  }

  const openSet = new WeakSet();
  function buildItems(d, obj, ctx) {
    const [o, kk] = ensure(obj, d.k, () => []);
    const arr = o[kk], root = el("div", d.sub ? "sub-items" : "panel");
    root.append(el(d.sub ? "span" : "h3", d.sub ? "lab" : "", esc(d.label || "")));
    const bar = el("div", "items-bar"), list = el("div", "items"), foot = el("button", "add", d.addLabel || "+ Ajouter"); foot.type = "button";
    let q = "";
    const sample = () => (d.sample ? d.sample() : arr.length && typeof arr[0] === "object" ? blank(arr[0]) : (d.fields.some((f) => f.k === "titre") ? { titre: "", texte: "" } : {}));
    const blank = (v) => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === "string" ? "" : typeof x === "number" ? 0 : Array.isArray(x) ? [] : x]));
    function draw() {
      list.innerHTML = "";
      const order = arr.map((it, i) => i);
      if (d.sort) order.sort((a, b) => (Number(arr[a][d.sort]) || 0) - (Number(arr[b][d.sort]) || 0));
      order.forEach((i) => {
        const it = arr[i], s = (d.sum || ((x) => ({ title: x.titre || x.nom || x.etape || "(sans titre)", sub: (x.texte || x.description || "").slice(0, 80) })));
        if (q && !JSON.stringify(it).toLowerCase().includes(q)) return;
        const box = el("div", "item" + (openSet.has(it) ? " open" : "")), head = el("div", "item-h"), body = el("div", "item-b");
        const fillHead = () => {
          const m = s(it);
          const th = m.thumb || m.mono ? (O.safeSrc(m.thumb) ? `<span class="th"><img src="${esc(m.thumb)}" alt="" loading="lazy"></span>` : `<span class="th" style="background:hsl(${O.hue(m.mono || "")} 38% 58%)">${esc(O.initials(m.mono || "?"))}</span>`) : "";
          head.innerHTML = `<span class="chev">▸</span>${th}<div class="tt"><strong>${esc(m.title)}</strong><small>${esc(m.sub || "")}</small></div><div class="bd">${(m.badges || []).join("")}</div>`;
          const acts = el("div", "acts");
          const ab = (t, ti, fn, cls = "") => { const b = el("button", cls, t); b.type = "button"; b.title = ti; b.onclick = (e) => { e.stopPropagation(); fn(); }; acts.append(b); };
          if (!d.sort) { ab("↑", "Monter", () => { if (i) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; draw(); ctx.change(); } }); ab("↓", "Descendre", () => { if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; draw(); ctx.change(); } }); }
          ab("⧉", "Dupliquer", () => { arr.splice(i + 1, 0, clone(it)); draw(); ctx.change(); });
          ab("🗑", "Supprimer", () => { if (confirm("Supprimer « " + (m.title || "cet élément") + " » ?")) { arr.splice(i, 1); draw(); ctx.change(); } }, "del");
          head.append(acts);
        };
        const sub = { change: () => { fillHead(); ctx.change(); }, redraw: () => { body.innerHTML = ""; fields(); } };
        const fields = () => quiet(() => d.fields.forEach((f) => { if (f.show && !f.show(it)) return; const n = build(f, it, sub); if (n) body.append(n); }));
        fillHead(); if (openSet.has(it)) fields();
        head.onclick = () => { const op = box.classList.toggle("open"); op ? (openSet.add(it), body.childElementCount || fields()) : openSet.delete(it); };
        box.append(head, body); list.append(box);
      });
    }
    if (d.search && arr.length > 5) { const s = el("input"); s.type = "search"; s.placeholder = "Filtrer…"; s.oninput = () => { q = s.value.toLowerCase(); draw(); }; bar.append(s); root.append(bar); }
    if (d.addMenu) {
      foot.hidden = true;
      const menu = el("div", "addmenu");
      d.addMenu.forEach(([t, preset]) => {
        const b = el("button", "add", esc(t)); b.type = "button";
        b.onclick = () => { const n = Object.assign(d.blank(), preset); arr.push(n); openSet.add(n); q = ""; draw(); ctx.change(); const last = list.lastElementChild; last && last.scrollIntoView({ behavior: "smooth", block: "center" }); };
        menu.append(b);
      });
      root.append(list, menu); draw(); return root;
    }
    foot.onclick = () => { const n = sample(); arr.push(n); openSet.add(n); q = ""; draw(); ctx.change(); const last = list.lastElementChild; last && last.scrollIntoView({ behavior: "smooth", block: "center" }); };
    root.append(list, foot); draw(); return root;
  }

  /* ---------- affichage des rubriques ---------- */
  function renderTabs() {
    const nav = $("tabs"); nav.innerHTML = "";
    SECTIONS.forEach((s) => {
      nav.append(el("h4", "", esc(s.g)));
      s.list.forEach((x) => {
        const n = x.id === "famille" ? (state.famille || []).length : x.id === "relations" ? (state.relations || []).length : x.id === "fils" ? (state.fils || []).length : x.id === "galerie" ? (state.galerie || []).length : "";
        const b = el("button", x.id === tab ? "on" : "", `<span class="ic">${x.ic}</span>${esc(x.label)}<span class="n">${n}</span>`); b.type = "button";
        b.onclick = () => { tab = x.id; render(); scrollTo(0, 0); }; nav.append(b);
      });
    });
  }
  function overview() {
    const wrap = el("div"), cards = el("div", "cards-ov");
    [["famille", "membres de la famille", (state.famille || []).length], ["relations", "relations", (state.relations || []).length], ["fils", "fils RP", (state.fils || []).length], ["histoire", "chapitres d'histoire", (state.histoire || []).length], ["sante", "entrées de santé", (state.sante || []).length], ["galerie", "images", (state.galerie || []).length], ["caractere", "traits de caractère", (state.caractere.qualites || []).length + (state.caractere.defauts || []).length]]
      .forEach(([id, t, n]) => { const b = el("button", "ov", `<b>${n}</b><span>${t}</span>`); b.type = "button"; b.onclick = () => { tab = id; render(); }; cards.append(b); });
    wrap.append(cards);
    const tips = el("section", "panel", `<h3>Pour bien démarrer</h3><ul class="tips">
      <li><strong>Relations</strong> : ajoute un chat, sa photo, s'il est vivant, son clan, puis des « avis datés » : le site dessine tout seul son Marais (nénuphars, grenouilles, brume).</li>
      <li><strong>Fils RP</strong> : colle le lien du fil Discord, il devient un bouton sur le site.</li>
      <li><strong>Mise en forme</strong> : dans les textes, utilise les boutons <b>B</b> <i>I</i> ≡ … (gras, italique, surligné, murmure).</li>
      <li><strong>Enregistrer</strong> : <kbd>Ctrl</kbd> + <kbd>S</kbd>. Un brouillon est gardé automatiquement dans ce navigateur si tu fermes l'onglet.</li>
      <li><strong>Photos</strong> : glisse-les sur un champ « Photo ». Elles sont allégées (WebP) automatiquement.</li></ul>`);
    wrap.append(tips); return wrap;
  }
  function render() {
    renderTabs();
    const sec = ALL.find((x) => x.id === tab) || ALL[0];
    $("sec-title").textContent = sec.title || sec.label; $("sec-help").textContent = sec.help || "";
    const ed = $("editor"); ed.innerHTML = "";
    if (sec.id === "vue") return ed.append(overview());
    const ctx = { change: () => { touch(); renderCounts(); }, redraw: () => {} };
    quiet(() => (sec.defs || []).forEach((d) => ed.append(build(d, state, ctx))));
  }
  function renderCounts() {
    const ns = { famille: (state.famille || []).length, relations: (state.relations || []).length, fils: (state.fils || []).length, galerie: (state.galerie || []).length };
    [...$("tabs").querySelectorAll("button")].forEach((b, i) => { const x = ALL.find((s) => b.textContent.includes(s.label)); if (x && x.id in ns) b.querySelector(".n").textContent = ns[x.id]; });
  }

  /* ---------- auth + chargement ---------- */
  function merged(savedData) {
    const base = clone(window.DEFAULT_CONTENT), s = O.migrate(savedData);
    if (s) for (const k of Object.keys(s)) if (Array.isArray(base[k]) === Array.isArray(s[k])) base[k] = (!Array.isArray(s[k]) && typeof s[k] === "object") ? Object.assign(base[k] || {}, s[k]) : s[k];
    return base;
  }
  async function checkAdmin() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return showLogin();
    const { data: ok, error } = await sb.rpc("bison_is_admin");
    if (error || ok !== true) { await sb.auth.signOut(); return showLogin(error ? "Base non configurée (voir supabase/setup.sql)." : "Ce compte Discord n'est pas autorisé."); }
    $("who").textContent = "Connecté·e : " + (session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Admin");
    $("login").hidden = true; $("dash").hidden = false;
    await load();
  }
  function showLogin(msg) { $("dash").hidden = true; $("login").hidden = false; $("login-msg").textContent = msg || ""; }
  async function load(keepTab) {
    const { data, error } = await sb.from(C.TABLE).select("data").eq("id", C.CONTENT_ID).maybeSingle();
    if (error) toast("Lecture impossible : " + error.message, true);
    state = merged(data?.data); saved = JSON.stringify(state); if (!keepTab) tab = "vue";
    render(); touch();
    try {
      const dr = JSON.parse(localStorage.getItem(DRAFT) || "null");
      if (dr && JSON.stringify(merged(dr.data)) !== saved) {
        const b = $("banner"); b.hidden = false;
        b.innerHTML = `Un brouillon non enregistré du ${new Date(dr.at).toLocaleString("fr-FR")} a été retrouvé. `;
        const r = el("button", "btn small primary", "Restaurer"), i = el("button", "btn small", "Ignorer"); r.type = i.type = "button";
        r.onclick = () => { state = merged(dr.data); b.hidden = true; render(); touch(); };
        i.onclick = () => { b.hidden = true; try { localStorage.removeItem(DRAFT); } catch (e) {} };
        b.append(r, i);
      }
    } catch (e) {}
  }
  async function save() {
    const btn = $("btn-save"); btn.disabled = true; btn.textContent = "Enregistrement…";
    const { error } = await sb.from(C.TABLE).upsert({ id: C.CONTENT_ID, data: state, updated_at: new Date().toISOString() });
    btn.disabled = false; btn.textContent = "Enregistrer";
    if (error) return toast("Erreur : " + error.message, true);
    saved = JSON.stringify(state); try { localStorage.removeItem(DRAFT); } catch (e) {} touch(); toast("Enregistré ✓ — le site est à jour");
  }
  $("btn-save").onclick = save;
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && state) { e.preventDefault(); save(); } });
  $("btn-undo").onclick = () => { if (confirm("Abandonner les modifications non enregistrées ?")) { try { localStorage.removeItem(DRAFT); } catch (e) {} load(true); } };
  $("btn-reset").onclick = () => { if (!confirm("Remplacer tout le contenu par les valeurs par défaut ? Rien n'est publié tant que tu n'enregistres pas.")) return; state = clone(window.DEFAULT_CONTENT); render(); touch(); };
  $("btn-export").onclick = () => { const a = el("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); a.download = "petit-bison.json"; a.click(); URL.revokeObjectURL(a.href); };
  $("file-import").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { state = merged(JSON.parse(await f.text())); render(); touch(); toast("Importé — clique sur Enregistrer pour publier"); } catch (err) { toast("Fichier JSON invalide", true); } e.target.value = ""; };
  $("btn-login").onclick = () => sb.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: location.origin + location.pathname } });
  $("btn-logout").onclick = async () => { await sb.auth.signOut(); showLogin(); };
  const th = $("btn-theme"); const setTheme = (t) => { document.documentElement.dataset.theme = t; th.textContent = t === "night" ? "☀" : "☾"; try { localStorage.setItem("pb-theme", t); } catch (e) {} };
  setTheme(document.documentElement.dataset.theme === "night" ? "night" : "day");
  th.onclick = () => setTheme(document.documentElement.dataset.theme === "night" ? "day" : "night");
  sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") showLogin(); });
  checkAdmin();
})();
