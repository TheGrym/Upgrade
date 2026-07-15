// ─────────────────────────────────────────────────────────────────────────────
// programs.js — UpGrade
// Programme UP / LOW / UP — Révisé, validé evidence-based
//
// Sources :
//   Schoenfeld & Krieger (2017) J Strength Cond Res — volume optimal 10-20 s/muscle/sem
//   Pelland et al. (2024) Sports Med — dose-réponse, 67 études
//   Schoenfeld & Grgic (2016) Sports Med — fréquence 2x/sem supérieure à 1x
//   Robinson et al. (2024) — RIR 1-3 ≈ échec pour l'hypertrophie
//
// Volume hebdomadaire validé :
//   Pectoraux      : 12 s  (9 UP A + 3 UP B)   cible 12-16 ✓
//   Haut pec       :  6 s  (priorité UP A)       ✓
//   Dos largeur    : 10 s  (4 UP A + 6 UP B)    ✓
//   Dos épaisseur  :  5 s  (2 UP A + 3 UP B)    ✓ (rapport largeur/épaisseur → effet V)
//   Épaules        : 12 s  (6 UP A + 6 UP B)    cible 12-16 ✓
//   Biceps         : 12 s  (6 UP A + 6 UP B)    cible 10-14 ✓
//   Triceps        : 12 s  (6 UP A + 6 UP B)    cible 12-16 ✓
//   Quadriceps     :  7 s  + indirect Hack Squat ✓
//   Ischio-jambiers:  6 s  + indirect Hack Squat ✓
//   Core           : 12 s  (6 UP A + 6 UP B)    ✓
// ─────────────────────────────────────────────────────────────────────────────

