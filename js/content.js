// Contenu par défaut du site. Le dashboard (admin.html) enregistre une version modifiée dans Supabase,
// qui prend le dessus sur ce fichier.
window.DEFAULT_CONTENT = {
  identite: {
    nom: "Petit Bison",
    sous_titre: "Chaton du Clan de l'Ombre · Une petite tornade au grand cœur",
    citation: "Ce n'est rien ! Presque pas mal du tout !",
    image: "assets/bison-saute.webp",
    image2: "assets/bison-assis.webp",
    pseudo_joueur: ".araxia.",
    credits: ".araxia.",
    lunes: "5 lunes",
    clan: "Clan de l'Ombre",
    rang: "Chaton",
    sexe: "Femelle",
    note_sexe: "Non binaire dans le futur.",
    orientation: "Bisexuel",
    pv: 10,
    pa: 2,
    taille: "23 cm au garrot (adulte)",
    poids: "2,5 kg (adulte)",
  },

  reglages: {
    mascotte: "oui",
    sprite_marche: "assets/sprite-marche.png",
    sprite_assis: "assets/sprite-assis.png",
    sprite_regard: "assets/sprite-regard.png",
    accroche_accueil: "En quelques mots",
    texte_pied: "Personnage créé par",
  },

  noms: [
    { etape: "Chaton", nom: "Petit Bison", texte: "Son physique lui a valu ce nom : elle est aussi sombre que la créature, et ce nom devait aussi faire d'elle l'incarnation de la puissance de la bête." },
    { etape: "Apprenti", nom: "Nuage de Bison", texte: "" },
    { etape: "Adulte", nom: "—", texte: "Elle laisse la cheffe décider. (Guérisseuse)" },
    { etape: "Chef", nom: "Étoile de Bison", texte: "" },
    { etape: "Ancien", nom: "—", texte: "" },
  ],

  caractere: {
    description: [
      "Petit Bison est une boule d'énergie au grand cœur, qui découvre le monde avec des yeux brillants et des pattes qui n'arrêtent jamais. Bienveillante et toujours prête à réconforter ses camarades de nid, elle ne supporte pas de voir quelqu'un triste ou seul. Elle va vers les autres sans la moindre gêne, les fait rire avec ses grimaces et ses réparties, et s'adapte à chacun pour que tout le monde se sente bien avec elle. Sa joie de vivre et son optimisme sont contagieux : pour elle, une mauvaise journée n'est qu'une promesse de lendemain meilleur, et rien ne semble vraiment impossible. Elle ne manque pas de courage non plus, et n'hésite pas à se placer devant les autres quand elle sent le danger, même si son cœur bat à toute vitesse.",
      "Mais derrière cette allure rayonnante se cache une petite tornade qui fonce avant de réfléchir. Étourdie, elle oublie les consignes aussi vite qu'on les lui donne, et se retrouve souvent dans des situations qu'elle n'avait pas vu venir. Attendre est une épreuve pour elle : tout doit se passer tout de suite, et elle s'agite dès que les choses traînent. Franche jusqu'à la maladresse, elle dit ce qu'elle pense sans mesurer l'effet de ses mots, persuadée d'être simplement honnête, et ne comprend pas toujours pourquoi certains se vexent.",
      "Sous ses airs joyeux, Petit Bison est aussi très sensible. Un regard froid, une moquerie ou une critique peuvent la bouleverser en un instant, et elle cache souvent son chagrin derrière un grand sourire. Elle rêve en grand, imagine un monde plus beau et plus juste que celui qu'elle connaît, et supporte mal que la réalité ne suive pas ses rêves. Sûre de ses idées, elle peut se montrer têtue, voire un peu hautaine quand il s'agit de ses projets, convaincue que sa façon de faire est la meilleure.",
      "Chaton attachant et imparfait, elle est un mélange de tendresse, d'audace et de maladresse. Elle a tout à apprendre, mais elle avance avec un enthousiasme qui ne laisse personne indifférent.",
    ],
    qualites: [
      { titre: "Bienveillante", texte: "Petit Bison a le cœur grand comme sa carrure. Quand un autre chaton pleure ou se fait gronder, elle est la première à venir se blottir contre lui en ronronnant. Elle partage sa part de gibier sans qu'on le lui demande et prête sa fourrure pour réchauffer les plus frileux dans la pouponnière. Elle pardonne vite : une dispute avec un camarade de nid ne dure jamais plus d'une demi-lune, et elle est souvent la première à faire un pas vers l'autre. Les autres chatons ont déjà pris l'habitude de venir la trouver quand quelque chose ne va pas." },
      { titre: "Adaptable", texte: "Avec les chatons timides, elle parle doucement et joue sans bousculer ; avec les plus fonceurs, elle court, saute et se roule dans la poussière sans se plaindre. Elle sent d'instinct quand il faut rire et quand il faut se taire. Face aux guerriers sévères, elle se tient bien droite et se montre polie ; face aux anciens, elle écoute leurs histoires avec les yeux brillants. Si le jeu change au milieu d'une partie, elle suit sans râler. Elle déteste les disputes et fera tout pour les éviter, quitte à changer de jeu ou à proposer un compromis." },
      { titre: "Enthousiaste", texte: "Tout est une aventure pour Petit Bison. Un papillon devient une grande chasse, un bout de mousse trouvé dans le camp, un trésor. Elle se réveille la première, la queue déjà dressée, et parle de ses projets avant même d'avoir ouvert complètement les yeux. Quand quelque chose lui plaît, elle ne peut pas s'empêcher de sautiller sur place et d'en parler à tout le monde. Sa joie est contagieuse : même les plus grognons ont du mal à rester de mauvaise humeur près d'elle. Elle rêve déjà de son apprentissage et pose mille questions sur les techniques de soin et sur les herbes." },
      { titre: "Sociable (drôle)", texte: "Elle ne reste jamais seule longtemps : si personne ne vient à elle, elle va vers les autres, sans une once de gêne. Elle salue tout le monde, même les guerriers occupés, et se fait un devoir de découvrir le nom et l'histoire de chaque chat du clan. Elle adore faire rire : grimaces, imitations (elle fait une parfaite imitation de la cheffe qui éternue !), réponses du tac au tac. Parfois ses blagues sont un peu maladroites ou tombent à plat, mais elle en rit la première et recommence de plus belle. Pour elle, une journée sans rire est une journée perdue." },
      { titre: "Courageuse", texte: "Petit Bison n'a pas peur de grand-chose, ou du moins, elle ne le montre pas. Quand un renard rôde près du camp ou quand un orage fait trembler la pouponnière, elle se place devant les autres chatons, le poil hérissé, en prétendant que « ce n'est rien ». Elle a le cœur qui bat fort comme tout le monde, mais elle avance quand même. Elle s'est déjà aventurée trop près de la lisière du camp juste pour prouver qu'elle pouvait le faire, au grand dam de sa mère. Pour elle, le courage, c'est de protéger ceux qu'on aime, et elle veut devenir aussi forte que le bison dont elle porte le nom." },
      { titre: "Optimiste", texte: "Pour elle, après la pluie vient toujours le soleil, et la proie manquée aujourd'hui sera attrapée demain. Quand le gibier se fait rare, elle assure aux autres que la prochaine chasse sera meilleure. Quand elle tombe ou se fait mal, elle se relève en riant et dit que « ça ne fait presque pas mal ». Elle a une confiance absolue en son clan et en sa cheffe, et pense sincèrement que tout finira toujours par s'arranger. Cette confiance est rassurante pour les autres chatons, même si elle ignore encore que la vie au clan peut être plus dure qu'elle ne le croit." },
    ],
    defauts: [
      { titre: "Étourdie", texte: "Petit Bison a la tête pleine de mille choses à la fois, et il y en a toujours une qui s'échappe. On lui demande de rapporter de la mousse à la pouponnière, et elle revient les pattes vides, parce qu'un scarabée a croisé sa route en chemin. Elle oublie les consignes à peine données, perd ses jouets de brindilles, et se retrouve souvent au mauvais endroit en se demandant comment elle y est arrivée. Elle fonce avant de regarder où elle met les pattes : elle a déjà trébuché sur un camarade de nid, renversé une réserve de plumes et marché dans une flaque juste après avoir été lavée. Elle s'excuse toujours avec de grands yeux sincères, mais la fois suivante, elle recommence, car elle n'a pas vu venir les conséquences." },
      { titre: "Impatiente", texte: "Attendre est une véritable torture pour elle. Quand on lui dit « bientôt », elle entend « tout de suite » et demande toutes les trois secondes si c'est le moment. Elle trépigne devant l'entrée de la pouponnière en attendant la fin de la pluie, tourne en rond quand les anciens racontent une histoire trop longue et pousse des soupirs si bruyants qu'on les entend de l'autre bout du camp. Son museau remue, sa queue fouette l'air, ses pattes ne tiennent pas en place. Les autres la trouvent un peu nerveuse, et elle déteste qu'on lui dise de « rester calme » : comment rester calme quand il se passe tant de choses, et que rien n'avance ? Elle a déjà quitté une partie de cache-cache en plein milieu parce que son camarade mettait « trop longtemps » à la chercher." },
      { titre: "Excès de franchise", texte: "Petit Bison pense sincèrement qu'être honnête, c'est dire tout ce qui lui passe par la tête, sans réfléchir à comment les mots vont être reçus. « Ton poil est tout emmêlé aujourd'hui », « ta chasse imaginaire était nulle », « ça sent mauvais ici » : elle le dit avec le sourire, sans méchanceté, persuadée de rendre service. Mais ses remarques piquent, et certains chatons se vexent ou s'éloignent, sans qu'elle comprenne pourquoi. Quand on le lui fait remarquer, elle se défend en disant qu'elle ne fait que dire la vérité, et elle s'abrite derrière cette excuse pour ne pas se remettre en question. Il lui faudra encore du temps pour comprendre qu'on peut être honnête et doux à la fois." },
      { titre: "Hypersensible", texte: "Sous son air joyeux, elle ressent tout, très fort. Un mot de travers, un regard froid ou une moquerie, même légère, et ses oreilles se couchent, sa queue retombe et ses yeux se remplissent de larmes. Ses émotions sont comme une grande vague : elles arrivent d'un coup et l'emportent. Elle peut passer de l'éclat de rire à la panique en un battement de cils, pour une simple inquiétude : « Et si on ne m'aimait plus ? », « Et si j'avais mal fait ? ». Elle a du mal à encaisser la critique, même gentille, et se cache parfois dans un coin du nid pour reprendre son souffle, en espérant que personne ne remarque qu'elle a pleuré. Elle dit toujours après que « ce n'est rien », mais son cœur bat encore très fort." },
      { titre: "Arrogante", texte: "Quand elle a une idée en tête, Petit Bison est certaine que c'est la meilleure, et elle n'hésite pas à le faire savoir. Pendant les jeux, elle décide des règles, distribue les rôles et balaie les propositions des autres d'un « non, ça ne marchera pas, fais comme moi ». Elle se vante de ce qu'elle sait déjà (ou croit savoir) sur la chasse, le combat ou la vie des guerriers, et prend un air supérieur face aux chatons plus petits ou moins informés. Elle n'a pas conscience d'être condescendante : elle pense simplement avoir raison. Se tromper la désarçonne et elle met du temps à l'admettre. Ce défaut ne se montre que quand il est question de ses projets, ailleurs elle reste bien plus souple." },
      { titre: "Idéaliste", texte: "Dans la tête de Petit Bison, tout est toujours plus grand, plus beau et plus facile que dans la réalité. Elle s'imagine déjà victorieuse de grandes batailles, adorée de tout le clan, et suivie par les légendes qui sauront son nom. Elle fabrique des plans magnifiques, sans penser aux obstacles, au temps qu'il faudra ou à ce qui pourrait mal tourner. Quand la réalité ne suit pas, elle est sincèrement surprise, parfois blessée : « Mais ça devait se passer autrement ! » Elle a du mal à accepter que le monde ne soit pas aussi parfait que ses rêves, et que les gens ne soient pas toujours aussi bons ou justes qu'elle l'espère." },
    ],
  },

  gouts: {
    aime: [
      { titre: "Qu'on s'intéresse à elle", texte: "Petit Bison adore qu'on s'intéresse à elle. Quand quelqu'un lui pose une question, l'écoute raconter sa journée ou lui demande son avis, elle se redresse fièrement, les yeux brillants, et parle sans pouvoir s'arrêter. Elle aime être au centre des conversations, et même un simple « Tiens, tu es là, Petit Bison ! » suffit à lui faire dresser la queue de bonheur. Quand on l'ignore, elle tourne autour du chat en question, jusqu'à obtenir un regard ou un mot." },
      { titre: "Jouer, tout le temps", texte: "Elle joue à tout, tout le temps, et avec n'importe quoi : une plume, une brindille, une pierre, la queue d'un camarade (qui n'a pas toujours son mot à dire). Chasse imaginaire, combats de mousse, course autour de la pouponnière, elle invente un jeu avec ce qui lui passe sous la patte. Elle n'a pas de jeu préféré, car le meilleur est toujours celui qu'elle est en train de jouer. Si quelqu'un refuse de jouer avec elle, elle change de jeu et revient à la charge." },
      { titre: "La brume du marais", texte: "Quand la brume monte sur le marais, Petit Bison est aux anges. Tout devient mystérieux, les formes se cachent, les sons s'étouffent : c'est le terrain de jeu parfait pour un cache-cache. Elle se glisse dans les nappes blanches, retient son souffle pour qu'on ne l'entende pas, et surgit en poussant un cri de victoire. Elle s'imagine aussi que la brume est un grand secret du clan, que seuls les plus braves osent traverser." },
      { titre: "Son beau poil", texte: "Elle tient beaucoup à son poil. Elle passe de longs moments à se lécher, à remettre en place la moindre touffe qui dépasse, et boude quand elle se retrouve pleine de boue après une partie. Sentir sa fourrure sombre bien lisse et brillante la rend fière : un vrai petit bison élégant, comme elle aime le dire. Elle remarque d'ailleurs quand les autres sont ébouriffés, et ne se gêne pas pour le leur dire." },
      { titre: "Les minois qui s'illuminent", texte: "Rien ne la rend plus heureuse que de voir un minois s'illuminer. Elle fait tout pour y parvenir : une grimace, une blague, un petit cadeau comme une plume ou une feuille jolie. Quand elle réussit à faire rire un chat grognon, elle en est fière toute la journée, et elle compte ses « victoires » en secret. Voir quelqu'un de triste lui serre le cœur, et elle ne peut pas s'en désintéresser." },
      { titre: "La grenouille", texte: "La grenouille c'est sa proie préférée, sans hésitation. Elle trouve leur goût délicieux, un peu sucré et très frais, et elle fait un festin dès qu'on lui en rapporte une. Elle aime aussi les regarder sauter dans le marais, et rêve déjà de les chasser elle-même. Elle réclame souvent de la grenouille quand on lui demande ce qu'elle veut manger." },
    ],
    deteste: [
      { titre: "Les cris", texte: "Quand on lui crie dessus, Petit Bison se fige, les oreilles plaquées contre la tête, et elle a du mal à comprendre ce qu'on lui dit tant elle est bouleversée. Même une remarque faite d'un ton un peu sec la blesse. Elle préfère qu'on lui explique calmement, car elle écoute bien mieux quand on lui parle doucement. Les critiques la poursuivent longtemps : elle les ressasse le soir dans son nid, en se demandant ce qu'elle a mal fait." },
      { titre: "Le plein soleil", texte: "Elle n'aime pas être exposée en plein soleil. La chaleur l'alourdit, elle a l'impression que sa fourrure sombre chauffe et lui colle à la peau, et elle devient grincheuse. Elle cherche toujours l'ombre : sous un buisson, dans la pouponnière, derrière un rocher. Elle préfère de loin les jours gris, humides et brumeux, qui lui paraissent bien plus agréables et pleins de promesses." },
      { titre: "Les contraintes", texte: "Elle déteste qu'on lui impose des horaires ou qu'on la force à faire quelque chose. Dès qu'on lui dit « tu dois », elle se hérisse et traîne les pattes, alors qu'elle aurait fait la même chose avec plaisir si on lui avait laissé le choix. Elle fait les choses quand elle en a envie, à son rythme, et si possible à sa manière. Les journées toutes pareilles l'ennuient à mourir, et elle cherche toujours un moyen de les rendre plus amusantes." },
      { titre: "L'écureuil", texte: "Pour l'écureuil, elle trouve son goût étrange, trop fort et un peu rance, et fait une grimace à la moindre bouchée. Elle préfère laisser sa part, ou la donner discrètement à quelqu'un d'autre, plutôt que de se forcer à la manger. Elle ne comprend pas comment les autres peuvent l'apprécier, et ne se gêne pas pour le dire !" },
      { titre: "Les câlins collés-serrés", texte: "Elle n'aime pas qu'on se colle à elle ou qu'on se blottisse contre sa fourrure. Elle se sent à l'étroit, un peu prisonnière, et se dégage en se tortillant, parfois sans trop de délicatesse. Elle a besoin d'espace, même au milieu des autres, et se met à l'écart quand on la serre de trop près. Ce n'est pas qu'elle n'aime pas les autres, c'est simplement que ça la met mal à l'aise." },
      { titre: "Être rabaissée", texte: "Elle déteste qu'on la rabaisse, qu'on se moque d'elle ou qu'on lui dise qu'elle est « trop petite » ou « trop jeune » pour quelque chose. Elle se redresse alors de toute sa taille et répond avec fierté, même si son cœur tremble un peu. Se sentir inférieure aux autres la touche en plein cœur, et elle fait tout pour prouver qu'elle en est capable." },
    ],
    peurs: [
      { titre: "Le vide", texte: "Petit Bison a le vertige, et ça se voit. Dès que ses pattes quittent le sol de plus de quelques longueurs de souris, son ventre se noue, ses griffes s'accrochent à tout ce qui passe et elle n'ose plus bouger. Un rocher un peu trop haut, une souche, une branche basse : elle préfère les contourner en prétendant qu'elle n'en a « pas envie ». Quand les autres chatons grimpent en riant sur les racines ou escaladent un tronc, elle reste en bas, la queue basse, à les regarder avec un mélange d'envie et de panique. Si on la met en hauteur sans la prévenir, elle se fige, les yeux écarquillés, et son cœur bat si fort qu'elle l'entend dans ses oreilles. Elle déteste qu'on la voie avoir peur, alors elle dit que le vide « ne lui fait rien », mais elle ne s'approche jamais du bord. Pour une chaton qui se croit si courageuse, c'est un secret qu'elle garde jalousement." },
      { titre: "La brume qui murmure", texte: "Elle aime la brume pour jouer, mais depuis qu'elle a entendu parler des cauchemars qui hantent le Clan de l'Ombre, elle ressent aussi un frisson quand elle devient trop épaisse. Elle a entendu les murmures des anciens et les chuchotements des autres chatons, et son imagination fait le reste : des ombres qui bougent, des voix qui l'appellent, des yeux qui brillent dans le blanc. La nuit, quand le brouillard s'insinue jusqu'à l'entrée de la pouponnière, elle se réveille parfois en sursaut, le poil hérissé, sans savoir si elle a rêvé ou non. Elle ne le dit à personne et fait semblant de dormir. Le lendemain, elle retourne jouer dans la brume avec encore plus d'entrain, comme pour se prouver qu'elle n'a pas peur. C'est une peur qui la fascine autant qu'elle l'effraie, et qui ne la quitte jamais vraiment." },
    ],
    habitudes: [
      { titre: "Couper la parole", texte: "Petit Bison a toujours quelque chose à dire, et surtout, elle ne peut pas attendre son tour. Dès qu'une idée lui traverse l'esprit, les mots se bousculent dans sa gueule et jaillissent avant que l'autre ait fini sa phrase. « Moi aussi ! », « Attends, attends, je sais ! », « Mais non, c'est comme ça que... » : elle enchaîne, les yeux brillants, convaincue que ce qu'elle a à dire est trop important pour attendre. Elle ne le fait jamais par méchanceté ou par manque de respect, c'est simplement plus fort qu'elle : son enthousiasme déborde plus vite que sa patience. Quand on le lui fait remarquer, elle se mord la langue, s'excuse en baissant les oreilles, et promet de faire attention. Elle tient parfois quelques instants, avant de recommencer à la première occasion. Les anciens soupirent en la voyant arriver au milieu d'une histoire, mais ils finissent souvent par sourire de sa vivacité." },
      { titre: "Le rire nerveux", texte: "Quand un silence s'installe trop longtemps, ou quand l'ambiance devient gênante, Petit Bison ne sait pas quoi faire de ses pattes et de ses mots, alors elle rit. Ce n'est pas son rire habituel, franc, sonore et communicatif : c'est un petit rire aigu, un peu étranglé, qui s'échappe malgré elle et qui sonne légèrement faux. Elle rit quand on la gronde, quand deux chats se disputent près d'elle, ou quand une question reste sans réponse, comme pour dissiper le malaise. Elle ne se rend pas toujours compte qu'elle le fait, et ce rire peut mal tomber : certains y voient de l'insolence, ou de la moquerie, alors qu'elle est simplement mal à l'aise. Ceux qui la connaissent bien savent le reconnaître : ses oreilles frémissent, sa queue s'agite nerveusement, et son sourire ne monte pas jusqu'à ses yeux." },
    ],
  },

  physique: {
    description: [
      "Petit Bison est petite, même pour une chaton de son âge. Elle est légère et ne pèse presque rien quand on la soulève par la peau de la nuque, mais son corps raconte autre chose : trapu, ramassé, monté sur des pattes courtes qui la rapprochent du sol. Ses larges épaules et ses muscles déjà bien dessinés sous la fourrure donnent l'impression d'un petit bloc de puissance, comme si on avait enfermé un grand chat dans un corps de chaton. Quand elle joue à se battre avec ses camarades de nid, on remarque vite qu'elle est plus solide qu'elle n'en a l'air : elle encaisse les bousculades sans broncher et pousse bien plus fort que sa taille ne le laisse croire. Elle n'a rien de la finesse élancée des autres chatons du clan, et c'est justement ce qui la rend reconnaissable.",
      "Ses oreilles sont repliées vers l'avant et vers le bas, petites et rondes, comme celles de son baba. C'est le seul trait qu'elle tient d'iel, et elle y est très attachée, même si elle ne le dit pas. Elles lui donnent un air doux, presque tendre, qui contraste avec sa carrure et son franc-parler. Quand elle est contente, elles se redressent légèrement sur le dessus, sans jamais se dresser complètement. Quand elle est vexée ou triste, elles se plaquent encore un peu plus contre son crâne, ce qui trahit ses émotions plus vite qu'elle ne le voudrait.",
      "Son pelage est sombre, brun foncé comme l'écorce humide d'un vieux tronc, mais il est entrecoupé de plaques et de mèches de roux qui le réchauffent. Ce mélange de chocolat et de roux la rend écaille de tortue, avec des taches irrégulières qui épousent ses flancs, son dos et ses joues, comme si on les avait posées au hasard d'un coup de patte. Son poil est doux, épais et bien entretenu : elle passe beaucoup de temps à le lécher et à le lisser, car elle est fière de le voir briller sous la lumière du soleil et de la lune. Les reflets roux s'embrasent alors, tandis que le brun profond prend des teintes presque noires dans l'ombre. Dans la brume du marais, elle se fond dans les ombres, avec seulement ses taches rousses pour la trahir.",
      "Quelques touches de blanc viennent adoucir l'ensemble : le bout de ses pattes, comme des chaussettes ou des petits gants, son poitrail, son museau et son ventre. Ces marques claires se salissent vite, ce qui la contrarie, car elle déteste avoir les pattes pleines de boue après une partie dans le marais. Son museau blanc lui donne une expression curieuse et un peu espiègle, surtout quand elle le fronce en riant ou en faisant une grimace.",
      "Petit Bison ne marche pas comme les autres. Elle garde la tête légèrement basse et un peu en avant, comme si elle s'apprêtait à charger, ce qui lui donne un air déterminé, même quand elle se promène simplement dans le camp. Ses épaules sont un peu plus hautes que le reste de son dos, formant une petite bosse qui accentue cette impression et qui rappelle la silhouette de la bête dont elle porte le nom. Quand elle court, elle ne bondit pas avec légèreté : elle fonce, lourde et directe, en faisant voler la poussière derrière elle. Elle n'est pas la plus gracieuse, mais personne ne la voit arriver sans la remarquer.",
      "Ses yeux sont d'un vert prairie intense, vif et lumineux, qui ressort fortement sur son pelage sombre. C'est une couleur que le Clan de l'Ombre a perdue depuis que la brume maudite a avalé les prés et les feuillages : quand on croise son regard, on a presque l'impression de revoir un coin d'herbe en plein printemps. Ses yeux sont très expressifs, grands et brillants quand elle est enthousiaste, humides et inquiets quand elle est blessée par un mot, et plissés de malice quand elle prépare une farce.",
      "Une fois adulte, Petit Bison ne sera pas grande : elle atteindra seulement 23 cm au garrot, pour un poids léger de 2,5 kg. Sa carrure restera compacte et robuste, et sa bosse d'épaules ne fera que se préciser avec le temps.",
    ],
    forts: [
      { titre: "Robuste", texte: "Petit Bison est petite, mais son corps est fait d'un bois solide. Ses épaules larges et ses muscles déjà marqués lui permettent d'encaisser les bousculades, les chutes et les coups de patte sans broncher. Quand un jeu tourne mal et qu'un camarade de nid lui retombe dessus, elle se secoue, ronchonne un peu et repart à l'assaut. Elle se remet vite des bobos et des écorchures, et elle en est secrètement très fière : pour elle, un vrai bison ne se plaint pas pour si peu. Ceux qui l'ont prise pour une proie facile à cause de sa taille ont souvent été surpris." },
      { titre: "Endurante", texte: "Elle peut courir, sauter et jouer pendant des heures sans s'essouffler, alors que les autres chatons sont déjà effondrés dans la mousse. Elle n'est pas rapide, mais elle tient : lourde et régulière, elle avance au même rythme du matin jusqu'au soir. Elle fait parfois la course en comptant sur ça, laisse les autres partir comme des flèches, puis les rattrape quand ils soufflent. Son énergie semble sans fond, ce qui épuise souvent ses camarades de jeu plus que le jeu lui-même." },
      { titre: "Ouïe fine", texte: "On pourrait croire que ses oreilles pliées l'handicapent, mais c'est tout le contraire : elle entend des bruits que les autres ne remarquent même pas, comme un pas léger dans les roseaux, un craquement lointain ou deux chats qui chuchotent à l'autre bout du camp. Dans la brume, quand la vue ne sert plus à rien, son ouïe est son meilleur atout, et c'est pour ça qu'elle gagne si souvent à cache-cache. Elle la trahit parfois : elle entend des conversations qui ne la regardent pas, et ne sait pas toujours faire semblant de ne rien avoir saisi." },
      { titre: "Équilibre parfait", texte: "Elle retombe toujours sur ses pattes, même après une glissade ou une pirouette ratée. Elle peut marcher sur un tronc couché, traverser une pierre glissante dans le marais ou se tenir sur une souche étroite sans vaciller. Son centre de gravité bas et ses pattes courtes l'aident beaucoup : elle est plantée dans le sol comme une petite souche, et il est difficile de la renverser. C'est son talent préféré, qu'elle montre volontiers, du moment que le sol reste tout près." },
    ],
    faibles: [
      { titre: "Discrétion", texte: "Entre sa démarche de charge, son souffle sonore, ses pattes lourdes et sa tendance à parler ou à rire, Petit Bison ne passe jamais inaperçue. Elle fait craquer chaque brindille et glisser chaque feuille sèche, et sa queue fouette l'air sans qu'elle s'en rende compte. Quand elle essaie de se faufiler quelque part, tout le monde l'entend arriver bien avant de la voir. Elle ne comprend pas pourquoi ça ne marche pas, puisque dans sa tête elle est « silencieuse comme une ombre »." },
      { titre: "Réflexes lents", texte: "Elle est solide, mais pas vive. Il lui faut un temps de plus que les autres pour réagir : une patte qui surgit, un camarade qui bondit, un caillou qui roule, et elle est déjà touchée avant d'avoir compris. Elle esquive mal et ne peut compter que sur sa robustesse pour encaisser. Pendant les jeux de bagarre, elle se retrouve souvent plaquée au sol en riant, sans avoir vu le coup venir. Sa distraction n'arrange rien : un papillon qui passe, et elle rate l'attaque." },
      { titre: "Morsure faible", texte: "Elle n'a pas l'habitude de se servir de sa mâchoire pour se battre. Quand elle mord, c'est plus un pincement qu'une vraie morsure, et ses petites crocs ne font que chatouiller. Elle préfère pousser, plaquer ou bousculer avec ses épaules, et oublie d'utiliser ses dents dans les jeux de combat. Ses camarades l'ont vite remarqué, et cela déçoit un peu Petit Bison, qui aimerait avoir la mâchoire d'une vraie bête." },
      { titre: "Raideur articulaire", texte: "Son corps trapu manque de souplesse. Elle ne se plie pas facilement, se tord mal et a du mal à atteindre certaines parties de son dos quand elle se lèche. Les sauts incroyables, les pirouettes serrées et les passages étroits lui demandent plus d'efforts qu'aux autres, et elle se retrouve parfois coincée là où un autre chaton se serait glissé sans problème. Elle compense par la force, ce qui ne marche pas toujours, et elle râle en frottant ses pattes quand elle a trop forcé." },
    ],
    handicap: { citation: "", intro: "", points: [] },
    accessoires: { citation: "", points: [] },
    cicatrices: [],
  },

  famille_infos: [
    { titre: "Conjoint·e", texte: "Jamais de sa vie." },
    { titre: "Descendance", texte: "Jamais de sa vie." },
    { titre: "Mentorat", texte: "À voir dans une lune." },
  ],

  histoire: [
    "0 lune — Naissance.",
    "5 lunes — Présent.",
  ],

  convictions: {
    clan: {
      citation: "Une grande famille ne peut pas se disputer sérieusement.",
      paragraphes: [
        "Petit Bison se sent chez elle au Clan de l'Ombre, et l'idée d'en partir ne lui a jamais traversé l'esprit. Pour elle, le camp est un grand nid où chacun a sa place : les guerriers qui rentrent de patrouille, les anciens qui racontent leurs histoires, les autres chatons avec qui elle joue. Elle salue tout le monde, connaît (ou veut connaître) chaque nom, et reste persuadée que tout le clan l'adore autant qu'elle l'adore. Elle ne voit pas les tensions ni les regards agacés, ou elle choisit de ne pas les voir, car dans sa tête, une grande famille ne peut pas se disputer sérieusement. Elle se sent fière d'être une Ombreuse, et rêve de défendre son clan quand elle sera plus grande, sans vraiment savoir ce que cela demande. Sa loyauté est simple, sincère et entière : le clan passe avant tout, même si elle n'a pas encore mesuré ce que cela pourrait lui coûter.",
      ],
    },
    autres_clans: {
      intro: "Petit Bison n'a pas vraiment d'avis sur les autres clans, tout simplement parce qu'elle ne les connaît pas. Elle n'a jamais franchi la frontière, et ce qu'elle sait vient des histoires entendues dans la pouponnière ou près du tas de gibier. On lui a parlé du Clan du Vent et du Clan du Tonnerre, et son imagination a fait le reste : des chats rapides comme l'éclair, des guerriers immenses, des camps pleins de soleil. Mais pour elle, ce ne sont que des histoires, et elle préfère attendre de voir par elle-même avant de juger. Sa curiosité l'emporte sur la méfiance : elle poserait volontiers mille questions à un chat d'un autre clan, si l'occasion se présentait.",
      clans: [
        { nom: "L'ancien Clan de la Rivière", texte: "Elle ne fait aucune distinction. Plusieurs de ses anciens membres vivent désormais au Clan de l'Ombre, et pour elle, ils sont des Ombreux comme les autres. Elle ne comprend pas toujours pourquoi certains adultes parlent encore d'eux à voix basse ou leur lancent des regards en coin, et il lui arrive de poser la question tout haut, sans penser à la gêne que cela peut créer." },
      ],
    },
    etoiles: {
      citation: "Les étoiles finiront par chasser la brume.",
      paragraphes: [
        "Petit Bison croit au Clan des Étoiles de tout son cœur. Pour elle, ce sont des êtres supérieurs, mystérieux et bienveillants, qui veillent sur le clan depuis le ciel, même quand la brume cache les étoiles. Elle lève souvent les yeux la nuit, cherchant une lueur entre les nappes blanches, et leur parle parfois à voix basse avant de s'endormir. On raconte qu'ils auraient maudit le clan, mais elle n'y prête pas attention : une malédiction, pour elle, ressemble plus à une épreuve qu'à une punition, et le Clan des Étoiles doit sûrement avoir ses raisons. Même quand les cauchemars la réveillent en pleine nuit, sa foi ne vacille pas, elle s'y accroche même davantage. C'est une croyance simple et pleine de confiance, qui reflète bien son optimisme : elle est convaincue que les étoiles finiront par chasser la brume.",
      ],
    },
  },

  // Famille et relations ont la même forme : photo, vivant ou non, PJ ou PNJ, clan / groupe, avis datés (phases).
  // place (famille seulement) : ascendant, fratrie, descendant, autre.
  famille: [
    { nom: "Pensée de Libellule", lien: "Mère", place: "ascendant", groupe: "Clan de l'Ombre", rang: "", type: "PNJ", joueur: "", vivant: "oui", image: "", notes: "",
      phases: [{ age: 0, appreciation: "pos3", description: "Sa mère. Petit Bison s'est déjà aventurée trop près de la lisière du camp, au grand dam de sa mère." }] },
    { nom: "Langue d'Ortie", lien: "Baba", place: "ascendant", groupe: "Clan de l'Ombre", rang: "", type: "PNJ", joueur: "", vivant: "oui", image: "", notes: "",
      phases: [{ age: 0, appreciation: "pos3", description: "Son baba. Elle tient de iel ses oreilles repliées, le seul trait dont elle a hérité, et elle y est très attachée." }] },
    { nom: "Petit Sanglier", lien: "Frère", place: "fratrie", groupe: "Clan de l'Ombre", rang: "Chaton", type: "PNJ", joueur: "", vivant: "oui", image: "", notes: "",
      phases: [{ age: 0, appreciation: "pos2", description: "Son frère de nid." }] },
  ],

  relations: [],

  fils: [],

  galerie: [
    { titre: "Petit Bison — en bondissant", categorie: "Illustrations", image: "assets/bison-saute.webp", description: "Fiche d'apparence, pose 1." },
    { titre: "Petit Bison — assise", categorie: "Illustrations", image: "assets/bison-assis.webp", description: "Fiche d'apparence, pose 2." },
    { titre: "Pixel — en marche", categorie: "Pixel-art", image: "assets/sprite-marche.png", description: "Sprite pixel-art." },
    { titre: "Pixel — assise", categorie: "Pixel-art", image: "assets/sprite-assis.png", description: "Sprite pixel-art." },
    { titre: "Pixel — le nez en l'air", categorie: "Pixel-art", image: "assets/sprite-regard.png", description: "Sprite pixel-art." },
  ],
};
