@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Reset & base ──────────────────────────────────── */

*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  overflow-x: hidden;
  overscroll-behavior-x: none;
  width: 100%;
  max-width: 100vw;
  -webkit-text-size-adjust: 100%;
}

html, body, #root {
  margin: 0;
  padding: 0;
  background: #08080B;
  color: #EAEAE6;
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  overscroll-behavior: none;
  overflow-x: clip;
  width: 100%;
  max-width: 100vw;
  position: relative;
}

#root {
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

input, textarea, button, select {
  font-family: inherit;
  color: inherit;
  max-width: 100%;
  -webkit-appearance: none;
}

input:focus, textarea:focus, select:focus {
  border-color: #FF6200 !important;
  outline: none;
}

button { cursor: pointer; }
button:active:not(:disabled) { transform: scale(0.97); }

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] { -moz-appearance: textfield; }

input::placeholder, textarea::placeholder { color: #52525C; }
img, svg, video { max-width: 100%; height: auto; }
::selection { background: #FF6200; color: #08080B; }

::-webkit-scrollbar { width: 2px; height: 2px; }
::-webkit-scrollbar-thumb { background: #1C1C23; border-radius: 2px; }
::-webkit-scrollbar-track { background: transparent; }

select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2376767E' stroke-width='1.5'><path d='M6 9l6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px !important;
}

/* ── Noise overlay ──────────────────────────────────── */
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Scrollbar hide ─────────────────────────────────── */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* ── Keyframes ──────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes restSlide {
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes setFlash {
  0%   { background: #08080B; }
  25%  { background: #131318; }
  100% { background: transparent; }
}
@keyframes checkPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.2); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes stickyIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes accentPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* ── Animation classes ──────────────────────────────── */
.fade-in      { animation: fadeIn 0.32s cubic-bezier(0.16,1,0.3,1) both; }
.view-right   { animation: slideInRight 0.28s cubic-bezier(0.16,1,0.3,1) both; }
.view-left    { animation: slideInLeft  0.28s cubic-bezier(0.16,1,0.3,1) both; }
.set-flash    { animation: setFlash 0.5s ease-out; }
.check-pop    { animation: checkPop 0.28s cubic-bezier(0.34,1.56,0.64,1); }
.rest-slide   { animation: restSlide 0.3s cubic-bezier(0.16,1,0.3,1) both; }
.sticky-in    { animation: stickyIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }
.accent-pulse { animation: accentPulse 1.4s ease-in-out infinite; }

.card-gl {
  background: rgba(255,255,255,0.028);
  border: 1px solid rgba(255,255,255,0.065);
  border-radius: 14px;
}
@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(255,98,0,0.45); }
  50%       { box-shadow: 0 0 14px rgba(255,98,0,0.75); }
}
.progress-glow { animation: progressGlow 2s ease-in-out infinite; }
