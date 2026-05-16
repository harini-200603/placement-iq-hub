import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { getStreak, getLevel, getXP } from "@/lib/gamification";
import { Link } from "react-router-dom";

export const StreakBadge = () => {
  const [streak, setStreak] = useState(getStreak());
  const [lvl, setLvl] = useState(getLevel());

  useEffect(() => {
    const update = () => { setStreak(getStreak()); setLvl(getLevel(getXP())); };
    update();
    window.addEventListener("badge-unlocked", update);
    window.addEventListener("storage", update);
    const i = setInterval(update, 5000);
    return () => { window.removeEventListener("badge-unlocked", update); window.removeEventListener("storage", update); clearInterval(i); };
  }, []);

  return (
    <Link to="/achievements" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-amber-500/20 transition-colors">
      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
        <Flame className="w-4 h-4" />
        <span className="text-xs font-bold">{streak.current}</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <Trophy className="w-4 h-4" />
        <span className="text-xs font-bold">Lv {lvl.level}</span>
      </div>
    </Link>
  );
};
