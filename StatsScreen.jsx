// Composant SVG anatomique — aucune dépendance externe
// Props: highlighted (slug[]), side ("front"|"back"), size (hauteur px)
// ViewBox: "0 0 120 235" — figure centrée en x=60

const ACCENT  = "#FF6200";
const PASSIVE = "#52525C";
const BG      = "#0F0F13";
const OUTLINE = "#1C1C23";

// ── Paths anatomiques AVANT (cubic Bézier) ──────────────────────────────────
const FRONT = {
  chest: [
    // Pectoral gauche
    "M57,42 C52,38 40,40 34,52 C29,62 31,74 37,80 C43,84 53,82 58,76 C63,68 65,56 62,48 Z",
    // Pectoral droit
    "M63,42 C68,38 80,40 86,52 C91,62 89,74 83,80 C77,84 67,82 62,76 C57,68 55,56 58,48 Z",
  ],
  shoulders: [
    // Deltoïde gauche
    "M22,40 C17,44 14,56 16,66 C18,74 24,80 32,80 C40,80 46,74 47,66 C48,56 44,46 38,40 C34,36 28,34 24,38 Z",
    // Deltoïde droit
    "M98,40 C103,44 106,56 104,66 C102,74 96,80 88,80 C80,80 74,74 73,66 C72,56 76,46 82,40 C86,36 92,34 96,38 Z",
  ],
  biceps: [
    // Biceps gauche
    "M15,68 C12,76 11,88 13,100 C15,110 20,116 27,118 C34,120 40,116 43,106 C46,96 44,82 40,72 C36,64 28,60 22,62 C18,63 16,66 15,68 Z",
    // Biceps droit
    "M105,68 C108,76 109,88 107,100 C105,110 100,116 93,118 C86,120 80,116 77,106 C74,96 76,82 80,72 C84,64 92,60 98,62 C102,63 104,66 105,68 Z",
  ],
  abs: [
    // Grand droit de l'abdomen + obliques
    "M45,84 C40,88 38,100 39,114 C40,126 45,134 52,136 C58,138 66,136 72,130 C77,122 78,108 76,96 C74,86 68,80 62,78 C56,74 50,78 45,84 Z",
  ],
  quads: [
    // Quadriceps gauche
    "M39,124 C33,128 29,140 30,158 C31,170 36,178 44,180 C50,182 56,178 59,168 C62,156 60,140 56,128 C52,118 44,116 40,118 C39,120 39,122 39,124 Z",
    // Quadriceps droit
    "M81,124 C87,128 91,140 90,158 C89,170 84,178 76,180 C70,182 64,178 61,168 C58,156 60,140 64,128 C68,118 76,116 80,118 C81,120 81,122 81,124 Z",
  ],
};

// ── Paths anatomiques ARRIÈRE ────────────────────────────────────────────────
const BACK = {
  traps: [
    // Trapèze (diamant en haut du dos)
    "M32,36 C44,28 60,24 76,28 C86,32 92,40 90,50 C88,60 80,68 68,72 C60,74 52,74 44,70 C32,64 26,54 26,46 C26,40 28,38 32,36 Z",
  ],
  lats: [
    // Grand dorsal gauche
    "M20,54 C15,62 13,76 15,90 C17,104 24,116 34,122 C44,128 52,126 54,116 C56,106 52,92 46,80 C40,68 32,58 26,54 C24,52 22,52 20,54 Z",
    // Grand dorsal droit
    "M100,54 C105,62 107,76 105,90 C103,104 96,116 86,122 C76,128 68,126 66,116 C64,106 68,92 74,80 C80,68 88,58 94,54 C96,52 98,52 100,54 Z",
  ],
  triceps: [
    // Triceps gauche
    "M13,66 C10,74 9,88 11,100 C13,112 18,118 26,120 C34,122 40,118 44,108 C48,96 46,82 42,70 C38,60 30,56 24,56 C18,56 15,62 13,66 Z",
    // Triceps droit
    "M107,66 C110,74 111,88 109,100 C107,112 102,118 94,120 C86,122 80,118 76,108 C72,96 74,82 78,70 C82,60 90,56 96,56 C102,56 105,62 107,66 Z",
  ],
  glutes: [
    // Fessier gauche
    "M34,130 C27,136 24,148 26,162 C28,174 36,182 46,184 C54,186 62,180 64,168 C66,154 62,140 54,132 C48,126 40,122 34,130 Z",
    // Fessier droit
    "M86,130 C93,136 96,148 94,162 C92,174 84,182 74,184 C66,186 58,180 56,168 C54,154 58,140 66,132 C72,126 80,122 86,130 Z",
  ],
  hamstrings: [
    // Ischio-jambier gauche
    "M30,188 C25,196 23,210 25,222 C27,232 33,238 41,238 C48,238 54,232 57,222 C60,210 58,194 54,184 C50,176 42,172 36,174 C32,176 31,182 30,188 Z",
    // Ischio-jambier droit
    "M90,188 C95,196 97,210 95,222 C93,232 87,238 79,238 C72,238 66,232 63,222 C60,210 62,194 66,184 C70,176 78,172 84,174 C88,176 89,182 90,188 Z",
  ],
};

