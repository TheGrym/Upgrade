import { useState } from "react";
import { T, FF_UI, FF_MONO } from "../design/tokens.js";

export default function HackSquatPlacement({ placement }) {
  const [active, setActive] = useState("quad");
  const p = placement[active];

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {["quad", "post"].map(k => (
          <button
            key={k}
            onClick={() => setActive(k)}
            style={{
              flex: 1,
              padding: "6px 0",
              background: active === k ? T.accent : T.surface,
              border: `1px solid ${active === k ? T.accent : T.border}`,
              borderRadius: 10,
              fontFamily: FF_UI,
              fontWeight: 700,
              fontSize: 8,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active === k ? T.bg : T.textDim,
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {placement[k].label}
          </button>
        ))}
      </div>

      <div style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "8px 10px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
      }}>
        {[
          ["PIEDS", p.feet],
          ["ÉCARTEMENT", p.width],
          ["POINTES", p.toes],
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{
              fontFamily: FF_UI,
              fontWeight: 700,
              fontSize: 7,
              color: T.textDim,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 1,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: FF_MONO,
              fontSize: 9,
              color: T.text,
            }}>
              {val}
            </div>
          </div>
        ))}
        <div style={{
          gridColumn: "1 / -1",
          marginTop: 4,
          fontFamily: FF_MONO,
          fontSize: 8,
          color: T.accentDim,
          borderTop: `1px solid ${T.border}`,
          paddingTop: 4,
        }}>
          {p.note}
        </div>
      </div>
    </div>
  );
}
