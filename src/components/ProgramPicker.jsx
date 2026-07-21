import { T, FF_UI, FF_DISPLAY } from "../design/tokens.js";
import { IC, Ico } from "../design/icons.jsx";
import { PROGRAMS } from "../data/programs.js";
import { haptic } from "../lib/audio.js";

export default function ProgramPicker({ currentId, programs, onPick, onClose }) {
  const allProgs = programs || PROGRAMS;
  return (
    <div style={{ position:"fixed", inset:0, background:T.bg, zIndex:2000,
      display:"flex", flexDirection:"column", animation:"modalIn 0.22s" }}>
      <div style={{ maxWidth:520, margin:"0 auto", width:"100%", flex:1, overflowY:"auto",
        padding:"20px 20px 40px", paddingTop:"calc(20px + env(safe-area-inset-top))", boxSizing:"border-box" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <div style={{ fontFamily:FF_DISPLAY, fontSize:36, color:T.text, lineHeight:0.9 }}>
            SÉLECTION<br/><span style={{ color:T.accent }}>PROGRAMME</span>
          </div>
          <button onClick={onClose} style={{ background:T.card, border:`1px solid ${T.border}`,
            borderRadius:10, padding:10, cursor:"pointer", display:"flex" }}>
            <Ico d={IC.close} s={18} c={T.text}/>
          </button>
        </div>

        <div style={{ height:1, background:T.border, marginBottom:28 }}/>

        {Object.values(allProgs).map(p => (
          <button key={p.id} onClick={()=>{ haptic(); onPick(p.id); }}
            style={{ width:"100%", background:currentId===p.id?T.card:"transparent",
              border:`1px solid ${currentId===p.id?T.accent:T.border}`,
              borderRadius:14, padding:"20px 16px", marginBottom:12,
              cursor:"pointer", textAlign:"left",
              display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:14 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ fontFamily:FF_DISPLAY, fontSize:22, color:currentId===p.id?T.accent:T.text,
                  lineHeight:0.9, textTransform:"uppercase" }}>{p.name}</div>
                {currentId===p.id && (
                  <span style={{ background:T.accent, color:T.bg, padding:"3px 10px", borderRadius:20,
                    fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em" }}>ACTIF</span>
                )}
                {p.isCustom && (
                  <span style={{ border:`1px solid ${T.accentDim}`, color:T.accentDim, padding:"2px 8px", borderRadius:20,
                    fontFamily:FF_UI, fontSize:8, fontWeight:700, letterSpacing:"0.12em" }}>CUSTOM</span>
                )}
              </div>
              <div style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim,
                letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>{p.subtitle}</div>
              <p style={{ fontFamily:"system-ui", fontSize:12, color:T.dim, lineHeight:1.5 }}>{p.description}</p>
            </div>
            <Ico d={IC.arrowR} s={16} c={currentId===p.id?T.accent:T.textDim}/>
          </button>
        ))}
      </div>
    </div>
  );
}
