import { useCallback, useEffect, useState } from "react";

export const useFullscreen = (enabled: boolean) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exitAttempts, setExitAttempts] = useState(0);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (e) {
      console.warn("Fullscreen not supported or denied");
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (e) {
      console.warn("Exit fullscreen failed");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && enabled) {
        setExitAttempts((p) => p + 1);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [enabled]);

  // Disable copy/paste/right-click
  useEffect(() => {
    if (!enabled) return;

    const preventCopy = (e: Event) => e.preventDefault();
    const preventContextMenu = (e: Event) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "u" || e.key === "a")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventKeys);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeys);
    };
  }, [enabled]);

  // Detect tab switch
  useEffect(() => {
    if (!enabled) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setExitAttempts((p) => p + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled]);

  return { isFullscreen, enterFullscreen, exitFullscreen, exitAttempts };
};
