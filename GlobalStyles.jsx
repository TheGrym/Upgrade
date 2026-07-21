import { useState, useEffect, useCallback, useMemo } from "react";
import { T } from "./design/tokens.js";
import { useAppState } from "./hooks/useAppState.js";
import { useRestTimer } from "./hooks/useRestTimer.js";
import { PROGRAMS } from "./data/programs.js";
import { initSession, getTotalVolume } from "./lib/sessions.js";
import { haptic } from "./lib/audio.js";
import { applyVariant, advanceBlock, getCurrentBlock, getBlockDisplayInfo } from "./lib/blockManager.js";
import BottomNav from "./components/BottomNav.jsx";
import RestTimer from "./components/RestTimer.jsx";
import ProgramPicker from "./components/ProgramPicker.jsx";
import HomeScreen from "./components/screens/HomeScreen.jsx";
import SessionSelectScreen from "./components/screens/SessionSelectScreen.jsx";
import ActiveWorkoutScreen from "./components/screens/ActiveWorkoutScreen.jsx";
import ExerciseLibraryScreen from "./components/screens/ExerciseLibraryScreen.jsx";
import StatsScreen from "./components/screens/StatsScreen.jsx";
import ProgramBuilderScreen from "./components/screens/ProgramBuilderScreen.jsx";
import ConfigScreen from "./components/screens/ConfigScreen.jsx";

const NAV_ORDER = { home:0, session:1, stats:2, bank:3, more:4 };

