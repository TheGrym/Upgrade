import { uid } from "./utils.js";
import { PROGRAMS } from "../data/programs.js";

export function initSession(programId, sessionKey, state) {
  const prog = PROGRAMS[programId]; if (!prog) return null;
  const sess = prog.sessions.find(s => s.key === sessionKey); if (!sess) return null;
  const exercises = {};
  sess.exercises.forEach(ex => {
    const n = ex.degressive ? ex.sets * ex.degressive : (ex.sets || 2);
    if (ex.superset)
      exercises[ex.id] = { sets: Array.from({ length: n }, () => ({ weightA:"", repsA:"", weightB:"", repsB:"", done:false })) };
    else
      exercises[ex.id] = { sets: Array.from({ length: n }, () => ({ weight:"", reps:"", done:false })) };
  });
  const pastCount = (state.sessions || []).filter(s => s.programId === programId && s.sessionKey === sessionKey).length;
  const hackReps = pastCount % 2 === 0 ? 3 : 5;
  return { id: uid(), programId, sessionKey, startTime: Date.now(), exercises, rpe: 0, notes: "", hackReps };
}

export function getLastSession(sessions, programId, sessionKey) {
  return sessions
    .filter(s => s.programId === programId && s.sessionKey === sessionKey)
    .sort((a, b) => b.date - a.date)[0];
}

export function getLastMax(sessions, programId, sessionKey, exId, isSuperset) {
  const last = getLastSession(sessions, programId, sessionKey);
  if (!last) return null;
  const d = last.exercises?.[exId];
  if (!d?.sets?.length) return null;
  if (isSuperset) {
    const wA = Math.max(0, ...d.sets.map(s => parseFloat(s.weightA) || 0));
    const wB = Math.max(0, ...d.sets.map(s => parseFloat(s.weightB) || 0));
    if (wA <= 0 && wB <= 0) return null;
    return { wA, wB, date: last.date, isSuperset: true };
  }
  const w = Math.max(0, ...d.sets.map(s => parseFloat(s.weight) || 0));
  if (w <= 0) return null;
  return { w, date: last.date };
}

// Lookup par NOM d'exercice (pas par ID) — cross-séances, cross-programmes
export function getAllTimeMax(sessions, ex) {
  const isSuperset = !!ex.superset;
  if (isSuperset) {
    // Pour chaque nom (nameA, nameB), trouve tous les (id, side) qui correspondent dans PROGRAMS
    const nameALookups = [], nameBLookups = [];
    Object.values(PROGRAMS).forEach(prog => {
      prog.sessions.forEach(sess => {
        sess.exercises.forEach(e => {
          if (!e.superset) return;
          if (e.nameA === ex.nameA) nameALookups.push({ id: e.id, side: "A" });
          if (e.nameB === ex.nameA) nameALookups.push({ id: e.id, side: "B" });
          if (e.nameA === ex.nameB) nameBLookups.push({ id: e.id, side: "A" });
          if (e.nameB === ex.nameB) nameBLookups.push({ id: e.id, side: "B" });
        });
      });
    });
    let prWA = 0, prRepsA = 0, prWB = 0, prRepsB = 0, prDate = 0;
    sessions.forEach(s => {
      nameALookups.forEach(({ id, side }) => {
        const d = s.exercises?.[id]; if (!d?.sets) return;
        d.sets.forEach(set => {
          const w = parseFloat(set[`weight${side}`]) || 0, r = parseInt(set[`reps${side}`]) || 0;
          if (w > prWA) { prWA = w; prRepsA = r; prDate = s.date; }
        });
      });
      nameBLookups.forEach(({ id, side }) => {
        const d = s.exercises?.[id]; if (!d?.sets) return;
        d.sets.forEach(set => {
          const w = parseFloat(set[`weight${side}`]) || 0, r = parseInt(set[`reps${side}`]) || 0;
          if (w > prWB) { prWB = w; prRepsB = r; prDate = s.date; }
        });
      });
    });
    if (prWA <= 0 && prWB <= 0) return null;
    return { wA: prWA, repsA: prRepsA, wB: prWB, repsB: prRepsB, date: prDate, isSuperset: true };
  }
  // Exercice normal : tous les IDs portant le même name dans tous les programmes
  const idLookups = [];
  Object.values(PROGRAMS).forEach(prog => {
    prog.sessions.forEach(sess => {
      sess.exercises.forEach(e => { if (!e.superset && e.name === ex.name) idLookups.push(e.id); });
    });
  });
  let prW = 0, prReps = 0, prDate = 0;
  sessions.forEach(s => {
    idLookups.forEach(id => {
      const d = s.exercises?.[id]; if (!d?.sets) return;
      d.sets.forEach(set => {
        const w = parseFloat(set.weight) || 0, r = parseInt(set.reps) || 0;
        if (w > prW) { prW = w; prReps = r; prDate = s.date; }
      });
    });
  });
  if (prW <= 0) return null;
  return { w: prW, reps: prReps, date: prDate };
}

export function getSuggestion(sessions, programId, sessionKey, ex) {
  const last = getLastSession(sessions, programId, sessionKey);
  if (!last) return null;
  const data = last.exercises?.[ex.id];
  if (!data?.sets?.length) return null;
  if (!data.sets.every(s => s.done)) return null;
  if (ex.superset) {
    const allMaxA = data.sets.every(s => parseInt(s.repsA || 0) >= ex.max);
    const allMaxB = data.sets.every(s => parseInt(s.repsB || 0) >= ex.max);
    const wA = Math.max(0, ...data.sets.map(s => parseFloat(s.weightA) || 0));
    const wB = Math.max(0, ...data.sets.map(s => parseFloat(s.weightB) || 0));
    return { wA: allMaxA && wA > 0 ? wA + 2.5 : wA, wB: allMaxB && wB > 0 ? wB + 2.5 : wB, upA: allMaxA, upB: allMaxB };
  }
  if (!ex.max) return null;
  const allMax = data.sets.every(s => parseInt(s.reps || 0) >= ex.max);
  const w = Math.max(0, ...data.sets.map(s => parseFloat(s.weight) || 0));
  return { w: allMax && w > 0 ? w + 2.5 : w, up: allMax };
}

export function getPR(sessions, exId, isSuperset, side = "") {
  let prW = 0, pr1RM = 0, prDate = 0;
  sessions.forEach(s => {
    const d = s.exercises?.[exId];
    if (!d?.sets) return;
    d.sets.forEach(set => {
      const w = isSuperset ? parseFloat(set[`weight${side}`]) || 0 : parseFloat(set.weight) || 0;
      const r = isSuperset ? parseInt(set[`reps${side}`]) || 0 : parseInt(set.reps) || 0;
      if (w > prW) { prW = w; prDate = s.date; }
      if (w > 0 && r > 0) {
        const est = w * (1 + r / 30);
        if (est > pr1RM) pr1RM = est;
      }
    });
  });
  return { weight: prW, e1rm: Math.round(pr1RM * 10) / 10, date: prDate };
}

export function getTotalVolume(session) {
  let v = 0;
  Object.values(session.exercises || {}).forEach(d => {
    (d.sets || []).forEach(s => {
      const w = parseFloat(s.weight) || 0, r = parseInt(s.reps) || 0;
      const wA = parseFloat(s.weightA) || 0, rA = parseInt(s.repsA) || 0;
      const wB = parseFloat(s.weightB) || 0, rB = parseInt(s.repsB) || 0;
      v += w * r + wA * rA + wB * rB;
    });
  });
  return Math.round(v);
}
