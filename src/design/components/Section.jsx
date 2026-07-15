import { T } from "../tokens.js";
import { Label } from "./Label.jsx";
import { Rule } from "./Rule.jsx";

export const Section = ({ code, title, right, children, style = {} }) => (
  <div style={{ marginBottom: 36, ...style }}>
    <div style={{
      display: "flex", alignItems: "flex-end",
      justifyContent: "space-between", marginBottom: 18, gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flex: 1 }}>
        {code && <Label>{code}</Label>}
        {code && <Rule style={{ flex: 1, maxWidth: 30 }} />}
        <Label color={T.text}>{title}</Label>
      </div>
      {right}
    </div>
    {children}
  </div>
);
