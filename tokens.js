import { T, FF_DISPLAY } from "../tokens.js";

export const Display = ({ children, size = 40, weight = 400, style = {} }) => (
  <span style={{
    fontFamily: FF_DISPLAY,
    fontSize: size, fontWeight: weight,
    textTransform: "uppercase",
    color: T.text, lineHeight: 0.92,
    display: "block", width: "100%",
    overflow: "hidden", wordBreak: "break-word",
    ...style,
  }}>
    {children}
  </span>
);
