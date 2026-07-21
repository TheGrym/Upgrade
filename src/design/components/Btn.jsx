import { T, FF_UI } from "../tokens.js";
import { haptic } from "../../lib/audio.js";

export const Btn = ({
  children, variant = "primary", onClick, disabled,
  size = "md", style = {}, as = "button", block = false, ...rest
}) => {
  const sizes = {
    sm: { p: "8px 14px",  f: 10 },
    md: { p: "12px 20px", f: 11 },
    lg: { p: "16px 24px", f: 12 },
  };
  const S = sizes[size];
  const base = {
    fontFamily: FF_UI, fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    padding: S.p, fontSize: S.f,
    borderRadius: 10,
    letterSpacing: "0.08em", textTransform: "uppercase",
    display: block ? "flex" : "inline-flex",
    alignItems: "center", justifyContent: "center", gap: 8,
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
    opacity: disabled ? 0.35 : 1,
    lineHeight: 1,
    width: block ? "100%" : "auto",
    boxSizing: "border-box",
    border: "none",
  };
  const variants = {
    primary:   { background: T.text,    color: T.bg },
    secondary: { background: "transparent", color: T.text, border: `1px solid ${T.border}` },
    accent:    { background: T.accent,  color: T.bg },
    ghost:     { background: "transparent", color: T.textMid, border: `1px solid ${T.border}` },
    danger:    { background: "transparent", color: T.red,  border: `1px solid ${T.red}` },
  };
  const Tag = as;
  return (
    <Tag
      onClick={e => { if (!disabled) { haptic(); onClick && onClick(e); } }}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
