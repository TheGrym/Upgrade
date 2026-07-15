import { useMemo } from "react";
import { T, FF_MONO, FF_UI, FF_DISPLAY } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { PROGRAMS } from "../../data/programs.js";
import { getLastSession, getTotalVolume } from "../../lib/sessions.js";
import { getBlockDisplayInfo } from "../../lib/blockManager.js";
import { fmtAgo, pad2, pad3 } from "../../lib/utils.js";
import { haptic } from "../../lib/audio.js";

export default function HomeScreen({ state, programs, onStartSession, onSwitchProgram, onNewProgram, onGoToSession }) {
  const allProgs = programs || PROGRAMS;
  const prog = allProgs[state.activeProgramId] || Object.values(allProgs)[0];

  const totalSessions = state.sessions.length;
  const weekSessions  = state.sessions.filter(s => Date.now() - s.date < 7*86400000).length;
  const totalVolumeKg = state.sessions.reduce((a,s) => a + (s.totalVolume||getTotalVolume(s)), 0);

  const blockInfo = getBlockDisplayInfo(state.activeProgramId);
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

  const today = new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}).split("/").join(".");

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{padding:"28px 0 44px", borderBottom:`1px solid ${T.border}`, marginBottom:36}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
          <span style={{fontFamily:FF_MONO, fontSize:10, fontWeight:700, color:T.dim, letterSpacing:"0.12em"}}>
            INDEX · {pad3(totalSessions)}
          </span>
          <span style={{fontFamily:FF_MONO, fontSize:10, fontWeight:700, color:T.dim}}>{today}</span>
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:"clamp(60px,17vw,80px)", color:T.text, lineHeight:0.86, textTransform:"uppercase"}}>
          PROCHAINE
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:"clamp(60px,17vw,80px)", color:T.accent, lineHeight:0.86, textTransform:"uppercase"}}>
          SÉANCE
        </div>
      </div>

      {/* Programme actif */}
      <button onClick={onSwitchProgram} style={{
        width:"100%",
        background: T.glass,
        border: `1px solid ${T.glassBorder}`,
        borderRadius: 12,
        padding:"16px 18px",
        marginBottom: 28,
        cursor:"pointer", textAlign:"left", display:"block",
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
          <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim,
            letterSpacing:"0.1em", textTransform:"uppercase"}}>PROGRAMME ACTIF</span>
          <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.accent,
            letterSpacing:"0.1em", textTransform:"uppercase"}}>CHANGER →</span>
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:26, color:T.text, lineHeight:0.9,
          textTransform:"uppercase"}}>{prog.name}</div>
        {prog.isCustom && (
          <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.accentDim,
            letterSpacing:"0.1em", textTransform:"uppercase", marginTop:4, display:"block"}}>CUSTOM</span>
        )}
      </button>

      {/* Quick Launch — 1 tap */}
      {!state.active && (() => {
        const sugSess = prog.sessions.find(s => s.key === suggestSessionKey);
        if (!sugSess) return null;
        return (
          <button onClick={() => { haptic(); onStartSession(prog.id, suggestSessionKey); }}
            style={{
              width:"100%", background:T.accent, border:"none", borderRadius:14,
              padding:"16px 20px", marginBottom:16, cursor:"pointer", textAlign:"left",
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
            <div>
              <div style={{fontFamily:FF_UI, fontSize:8, fontWeight:700, color:"rgba(0,0,0,0.45)",
                letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:6}}>
                LANCER MAINTENANT
              </div>
              <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.bg, lineHeight:0.9, textTransform:"uppercase"}}>
                {sugSess.label}
              </div>
              <div style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:"rgba(0,0,0,0.5)",
                textTransform:"uppercase", letterSpacing:"0.06em", marginTop:5}}>
                {sugSess.title}
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8}}>
              <div style={{fontFamily:FF_MONO, fontSize:20, color:T.bg, fontWeight:700}}>→</div>
              <div style={{background:"rgba(0,0,0,0.15)", borderRadius:6, padding:"3px 8px", textAlign:"center"}}>
                <div style={{fontFamily:FF_MONO, fontSize:8, fontWeight:700, color:T.bg, letterSpacing:"0.1em"}}>
                  BLOC {blockInfo.blockLabel}
                </div>
                <div style={{fontFamily:FF_MONO, fontSize:7, color:"rgba(0,0,0,0.45)"}}>
                  SEM. {blockInfo.currentWeek}
                </div>
              </div>
            </div>
          </button>
        );
      })()}

      {/* Sessions label */}
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <span style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim, letterSpacing:"0.1em"}}>01</span>
        <div style={{height:1, flex:1, maxWidth:28, background:T.border}}/>
        <span style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.text, letterSpacing:"0.1em", textTransform:"uppercase"}}>SESSIONS</span>
      </div>

      {/* Sessions — glass cards */}
      <div style={{marginBottom:40}}>
        {prog.sessions.map(sess => {
          const isActive  = state.active?.programId===prog.id && state.active?.sessionKey===sess.key;
          const last      = getLastSession(state.sessions, prog.id, sess.key);
          const suggested = sess.key===suggestSessionKey && !state.active;
          const count     = state.sessions.filter(s=>s.programId===prog.id && s.sessionKey===sess.key).length;

          let badge = null;
          if (isActive) badge = (
            <span style={{background:T.accent, color:T.bg, padding:"5px 10px", borderRadius:20,
              fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
              display:"inline-flex", alignItems:"center", gap:5}}>
              <span style={{width:4, height:4, background:T.bg, borderRadius:2,
                animation:"accentPulse 1.4s ease-in-out infinite"}}/>
              EN COURS
            </span>
          );
          else if (suggested) badge = (
            <span style={{background:T.accent, color:T.bg, padding:"5px 10px", borderRadius:20,
              fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase"}}>
              ▲ SUGGÉRÉE
            </span>
          );
          else if (!last) badge = (
            <span style={{border:`1px solid ${T.accent}`, color:T.accent, padding:"4px 9px", borderRadius:20,
              fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase"}}>
              NOUVEAU
            </span>
          );

          const cardBg = (suggested || isActive)
            ? "linear-gradient(135deg, rgba(255,98,0,0.09) 0%, rgba(255,98,0,0.03) 100%)"
            : T.glass;
          const cardBorder = (suggested || isActive) ? T.accent : T.glassBorder;
          const cardShadow = (suggested || isActive) ? `0 0 28px rgba(255,98,0,0.10)` : "none";

          return (
            <button key={sess.key}
              onClick={()=>{ if(!state.active||isActive){haptic();onStartSession(prog.id,sess.key);} }}
              disabled={!!state.active&&!isActive}
              style={{
                width:"100%",
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 10,
                cursor: (!state.active||isActive) ? "pointer" : "not-allowed",
                textAlign:"left", display:"block",
                opacity: !!state.active&&!isActive ? 0.28 : 1,
                transition: "opacity 0.2s, box-shadow 0.3s",
                boxShadow: cardShadow,
              }}>
              {/* Top row */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
                <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.14em"}}>{sess.code}</span>
                {badge || <Ico d={IC.arrowR} s={14} c={T.textDim}/>}
              </div>

              {/* Label */}
              <div style={{fontFamily:FF_DISPLAY, fontSize:50, color:(suggested||isActive)?T.accent:T.text,
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
                paddingTop: 12, borderTop: `1px solid ${(suggested||isActive) ? "rgba(255,98,0,0.25)" : T.border}`,
              }}>
                <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.08em"}}>
                  {sess.exercises.length} EXERCICES
                </span>
                <div style={{display:"flex", gap:14, alignItems:"center"}}>
                  <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:count>0?T.textMid:T.dim, letterSpacing:"0.08em"}}>
                    ×{pad3(count)}
                  </span>
                  <span style={{fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:last?T.dim:T.textFaint, letterSpacing:"0.08em"}}>
                    {last ? fmtAgo(last.date) : "JAMAIS"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Nouveau programme */}
      <button onClick={()=>{haptic();onNewProgram&&onNewProgram();}}
        style={{
          width:"100%", background:"transparent",
          border:`1px dashed ${T.accentDim}`,
          borderRadius:14, padding:"14px", marginBottom:44, cursor:"pointer",
          fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.accentDim,
          letterSpacing:"0.1em", textTransform:"uppercase",
        }}>
        + CRÉER UN NOUVEAU PROGRAMME
      </button>

      {/* Métriques */}
      {totalSessions > 0 && (
        <div style={{marginBottom:52}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}>
            <span style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim, letterSpacing:"0.1em"}}>02</span>
            <div style={{height:1, flex:1, maxWidth:28, background:T.border}}/>
            <span style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.text, letterSpacing:"0.1em", textTransform:"uppercase"}}>PERFORMANCE</span>
          </div>

          <div style={{
            background: T.glass, border: `1px solid ${T.glassBorder}`,
            borderRadius: 16, padding: "4px 0", overflow: "hidden",
          }}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
              <div style={{padding:"20px 20px 20px", borderRight:`1px solid ${T.border}`}}>
                <div style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10}}>SÉANCES TOTALES</div>
                <div style={{fontFamily:FF_DISPLAY, fontSize:56, color:T.accent, lineHeight:0.84, fontVariantNumeric:"tabular-nums"}}>
                  {pad3(totalSessions)}
                </div>
              </div>
              <div style={{padding:"20px"}}>
                <div style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10}}>VOLUME TOTAL</div>
                <div style={{display:"flex", alignItems:"baseline", gap:5}}>
                  <span style={{fontFamily:FF_DISPLAY, fontSize:56, color:T.text, lineHeight:0.84, fontVariantNumeric:"tabular-nums"}}>
                    {(totalVolumeKg/1000).toFixed(1)}
                  </span>
                  <span style={{fontFamily:FF_MONO, fontSize:11, fontWeight:700, color:T.dim, letterSpacing:"0.1em"}}>T</span>
                </div>
              </div>
              <div style={{padding:"20px", borderTop:`1px solid ${T.border}`, borderRight:`1px solid ${T.border}`}}>
                <div style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10}}>7 JOURS</div>
                <div style={{fontFamily:FF_DISPLAY, fontSize:56, color:T.text, lineHeight:0.84, fontVariantNumeric:"tabular-nums"}}>
                  {pad2(weekSessions)}
                </div>
              </div>
              <div style={{padding:"20px", borderTop:`1px solid ${T.border}`}}>
                <div style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10}}>CE PROGRAMME</div>
                <div style={{fontFamily:FF_DISPLAY, fontSize:56, color:T.text, lineHeight:0.84, fontVariantNumeric:"tabular-nums"}}>
                  {pad3(state.sessions.filter(s=>s.programId===state.activeProgramId).length)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
