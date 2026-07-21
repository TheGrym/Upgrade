import { useState, useEffect } from "react";
import { T, FF_MONO, FF_UI, FF_DISPLAY } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { Label, Btn, Modal } from "../../design/components/index.js";
import { haptic } from "../../lib/audio.js";
import { pad2 } from "../../lib/utils.js";
import ExerciseCard from "../ExerciseCard.jsx";

function fmtElapsed(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export default function ActiveWorkoutScreen({ session, sessions, programs, onUpdate, onFinish, onAbandon, onRest }) {
  const [endModal,  setEndModal]  = useState(false);
  const [stopModal, setStopModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - session.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startTime]);

  const prog = programs?.[session.programId] || Object.values(programs || {})[0];
  const sess = prog?.sessions.find(s => s.key === session.sessionKey);
  if (!prog || !sess) return null;

  const updateSet = (exId, idx, patch) => {
    const exs  = { ...session.exercises };
    const sets = [...exs[exId].sets];
    sets[idx]  = { ...sets[idx], ...patch };
    exs[exId]  = { ...exs[exId], sets };
    onUpdate({ ...session, exercises: exs });
  };
  const completeSet = (exId, idx) => { updateSet(exId, idx, { done:true }); onRest(); };

  const totalSets = sess.exercises.reduce((a,ex) => a + (session.exercises[ex.id]?.sets?.length||0), 0);
  const doneSets  = sess.exercises.reduce((a,ex) => a + (session.exercises[ex.id]?.sets?.filter(s=>s.done).length||0), 0);
  const allDone   = doneSets === totalSets;
  const pct       = totalSets > 0 ? Math.round((doneSets/totalSets)*100) : 0;

  const activeExIdx = sess.exercises.findIndex(ex =>
    !(session.exercises[ex.id]?.sets?.every(s=>s.done))
  );

  return (
    <div className="fade-in">
      {/* Barre progression sticky */}
      <div style={{
        position:"sticky", top:"env(safe-area-inset-top)", zIndex:10,
        background:"rgba(8,8,11,0.95)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        padding:"10px 0 14px", borderBottom:`1px solid ${T.border}`,
        marginBottom:28, marginLeft:-20, marginRight:-20, paddingLeft:20, paddingRight:20,
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.12em", textTransform:"uppercase"}}>
              AVANCEMENT
            </span>
            <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:11, fontWeight:700,
              color: elapsed > 5400 ? T.red : T.textDim,
              letterSpacing:"0.08em", fontVariantNumeric:"tabular-nums"}}>
              ⏱ {fmtElapsed(elapsed)}
            </span>
          </div>
          <span style={{fontFamily:FF_MONO, fontSize:12, fontWeight:700, color:allDone?T.accent:T.text, letterSpacing:"0.08em", fontVariantNumeric:"tabular-nums"}}>
            {pad2(doneSets)}<span style={{color:T.dim}}>/{pad2(totalSets)}</span>
            <span style={{color:allDone?T.accent:T.textDim, marginLeft:8, fontSize:10}}>{pct}%</span>
          </span>
        </div>
        {/* Progress track */}
        <div style={{height:4, background:T.border, borderRadius:3, position:"relative", overflow:"hidden"}}>
          <div style={{
            position:"absolute", inset:0, width:`${pct}%`,
            background: `linear-gradient(90deg, ${T.accentDim}, ${T.accent})`,
            borderRadius:3,
            transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}/>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: T.glass, border:`1px solid ${T.glassBorder}`,
        borderRadius:16, padding:"18px 20px", marginBottom:20,
      }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
          <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.accent, letterSpacing:"0.14em",
            display:"flex", alignItems:"center", gap:6}}>
            <span style={{width:5, height:5, background:T.accent, borderRadius:3,
              animation:"accentPulse 1.4s ease-in-out infinite", display:"inline-block"}}/>
            EN COURS · {sess.code}
          </span>
          <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.1em"}}>{prog.name}</span>
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:52, color:T.text, lineHeight:0.88, letterSpacing:"0.02em", textTransform:"uppercase", marginBottom:4}}>
          {sess.label}
        </div>
        <div style={{fontFamily:FF_UI, fontSize:12, fontWeight:700, color:T.textMid, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8}}>
          {sess.title}
        </div>
        <div style={{fontFamily:FF_MONO, fontSize:10, color:T.textDim, letterSpacing:"0.04em"}}>
          {sess.muscles}
        </div>
      </div>

      {/* Priorité de séance */}
      {sess.priority && (
        <div style={{
          background: "#0F0F13",
          border: `1px solid rgba(255,98,0,0.18)`,
          borderLeft: `3px solid ${T.accent}`,
          borderRadius: "0 10px 10px 0",
          padding: "7px 12px",
          marginBottom: 12,
          fontFamily: FF_MONO,
          fontSize: 9,
          color: T.accent,
          letterSpacing: "0.04em",
        }}>
          {sess.priority}
        </div>
      )}

      {/* Interrompre */}
      <button onClick={()=>setStopModal(true)} style={{
        width:"100%", background:"rgba(255,61,61,0.06)",
        border:`1px solid rgba(255,61,61,0.3)`,
        borderRadius:12, padding:"12px 20px", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        marginBottom:28, fontFamily:FF_UI, fontSize:11, fontWeight:700,
        letterSpacing:"0.1em", textTransform:"uppercase", color:T.red,
      }}>
        <Ico d={IC.close} s={13} c={T.red}/>
        INTERROMPRE
      </button>

      {/* Exercices */}
      <div style={{marginBottom:8}}>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}>
          <Label color={T.textDim}>EX</Label>
          <div style={{height:1, flex:1, background:T.border}}/>
          <Label color={T.text}>EXERCICES · {pad2(sess.exercises.length)}</Label>
        </div>
        {sess.exercises.map((ex,idx)=>{
        // Appliquer la variante Bloc B si nécessaire
        const isBlockB = session.blockInfo?.currentBlock === 1;
        const resolvedEx = (isBlockB && ex.variant) ? { ...ex, ...ex.variant } : ex;
        return (
          <ExerciseCard key={ex.id} ex={resolvedEx}
            exData={session.exercises[ex.id]}
            sessions={sessions}
            programId={session.programId}
            sessionKey={session.sessionKey}
            session={session}
            onUpdate={updateSet}
            onComplete={completeSet}
            index={idx} total={sess.exercises.length}
            isActive={idx===activeExIdx}
          />
        );
      })}
      </div>

      {/* Terminer */}
      <Btn
        variant={allDone?"accent":"secondary"}
        onClick={()=>allDone&&setEndModal(true)}
        disabled={!allDone} size="lg" block
        style={{marginTop:28, marginBottom:80}}
      >
        {allDone ? "TERMINER LA SÉANCE" : `${pad2(totalSets-doneSets)} SÉRIE${totalSets-doneSets>1?"S":""} RESTANTE${totalSets-doneSets>1?"S":""}`}
      </Btn>

      {/* Modal bilan */}
      <Modal open={endModal} onClose={()=>setEndModal(false)} code="FIN" title="BILAN DE SÉANCE">
        <div style={{fontFamily:FF_MONO, fontSize:11, color:T.textDim, letterSpacing:"0.08em", marginBottom:16}}>
          DURÉE · {fmtElapsed(elapsed)}
        </div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.text, marginBottom:4}}>INTENSITÉ</div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.accent, marginBottom:28}}>RESSENTIE</div>
        <Label style={{display:"block", marginBottom:16}}>RPE · 1 (FACILE) → 5 (ÉCHEC)</Label>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", marginBottom:36, gap:8}}>
          {[1,2,3,4,5].map(n=>{
            const active = session.rpe===n;
            return (
              <button key={n} onClick={()=>{haptic();onUpdate({...session,rpe:n});}}
                style={{
                  background:active?T.accent:T.glass,
                  border:`1px solid ${active?T.accent:T.glassBorder}`,
                  borderRadius:10, padding:"16px 0", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                }}>
                <span style={{fontFamily:FF_DISPLAY, fontSize:24, color:active?T.bg:T.text, lineHeight:1}}>
                  {String(n).padStart(2,"0")}
                </span>
                <span style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:active?T.bg:T.dim, letterSpacing:"0.1em", textTransform:"uppercase"}}>
                  {["FACILE","STABLE","MOYEN","DIFFICILE","ÉCHEC"][n-1]}
                </span>
              </button>
            );
          })}
        </div>
        <Label style={{display:"block", marginBottom:10}}>NOTES</Label>
        <textarea placeholder="PR, douleurs, observations…" value={session.notes||""} onChange={e=>onUpdate({...session,notes:e.target.value})}
          style={{width:"100%", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:10,
            padding:14, color:T.text, fontSize:13, fontFamily:"system-ui", resize:"none", height:100,
            outline:"none", marginBottom:28, boxSizing:"border-box", lineHeight:1.5}}/>
        <div style={{display:"grid", gridTemplateColumns:"1fr 2fr", gap:10}}>
          <Btn variant="ghost" onClick={()=>setEndModal(false)}>ANNULER</Btn>
          <Btn variant="accent" onClick={()=>{setEndModal(false);onFinish(session);}}>SAUVEGARDER</Btn>
        </div>
      </Modal>

      {/* Modal abandon */}
      <Modal open={stopModal} onClose={()=>setStopModal(false)} code="STOP" title="CONFIRMATION">
        <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.red, marginBottom:16}}>INTERROMPRE ?</div>
        <div style={{fontFamily:FF_MONO, fontSize:10, color:T.textDim, letterSpacing:"0.08em", marginBottom:12}}>
          DURÉE ÉCOULÉE · {fmtElapsed(elapsed)}
        </div>
        <p style={{fontFamily:"system-ui", fontSize:13, color:T.textMid, lineHeight:1.6, marginBottom:36}}>
          Toutes les données saisies seront effacées. Action irréversible.
        </p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
          <Btn variant="ghost"  onClick={()=>setStopModal(false)}>ANNULER</Btn>
          <Btn variant="danger" onClick={()=>{setStopModal(false);onAbandon();}}>INTERROMPRE</Btn>
        </div>
      </Modal>
    </div>
  );
}