export default function App() {
  const [state, setState] = useAppState();
  const [tabData, setTabData]       = useState({ id:"home", dir:"right" });
  const [progPicker, setProgPicker]  = useState(false);
  const [progBuilder, setProgBuilder] = useState(false);
  const { timer, start:startRest, skip:skipRest, add:addTime } = useRestTimer(state.prefs?.restDefault||90);
  const tab = tabData.id;

  const allPrograms = useMemo(() => ({
    ...PROGRAMS,
    ...((state.customPrograms||[]).reduce((acc,p) => ({ ...acc, [p.id]:p }), {})),
  }), [state.customPrograms]);

  const navigateTo = useCallback((newId, forceDir) => {
    setTabData(prev => ({
      id: newId,
      dir: forceDir ?? (NAV_ORDER[newId] > NAV_ORDER[prev.id] ? "right" : "left"),
    }));
  }, []);

  const handleStartSession = useCallback((programId, sessionKey) => {
    const s = initSession(programId, sessionKey, state, allPrograms);
    if (s) {
      // s.exercises est un objet (dictionnaire des sets), pas un tableau
      // Les variantes sont appliquées au rendu dans ActiveWorkoutScreen via session.blockInfo
      const sessionWithVariants = {
        ...s,
        blockInfo: getBlockDisplayInfo(programId),
      };
      setState(st => ({ ...st, active: sessionWithVariants }));
      navigateTo("session", "right");
    }
  }, [state, setState, navigateTo, allPrograms]);

  const handleFinish = useCallback(sess => {
    const finished = {
      ...sess, date:Date.now(),
      duration: Math.floor((Date.now()-sess.startTime)/1000),
      totalVolume: getTotalVolume(sess),
    };
    setState(st => ({ ...st, sessions:[...st.sessions, finished], active:null }));
    // Avancer le bloc automatiquement après chaque séance terminée
    if (sess.programId) {
      advanceBlock(sess.programId);
    }
    skipRest(); navigateTo("home","left");
  }, [setState, skipRest, navigateTo]);

  const handleAbandon = useCallback(() => {
    setState(st => ({ ...st, active:null }));
    skipRest(); navigateTo("home","left");
  }, [setState, skipRest, navigateTo]);

  const handleUpdateSession = useCallback(sess => setState(st => ({ ...st, active:sess })), [setState]);

  const handleSwitchProgram = useCallback(pid => {
    setState(st => ({ ...st, activeProgramId:pid }));
    setProgPicker(false);
  }, [setState]);

  const handleSaveCustomProgram = useCallback(prog => {
    setState(st => ({ ...st, customPrograms:[...(st.customPrograms||[]), prog] }));
    setProgBuilder(false);
    navigateTo("home");
  }, [setState, navigateTo]);

  useEffect(() => {
    if (state.active && tab !== "session") navigateTo("session","right");
  }, [state.active]);

  return (
    <>
      <div className="noise-overlay"/>
      <div style={{ minHeight:"100vh", background:T.bg, position:"relative" }}>
        <RestTimer timer={timer} onSkip={skipRest} onAdd={addTime}/>

        <div style={{
          maxWidth: 420, margin: "0 auto",
          padding: "20px 20px",
          paddingTop: "calc(20px + env(safe-area-inset-top))",
          paddingBottom: timer.active ? "208px" : "128px",
          position: "relative", zIndex: 1,
          transition: "padding-bottom 0.3s",
        }}>
          {/* Wordmark */}
          <div style={{ paddingBottom:16, marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{
                  width:32, height:32,
                  background:`linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  borderRadius:8, flexShrink:0,
                  boxShadow:`0 0 16px ${T.accentGlow}`,
                }}>
                  <span style={{ fontFamily:"'Bebas Neue', system-ui, sans-serif", fontSize:22, color:T.bg, lineHeight:1 }}>U</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue', system-ui, sans-serif", fontSize:20, color:T.text, letterSpacing:"0.24em", lineHeight:1 }}>
                    UPGRADE
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono', ui-monospace, monospace", fontSize:8, color:T.accent, letterSpacing:"0.16em", textTransform:"uppercase", marginTop:3, lineHeight:1 }}>
                    FITNESS TRACKER
                  </div>
                </div>
              </div>
              <span style={{ fontFamily:"'Syne', system-ui, sans-serif", fontSize:9, fontWeight:700, color:T.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                EST · 2026
              </span>
            </div>
            <div style={{ height:1, background:`linear-gradient(90deg, ${T.accent} 0%, ${T.border} 55%, transparent 100%)`, borderRadius:1 }}/>
          </div>

          {/* Program Builder (overlay) */}
          {progBuilder && (
            <ProgramBuilderScreen onSave={handleSaveCustomProgram} onClose={()=>setProgBuilder(false)}/>
          )}

          {!progBuilder && (
            <div style={{ overflowX:"hidden" }}>
              <div key={tab} className={`view-${tabData.dir}`}>
                {tab==="home" && (
                  <HomeScreen
                    state={state}
                    programs={allPrograms}
                    onStartSession={handleStartSession}
                    onSwitchProgram={()=>setProgPicker(true)}
                    onNewProgram={()=>setProgBuilder(true)}
                    onGoToSession={()=>navigateTo("session")}
                  />
                )}
                {tab==="session" && (
                  state.active
                    ? <ActiveWorkoutScreen
                        session={state.active}
                        sessions={state.sessions}
                        programs={allPrograms}
                        onUpdate={handleUpdateSession}
                        onFinish={handleFinish}
                        onAbandon={handleAbandon}
                        onRest={startRest}
                      />
                    : <SessionSelectScreen
                        state={state}
                        programs={allPrograms}
                        onStartSession={handleStartSession}
                        onGoHome={()=>navigateTo("home","left")}
                      />
                )}
                {tab==="stats" && <StatsScreen state={state}/>}
                {tab==="bank"  && <ExerciseLibraryScreen/>}
                {tab==="more"  && <ConfigScreen state={state} setState={setState}/>}
              </div>
            </div>
          )}
        </div>

        {progPicker && (
          <ProgramPicker
            currentId={state.activeProgramId}
            programs={allPrograms}
            onPick={handleSwitchProgram}
            onClose={()=>setProgPicker(false)}
          />
        )}

        <BottomNav tab={tab} onNavigate={navigateTo} hasActiveSession={!!state.active}/>
      </div>
    </>
  );
}
