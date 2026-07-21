import { T, FF_UI } from "../design/tokens.js";
import { IC, Ico } from "../design/icons.jsx";
import { haptic } from "../lib/audio.js";

const NAV = [
  { id:"home",    l:"ACCUEIL", icon:IC.nav_home  },
  { id:"session", l:"SÉANCE",  icon:IC.nav_train },
  { id:"stats",   l:"STATS",   icon:IC.nav_stats },
  { id:"bank",    l:"BANQUE",  icon:IC.note      },
  { id:"more",    l:"PLUS",    icon:IC.nav_more  },
];

export default function BottomNav({ tab, onNavigate, hasActiveSession }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(8,8,11,0.94)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      paddingBottom: "env(safe-area-inset-bottom)",
      zIndex: 900,
      height: "calc(60px + env(safe-area-inset-bottom))",
    }}>
      <div style={{
        maxWidth: 420, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(5,1fr)", height: 60,
        padding: "0 4px",
      }}>
        {NAV.map((n) => {
          const active = tab === n.id;
          return (
            <button key={n.id}
              onClick={() => { haptic(); onNavigate(n.id); }}
              style={{
                background: active ? "rgba(255,98,0,0.11)" : "transparent",
                border: "none",
                borderRadius: 10,
                margin: "8px 3px",
                cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 4,
                color: active ? T.accent : T.dim,
                transition: "background 0.2s, color 0.15s",
                position: "relative",
              }}
            >
              {n.id === "session" && hasActiveSession && !active && (
                <span style={{
                  position: "absolute", top: 5, right: "calc(50% - 15px)",
                  width: 5, height: 5, background: T.accent, borderRadius: 3,
                  animation: "accentPulse 1.4s ease-in-out infinite",
                }}/>
              )}
              <Ico d={n.icon} s={18} c={active ? T.accent : T.dim}/>
              <span style={{
                fontFamily: FF_UI, fontSize: 7, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1,
              }}>{n.l}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
