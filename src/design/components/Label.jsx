import { T, FF_UI } from "../tokens.js";

export const Label = ({ children, style = {}, color = T.textMid, size = 10 }) => (
  <span style={{
    fontFamily: FF_UI,
    fontSize: size, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color, lineHeight: 1, ...style,
  }}>
    {children}
  </span>
);
