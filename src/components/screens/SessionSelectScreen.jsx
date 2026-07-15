import { useMemo } from "react";
import { T, FF_MONO, FF_UI, FF_DISPLAY } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { PROGRAMS } from "../../data/programs.js";
import { getLastSession } from "../../lib/sessions.js";
import { fmtAgo, pad3 } from "../../lib/utils.js";
import { haptic } from "../../lib/audio.js";

export default function SessionSelectScreen({ state, programs, onStartSession, onGoHome }) {
  const allProgs = programs || PROGRAMS;
  const prog = allProgs[state.activeProgramId] || Object.values(allProgs)[0];

  const suggestSessionKey = useMemo(() => {
    const counts = {};
    prog.sessions.forEach(s => (counts[s.key] = 0));
    state.sessions.filter(s => s.programId === prog.id).forEach(s => {
      counts[s.sessionKey] = (counts[s.sessionKey]||0)+1;
    });
    const lastDates = {};
    prog.sessions.forEach(s => {
      const last = getLastSession(state.sessions, prog.id, s.key);
      lastDates[s.key] = last ? last.date : 0;
    });
    return prog.sessions.slice().sort((a,b)=>
      counts[a.key]-counts[b.key] || lastDates[a.key]-lastDates[b.key]
    )[0].key;
  }, [state.sessions, prog]);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{padding:"28px 0 36px", borderBottom:`1px solid ${T.border}`, marginBottom:28}}>
        <div style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.12em", marginBottom:16}}>
          {prog.name}
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:"clamp(52px,14vw,68px)", color:T.text, lineHeight:0.86, textTransform:"uppercase"}}>
          CHOISIR
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:"clamp(52px,14vw,68px)", color:T.accent, lineHeight:0.86, textTransform:"uppercase"}}>
          SÉANCE
        </div>
      </div>

      {/* Sessions — glass cards */}
      <div style={{marginBottom:36}}>
        {prog.sessions.map(sess => {
          const last      = getLastSession(state.sessions, prog.id, sess.key);
          const suggested = sess.key === suggestSessionKey;
          const count     = state.sessions.filter(s=>s.programId===prog.id && s.sessionKey===sess.key).length;

          const cardBg = suggested
            ? "linear-gradient(135deg, rgba(255,98,0,0.09) 0%, rgba(255,98,0,0.03) 100%)"
            : T.glass;

          return (
            <button key={sess.key}
              onClick={()=>{ haptic(); onStartSession(prog.id, sess.key); }}
              style={{
                width:"100%",
                background: cardBg,
                border: `1px solid ${suggested ? T.accent : T.glassBorder}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 10,
                cursor:"pointer", textAlign:"left", display:"block",
                boxShadow: suggested ? "0 0 28px rgba(255,98,0,0.10)" : "none",
                transition: "box-shadow 0.3s",
              }}>
              {/* Top row */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
                <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.14em"}}>{sess.code}</span>
                {suggested
                  ? <span style={{background:T.accent, color:T.bg, padding:"5px 10px", borderRadius:20,
                      fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase"}}>
                      ▲ SUGGÉRÉE
                    </span>
                  : <Ico d={IC.arrowR} s={14} c={T.textDim}/>
                }
              </div>

              {/* Label */}
              <div style={{fontFamily:FF_DISPLAY, fontSize:50, color:suggested?T.accent:T.text,
                letterSpacing:"0.02em", lineHeight:0.86, marginBottom:8, textTransform:"uppercase"}}>
                {sess.label}
              </div>

              {/* Title */}
              <div style={{fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.textMid,
                textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8}}>
                {sess.title}
              </div>

              {/* Muscles */}
              <div style={{fontFamily:FF_MONO, fontSize:10, color:T.dim, lineHeight:1.4,
                letterSpacing:"0.04em", marginBottom:14}}>
                {sess.muscles}
              </div>

              {/* Footer */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                paddingTop:12, borderTop:`1px solid ${suggested ? "rgba(255,98,0,0.25)" : T.border}`,
              }}>
                <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.textDim}}>
                  {sess.exercises.length} EXERCICES
                </span>
                <div style={{display:"flex", gap:14}}>
                  <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:count>0?T.textMid:T.dim}}>
                    ×{pad3(count)}
                  </span>
                  <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim}}>
                    {last ? fmtAgo(last.date) : "JAMAIS"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Retour */}
      <button onClick={()=>{haptic();onGoHome();}}
        style={{
          width:"100%",
          background: T.glass, border:`1px solid ${T.glassBorder}`,
          borderRadius:14, padding:"14px", cursor:"pointer",
          fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.textDim,
          letterSpacing:"0.1em", textTransform:"uppercase",
        }}>
        ← RETOUR ACCUEIL
      </button>
    </div>
  );
}