// ── Silhouette corps complet (fond) ─────────────────────────────────────────
const BODY_FRONT_BG =
  // Tête
  "M60,3 C65,3 70,8 70,14 C70,20 65,25 60,25 C55,25 50,20 50,14 C50,8 55,3 60,3 Z " +
  // Cou
  "M55,25 L56,36 L64,36 L65,25 Z " +
  // Torse + hanches
  "M30,36 C24,40 18,50 17,64 L15,100 C15,110 18,120 22,126 L24,132 C20,138 20,148 22,162 L22,200 L44,200 L44,182 C40,170 38,158 38,148 L38,132 L48,130 L60,132 L72,130 L82,132 L82,148 C82,158 80,170 76,182 L76,200 L98,200 L98,162 C100,148 100,138 96,132 L98,126 C102,120 105,110 105,100 L103,64 C102,50 96,40 90,36 Z " +
  // Bras gauche
  "M17,64 C14,70 12,82 12,96 L11,114 C11,120 13,126 16,128 L20,130 L24,128 L22,126 L22,100 L17,64 Z " +
  // Bras droit
  "M103,64 C106,70 108,82 108,96 L109,114 C109,120 107,126 104,128 L100,130 L96,128 L98,126 L98,100 L103,64 Z";

const BODY_BACK_BG =
  "M60,3 C65,3 70,8 70,14 C70,20 65,25 60,25 C55,25 50,20 50,14 C50,8 55,3 60,3 Z " +
  "M55,25 L56,36 L64,36 L65,25 Z " +
  "M30,36 C24,40 18,50 17,64 L15,100 C15,110 18,120 22,126 L24,132 C20,140 20,152 24,166 L26,200 L46,200 L46,190 C44,178 42,166 42,154 L42,132 L52,130 L60,132 L68,130 L78,132 L78,154 C78,166 76,178 74,190 L74,200 L94,200 L96,166 C100,152 100,140 96,132 L98,126 C102,120 105,110 105,100 L103,64 C102,50 96,40 90,36 Z " +
  "M17,64 C14,70 12,82 12,96 L11,114 L16,128 L20,130 L24,128 L22,126 L22,100 L17,64 Z " +
  "M103,64 C106,70 108,82 108,96 L109,114 L104,128 L100,130 L96,128 L98,126 L98,100 L103,64 Z";

// ── Composant ────────────────────────────────────────────────────────────────
export default function MuscleBody({ highlighted = [], side = "front", size = 120 }) {
  const isBack    = side === "back";
  const muscles   = isBack ? BACK : FRONT;
  const bodyBg    = isBack ? BODY_BACK_BG : BODY_FRONT_BG;
  const vbH       = isBack ? 244 : 206;
  const aspectW   = 120;
  const renderW   = Math.round((size / vbH) * aspectW);

  const slugSet = new Set(highlighted);

  return (
    <svg
      width={renderW}
      height={size}
      viewBox={`0 0 ${aspectW} ${vbH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Silhouette de fond */}
      <path d={bodyBg} fill={BG} stroke={OUTLINE} strokeWidth="1" fillRule="evenodd" />

      {/* Groupes musculaires */}
      {Object.entries(muscles).map(([slug, paths]) => {
        const active = slugSet.has(slug);
        return paths.map((d, i) => (
          <path
            key={`${slug}-${i}`}
            d={d}
            fill={active ? ACCENT : PASSIVE}
            stroke={active ? ACCENT : OUTLINE}
            strokeWidth={active ? "0.4" : "0.6"}
            opacity={active ? 1 : 0.18}
          />
        ));
      })}
    </svg>
  );
}
