import { useState, useRef } from "react";
import { T, FF_UI, FF_DISPLAY, FF_MONO } from "../../design/tokens.js";
import { IC, Ico } from "../../design/icons.jsx";
import { Btn, Modal } from "../../design/components/index.js";
import { getTotalVolume } from "../../lib/sessions.js";
import { initialState } from "../../lib/storage.js";
import { haptic } from "../../lib/audio.js";
import { pad3 } from "../../lib/utils.js";

export default function ConfigScreen({ state, setState }) {
  const [resetModal, setResetModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `upgrade-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url); haptic();
  };

  const handleImport = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.sessions !== undefined) {
          if (confirm("Remplacer toutes tes données ? Action irréversible.")) {
            setState(data); alert("Import réussi.");
          }
        } else alert("Fichier invalide.");
      } catch { alert("Impossible de lire le fichier."); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  const totalSessions = state.sessions.length;
  const totalVolume   = state.sessions.reduce((a,s) => a+(s.totalVolume||getTotalVolume(s)), 0);

  const Row = ({ code, label, value, onClick, danger, last }) => (
    <button onClick={onClick} style={{
      width:"100%", background:"transparent", border:"none",
      padding:"18px 0", borderBottom:last?"none":`1px solid ${T.border}`,
      cursor:"pointer", textAlign:"left",
      display:"flex", justifyContent:"space-between", alignItems:"center", gap:12,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
        <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim,
          letterSpacing:"0.1em", textTransform:"uppercase" }}>{code}</span>
        <span style={{ fontFamily:"system-ui", fontSize:14, color:danger?T.red:T.text }}>{label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        {value && <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textMid,
          letterSpacing:"0.1em", textTransform:"uppercase" }}>{value}</span>}
        {onClick && <Ico d={IC.arrowR} s={14} c={danger?T.red:T.textDim}/>}
      </div>
    </button>
  );

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ padding:"24px 0 32px", borderBottom:`1px solid ${T.border}`, marginBottom:32 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.12em" }}>SYSTÈME</span>
          <span style={{ fontFamily:FF_MONO, fontSize:9, fontWeight:700, color:T.dim }}>v2.0</span>
        </div>
        <div style={{ fontFamily:FF_DISPLAY, fontSize:52, color:T.accent, lineHeight:0.9 }}>RÉGLAGES</div>
      </div>

      {/* Cumul */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.1em" }}>00</span>
          <div style={{ height:1, flex:1, maxWidth:24, background:T.border }}/>
          <span style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.text, letterSpacing:"0.1em", textTransform:"uppercase" }}>CUMUL</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ padding:"20px 16px", borderRight:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:FF_UI, fontSize:8, fontWeight:700, color:T.dim,
              letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>SÉANCES</div>
            <div style={{ fontFamily:FF_DISPLAY, fontSize:48, color:T.accent, lineHeight:0.9,
              fontVariantNumeric:"tabular-nums" }}>{pad3(totalSessions)}</div>
          </div>
          <div style={{ padding:"20px 16px" }}>
            <div style={{ fontFamily:FF_UI, fontSize:8, fontWeight:700, color:T.dim,
              letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>VOLUME</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
              <span style={{ fontFamily:FF_DISPLAY, fontSize:48, color:T.text, lineHeight:0.9, fontVariantNumeric:"tabular-nums" }}>
                {(totalVolume/1000).toFixed(1)}
              </span>
              <span style={{ fontFamily:FF_MONO, fontSize:11, fontWeight:700, color:T.dim, letterSpacing:"0.1em" }}>T</span>
            </div>
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.1em" }}>01</span>
          <div style={{ height:1, flex:1, maxWidth:24, background:T.border }}/>
          <span style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.text, letterSpacing:"0.1em", textTransform:"uppercase" }}>PRÉFÉRENCES</span>
        </div>
        <div style={{ borderTop:`1px solid ${T.border}` }}>
          <div style={{ padding:"16px 0", borderBottom:`1px solid ${T.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em" }}>REP.</span>
              <span style={{ fontFamily:"system-ui", fontSize:14, color:T.text }}>Temps de repos par défaut</span>
            </div>
            <select value={state.prefs.restDefault}
              onChange={e=>{ haptic(); setState(st=>({...st,prefs:{...st.prefs,restDefault:parseInt(e.target.value)}})); }}
              style={{ background:T.inputBg, color:T.text, border:`1px solid ${T.border}`, borderRadius:8,
                padding:"8px 28px 8px 12px", fontFamily:FF_MONO, fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:"0.06em" }}>
              {[60,75,90,120,150,180].map(s=>(
                <option key={s} value={s} style={{ background:T.bg }}>
                  {s<60?s+"S":Math.floor(s/60)+"M"+(s%60?s%60:"")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Données */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <span style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.textDim, letterSpacing:"0.1em" }}>02</span>
          <div style={{ height:1, flex:1, maxWidth:24, background:T.border }}/>
          <span style={{ fontFamily:FF_UI, fontSize:10, fontWeight:700, color:T.text, letterSpacing:"0.1em", textTransform:"uppercase" }}>DONNÉES</span>
        </div>
        <div style={{ borderTop:`1px solid ${T.border}` }}>
          <Row code="EXP" label="Exporter un backup JSON" value="TÉLÉCHARGER" onClick={handleExport}/>
          <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} style={{ display:"none" }}/>
          <Row code="IMP" label="Importer un backup JSON" value="CHOISIR" onClick={()=>fileInputRef.current?.click()}/>
          <Row code="DEL" label="Effacer toutes les données" value="RESET" onClick={()=>setResetModal(true)} danger last/>
        </div>
      </div>

      {/* Colophon */}
      <div style={{ padding:"24px 0 40px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:FF_UI, fontSize:9, fontWeight:700, color:T.dim,
          letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>COLOPHON</div>
        <p style={{ fontFamily:"system-ui", fontSize:12, color:T.dim, lineHeight:1.6 }}>
          UpGrade v2.0 · Tracker personnel, 100% local. Tes données restent sur ton appareil.
        </p>
      </div>

      {/* Modal reset */}
      <Modal open={resetModal} onClose={()=>setResetModal(false)} code="DEL" title="EFFACEMENT DÉFINITIF">
        <div style={{ fontFamily:FF_DISPLAY, fontSize:36, color:T.red, marginBottom:16 }}>TOUT EFFACER ?</div>
        <p style={{ fontFamily:"system-ui", fontSize:13, color:T.textMid, lineHeight:1.6, marginBottom:36 }}>
          Toutes tes séances, records et réglages seront définitivement supprimés.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Btn variant="ghost" onClick={()=>setResetModal(false)}>ANNULER</Btn>
          <Btn variant="danger" onClick={()=>{ setState(initialState()); setResetModal(false); }}>EFFACER</Btn>
        </div>
      </Modal>
    </div>
  );
}
