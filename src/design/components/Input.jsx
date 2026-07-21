import { T, FF_MONO } from "../tokens.js";

export const Input = ({ style = {}, onFocus, ...rest }) => (
  <input
    {...rest}
    onFocus={e => { e.target.select(); onFocus && onFocus(e); }}
    style={{
      background: T.inputBg,
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: "14px 8px",
      color: T.text,
      fontSize: 14,
      fontFamily: FF_MONO,
      fontWeight: 700,
      width: "100%",
      textAlign: "center",
      outline: "none",
      boxSizing: "border-box",
      fontVariantNumeric: "tabular-nums",
      transition: "border-color 0.15s",
      WebkitAppearance: "none",
      ...style,
    }}
  />
);
