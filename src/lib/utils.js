export const uid = () => Math.random().toString(36).slice(2, 10);

export const fmtDate = ts =>
  new Date(ts).toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit", year:"2-digit" });

export const fmtDateLong = ts =>
  new Date(ts).toLocaleDateString("fr-FR", { weekday:"short", day:"2-digit", month:"long" }).toUpperCase();

export const fmtDur = sec => {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};

export const fmtClock = sec =>
  `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;

export const daysAgo = ts => Math.floor((Date.now() - ts) / 86400000);

export const fmtAgo = ts => {
  const d = daysAgo(ts);
  if (d === 0) return "AUJOURD'HUI";
  if (d === 1) return "HIER";
  if (d < 7)  return `J-${d}`;
  if (d < 30) return `S-${Math.floor(d/7)}`;
  return fmtDate(ts);
};

export const pad2 = n => String(n).padStart(2, "0");
export const pad3 = n => String(n).padStart(3, "0");
