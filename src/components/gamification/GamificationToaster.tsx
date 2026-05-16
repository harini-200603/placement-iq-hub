import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkInStreak, type BadgeDef } from "@/lib/gamification";

export const GamificationToaster = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Daily check-in on app mount
    checkInStreak();

    const handler = (e: Event) => {
      const def = (e as CustomEvent<BadgeDef>).detail;
      if (!def) return;
      toast({
        title: `${def.emoji} Badge Unlocked: ${def.name}`,
        description: `${def.description} • +50 XP`,
      });
    };
    window.addEventListener("badge-unlocked", handler);
    return () => window.removeEventListener("badge-unlocked", handler);
  }, [toast]);

  return null;
};
