const STORAGE_KEY = "upgrade_v2";
const SESSIONS_PER_BLOCK = 15;

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeStorage(patch) {
  try {
    const current = readStorage();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {}
}

export function getCurrentBlock(programId) {
  const s = readStorage();
  return s.programBlocks?.[programId] || {
    currentBlock: 0,
    completedSessions: 0,
    sessionsPerBlock: SESSIONS_PER_BLOCK,
  };
}

export function advanceBlock(programId) {
  const s = readStorage();
  const info = s.programBlocks?.[programId] || {
    currentBlock: 0,
    completedSessions: 0,
    sessionsPerBlock: SESSIONS_PER_BLOCK,
  };
  const newCompleted = info.completedSessions + 1;
  const blockDone = newCompleted >= SESSIONS_PER_BLOCK;
  const updated = {
    currentBlock: blockDone ? (info.currentBlock + 1) % 2 : info.currentBlock,
    completedSessions: blockDone ? 0 : newCompleted,
    sessionsPerBlock: SESSIONS_PER_BLOCK,
  };
  writeStorage({ programBlocks: { ...(s.programBlocks || {}), [programId]: updated } });
  return updated;
}

export function applyVariant(exercise, isBlockB) {
  if (!isBlockB || !exercise.variant) return exercise;
  return { ...exercise, ...exercise.variant };
}

export function getBlockDisplayInfo(programId) {
  const info = getCurrentBlock(programId);
  return {
    blockLabel: info.currentBlock === 0 ? "A" : "B",
    currentBlock: info.currentBlock,
    completedSessions: info.completedSessions,
    sessionsPerBlock: info.sessionsPerBlock,
    currentWeek: Math.floor(info.completedSessions / 3) + 1,
    progress: (info.completedSessions / info.sessionsPerBlock) * 100,
  };
}