export const PROGRAMS = {
  uplowup: {
    id: "uplowup",
    name: "UP / LOW / UP",
    subtitle: "HYPERTROPHIE · 3 SESSIONS",
    author: "JULIEN",
    description: "Split haut/bas/haut. Volume validé 12-18 s/muscle/sem. Surcharge progressive par double progression.",
    sessions: [

      // ═══════════════════════════════════════════════════════════════════
      // UP A — Push dominant · Priorité haut pec · Core
      // ═══════════════════════════════════════════════════════════════════
      {
        id: "u1", key: "u1", label: "UP 1", code: "A-01",
        title: "UPPER BODY A", num: "01",
        muscles: "PEC (HAUT) · ÉPAULES · TRICEPS · BICEPS · DOS",
        priority: "Commencer par DI Haltère — priorité haut pec quand tu es frais.",
        exercises: [

          {
            id: "di_halt",
            name: "DI Haltère",
            sets: 4, min: 8, max: 12,
            muscles: "Chef claviculaire pec · Deltoïde ant. · Triceps",
            placement: "Banc à 30° exactement. Coudes à 45-70° du buste.",
            tips: [
              "Banc à 30° — au-delà de 45° les épaules prennent le relais.",
              "Omoplates rétractées et abaissées, maintenues tout au long.",
              "Descente en 3 secondes, cherche l'étirement maximal du haut du pec.",
              "Pense 'écraser avec le haut du pec', pas 'pousser avec les épaules'.",
              "Mindmuscle : pose les doigts sur le haut du pec avant de saisir les haltères.",
            ],
          },

          {
            id: "dc_halt",
            name: "DC Haltère",
            sets: 3, min: 6, max: 10,
            muscles: "Chef sternal pec · Deltoïde ant. · Triceps",
            placement: "Banc plat. Omoplates rétractées avant de saisir.",
            tips: [
              "Omoplates rétractées et verrouillées — ne les relâche pas.",
              "Descente contrôlée en 3 temps, coudes à 45° du buste.",
              "Étirement maximal en bas, pause 1 seconde avant de pousser.",
              "Ramène légèrement les mains l'une vers l'autre en poussant (adduction = squeeze pec).",
            ],
          },

          {
            id: "ecarte_incline",
            name: "Écarté Poulie Incliné",
            sets: 2, min: 10, max: 15,
            muscles: "Chef claviculaire pec · Isolation haut pec",
            placement: "Câbles positionnés BAS (hanches). Mains qui montent vers le haut.",
            tips: [
              "Câbles bas — trajectoire ascendante = faisceau claviculaire ciblé.",
              "Bras légèrement fléchis, verrouillés. Charge légère — l'étirement prime.",
              "Descente en 4 secondes. Contraction 1 seconde en haut (mains au niveau des yeux).",
            ],
          },

          {
            id: "curl_ss_u1",
            superset: true,
            nameA: "Curl Marteau Poulie",
            nameB: "Curl Incliné Haltère",
            sets: 3, min: 8, max: 12,
            musclesA: "Brachial · Brachioradial · Biceps",
            musclesB: "Biceps longue portion — étirement maximal",
            placementA: "Poulie basse. Coudes fixes contre le corps. Poignet neutre.",
            placementB: "Banc 45-60°. Coudes fixes, ne les avance pas en montant.",
            tipsA: [
              "Coudes parfaitement fixes, poignet neutre tout au long.",
              "Descente excentrique en 3-4 secondes — phase la plus stimulante.",
            ],
            tipsB: [
              "L'inclinaison met le biceps en étirement complet dès le bas.",
              "Enchaîne directement après le curl marteau, sans repos.",
            ],
          },

          {
            id: "epaules_ss_u1",
            superset: true,
            nameA: "Tirage Menton 2 Temps",
            nameB: "Élévation Latérale",
            sets: 3, min: 8, max: 12,
            musclesA: "Deltoïde ant. · Trapèze sup. · Biceps",
            musclesB: "Deltoïde moyen · Supra-épineux",
            placementA: "Poulie haute, prise large. Coudes AU-DESSUS des mains à tout moment.",
            placementB: "Légère inclinaison avant du buste (15°). Pouce légèrement vers le bas.",
            tipsA: [
              "1er temps : coudes à hauteur d'épaule. 2e temps : mains au menton.",
              "Coudes TOUJOURS au-dessus des mains — sinon impingement coiffe.",
            ],
            tipsB: [
              "Monte jusqu'à l'horizontale uniquement — ne dépasse pas.",
              "Descente lente 3 secondes. Enchaîne directement.",
            ],
          },

          {
            id: "triceps_ss_u1",
            superset: true,
            nameA: "Extension Poulie Basse",
            nameB: "Extension Poulie Haute",
            sets: 3, min: 8, max: 12,
            musclesA: "Triceps long (longue portion — étirement maximal bras au-dessus)",
            musclesB: "Triceps latéral · Triceps médial",
            placementA: "Dos à la machine. Corde derrière la nuque. Coudes collés aux tempes, pointés vers le plafond.",
            placementB: "Face à la machine. Poulie haute. Coudes fixes légèrement devant les oreilles. Corps légèrement penché.",
            tipsA: [
              "La longue portion ne s'étire que bras au-dessus de la tête — c'est irremplaçable.",
              "Coudes collés aux tempes, fixes. Extension totale + contraction 1 seconde.",
            ],
            tipsB: [
              "Coudes fixes, ne les laisse pas partir vers l'extérieur.",
              "Contraction parfaite en extension complète. Enchaîne directement.",
            ],
          },

          {
            id: "tv_large_u1",
            name: "Tirage Vertical Prise Large",
            sets: 4, min: 6, max: 10,
            muscles: "Grand dorsal (largeur) · Trapèze · Biceps",
            placement: "Prise pronation NETTEMENT plus large que les épaules (15-20cm de chaque côté).",
            tips: [
              "Prise large = étirement en abduction du grand dorsal = largeur du dos.",
              "Initie par la DÉPRESSION des omoplates AVANT de plier les bras.",
              "Tire vers le HAUT de la poitrine — jamais derrière la nuque.",
              "Étirement COMPLET en haut, bras tendus, avant chaque rep.",
            ],
          },

          {
            id: "th_u1",
            name: "Tirage Horizontal",
            sets: 2, min: 8, max: 12,
            muscles: "Grand dorsal (épaisseur) · Trapèze moyen · Rhomboïdes",
            placement: "Poulie basse. Torse droit, légèrement penché en avant au départ.",
            tips: [
              "Ramène les coudes DERRIÈRE le buste — amplitude complète.",
              "Rétracte les omoplates à la contraction — TIENS 1 seconde.",
              "Descente contrôlée en 2-3 secondes.",
            ],
          },

          {
            id: "crunch_u1",
            name: "Crunch",
            sets: 3, min: 15, max: 20,
            muscles: "Abdominaux",
            placement: "Sol ou banc décliné. Mains derrière la nuque, coudes ouverts.",
            tips: [
              "Exhale en montant, contraction maximale.",
              "Ne tire pas sur la nuque — les mains ne font que soutenir.",
              "Progression : +2 reps par semaine.",
            ],
          },

          {
            id: "gainage_u1",
            name: "Gainage",
            sets: 3, min: 30, max: 60,
            muscles: "Abdominaux · Obliques · Érecteurs spinaux",
            placement: "Avant-bras au sol, corps en ligne droite de la tête aux talons.",
            tips: [
              "Core contracté, respiration régulière. Pas d'apnée.",
              "Progression : +5 secondes chaque semaine.",
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════
      // LOW — Chaîne postérieure rééquilibrée
      // ═══════════════════════════════════════════════════════════════════
      {
        id: "lo", key: "lo", label: "LOW", code: "B-02",
        title: "LOWER BODY", num: "02",
        muscles: "QUADRICEPS · ISCHIO · FESSIERS · ADDUCTEURS · ABDUCTEURS · MOLLETS",
        priority: "Hack Squat en premier. SDL Roumain en 2e — charges lourdes, pas en fin de séance.",
        exercises: [

          {
            id: "hack_squat",
            name: "Hack Squat",
            sets: 3,
            alternating: true,
            special: "Montée en gamme — échec sur la 3e série",
            muscles: "Quadriceps · Fessiers · Ischio (selon placement)",
            placement: "Placement variable selon l'objectif du jour. Voir tips.",
            hackPlacement: {
              quad: {
                label: "QUAD / FESSIERS",
                feet: "Pieds BAS sur le plateau",
                width: "Largeur épaules",
                toes: "Pointes 15-20° ext.",
                note: "Genoux avancent sur les pointes. Descente cuisses aux mollets.",
              },
              post: {
                label: "ISCHIOS / POST.",
                feet: "Pieds HAUTS sur le plateau",
                width: "Légèrement + large",
                toes: "Pointes 20-30° ext.",
                note: "Extension de hanche quasi-complète en haut. Hanches reculent en descente.",
              },
            },
            tips: [
              "Semaine IMPAIRE : 3 reps charge max. Semaine PAIRE : 5 reps volume.",
              "Pieds BAS = focus quadriceps. Pieds HAUTS = focus ischios/fessiers.",
              "Échauffement genoux obligatoire avant la 1ère série.",
              "Montée en gamme : chaque série plus lourde, échec sur la 3e.",
            ],
          },

          {
            id: "sdl_roumain",
            name: "SDL Roumain",
            sets: 3, min: 8, max: 12,
            muscles: "Ischio-jambiers · Grand fessier · Érecteurs spinaux",
            placement: "Pieds largeur de hanches. Barre ou haltères glissent le long des jambes.",
            tips: [
              "CHARNIÈRE DE HANCHE — hanches reculent, genoux très légèrement fléchis (pas un squat).",
              "Descends jusqu'à sentir l'étirement des ischios — généralement mi-tibia.",
              "DOS DROIT absolu tout au long. Si le dos s'arrondit, tu es descendu trop bas.",
              "Montée : extension des hanches, contracte les fessiers en haut.",
              "Si douleur lombaire : réduis la charge 30-40% et filme-toi de profil pour vérifier.",
            ],
          },

          {
            id: "squat_smith",
            name: "Squat Smith Focus Quad",
            sets: 2, min: 6, max: 10,
            muscles: "Quadriceps · Fessiers (secondaire)",
            placement: "Pieds légèrement avancés devant la barre (30-40cm). Pointes à 30°.",
            tips: [
              "Pieds avancés — spécificité du Smith qui sécurise le bas du dos.",
              "Laisse les genoux avancer sur les orteils pour isoler les quadriceps.",
              "Descente profonde, cuisses parallèles ou en dessous.",
            ],
          },

          {
            id: "leg_curl",
            name: "Leg Curl",
            sets: 3, min: 10, max: 12,
            degressive: 3,
            muscles: "Ischio-jambiers (biceps fémoral · semi-tendineux · semi-membraneux)",
            placement: "Machine allongée ou assise. Cheville bien calée sous le rouleau.",
            tips: [
              "Pointe les orteils vers toi (flexion dorsale) : activation ischios supérieure.",
              "Contraction maximale en haut — tiens 1 seconde.",
              "Descente LENTE en 3 secondes — la phase excentrique est la plus stimulante.",
              "Dégressive × 3 : échec → -20% → continue → -20% → continue.",
            ],
          },

          {
            id: "leg_ext",
            name: "Leg Extension",
            sets: 2, min: 10, max: 15,
            degressive: 2,
            muscles: "Quadriceps (vaste médial · vaste latéral · rectus femoris)",
            placement: "Dos bien calé, genou dans l'axe de la machine.",
            tips: [
              "Contraction électrique en haut — TIENS 2 secondes (vaste médial ++).",
              "Dégressive × 2 : à l'échec → -20-25% → continue.",
              "Pied neutre = équilibré. Pied légèrement en dedans = vaste médial +.",
            ],
          },

          {
            id: "adducteur",
            name: "Adducteur",
            sets: 2, min: 8, max: 12,
            degressive: 2,
            muscles: "Adducteurs (face interne cuisse)",
            placement: "Machine adducteur. Amplitude complète à chaque rep.",
            tips: [
              "Amplitude complète. Contraction nette en fin de course — tiens 1 seconde.",
              "Dégressive × 2 : -20% à l'échec, sans repos.",
              "Enchaîne directement avec l'abducteur (même zone, pas de repos entre les deux).",
            ],
          },

          {
            id: "abducteur",
            name: "Abducteur",
            sets: 2, min: 12, max: 15,
            muscles: "Abducteurs · Fessier moyen (face externe cuisse)",
            placement: "Machine abducteur. Même position que l'adducteur.",
            tips: [
              "Amplitude complète vers l'extérieur. Mouvement contrôlé — ne pas balancer.",
              "Équilibre med/lat de la cuisse. Repos 1 min après avoir fini les deux.",
            ],
          },

          {
            id: "mollets_smith",
            name: "Montée de Pointe Smith",
            sets: 3, min: 12, max: 15,
            muscles: "Gastrocnémien · Soléaire · Tibialis anterior",
            placement: "Barre sur épaules. Pointe du pied sur une plaque ou marche pour l'amplitude complète.",
            tips: [
              "Pause OBLIGATOIRE 2 secondes en bas — étirement complet du mollet.",
              "Monte le plus haut possible, tiens 1 seconde en haut.",
              "Mouvement LENT — le mollet répond au temps sous tension, pas à la vitesse.",
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════
      // UP B — Pull dominant · Dos en V priorité · Core
      // ═══════════════════════════════════════════════════════════════════
      {
        id: "u2", key: "u2", label: "UP 2", code: "C-03",
        title: "UPPER BODY B", num: "03",
        muscles: "DOS (LARGEUR) · DOS (ÉPAISSEUR) · BICEPS · ÉPAULES · TRICEPS · PEC",
        priority: "Tirage Vertical Prise Large en premier — UP B est la séance de construction du V.",
        exercises: [

          {
            id: "tv_large_u2",
            name: "Tirage Vertical Prise Large",
            sets: 3, min: 6, max: 10,
            muscles: "Grand dorsal (largeur) · Trapèze · Biceps",
            placement: "Prise pronation NETTEMENT plus large que les épaules.",
            tips: [
              "Prise large = abduction du dorsal = largeur. C'est l'exercice n°1 pour le V.",
              "Initie par la DÉPRESSION des omoplates avant de plier les bras.",
              "Tire vers le HAUT de la poitrine — jamais derrière la nuque.",
              "Étirement COMPLET en haut à chaque rep.",
            ],
          },

          {
            id: "tv_unilateral",
            name: "Tirage Vertical Unilatéral",
            sets: 3, min: 8, max: 12,
            muscles: "Grand dorsal (largeur amplifiée) · Dentelé antérieur",
            placement: "Poulie haute, poignée simple, un bras à la fois.",
            tips: [
              "L'amplitude d'étirement latéral est supérieure au tirage à deux bras.",
              "Légère rotation du buste du côté qui tire — sans excès.",
              "Étirement complet en haut, contraction nette en bas — tiens 1 seconde.",
              "Alterne les bras à chaque série.",
            ],
          },

          {
            id: "rowing_coude_ouvert",
            name: "Rowing Coude Ouvert",
            sets: 3, min: 8, max: 12,
            muscles: "Deltoïde post. · Trapèze moyen (épaisseur) · Rhomboïdes",
            placement: "Poulie ou barre. Torse penché 30°. Coudes latéraux à 45-90°.",
            tips: [
              "Coudes partent latéralement — distingue cet exercice du rowing classique.",
              "Rétracte les omoplates en fin de course — TIENS 1 seconde.",
              "Contrôle la descente en 2-3 secondes.",
            ],
          },

          {
            id: "curl_ss_u2",
            superset: true,
            nameA: "Curl Barre",
            nameB: "Curl Marteau Haltère",
            sets: 3, min: 8, max: 12,
            musclesA: "Biceps brachial (chef long + court) · Brachial",
            musclesB: "Brachial · Brachioradial · Biceps",
            placementA: "Prise supinée légèrement + large que les épaules. Coudes fixes contre le corps.",
            placementB: "Haltères, poignet neutre. Debout ou assis.",
            tipsA: [
              "Coudes ABSOLUMENT fixes. S'ils partent vers l'avant, c'est trop lourd.",
              "Ne balance pas le dos — si tu bascules, réduis la charge.",
            ],
            tipsB: [
              "Poignet neutre tout au long.",
              "Enchaîne directement.",
            ],
          },

          {
            id: "epaules_ss_u2",
            superset: true,
            nameA: "Développé Militaire",
            nameB: "Face Pull",
            sets: 3, min: 10, max: 15,
            musclesA: "Deltoïde ant. · Triceps · Trapèze sup.",
            musclesB: "Deltoïde post. · Trapèze moyen · Rhomboïdes · Coiffe des rotateurs",
            placementA: "Assis ou debout. Dos droit, core engagé. Coudes légèrement devant.",
            placementB: "Corde à hauteur du front ou des yeux. Poulie haute. Face à la machine.",
            tipsA: [
              "Coudes légèrement DEVANT le buste au départ — pas perpendiculaires.",
              "Extension complète en haut sans claquer. Descente contrôlée.",
            ],
            tipsB: [
              "Tire en ÉCARTANT les mains vers les oreilles (rotation externe — coiffe des rotateurs ++).",
              "Remplace l'Oiseau — sans contrainte sur l'articulation de l'épaule.",
              "Enchaîne directement.",
            ],
          },

          {
            id: "triceps_ss_u2",
            superset: true,
            nameA: "Extension Poulie Basse",
            nameB: "Kickback",
            sets: 3, min: 8, max: 12,
            musclesA: "Triceps long (longue portion — étirement maximal)",
            musclesB: "Triceps (contraction maximale en fin de course)",
            placementA: "Dos à la machine. Corde derrière la nuque. Coudes collés aux tempes.",
            placementB: "Buste parallèle au sol (90°). Bras supérieur plaqué contre le corps.",
            tipsA: [
              "Étirement maximal de la longue portion. Coudes fixes, extension totale + 1 seconde.",
            ],
            tipsB: [
              "Extension complète du coude en arrière — contraction maximale.",
              "Charge légère, mouvement strict. Enchaîne directement.",
            ],
          },

          {
            id: "dc_halt_u2",
            name: "DC Haltère",
            sets: 3, min: 6, max: 10,
            muscles: "Chef sternal pec · Triceps (secondaire)",
            placement: "Banc plat. Omoplates rétractées avant de saisir.",
            tips: [
              "Descends lentement en 3 temps, coudes à 45° du buste.",
              "Étirement maximal des pectoraux en bas.",
            ],
          },

          {
            id: "crunch_u2",
            name: "Crunch",
            sets: 3, min: 15, max: 20,
            muscles: "Abdominaux",
            placement: "Sol ou banc décliné. Mains derrière la nuque.",
            tips: [
              "Exhale en montant, contraction maximale.",
              "Ne tire pas sur la nuque.",
            ],
          },

          {
            id: "gainage_u2",
            name: "Gainage",
            sets: 3, min: 30, max: 60,
            muscles: "Abdominaux · Obliques · Érecteurs spinaux",
            placement: "Avant-bras au sol, corps en ligne droite.",
            tips: [
              "Core contracté, respiration régulière.",
              "Progression : +5 secondes chaque semaine.",
            ],
          },
        ],
      },
    ],
  },

  // ─── PPL3 et FB3 inchangés ───────────────────────────────────────────────
  ppl3: {
    id: "ppl3", name: "PUSH / PULL / LEGS", subtitle: "HYPERTROPHIE · 3 SESSIONS", author: "UPGRADE",
    description: "Split classique poussée / tirage / jambes. Polyvalent, éprouvé.",
    sessions: [
      { id:"push", key:"push", label:"PUSH", code:"A-01", title:"POUSSÉE", muscles:"PEC · ÉPAULES · TRICEPS", num:"01", exercises:[
        { id:"dc_barre", name:"Développé Couché Barre", sets:4, min:6, max:10, tips:["Omoplates rétractées et fixées durant toute la série.","Descente contrôlée 2-3s, pause 1s en bas.","Barre touche la poitrine à hauteur des mamelons."]},
        { id:"di_halt_ppl", name:"Développé Incliné Haltère", sets:3, min:8, max:12, tips:["Banc à 30-45° max.","Trajectoire légèrement convergente en haut.","Contrôle la descente."]},
        { id:"dm_halt", name:"Développé Militaire Haltère", sets:3, min:8, max:12, tips:["Assis, dos calé contre le banc incliné presque vertical.","Coudes légèrement devant le buste.","Verrouillage en haut sans claquer les haltères."]},
        { id:"ecarte_ppl", name:"Écarté Poulie", sets:3, min:10, max:15, tips:["Bras légèrement fléchis, verrouillés.","Amène les mains devant la poitrine, contraction 1s.","Étirement contrôlé sur le retour."]},
        { id:"el_lat", name:"Élévation Latérale Haltère", sets:3, min:12, max:15, tips:["Légère inclinaison avant du buste.","Monte jusqu'à l'horizontale, pas au-delà.","Descente lente en 3s."]},
        { id:"ext_poulie_ppl", name:"Extension Triceps Poulie Haute", sets:3, min:10, max:12, tips:["Coudes fixes contre le corps.","Poignets neutres, amplitude complète.","Descente contrôlée."]},
      ]},
      { id:"pull", key:"pull", label:"PULL", code:"B-02", title:"TIRAGE", muscles:"DOS · BICEPS · DELTOÏDES POSTÉRIEURS", num:"02", exercises:[
        { id:"sdt", name:"Soulevé de Terre", sets:4, min:4, max:6, tips:["Barre collée aux tibias au départ.","Dos droit, scapulas engagées.","Extension complète des hanches en haut, puis redescend contrôlé."]},
        { id:"tractions", name:"Tractions (ou Tirage Vertical)", sets:4, min:6, max:10, tips:["Prise pronation, légèrement plus large que les épaules.","Tire les coudes vers les hanches.","Étirement complet en bas."]},
        { id:"rowing_barre", name:"Rowing Barre Buste Penché", sets:3, min:8, max:10, tips:["Buste à 30-45° de l'horizontale.","Tire la barre vers le bas du sternum.","Rétracte les omoplates à chaque rep."]},
        { id:"face_pull", name:"Face Pull Corde", sets:3, min:12, max:15, tips:["Corde à hauteur du front.","Tire en écartant les mains vers les oreilles.","Deltoïdes postérieurs + trapèzes moyens."]},
        { id:"curl_barre_ppl", name:"Curl Barre", sets:3, min:8, max:12, tips:["Coudes collés au corps, fixes.","Montée complète jusqu'au contact avant-bras/biceps.","Descente contrôlée 3s."]},
        { id:"curl_marteau_ppl", name:"Curl Marteau", sets:3, min:10, max:12, tips:["Poignet neutre, paumes face à face.","Coudes immobiles.","Alterne ou simultané."]},
      ]},
      { id:"legs", key:"legs", label:"LEGS", code:"C-03", title:"JAMBES", muscles:"QUADRICEPS · ISCHIO · FESSIERS · MOLLETS", num:"03", exercises:[
        { id:"squat_barre", name:"Squat Barre", sets:4, min:5, max:8, tips:["Pieds largeur épaules, pointes légèrement ouvertes.","Descente profonde (cuisses parallèles minimum).","Genoux dans l'axe des pointes."]},
        { id:"presse", name:"Presse à Cuisses", sets:3, min:8, max:12, tips:["Pieds hauts sur la plate-forme = fessiers/ischio.","Pieds bas = quadriceps.","Ne verrouille jamais les genoux en haut."]},
        { id:"sdl_ppl", name:"Soulevé de Terre Roumain", sets:3, min:8, max:12, tips:["Barre près des jambes durant tout le mouvement.","Hanches en arrière, très peu de flexion de genoux.","Étirement des ischio en bas."]},
        { id:"fentes", name:"Fentes Marchées Haltère", sets:3, min:10, max:12, tips:["Genou avant jamais devant la pointe du pied.","Descente contrôlée, pousse sur le talon avant.","Corps droit, pas d'inclinaison."]},
        { id:"mollets", name:"Mollets Debout (Smith)", sets:4, min:12, max:15, tips:["Pause 2s en bas, étirement complet.","Monte le plus haut possible, tiens 1s.","Temps sous tension : mouvement lent."]},
      ]},
    ],
  },

  fb3: {
    id: "fb3", name: "FULL BODY · 3J", subtitle: "ÉQUILIBRÉ · 3 SESSIONS", author: "UPGRADE",
    description: "Chaque séance couvre tout le corps. Idéal pour la polyvalence.",
    sessions: [
      { id:"fb_a", key:"fb_a", label:"A", code:"A-01", title:"FULL BODY A", muscles:"TOUT LE CORPS · ACCENT POUSSÉE", num:"01", exercises:[
        { id:"squat_fb", name:"Squat Barre", sets:3, min:5, max:8, tips:["Descente contrôlée, poussée explosive.","Respiration bloquée au point bas."]},
        { id:"dc_fb", name:"Développé Couché Barre", sets:3, min:6, max:10, tips:["Omoplates verrouillées.","Barre touche la poitrine, pas de rebond."]},
        { id:"rowing_fb", name:"Rowing Barre", sets:3, min:6, max:10, tips:["Buste à 30-45°.","Tire vers le bas du sternum."]},
        { id:"dm_fb", name:"Développé Militaire", sets:3, min:8, max:10, tips:["Debout ou assis dossier droit.","Gainage abdominal constant."]},
        { id:"curl_fb_a", name:"Curl Haltère Alterné", sets:3, min:10, max:12, tips:["Coudes fixes.","Contrôle la descente en 3s."]},
      ]},
      { id:"fb_b", key:"fb_b", label:"B", code:"B-02", title:"FULL BODY B", muscles:"TOUT LE CORPS · ACCENT TIRAGE", num:"02", exercises:[
        { id:"sdt_fb", name:"Soulevé de Terre", sets:3, min:4, max:6, tips:["Barre aux tibias.","Extension complète des hanches."]},
        { id:"tractions_fb", name:"Tractions (ou Tirage)", sets:3, min:6, max:10, tips:["Amplitude complète, menton au-dessus de la barre."]},
        { id:"di_fb", name:"Développé Incliné Haltère", sets:3, min:8, max:10, tips:["Banc à 30-45° max."]},
        { id:"fentes_fb", name:"Fentes Haltère", sets:3, min:10, max:12, tips:["Genou avant dans l'axe du pied.","Descente lente."]},
        { id:"ext_fb", name:"Extension Triceps Poulie", sets:3, min:10, max:12, tips:["Coudes fixes contre le corps."]},
      ]},
      { id:"fb_c", key:"fb_c", label:"C", code:"C-03", title:"FULL BODY C", muscles:"TOUT LE CORPS · VOLUME", num:"03", exercises:[
        { id:"presse_fb", name:"Presse à Cuisses", sets:3, min:10, max:12, tips:["Pieds adaptés à la zone ciblée."]},
        { id:"sdl_fb", name:"Soulevé de Terre Roumain", sets:3, min:8, max:12, tips:["Hanches en arrière, pas de flexion excessive des genoux."]},
        { id:"dc_halt_fb", name:"DC Haltère", sets:3, min:8, max:12, tips:["Étirement maximal en bas."]},
        { id:"tirage_fb", name:"Tirage Horizontal", sets:3, min:8, max:12, tips:["Rétraction des omoplates."]},
        { id:"el_lat_fb", name:"Élévation Latérale", sets:3, min:12, max:15, tips:["Monte jusqu'à l'horizontale.","Descente lente."]},
        { id:"mollets_fb", name:"Mollets Smith", sets:3, min:12, max:15, tips:["Pause 2s en bas."]},
      ]},
    ],
  },
};
