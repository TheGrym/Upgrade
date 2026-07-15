export const SKEY = "upgrade_v2";
export const REST_DEFAULT = 90;

export const initialState = () => ({
  version: 2,
  activeProgramId: "uplowup",
  sessions: [],
  active: null,
  prefs: { units: "kg", restDefault: REST_DEFAULT },
  customPrograms: [],
});

export const save = d => {
  try { localStorage.setItem(SKEY, JSON.stringify(d)); } catch (e) {}
};

export const load = () => {
  try {
    const r = localStorage.getItem(SKEY);
    if (r) return JSON.parse(r);
    const old = localStorage.getItem("iron_v1");
    if (old) { const parsed = JSON.parse(old); return { ...parsed, version: 2 }; }
    return null;
  } catch (e) { return null; }
};
