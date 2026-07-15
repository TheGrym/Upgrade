import { T, FF_DISPLAY, FF_MONO } from "../tokens.js";
import { Label } from "./Label.jsx";

export const Metric = ({ label, value, unit, align = "left", size = 44, color = T.text }) => (
  <div style={{ textAlign: align, minWidth: 0 }}>
    <Label>{label}</Label>
    <div style={{
      display: "flex", alignItems: "baseline", gap: 4, marginTop: 8,
      justifyContent: align === "right" ? "flex-end" : "flex-start",
    }}>
      <span style={{
        fontFamily: FF_DISPLAY, fontSize: size, fontWeight: 700,
        letterSpacing: "-0.03em", color, lineHeight: 0.9,
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </span>
      {unit && (
        <span style={{
          fontFamily: FF_MONO, fontSize: 11, fontWeight: 500,
          color: T.textMid, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {unit}
        </span>
      )}
    </div>
  </div>
);
