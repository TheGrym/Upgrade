import { T, FF_UI } from "../tokens.js";
import { Ico, IC } from "../icons.jsx";

export const Modal = ({ open, onClose, children, title, code }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: T.bg, zIndex: 2000,
      display: "flex", flexDirection: "column",
      animation: "modalIn 0.22s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        maxWidth: 520, margin: "0 auto",
        padding: "20px 20px 40px",
        paddingTop: "calc(20px + env(safe-area-inset-top))",
        width: "100%", boxSizing: "border-box",
        flex: 1, overflowY: "auto",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 28, paddingTop: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {code && (
              <span style={{ fontFamily: FF_UI, fontSize: 9, fontWeight: 700,
                color: T.accent, letterSpacing: "0.14em" }}>{code}</span>
            )}
            {title && (
              <span style={{ fontFamily: FF_UI, fontSize: 13, fontWeight: 700,
                color: T.text, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</span>
            )}
          </div>
          <button onClick={onClose} style={{
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
            color: T.text, cursor: "pointer", padding: 8, display: "flex",
          }}>
            <Ico d={IC.close} s={18} />
          </button>
        </div>
        <div style={{ height: 1, background: T.border, marginBottom: 28 }} />
        {children}
      </div>
    </div>
  );
};
