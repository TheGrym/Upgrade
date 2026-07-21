import { T } from "../tokens.js";

export const Rule = ({ color = T.hairline, style = {}, weight = 1 }) => (
  <div style={{ height: weight, background: color, width: "100%", ...style }} />
);
