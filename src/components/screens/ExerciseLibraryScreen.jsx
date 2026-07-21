import { useState, useMemo } from "react";
import MuscleBody from "../MuscleBody.jsx";
import { T, FF_UI, FF_MONO, FF_DISPLAY } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { EXERCISE_DB, CATEGORIES } from "../../data/exerciseDB.js";
import { haptic } from "../../lib/audio.js";

export default function ExerciseLibraryScreen({ onSelectExercise, selectMode = false }) {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => EXERCISE_DB.filter(ex => {
    const matchCat    = cat === "all" || ex.category === cat;
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [search, cat]);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{padding:"24px 0 32px", borderBottom:`1px solid ${T.border}`, marginBottom:24}}>
        <div style={{fontFamily:FF_DISPLAY, fontSize:52, color:T.text, lineHeight:0.9, marginBottom:2}}>BANQUE</div>
        <div style={{fontFamily:FF_DISPLAY, fontSize:52, color:T.accent, lineHeight:0.9}}>EXERCICES</div>
      </div>

      {/* Recherche */}
      <div style={{position:"relative", marginBottom:16}}>
        <div style={{position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none"}}>
          <Ico d={IC.arrowR} s={14} c={T.textDim}/>
        </div>
        <input
          placeholder="Rechercher un exercice…"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{
            width:"100%", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:10,
            padding:"12px 14px 12px 38px", color:T.text, fontFamily:FF_UI, fontSize:13, fontWeight:600,
            outline:"none", boxSizing:"border-box", letterSpacing:"0.02em",
          }}
        />
        {search && (
          <button onClick={()=>setSearch("")} style={{position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", cursor:"pointer", padding:6}}>
            <Ico d={IC.close} s={14} c={T.textDim}/>
          </button>
        )}
      </div>

      {/* Filtres */}
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:20}}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>{haptic();setCat(c.id);}}
            style={{
              padding:"6px 14px", borderRadius:20,
              border:`1px solid ${cat===c.id?T.accent:T.border}`,
              background:cat===c.id?T.accent:"transparent",
              color:cat===c.id?T.bg:T.textMid,
              fontFamily:FF_UI, fontSize:10, fontWeight:700,
              letterSpacing:"0.1em", cursor:"pointer", textTransform:"uppercase",
              transition:"all 0.15s",
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Compteur */}
      <div style={{fontFamily:FF_MONO, fontSize:9, color:T.dim, letterSpacing:"0.1em", marginBottom:14}}>
        {filtered.length} EXERCICE{filtered.length!==1?"S":""}
      </div>

      {/* Liste */}
      {filtered.map((ex,idx)=>{
        const isOpen    = expanded===idx;
        const frontData = ex.musclesFront||[];
        const backData  = ex.musclesBack||[];

        return (
          <div key={idx} style={{
            background:T.card, border:`1px solid ${T.border}`, borderRadius:14,
            marginBottom:10, overflow:"hidden",
          }}>
            <button onClick={()=>{haptic();setExpanded(isOpen?null:idx);}}
              style={{width:"100%", background:"none", border:"none", padding:"15px 14px",
                cursor:"pointer", textAlign:"left", display:"flex",
                justifyContent:"space-between", alignItems:"center", gap:12}}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:FF_UI, fontSize:13, fontWeight:700, color:T.text,
                  textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4}}>
                  {ex.name}
                </div>
                <div style={{display:"flex", gap:10, alignItems:"center"}}>
                  <span style={{fontFamily:FF_MONO, fontSize:9, color:T.textDim, letterSpacing:"0.1em", textTransform:"uppercase"}}>
                    {ex.equipment}
                  </span>
                  <span style={{fontFamily:FF_MONO, fontSize:9, color:T.dim}}>
                    {ex.sets}×{ex.repRange[0]}-{ex.repRange[1]}
                  </span>
                </div>
              </div>
              <Ico d={isOpen?IC.chevU:IC.chevD} s={14} c={T.textDim}/>
            </button>

            {isOpen && (
              <div style={{padding:"0 14px 16px"}}>
                {(frontData.length>0||backData.length>0) && (
                  <div style={{display:"flex", justifyContent:"center", gap:24,
                    background:T.surface, borderRadius:10, padding:"16px 0", marginBottom:14}}>
                    {frontData.length>0 && (
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:FF_MONO, fontSize:8, color:T.dim, marginBottom:6, letterSpacing:"0.1em"}}>AVANT</div>
                        <MuscleBody highlighted={frontData} side="front" size={80}/>
                      </div>
                    )}
                    {backData.length>0 && (
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:FF_MONO, fontSize:8, color:T.dim, marginBottom:6, letterSpacing:"0.1em"}}>ARRIÈRE</div>
                        <MuscleBody highlighted={backData} side="back" size={80}/>
                      </div>
                    )}
                  </div>
                )}

                <div style={{borderLeft:`2px solid ${T.accentDim}`, borderRadius:"0 10px 10px 0",
                  padding:"10px 12px", marginBottom:14, background:T.bg}}>
                  {ex.tips.map((tip,i)=>(
                    <p key={i} style={{fontFamily:"system-ui", fontSize:13, color:T.textMid,
                      lineHeight:1.5, marginBottom:i<ex.tips.length-1?6:0}}>— {tip}</p>
                  ))}
                </div>

                {selectMode && onSelectExercise && (
                  <button onClick={()=>{haptic();onSelectExercise(ex);}}
                    style={{width:"100%", background:T.accent, border:"none", borderRadius:10,
                      padding:"12px", fontFamily:FF_UI, fontSize:12, fontWeight:700,
                      color:T.bg, cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase"}}>
                    AJOUTER À LA SÉANCE
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {filtered.length===0 && (
        <div style={{textAlign:"center", padding:"60px 0"}}>
          <div style={{fontFamily:FF_DISPLAY, fontSize:36, color:T.dim, marginBottom:8}}>AUCUN RÉSULTAT</div>
          <div style={{fontFamily:FF_UI, fontSize:12, fontWeight:600, color:T.dim}}>Modifie la recherche ou le filtre.</div>
        </div>
      )}
    </div>
  );
}
