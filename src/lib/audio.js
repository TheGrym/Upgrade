let _ctx = null;
const getCtx = () => {
  try {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === "suspended") _ctx.resume();
    return _ctx;
  } catch (e) { return null; }
};

export const playBeep = () => {
  const c = getCtx(); if (!c) return;
  try {
    [[0,880,0.15],[0.2,880,0.15],[0.42,1320,0.35]].forEach(([t,f,d]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = "square"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, c.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.4, c.currentTime+t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+t+d);
      o.start(c.currentTime+t); o.stop(c.currentTime+t+d+0.05);
    });
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate([200,100,200,100,400]); } catch (e) {}
};

export const playTick = () => {
  const c = getCtx(); if (!c) return;
  try {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = "square"; o.frequency.value = 720;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22, c.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+0.07);
    o.start(c.currentTime); o.stop(c.currentTime+0.08);
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate(40); } catch (e) {}
};

export const haptic = () => {
  try { navigator.vibrate && navigator.vibrate(10); } catch (e) {}
};
