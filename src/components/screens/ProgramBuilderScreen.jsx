import { useState } from "react";
import { T, FF_UI, FF_MONO, FF_DISPLAY } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { Btn, Modal } from "../../design/components/index.js";
import { haptic } from "../../lib/audio.js";
import { uid } from "../../lib/utils.js";
import ExerciseLibraryScreen from "./ExerciseLibraryScreen.jsx";

function makeEx(dbEx) {
  return {
    id: uid(),
    name: dbEx.name,
    sets: dbEx.sets || 3,
    min: dbEx.repRange?.[0] || 8,
    max: dbEx.repRange?.[1] || 12,
    tips: dbEx.tips || [],
    musclesFront: dbEx.musclesFront || [],
    musclesBack: dbEx.musclesBack || [],
  };
}

function makeSession(idx) {
  const labels = ["A","B","C","D","E","F"];
  const lbl = labels[idx] || String(idx+1);
  return {
    id: uid(), key: uid(),
    label: lbl, code: `${lbl}-0${idx+1}`,
    title: `SÉANCE ${lbl}`, muscles: "",
    num: String(idx+1).padStart(2,"0"),
    exercises: [],
  };
}

export default function ProgramBuilderScreen({ onSave, onClose }) {
  const [progName, setProgName] = useState("");
  const [sessions,  setSessions] = useState([makeSession(0)]);
  const [bankModal, setBankModal] = useState(null);

  const addSession = () => {
    haptic();
    setSessions(s => [...s, makeSession(s.length)]);
  };

  const removeSession = idx => {
    haptic();
    setSessions(s => s.filter((_,i)=>i!==idx));
  };

  const addExercise = (sessIdx, dbEx) => {
    const ex = makeEx(dbEx);
    setSessions(s => s.map((sess,i) => i!==sessIdx ? sess
      : { ...sess, exercises: [...sess.exercises, ex] }
    ));
    setBankModal(null);
  };

  const removeExercise = (sessIdx, exIdx) => {
    haptic();
    setSessions(s => s.map((sess,i) => i!==sessIdx ? sess
      : { ...sess, exercises: sess.exercises.filter((_,j)=>j!==exIdx) }
    ));
  };

  const updateEx = (sessIdx, exIdx, patch) => {
    setSessions(s => s.map((sess,i) => i!==sessIdx ? sess
      : { ...sess, exercises: sess.exercises.map((ex,j)=>j!==exIdx?ex:{...ex,...patch}) }
    ));
  };

  const mergeSuperset = (sessIdx, exIdx) => {
    setSessions(s => s.map((sess,i) => {
      if (i!==sessIdx) return sess;
      const exs = [...sess.exercises];
      const a = exs[exIdx], b = exs[exIdx+1];
      if (!a||!b) return sess;
      const ss = {
        id: uid(), superset:true,
        nameA:a.name, nameB:b.name,
        sets:a.sets, min:a.min, max:a.max,
        tipsA:a.tips||[], tipsB:b.tips||[],
        musclesFront:[...(a.musclesFront||[]),...(b.musclesFront||[])],
        musclesBack:[...(a.musclesBack||[]),...(b.musclesBack||[])],
      };
      exs.splice(exIdx, 2, ss);
      return { ...sess, exercises:exs };
    }));
  };

  const handleSave = () => {
    if (!progName.trim()) return;
    const prog = {
      id: uid(),
      name: progName.toUpperCase(),
      subtitle: `CUSTOM · ${sessions.length} SESSION${sessions.length>1?"S":""}`,
      author: "CUSTOM",
      description: "Programme personnalisé",
      isCustom: true,
      sessions: sessions.map(s => ({
        ...s,
        muscles: s.exercises
          .flatMap(ex => [...(ex.musclesFront||[]),...(ex.musclesBack||[])])
          .join(" · ").toUpperCase() || "PERSONNALISÉ",
      })),
    };
    onSave(prog);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"20px 0 24px", borderBottom:`1px solid ${T.border}`, marginBottom:28}}>
        <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.accent, lineHeight:0.9}}>NOUVEAU<br/>PROGRAMME</div>
        <button onClick={onClose} style={{background:T.card, border:`1px solid ${T.border}`,
          borderRadius:10, padding:10, cursor:"pointer", display:"flex"}}>
          <Ico d={IC.close} s={18} c={T.text}/>
        </button>
      </div>

      {/* Nom */}
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim,
          letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8}}>NOM DU PROGRAMME</div>
        <input
          placeholder="MON PROGRAMME…"
          value={progName}
          onChange={e=>setProgName(e.target.value)}
          style={{width:"100%", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"14px 16px", color:T.text, fontFamily:FF_UI, fontSize:15, fontWeight:700,
            outline:"none", boxSizing:"border-box", letterSpacing:"0.06em", textTransform:"uppercase"}}
        />
      </div>

      {/* Séances */}
      {sessions.map((sess,si)=>(
        <div key={sess.id} style={{background:T.card, border:`1px solid ${T.border}`,
          borderRadius:14, marginBottom:16, overflow:"hidden"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"14px 16px", borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <span style={{fontFamily:FF_DISPLAY, fontSize:28, color:T.accent, lineHeight:1}}>{sess.label}</span>
              <input value={sess.title} onChange={e=>setSessions(s=>s.map((x,i)=>i!==si?x:{...x,title:e.target.value.toUpperCase()}))}
                style={{background:"transparent", border:"none", color:T.textMid, fontFamily:FF_UI,
                  fontSize:12, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
                  outline:"none", width:140}}/>
            </div>
            {sessions.length>1 && (
              <button onClick={()=>removeSession(si)} style={{background:"none", border:"none", cursor:"pointer", padding:6}}>
                <Ico d={IC.trash} s={16} c={T.red}/>
              </button>
            )}
          </div>

          <div style={{padding:"12px 16px"}}>
            {sess.exercises.map((ex,ei)=>(
              <div key={ex.id}>
                <div style={{display:"flex", alignItems:"center", gap:10, padding:"10px 0",
                  borderBottom:`1px solid ${T.border}`}}>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontFamily:FF_UI, fontSize:12, fontWeight:700, color:T.text,
                      textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6}}>
                      {ex.superset ? `${ex.nameA} / ${ex.nameB}` : ex.name}
                      {ex.superset && <span style={{fontFamily:FF_UI, fontSize:8, color:T.accent,
                        letterSpacing:"0.14em", marginLeft:8}}>SUPERSET</span>}
                    </div>
                    <div style={{display:"flex", gap:8, alignItems:"center"}}>
                      <input type="number" value={ex.sets} onChange={e=>updateEx(si,ei,{sets:parseInt(e.target.value)||1})}
                        style={{width:40, background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:6,
                          padding:"4px 6px", color:T.text, fontFamily:FF_MONO, fontSize:11, textAlign:"center", outline:"none"}}/>
                      <span style={{fontFamily:FF_MONO, fontSize:9, color:T.dim}}>×</span>
                      <input type="number" value={ex.min} onChange={e=>updateEx(si,ei,{min:parseInt(e.target.value)||1})}
                        style={{width:40, background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:6,
                          padding:"4px 6px", color:T.text, fontFamily:FF_MONO, fontSize:11, textAlign:"center", outline:"none"}}/>
                      <span style={{fontFamily:FF_MONO, fontSize:9, color:T.dim}}>-</span>
                      <input type="number" value={ex.max} onChange={e=>updateEx(si,ei,{max:parseInt(e.target.value)||1})}
                        style={{width:40, background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:6,
                          padding:"4px 6px", color:T.text, fontFamily:FF_MONO, fontSize:11, textAlign:"center", outline:"none"}}/>
                    </div>
                  </div>
                  <button onClick={()=>removeExercise(si,ei)} style={{background:"none", border:"none", cursor:"pointer", padding:6}}>
                    <Ico d={IC.close} s={14} c={T.textDim}/>
                  </button>
                </div>
                {ei<sess.exercises.length-1 && !ex.superset && !sess.exercises[ei+1]?.superset && (
                  <button onClick={()=>mergeSuperset(si,ei)}
                    style={{width:"100%", background:"none", border:`1px dashed ${T.border}`,
                      borderRadius:8, padding:"6px", margin:"4px 0",
                      fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim,
                      letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer"}}>
                    + FUSIONNER EN SUPERSET
                  </button>
                )}
              </div>
            ))}

            <button onClick={()=>{haptic();setBankModal(si);}}
              style={{width:"100%", background:"transparent", border:`1px dashed ${T.accentDim}`,
                borderRadius:10, padding:"11px", marginTop:sess.exercises.length>0?12:0,
                fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.accentDim,
                letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer"}}>
              + AJOUTER EXERCICE
            </button>
          </div>
        </div>
      ))}

      <button onClick={addSession}
        style={{width:"100%", background:"transparent", border:`1px dashed ${T.border}`,
          borderRadius:14, padding:"14px", marginBottom:32,
          fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.textDim,
          letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer"}}>
        + AJOUTER UNE SÉANCE
      </button>

      <Btn variant="accent" size="lg" block
        disabled={!progName.trim()||sessions.every(s=>s.exercises.length===0)}
        onClick={handleSave}>
        SAUVEGARDER LE PROGRAMME
      </Btn>

      {/* Modal banque */}
      {bankModal!==null && (
        <div style={{position:"fixed", inset:0, background:T.bg, zIndex:3000,
          display:"flex", flexDirection:"column", animation:"modalIn 0.22s"}}>
          <div style={{maxWidth:420, margin:"0 auto", width:"100%", flex:1,
            overflowY:"auto", padding:"20px 20px 40px",
            paddingTop:"calc(20px + env(safe-area-inset-top))", boxSizing:"border-box"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
              <span style={{fontFamily:FF_UI, fontSize:12, fontWeight:700, color:T.text,
                letterSpacing:"0.08em", textTransform:"uppercase"}}>CHOISIR UN EXERCICE</span>
              <button onClick={()=>setBankModal(null)} style={{background:T.card, border:`1px solid ${T.border}`,
                borderRadius:10, padding:10, cursor:"pointer", display:"flex"}}>
                <Ico d={IC.close} s={18} c={T.text}/>
              </button>
            </div>
            <ExerciseLibraryScreen selectMode={true} onSelectExercise={ex=>addExercise(bankModal,ex)}/>
          </div>
        </div>
      )}
    </div>
  );
}
