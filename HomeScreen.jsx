import { useState, useEffect } from "react";
import MuscleBody from "./MuscleBody.jsx";
import HackSquatPlacement from "./HackSquatPlacement.jsx";
import { T, FF_MONO, FF_DISPLAY, FF_UI } from "../design/tokens.js";
import { IC, Ico } from "../design/icons.jsx";
import { Input } from "../design/components/index.js";
import { getSuggestion, getLastMax, getAllTimeMax } from "../lib/sessions.js";
import { haptic } from "../lib/audio.js";
import { pad2 } from "../lib/utils.js";

// ── Muscle mapping ──────────────────────────────────────────────────────────
const MUSCLE_MAP = {
  "DC Haltère":                     { front:["chest","triceps"],          back:["triceps"] },
  "DI Haltère":                     { front:["chest","deltoids"],         back:[] },
  "Écarté Poulie/Haltère":          { front:["chest"],                    back:[] },
  "Écarté Poulie Incliné":          { front:["chest"],                    back:[] },
  "Écarté Poulie":                   { front:["chest"],                    back:[] },
  "Curl Marteau Poulie":            { front:["biceps","forearm"],         back:[] },
  "Curl Incliné Haltère":           { front:["biceps"],                   back:[] },
  "Curl Barre":                     { front:["biceps","forearm"],         back:[] },
  "Curl Marteau Haltère":           { front:["biceps","forearm"],         back:[] },
  "Curl Marteau":                   { front:["biceps","forearm"],         back:[] },
  "Curl Haltère Alterné":           { front:["biceps"],                   back:[] },
  "Tirage Menton 2 Temps":          { front:["deltoids","biceps"],        back:["trapezius"] },
  "Élévation Latérale":             { front:["deltoids"],                 back:["deltoids"] },
  "Élévation Latérale Haltère":     { front:["deltoids"],                 back:[] },
  "Extension Poulie Haute":         { front:["triceps"],                  back:["triceps"] },
  "Extension Poulie Basse":         { front:["triceps"],                  back:["triceps"] },
  "Extension Triceps Poulie Haute": { front:["triceps"],                  back:["triceps"] },
  "Extension Triceps Poulie":       { front:["triceps"],                  back:["triceps"] },
  "Kickback":                       { front:["triceps"],                  back:["triceps"] },
  "Tirage Vertical":                { front:["biceps"],                   back:["upper-back","trapezius"] },
  "Tirage Horizontal":              { front:["biceps"],                   back:["upper-back"] },
  "Tractions (ou Tirage Vertical)": { front:["biceps"],                   back:["upper-back","trapezius"] },
  "Tractions (ou Tirage)":          { front:["biceps"],                   back:["upper-back"] },
  "Pull Over":                      { front:[],                           back:["upper-back"] },
  "Rowing Coude Ouvert":            { front:[],                           back:["upper-back","deltoids"] },
  "Rowing Barre Buste Penché":      { front:["biceps"],                   back:["upper-back","lower-back"] },
  "Rowing Barre":                   { front:["biceps"],                   back:["upper-back","lower-back"] },
  "Hack Squat":                     { front:["quadriceps"],               back:["gluteal","hamstring"] },
  "SDL — Soulevé de Terre Roumain": { front:[],                           back:["lower-back","hamstring","gluteal"] },
  "SDL Roumain":                    { front:[],                           back:["lower-back","hamstring","gluteal"] },
  "Soulevé de Terre Roumain":       { front:[],                           back:["lower-back","hamstring","gluteal"] },
  "Soulevé de Terre":               { front:["quadriceps"],               back:["lower-back","gluteal","hamstring","trapezius"] },
  "Squat Focus Quad Smith":         { front:["quadriceps"],               back:["gluteal"] },
  "Squat Smith Focus Quad":         { front:["quadriceps"],               back:["gluteal"] },
  "Squat Barre":                    { front:["quadriceps","adductors"],   back:["gluteal","hamstring"] },
  "Montée de Pointe Smith":         { front:["calves","tibialis"],        back:["calves"] },
  "Mollets Debout (Smith)":         { front:["calves","tibialis"],        back:["calves"] },
  "Mollets Smith":                  { front:["calves","tibialis"],        back:["calves"] },
  "Adducteur":                      { front:["adductors"],                back:["adductors"] },
  "Abducteur":                      { front:["adductors"],                back:["adductors"] },
  "Leg Curl":                       { front:[],                           back:["hamstring"] },
  "Leg Extension":                  { front:["quadriceps"],               back:[] },
  "Presse à Cuisses":               { front:["quadriceps"],               back:["gluteal"] },
  "Fentes Marchées Haltère":        { front:["quadriceps","adductors"],   back:["gluteal","hamstring"] },
  "Fentes Haltère":                 { front:["quadriceps","adductors"],   back:["gluteal","hamstring"] },
  "Développé Couché Barre":         { front:["chest","triceps"],          back:[] },
  "Développé Incliné Haltère":      { front:["chest","deltoids"],         back:[] },
  "Développé Militaire Haltère":    { front:["deltoids","triceps"],       back:["trapezius"] },
  "Développé Militaire":            { front:["deltoids","triceps"],       back:["trapezius"] },
  "Face Pull Corde":                { front:[],                           back:["deltoids","trapezius"] },
  "Face Pull":                      { front:[],                           back:["deltoids","trapezius"] },
  "Crunch":                         { front:["abs"],                      back:[] },
  "Gainage":                        { front:["abs"],                      back:[] },
};

