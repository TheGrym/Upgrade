import { T, FF_DISPLAY, FF_MONO, FF_UI } from "../design/tokens.js";
import { fmtClock } from "../lib/utils.js";
import ProgressRing from "./ProgressRing.jsx";

export default function RestTimer({ timer, onSkip, onAdd }) {
  if (!timer.active) return null;

  const pct      = timer.duration > 0 ? timer.remaining / timer.duration : 0;
  const urgent   = timer.remaining <= 10 && timer.remaining > 0;
  const finished = timer.remaining === 0;
  const color    = (urgent || finished) ? T.red : T.accent;

  return (
    <div className="rest-slide" style={{
      position: "fixed",
      bottom: "calc(60px + env(safe-area-inset-bottom))",
      left: 0, right: 0, zIndex: 500,
      background: "rgba(8,8,11,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "10px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ProgressRing progress={pct} color={color} size={52}/>
        <div>
          <div style={{
            fontFamily: FF_UI, fontSize: 9, fontWeight: 700,
            color: T.textDim, letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 2,
          }}>
            {finished ? "TERMINÉ" : urgent ? "FIN DU REPOS" : "REPOS"}
          </div>
          <div style={{
            fontFamily: FF_DISPLAY, fontSize: 34, color,
            lineHeight: 1, fontVariantNumeric: "tabular-nums",
            transition: "color 0.3s",
            animation: finished ? "accentPulse 1.2s ease-in-out infinite" : "none",
          }}>
            {fmtClock(timer.remaining)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {!finished && (
          <button onClick={onAdd} style={{
            background: T.glass, border: `1px solid ${T.glassBorder}`,
            borderRadius: 10, padding: "8px 12px",
            fontFamily: FF_MONO, fontSize: 10, fontWeight: 700,
            color: T.textMid, cursor: "pointer", letterSpacing: "0.06em",
          }}>+30S</button>
        )}
        <button onClick={onSkip} style={{
          background: finished ? T.accent : T.glass,
          border: `1px solid ${finished ? T.accent : T.glassBorder}`,
          borderRadius: 10, padding: "8px 16px",
          fontFamily: FF_UI, fontSize: 10, fontWeight: 700,
          color: finished ? T.bg : T.textMid,
          cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {finished ? "FERMER" : "PASSER"}
        </button>
      </div>
    </div>
  );
}
