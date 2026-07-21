import { useState, useEffect, useRef, useCallback } from "react";
import { playBeep, playTick } from "../lib/audio.js";

export function useRestTimer(restDefault) {
  const [timer, setTimer] = useState({ active: false, remaining: 0, duration: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!timer.active) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    if (timer.remaining <= 0) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        const r = t.remaining - 1;
        if (r <= 5 && r > 0) playTick();
        if (r <= 0) {
          playBeep();
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return { active: true, remaining: 0, duration: t.duration };
        }
        return { ...t, remaining: r };
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timer.active, timer.remaining]);

  const start = useCallback(() => {
    setTimer({ active: true, remaining: restDefault, duration: restDefault });
  }, [restDefault]);

  const skip = useCallback(() => {
    setTimer({ active: false, remaining: 0, duration: 0 });
  }, []);

  const add = useCallback(() => {
    setTimer(t => ({ ...t, remaining: t.remaining + 30, duration: t.duration + 30 }));
  }, []);

  return { timer, start, skip, add };
}