function getMuscles(name) {
  return MUSCLE_MAP[name] || { front:[], back:[] };
}

// ── SetRow ───────────────────────────────────────────────────────────────────
function SetRow({ idx, data, ex, suggestion, targetReps, onUpdate, onComplete, exId, totalRows }) {
  const done = data.done;
  const [flash, setFlash] = useState(false);
  const isSec = ex.unit === "sec";

  let rowLabel;
  if (ex.degressive) {
    const serieNum  = Math.floor(idx / ex.degressive) + 1;
    const palierNum = (idx % ex.degressive) + 1;
    rowLabel = palierNum === 1 ? `SET ${pad2(serieNum)}` : `↓ PALIER ${pad2(palierNum)}`;
  } else {
    rowLabel = `SET ${pad2(idx + 1)}`;
  }

  const idW  = `inp-${exId}-${idx}-w`;
  const idR  = `inp-${exId}-${idx}-r`;
  const idWA = `inp-${exId}-${idx}-wa`;
  const idRA = `inp-${exId}-${idx}-ra`;
  const idWB = `inp-${exId}-${idx}-wb`;
  const idRB = `inp-${exId}-${idx}-rb`;
  const nextW  = idx < totalRows - 1 ? `inp-${exId}-${idx+1}-w`  : null;
  const nextWA = idx < totalRows - 1 ? `inp-${exId}-${idx+1}-wa` : null;

  const focus   = id => { const el = document.getElementById(id); if (el) { el.focus(); el.select(); } };
  const advance = nextId => e => { if (e.key === "Enter") { e.preventDefault(); if (nextId) focus(nextId); } };

  const handleComplete = () => {
    if (done) { onUpdate({ done: false }); return; }
    setFlash(true);
    onComplete(idx);
    setTimeout(() => setFlash(false), 550);
  };

  const isPalier = ex.degressive && (idx % ex.degressive) > 0;

  return (
    <div
      className={flash ? "set-flash" : ""}
      style={{
        padding: "14px 0",
        borderBottom: `1px solid ${T.border}`,
        background: done ? "rgba(255,255,255,0.015)" : isPalier ? T.surface : "transparent",
        transition: "background 0.3s",
      }}
    >
      <div style={{
        fontFamily: FF_MONO, fontSize: 10, fontWeight: 700,
        color: done ? T.dim : isPalier ? T.accent : T.textMid,
        letterSpacing: "0.14em", marginBottom: 10,
        textDecoration: done ? "line-through" : "none",
      }}>
        {rowLabel}
        {isPalier && !done && (
          <span style={{ fontFamily: FF_UI, fontSize: 9, fontWeight: 400, color: T.dim, marginLeft: 8 }}>
            sans repos · -20%
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {ex.superset ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: FF_DISPLAY, fontSize: 16, color: T.accent, lineHeight: 1 }}>A</span>
                  <span style={{ fontFamily: FF_MONO, fontSize: 9, color: T.textDim, letterSpacing: "0.1em" }}>KG × REPS</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Input id={idWA} placeholder="—" inputMode="decimal" value={data.weightA||""} onChange={e=>onUpdate({weightA:e.target.value})} onKeyDown={advance(idRA)} disabled={done} style={{ flex:1, opacity:done?0.4:1 }}/>
                  <span style={{ color:T.textDim, fontFamily:FF_MONO, fontSize:14, flexShrink:0 }}>×</span>
                  <Input id={idRA} placeholder="—" inputMode="numeric" value={data.repsA||""} onChange={e=>onUpdate({repsA:e.target.value})} onKeyDown={advance(idWB)} disabled={done} style={{ flex:1, opacity:done?0.4:1 }}/>
                </div>
                {suggestion?.wA > 0 && !done && (
                  <button onClick={()=>onUpdate({weightA:String(suggestion.wA)})} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 0 0",display:"block"}}>
                    <span style={{fontFamily:FF_MONO,fontSize:10,color:suggestion.upA?T.accent:T.textMid,letterSpacing:"0.06em"}}>
                      {suggestion.upA?"▲ +2.5 → ":"○ "}{suggestion.wA}kg
                    </span>
                  </button>
                )}
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:8, padding:"4px 0",
              }}>
                <div style={{flex:1, height:1, background:T.border}}/>
                <span style={{fontFamily:"'Syne', system-ui, sans-serif", fontSize:8, fontWeight:700,
                  color:T.dim, letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap"}}>
                  ENCHAÎNER →
                </span>
                <div style={{flex:1, height:1, background:T.border}}/>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{fontFamily:FF_DISPLAY, fontSize:16, color:T.textDim, lineHeight:1}}>B</span>
                  <span style={{fontFamily:FF_MONO, fontSize:9, color:T.textDim, letterSpacing:"0.1em"}}>KG × REPS</span>
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <Input id={idWB} placeholder="—" inputMode="decimal" value={data.weightB||""} onChange={e=>onUpdate({weightB:e.target.value})} onKeyDown={advance(idRB)} disabled={done} style={{flex:1, opacity:done?0.4:1}}/>
                  <span style={{color:T.textDim, fontFamily:FF_MONO, fontSize:14, flexShrink:0}}>×</span>
                  <Input id={idRB} placeholder="—" inputMode="numeric" value={data.repsB||""} onChange={e=>onUpdate({repsB:e.target.value})} onKeyDown={advance(nextWA)} disabled={done} style={{flex:1, opacity:done?0.4:1}}/>
                </div>
                {suggestion?.wB > 0 && !done && (
                  <button onClick={()=>onUpdate({weightB:String(suggestion.wB)})} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 0 0",display:"block"}}>
                    <span style={{fontFamily:FF_MONO,fontSize:10,color:suggestion.upB?T.accent:T.textMid,letterSpacing:"0.06em"}}>
                      {suggestion.upB?"▲ +2.5 → ":"○ "}{suggestion.wB}kg
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : isSec ? (
            <div>
              <div style={{fontFamily:FF_MONO, fontSize:9, color:T.textDim, letterSpacing:"0.1em", marginBottom:6}}>
                DURÉE · SEC{ex.min && ex.max ? ` · CIBLE ${ex.min}-${ex.max}s` : ""}
              </div>
              <div style={{display:"flex", gap:8, alignItems:"center"}}>
                <Input id={idR} placeholder={`${ex.min||"—"}-${ex.max||"—"}`} inputMode="numeric"
                  value={data.reps||""} onChange={e=>onUpdate({reps:e.target.value})}
                  onKeyDown={advance(nextW)} disabled={done} style={{flex:1, opacity:done?0.4:1}}/>
                <span style={{color:T.textDim, fontFamily:FF_MONO, fontSize:11, flexShrink:0, letterSpacing:"0.06em"}}>SEC</span>
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontFamily:FF_MONO, fontSize:9, color:T.textDim, letterSpacing:"0.1em", marginBottom:6}}>
                KG × REPS{targetReps ? ` · CIBLE ${targetReps}` : ""}
              </div>
              <div style={{display:"flex", gap:8, alignItems:"center"}}>
                <Input id={idW} placeholder="—" inputMode="decimal" value={data.weight||""} onChange={e=>onUpdate({weight:e.target.value})} onKeyDown={advance(idR)} disabled={done} style={{flex:1, opacity:done?0.4:1}}/>
                <span style={{color:T.textDim, fontFamily:FF_MONO, fontSize:14, flexShrink:0}}>×</span>
                <Input id={idR} placeholder={targetReps||"—"} inputMode="numeric" value={data.reps||""} onChange={e=>onUpdate({reps:e.target.value})} onKeyDown={advance(nextW)} disabled={done} style={{flex:1, opacity:done?0.4:1}}/>
              </div>
              {suggestion?.w > 0 && !done && (
                <button onClick={()=>onUpdate({weight:String(suggestion.w)})} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 0 0",display:"block"}}>
                  <span style={{fontFamily:FF_MONO, fontSize:10, color:suggestion.up?T.accent:T.textMid, letterSpacing:"0.06em"}}>
                    {suggestion.up?"▲ +2.5 → ":"○ "}{suggestion.w}kg
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bouton check — circulaire */}
        <button
          onClick={handleComplete}
          className={flash ? "check-pop" : ""}
          style={{
            width: 44, height: 44,
            border: `2px solid ${done ? T.green : T.borderHi}`,
            background: done ? T.green : "transparent",
            cursor: "pointer", borderRadius: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, alignSelf: ex.superset ? "flex-end" : "center",
            transition: "background 0.18s, border-color 0.18s",
          }}
        >
          <Ico d={IC.check} s={18} c={done ? T.bg : T.dim}/>
        </button>
      </div>
    </div>
  );
}

// ── ExerciseCard ─────────────────────────────────────────────────────────────
export default function ExerciseCard({
  ex, exData, sessions, programId, sessionKey,
  session, onUpdate, onComplete, index, total, isActive,
}) {
  const [open, setOpen] = useState(true);
  const [tips, setTips] = useState(false);

  const sugg    = getSuggestion(sessions, programId, sessionKey, ex);
  const lastMax = getLastMax(sessions, programId, sessionKey, ex.id, !!ex.superset);
  const allMax  = getAllTimeMax(sessions, ex);

  const done    = exData.sets.filter(s => s.done).length;
  const allDone = done === exData.sets.length;

  useEffect(() => { if (allDone) setOpen(false); }, [allDone]);

  const isSS = !!ex.superset;

  const frontName = isSS ? ex.nameA : ex.name;
  const mFront = ex.musclesFront || getMuscles(frontName).front;

  let volLabel = ex.alternating && session?.hackReps
    ? `${ex.sets}×${session.hackReps} · ÉCHEC`
    : ex.alternating ? `${ex.sets}×3-5 · ÉCHEC`
    : ex.unit === "sec" ? `${ex.sets}×${ex.min}-${ex.max}s`
    : `${ex.sets}×${ex.min}-${ex.max}`;
  if (ex.degressive) volLabel += ` · DÉG×${ex.degressive}`;

  return (
    <div style={{
      background: T.glass,
      border: `1px solid ${isActive && !allDone ? T.accent : T.glassBorder}`,
      borderRadius: 14,
      marginBottom: 10,
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      {/* Ghost number */}
      <div style={{
        position:"relative", overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", right:12, top:6,
          fontFamily:FF_DISPLAY, fontSize:72, color:T.text,
          opacity:0.04, lineHeight:1, pointerEvents:"none", userSelect:"none",
        }}>{ex.sets}</div>

        {/* Header button */}
        <button
          onClick={()=>{ haptic(); setOpen(o=>!o); }}
          style={{ width:"100%", background:"none", border:"none", padding:"18px 16px 14px", cursor:"pointer", textAlign:"left", display:"block" }}
        >
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
            <span style={{fontFamily:FF_UI, fontSize:8, fontWeight:700,
              color:allDone?T.accent:T.dim, letterSpacing:"0.1em", textTransform:"uppercase"}}>
              {pad2(index+1)} / {pad2(total)}
            </span>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <span style={{fontFamily:FF_MONO, fontSize:11, fontWeight:700,
                color:allDone?T.accent:T.text, letterSpacing:"0.1em", fontVariantNumeric:"tabular-nums"}}>
                {allDone?"✓ FINI":`${pad2(done)}/${pad2(exData.sets.length)}`}
              </span>
              <Ico d={open?IC.chevU:IC.chevD} s={14} c={T.textDim}/>
            </div>
          </div>

          <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12}}>
            <div style={{flex:1, minWidth:0}}>
              {isSS ? (
                <div>
                  <div style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:T.accent,
                    letterSpacing:"0.18em", marginBottom:8, textTransform:"uppercase",
                    background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.25)",
                    borderRadius:4, padding:"3px 7px", display:"inline-block"}}>SUPERSET</div>

                  <div style={{display:"flex", alignItems:"flex-start", gap:8, marginBottom:4}}>
                    <span style={{fontFamily:FF_DISPLAY, fontSize:18, color:T.accent, lineHeight:1, minWidth:16, marginTop:2}}>A</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FF_UI, fontSize:13, fontWeight:700, color:T.text,
                        textTransform:"uppercase", letterSpacing:"0.04em"}}>{ex.nameA}</div>
                      {ex.placementA && (
                        <div style={{fontFamily:FF_MONO, fontSize:9, color:T.accentDim,
                          letterSpacing:"0.06em", marginTop:2, marginBottom:3, paddingLeft:2}}>
                          {ex.placementA}
                        </div>
                      )}
                      {ex.musclesA && (
                        <div style={{fontFamily:FF_UI, fontWeight:700, fontSize:7, color:T.dim,
                          letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4}}>
                          {ex.musclesA}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{display:"flex", alignItems:"flex-start", gap:8}}>
                    <span style={{fontFamily:FF_DISPLAY, fontSize:18, color:T.textDim, lineHeight:1, minWidth:16, marginTop:2}}>B</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FF_UI, fontSize:13, fontWeight:700, color:T.textMid,
                        textTransform:"uppercase", letterSpacing:"0.04em"}}>{ex.nameB}</div>
                      {ex.placementB && (
                        <div style={{fontFamily:FF_MONO, fontSize:9, color:T.accentDim,
                          letterSpacing:"0.06em", marginTop:2, marginBottom:3, paddingLeft:2}}>
                          {ex.placementB}
                        </div>
                      )}
                      {ex.musclesB && (
                        <div style={{fontFamily:FF_UI, fontWeight:700, fontSize:7, color:T.dim,
                          letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4}}>
                          {ex.musclesB}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{fontFamily:FF_UI, fontSize:15, fontWeight:700, color:T.text,
                    textTransform:"uppercase", letterSpacing:"0.06em", lineHeight:1.2}}>
                    {ex.name}
                    {ex.isCore && (
                      <span style={{
                        fontFamily: FF_UI,
                        fontWeight: 700,
                        fontSize: 7,
                        color: T.bg,
                        background: T.accentDim,
                        borderRadius: 4,
                        padding: "1px 5px",
                        marginLeft: 6,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        verticalAlign: "middle",
                      }}>
                        CORE
                      </span>
                    )}
                  </div>
                  {ex.placement && (
                    <div style={{
                      fontFamily: FF_MONO,
                      fontSize: 9,
                      color: T.accentDim,
                      letterSpacing: "0.06em",
                      marginTop: 3,
                      marginBottom: 6,
                      paddingLeft: 2,
                    }}>
                      {ex.placement}
                    </div>
                  )}
                  {ex.muscles && (
                    <div style={{
                      fontFamily: FF_UI,
                      fontWeight: 700,
                      fontSize: 7,
                      color: T.dim,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}>
                      {ex.muscles}
                    </div>
                  )}
                </div>
              )}
            </div>
            {mFront.length > 0 && (
              <div style={{flexShrink:0, opacity:0.85}}>
                <MuscleBody highlighted={mFront} side="front" size={44}/>
              </div>
            )}
          </div>

          {/* Max historique */}
          {allMax ? (
            <div style={{
              background:"rgba(255,98,0,0.07)", border:"1px solid rgba(255,98,0,0.18)",
              borderRadius:10, padding:"10px 12px", marginBottom:10,
            }}>
              <div style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:T.accent,
                letterSpacing:"0.14em", marginBottom:6, textTransform:"uppercase"}}>MAX HISTORIQUE</div>
              {allMax.isSuperset ? (
                <div style={{display:"flex", gap:16, flexWrap:"wrap"}}>
                  {allMax.wA > 0 && (
                    <div style={{display:"flex", alignItems:"baseline", gap:4}}>
                      <span style={{fontFamily:FF_DISPLAY, fontSize:28, color:T.accent, lineHeight:0.9, fontVariantNumeric:"tabular-nums"}}>{allMax.wA}</span>
                      <span style={{fontFamily:FF_MONO, fontSize:10, color:T.textDim, letterSpacing:"0.08em"}}>KG (A)</span>
                    </div>
                  )}
                  {allMax.wB > 0 && (
                    <div style={{display:"flex", alignItems:"baseline", gap:4}}>
                      <span style={{fontFamily:FF_DISPLAY, fontSize:28, color:T.textMid, lineHeight:0.9, fontVariantNumeric:"tabular-nums"}}>{allMax.wB}</span>
                      <span style={{fontFamily:FF_MONO, fontSize:10, color:T.textDim, letterSpacing:"0.08em"}}>KG (B)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{display:"flex", alignItems:"baseline", gap:8}}>
                  <span style={{fontFamily:FF_DISPLAY, fontSize:40, color:T.accent, lineHeight:0.86, fontVariantNumeric:"tabular-nums"}}>{allMax.w}</span>
                  <span style={{fontFamily:FF_MONO, fontSize:13, color:T.textMid, letterSpacing:"0.08em", fontWeight:700}}>KG</span>
                  {allMax.reps > 0 && <span style={{fontFamily:FF_MONO, fontSize:11, color:T.textDim}}>× {allMax.reps}</span>}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:10, padding:"10px 12px", marginBottom:10,
            }}>
              <div style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:T.dim, letterSpacing:"0.14em", marginBottom:4, textTransform:"uppercase"}}>MAX HISTORIQUE</div>
              <span style={{fontFamily:FF_UI, fontSize:11, fontWeight:700, color:T.dim}}>JAMAIS RÉALISÉ</span>
            </div>
          )}

          <div style={{display:"flex", gap:14, alignItems:"center", flexWrap:"wrap"}}>
            <span style={{fontFamily:FF_MONO, fontSize:10, color:T.textMid, letterSpacing:"0.08em"}}>{volLabel}</span>
            {lastMax && (
              <span style={{fontFamily:FF_MONO, fontSize:10, color:T.dim}}>
                DERN. {lastMax.isSuperset?`${lastMax.wA||"—"}·${lastMax.wB||"—"}kg`:`${lastMax.w}kg`}
              </span>
            )}
            {ex.special && <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.accent, letterSpacing:"0.1em", textTransform:"uppercase"}}>{ex.special}</span>}
          </div>
        </button>

        {/* Corps de la carte */}
        {open && (
          <div style={{padding:"0 16px 16px"}}>
            {/* Hack Squat placement interactif */}
            {ex.id === "hack_squat" && ex.hackPlacement && (
              <HackSquatPlacement placement={ex.hackPlacement} />
            )}

            {/* Tips toggle */}
            <button onClick={e=>{e.stopPropagation(); haptic(); setTips(t=>!t);}}
              style={{background:"none", border:"none", padding:"0 0 12px",
                cursor:"pointer", display:"flex", alignItems:"center", gap:8}}>
              <Ico d={IC.info} s={12} c={T.textDim}/>
              <span style={{fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim,
                letterSpacing:"0.1em", textTransform:"uppercase"}}>
                {tips?"MASQUER TIPS":"TIPS TECHNIQUE"}
              </span>
            </button>

            {tips && (
              <div style={{
                background:"rgba(255,255,255,0.02)", border:"none",
                borderLeft:`2px solid ${T.accentDim}`,
                borderRadius:"0 8px 8px 0", padding:"12px 14px", marginBottom:14,
              }}>
                {isSS ? (
                  <>
                    <div style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:T.accent,
                      letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8}}>A · {ex.nameA.toUpperCase()}</div>
                    {(ex.tipsA||[]).map((t,i)=>(
                      <p key={i} style={{fontFamily:"system-ui", fontSize:13, color:T.textMid,
                        lineHeight:1.5, marginBottom:i<ex.tipsA.length-1?6:0}}>— {t}</p>
                    ))}
                    <div style={{fontFamily:FF_UI, fontSize:7, fontWeight:700, color:T.accent,
                      letterSpacing:"0.12em", textTransform:"uppercase", marginTop:14, marginBottom:8}}>B · {ex.nameB.toUpperCase()}</div>
                    {(ex.tipsB||[]).map((t,i)=>(
                      <p key={i} style={{fontFamily:"system-ui", fontSize:13, color:T.textMid,
                        lineHeight:1.5, marginBottom:i<ex.tipsB.length-1?6:0}}>— {t}</p>
                    ))}
                  </>
                ) : (
                  (ex.tips||[]).map((t,i)=>(
                    <p key={i} style={{fontFamily:"system-ui", fontSize:13, color:T.textMid,
                      lineHeight:1.5, marginBottom:i<(ex.tips||[]).length-1?6:0}}>— {t}</p>
                  ))
                )}
              </div>
            )}

            {/* Sets */}
            {exData.sets.map((s,i)=>(
              <SetRow key={i} idx={i} data={s} ex={ex} suggestion={sugg}
                exId={ex.id} totalRows={exData.sets.length}
                targetReps={ex.alternating&&session?.hackReps?session.hackReps:""}
                onUpdate={p=>onUpdate(ex.id,i,p)}
                onComplete={()=>onComplete(ex.id,i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
