import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { T, FF_UI, FF_DISPLAY, FF_MONO } from "../../design/tokens.js";
import { PROGRAMS } from "../../data/programs.js";
import { getPR, getTotalVolume } from "../../lib/sessions.js";
import { fmtAgo, fmtDate, fmtDateLong, fmtDur, pad2, pad3 } from "../../lib/utils.js";
import { haptic } from "../../lib/audio.js";

// ── Historique ───────────────────────────────────────────────────────────────
const RPE_LABELS = ["—","FACILE","STABLE","MOYEN","DIFFICILE","ÉCHEC"];

function StatsHistory({ sessions }) {
  if (!sessions.length) return (
    <div style={{ padding:"80px 0", textAlign:"center" }}>
      <div style={{ fontFamily:FF_DISPLAY, fontSize:36, color:T.dim, marginBottom:8 }}>AUCUNE ENTRÉE</div>
      <p style={{ fontFamily:"system-ui", fontSize:13, color:T.dim }}>Termine une séance pour commencer l'archive.</p>
    </div>
  );

  return (
    <div>
      {sessions.map((s,idx)=>{
        const p    = PROGRAMS[s.programId];
        const sess = p?.sessions.find(x=>x.key===s.sessionKey);
        if (!sess) return null;
        return (
          <div key={s.id} style={{ padding:"20px 0", borderBottom:`1px solid ${T.border}`,
            display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ flexShrink:0 }}>
              <div style={{ fontFamily:FF_UI, fontSize:8, fontWeight:700, color:T.dim,
                letterSpacing:"0.1em", marginBottom:6 }}>№ {pad3(sessions.length-idx)}</div>
              <div style={{ fontFamily:FF_DISPLAY, fontSize:28, color:T.text, lineHeight:0.9, textTransform:"uppercase" }}>
                {sess.label}
              </div>
            </div>
            <div style={{ flex:1, minWidth:0, paddingTop:2 }}>
              <div style={{ fontFamily:FF_UI, fontSize:12, fontWeight:700, color:T.text,
                letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:6 }}>
                {sess.title}
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:s.notes?8:0 }}>
                <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textMid,
                  letterSpacing:"0.08em", textTransform:"uppercase" }}>{fmtDateLong(s.date)}</span>
                {s.duration && <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim }}>{fmtDur(s.duration)}</span>}
                {s.rpe>0 && <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.accent,
                  letterSpacing:"0.08em", textTransform:"uppercase" }}>RPE {s.rpe} · {RPE_LABELS[s.rpe]}</span>}
              </div>
              {s.notes && (
                <p style={{ fontFamily:"system-ui", fontSize:12, color:T.dim,
                  fontStyle:"italic", lineHeight:1.5, marginTop:6 }}>« {s.notes} »</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Records ──────────────────────────────────────────────────────────────────
function StatsPR({ state }) {
  const allExercises = useMemo(() => {
    const m = new Map();
    Object.values(PROGRAMS).forEach(prog => {
      prog.sessions.forEach(sess => {
        sess.exercises.forEach(ex => { if (!m.has(ex.id)) m.set(ex.id, ex); });
      });
    });
    return Array.from(m.values());
  }, []);

  const prs = allExercises.map(ex => {
    if (ex.superset) {
      const prA = getPR(state.sessions, ex.id, true, "A");
      const prB = getPR(state.sessions, ex.id, true, "B");
      return { ex, prA, prB, isSuperset:true };
    }
    return { ex, pr:getPR(state.sessions, ex.id, false) };
  })
    .filter(p => p.isSuperset?(p.prA.weight>0||p.prB.weight>0):p.pr.weight>0)
    .sort((a,b) => {
      const va = a.isSuperset?Math.max(a.prA.e1rm,a.prB.e1rm):a.pr.e1rm;
      const vb = b.isSuperset?Math.max(b.prA.e1rm,b.prB.e1rm):b.pr.e1rm;
      return vb-va;
    });

  if (!prs.length) return (
    <div style={{ padding:"80px 0", textAlign:"center" }}>
      <div style={{ fontFamily:FF_DISPLAY, fontSize:36, color:T.dim, marginBottom:8 }}>AUCUN RECORD</div>
      <p style={{ fontFamily:"system-ui", fontSize:13, color:T.dim }}>Les records apparaîtront au fil des séances.</p>
    </div>
  );

  return (
    <div>
      {prs.map(({ ex, pr, prA, prB, isSuperset }, idx) => (
        <div key={ex.id} style={{ padding:"18px 0", borderBottom:`1px solid ${T.border}`,
          display:"flex", gap:14, alignItems:"flex-start" }}>
          <span style={{ fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim,
            flexShrink:0, minWidth:28, paddingTop:3, letterSpacing:"0.08em" }}>
            #{pad2(idx+1)}
          </span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:FF_UI, fontSize:13, fontWeight:700, color:T.text,
              letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:4, lineHeight:1.3 }}>
              {isSuperset?`${ex.nameA} / ${ex.nameB}`:ex.name}
            </div>
            <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim,
              letterSpacing:"0.1em", textTransform:"uppercase" }}>
              {isSuperset?"SUPERSET":`${ex.sets||"—"}×${ex.min||"?"}-${ex.max||"?"}`}
            </span>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            {isSuperset ? (
              <div>
                {prA.weight>0 && (
                  <div style={{ display:"flex", alignItems:"baseline", gap:3, justifyContent:"flex-end" }}>
                    <span style={{ fontFamily:FF_DISPLAY, fontSize:22, color:T.accent, lineHeight:0.9, fontVariantNumeric:"tabular-nums" }}>{prA.weight}</span>
                    <span style={{ fontFamily:FF_MONO, fontSize:9, color:T.dim, letterSpacing:"0.08em" }}>KG(A)</span>
                  </div>
                )}
                {prB.weight>0 && (
                  <div style={{ display:"flex", alignItems:"baseline", gap:3, justifyContent:"flex-end", marginTop:2 }}>
                    <span style={{ fontFamily:FF_DISPLAY, fontSize:22, color:T.textMid, lineHeight:0.9, fontVariantNumeric:"tabular-nums" }}>{prB.weight}</span>
                    <span style={{ fontFamily:FF_MONO, fontSize:9, color:T.dim, letterSpacing:"0.08em" }}>KG(B)</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, justifyContent:"flex-end" }}>
                  <span style={{ fontFamily:FF_DISPLAY, fontSize:30, color:T.accent, lineHeight:0.9, fontVariantNumeric:"tabular-nums" }}>{pr.weight}</span>
                  <span style={{ fontFamily:FF_MONO, fontSize:11, fontWeight:700, color:T.textMid, letterSpacing:"0.08em" }}>KG</span>
                </div>
                <div style={{ fontFamily:FF_MONO, fontSize:9, color:T.dim, marginTop:4, letterSpacing:"0.08em" }}>
                  1RM {pr.e1rm}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Courbes ──────────────────────────────────────────────────────────────────
function StatsChart({ state }) {
  const [progId, setProgId] = useState(state.activeProgramId);
  const [exId,   setExId]   = useState(null);
  const prog = PROGRAMS[progId];

  const allEx = useMemo(() => {
    const list = [];
    prog.sessions.forEach(sess => { sess.exercises.forEach(ex => list.push({ ex, sess })); });
    return list;
  }, [prog]);

  const ex = exId ? allEx.find(e=>e.ex.id===exId) : null;

  const chartData = useMemo(() => {
    if (!ex) return [];
    return state.sessions
      .filter(s=>s.programId===progId && s.sessionKey===ex.sess.key)
      .sort((a,b)=>a.date-b.date)
      .map(s => {
        const d = s.exercises?.[ex.ex.id]; if (!d?.sets?.length) return null;
        let w = 0;
        d.sets.forEach(set => {
          w = Math.max(w, ...(ex.ex.superset
            ? [parseFloat(set.weightA)||0, parseFloat(set.weightB)||0]
            : [parseFloat(set.weight)||0]
          ));
        });
        return w>0 ? { date:fmtDate(s.date), kg:w } : null;
      }).filter(Boolean);
  }, [ex, state.sessions, progId]);

  return (
    <div>
      <div style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim,
        letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>PROGRAMME</div>
      <div style={{ display:"flex", gap:0, marginBottom:24,
        border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
        {Object.values(PROGRAMS).map((p,i)=>(
          <button key={p.id} onClick={()=>{ setProgId(p.id); setExId(null); }}
            style={{
              flex:1, padding:"11px 8px", border:"none",
              borderRight: i<Object.values(PROGRAMS).length-1?`1px solid ${T.border}`:"none",
              background: progId===p.id?T.card:"transparent",
              color: progId===p.id?T.accent:T.dim,
              fontFamily:FF_UI, fontSize:9, fontWeight:700, cursor:"pointer",
              letterSpacing:"0.08em", textTransform:"uppercase",
              borderTop: progId===p.id?`2px solid ${T.accent}`:"2px solid transparent",
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
              transition:"color 0.15s, border-top-color 0.15s",
            }}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.textDim,
        letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>EXERCICE</div>
      <div style={{ borderTop:`1px solid ${T.border}`, marginBottom:24 }}>
        {allEx.map(({ ex:e, sess })=>(
          <button key={e.id+sess.key} onClick={()=>{ haptic(); setExId(e.id); }}
            style={{ width:"100%", padding:"13px 0", background:"transparent",
              border:"none", borderBottom:`1px solid ${T.border}`,
              cursor:"pointer", textAlign:"left",
              display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:FF_UI, fontSize:13, fontWeight:700,
              color:exId===e.id?T.text:T.textMid, textTransform:"uppercase",
              letterSpacing:"0.04em" }}>
              {e.superset?`${e.nameA} / ${e.nameB}`:e.name}
            </span>
            <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700,
              color:exId===e.id?T.accent:T.dim, letterSpacing:"0.1em",
              textTransform:"uppercase", flexShrink:0 }}>{sess.label}</span>
          </button>
        ))}
      </div>

      {ex && (
        <div style={{ padding:"20px 0", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim,
            letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>COURBE · CHARGE MAX</div>
          <div style={{ fontFamily:FF_DISPLAY, fontSize:22, color:T.text, lineHeight:0.9,
            textTransform:"uppercase", marginBottom:20 }}>
            {ex.ex.superset?`${ex.ex.nameA} / ${ex.ex.nameB}`:ex.ex.name}
          </div>

          {chartData.length>=2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top:8, right:8, left:-24, bottom:4 }}>
                <XAxis dataKey="date"
                  tick={{ fontSize:8, fill:T.dim, fontFamily:"'Syne', sans-serif", letterSpacing:"0.06em" }}
                  axisLine={{ stroke:T.border }} tickLine={false}/>
                <YAxis
                  tick={{ fontSize:8, fill:T.dim, fontFamily:"'JetBrains Mono', monospace" }}
                  axisLine={false} tickLine={false} domain={["auto","auto"]}/>
                <Tooltip
                  contentStyle={{ background:T.card, border:`1px solid ${T.border}`,
                    borderRadius:8, fontSize:11, fontFamily:"'JetBrains Mono', monospace" }}
                  labelStyle={{ color:T.textMid, textTransform:"uppercase" }}
                  itemStyle={{ color:T.accent }}/>
                <Line type="linear" dataKey="kg" stroke={T.accent} strokeWidth={2}
                  dot={{ fill:T.bg, stroke:T.accent, strokeWidth:2, r:3 }}
                  activeDot={{ r:5, strokeWidth:2, fill:T.accent, stroke:T.bg }}/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding:"36px 0", textAlign:"center" }}>
              <div style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.dim,
                letterSpacing:"0.1em", textTransform:"uppercase" }}>
                AU MOINS 2 SÉANCES REQUISES
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── StatsScreen ───────────────────────────────────────────────────────────────
const TABS = [
  { id:"hist",  l:"HISTORIQUE" },
  { id:"pr",    l:"RECORDS" },
  { id:"chart", l:"COURBES" },
];

export default function StatsScreen({ state }) {
  const [tab, setTab] = useState("hist");
  const sorted = [...state.sessions].sort((a,b)=>b.date-a.date);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ padding:"24px 0 36px", borderBottom:`1px solid ${T.border}`, marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <span style={{ fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.12em" }}>
            ARCHIVE · {pad3(sorted.length)}
          </span>
          <span style={{ fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim }}>
            {sorted.length>0?fmtAgo(sorted[0].date):"—"}
          </span>
        </div>
        <div style={{ fontFamily:FF_DISPLAY, fontSize:52, color:T.text, lineHeight:0.9 }}>PROGRES-</div>
        <div style={{ fontFamily:FF_DISPLAY, fontSize:52, color:T.accent, lineHeight:0.9 }}>SION</div>
      </div>

      {/* Tabs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
        border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden", marginBottom:28 }}>
        {TABS.map((t,i)=>(
          <button key={t.id} onClick={()=>{ haptic(); setTab(t.id); }}
            style={{
              padding:"13px 0", border:"none",
              borderRight: i<2?`1px solid ${T.border}`:"none",
              background: tab===t.id?T.card:"transparent",
              color: tab===t.id?T.accent:T.dim,
              fontFamily:FF_UI, fontSize:10, fontWeight:700,
              cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase",
              borderTop: tab===t.id?`2px solid ${T.accent}`:"2px solid transparent",
              transition:"color 0.15s, border-top-color 0.15s",
            }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==="hist"  && <StatsHistory sessions={sorted}/>}
      {tab==="pr"    && <StatsPR state={state}/>}
      {tab==="chart" && <StatsChart state={state}/>}
    </div>
  );
}
