import { useEffect, useRef } from "react";
import sound from "../modules/Done5.wav";

export function useSuccessSound() {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(sound);
    audioRef.current.preload = "auto";

    const unlock = () => {
      if (unlockedRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          unlockedRef.current = true;
        })
        .catch(() => {}); // 👈 ignore error safely

      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
  }, []);

  return () => {
    // ✅ SAFE: play only if unlocked
    if (!unlockedRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {}); // 👈 NO error after refresh
  };
}
