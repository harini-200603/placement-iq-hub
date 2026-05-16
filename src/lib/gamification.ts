// Gamification: streaks, badges, milestones (localStorage-based)

export type BadgeId =
  | "first-step" | "topic-master-5" | "topic-master-25" | "topic-master-50"
  | "quiz-rookie" | "quiz-pro" | "quiz-perfectionist"
  | "streak-3" | "streak-7" | "streak-30"
  | "mock-warrior" | "all-in-one-champion"
  | "code-cracker" | "polyglot" | "night-owl" | "early-bird";

export interface BadgeDef {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export const BADGES: BadgeDef[] = [
  { id: "first-step", name: "First Step", description: "Complete your first topic", emoji: "🌱", tier: "bronze" },
  { id: "topic-master-5", name: "Getting Started", description: "Complete 5 topics", emoji: "📚", tier: "bronze" },
  { id: "topic-master-25", name: "Topic Master", description: "Complete 25 topics", emoji: "🎓", tier: "silver" },
  { id: "topic-master-50", name: "Knowledge Sage", description: "Complete 50 topics", emoji: "🧠", tier: "gold" },
  { id: "quiz-rookie", name: "Quiz Rookie", description: "Attempt your first quiz", emoji: "✏️", tier: "bronze" },
  { id: "quiz-pro", name: "Quiz Pro", description: "Score 80%+ on a quiz", emoji: "🎯", tier: "silver" },
  { id: "quiz-perfectionist", name: "Perfectionist", description: "Get 100% on a quiz", emoji: "💯", tier: "gold" },
  { id: "streak-3", name: "On Fire", description: "3-day login streak", emoji: "🔥", tier: "bronze" },
  { id: "streak-7", name: "Week Warrior", description: "7-day login streak", emoji: "⚡", tier: "silver" },
  { id: "streak-30", name: "Unstoppable", description: "30-day login streak", emoji: "🏆", tier: "platinum" },
  { id: "mock-warrior", name: "Mock Warrior", description: "Complete 5 mock tests", emoji: "⚔️", tier: "silver" },
  { id: "all-in-one-champion", name: "All-in-One Champion", description: "Crack the full placement simulator", emoji: "👑", tier: "platinum" },
  { id: "code-cracker", name: "Code Cracker", description: "Solve a coding problem", emoji: "💻", tier: "bronze" },
  { id: "polyglot", name: "Polyglot", description: "Practice 3+ languages", emoji: "🌐", tier: "silver" },
  { id: "night-owl", name: "Night Owl", description: "Study after midnight", emoji: "🦉", tier: "bronze" },
  { id: "early-bird", name: "Early Bird", description: "Study before 6 AM", emoji: "🐦", tier: "bronze" },
];

const STREAK_KEY = "gam-streak";
const BADGE_KEY = "gam-badges";
const STATS_KEY = "gam-stats";
const XP_KEY = "gam-xp";

export interface Streak { current: number; longest: number; lastDate: string; }
export interface GamStats {
  topicsCompleted: number;
  quizzesAttempted: number;
  mocksCompleted: number;
  codingSolved: number;
  languagesPracticed: string[];
  bestQuizScore: number;
}

export const getStreak = (): Streak => {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || "") || { current: 0, longest: 0, lastDate: "" }; }
  catch { return { current: 0, longest: 0, lastDate: "" }; }
};

export const checkInStreak = (): Streak => {
  const today = new Date().toISOString().split("T")[0];
  const s = getStreak();
  if (s.lastDate === today) return s;
  const yest = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const current = s.lastDate === yest ? s.current + 1 : 1;
  const longest = Math.max(s.longest, current);
  const next = { current, longest, lastDate: today };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  // streak badges
  if (current >= 3) unlockBadge("streak-3");
  if (current >= 7) unlockBadge("streak-7");
  if (current >= 30) unlockBadge("streak-30");
  // time-of-day badges
  const hour = new Date().getHours();
  if (hour < 6) unlockBadge("early-bird");
  if (hour >= 0 && hour < 4) unlockBadge("night-owl");
  return next;
};

export const getStats = (): GamStats => {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || "") || defaultStats(); }
  catch { return defaultStats(); }
};
const defaultStats = (): GamStats => ({
  topicsCompleted: 0, quizzesAttempted: 0, mocksCompleted: 0,
  codingSolved: 0, languagesPracticed: [], bestQuizScore: 0,
});
const setStats = (s: GamStats) => localStorage.setItem(STATS_KEY, JSON.stringify(s));

export const getXP = (): number => parseInt(localStorage.getItem(XP_KEY) || "0", 10);
export const addXP = (n: number): number => {
  const x = getXP() + n;
  localStorage.setItem(XP_KEY, String(x));
  return x;
};
export const getLevel = (xp = getXP()): { level: number; progress: number; nextAt: number } => {
  // 100 XP per level, scaling
  let level = 1, need = 100, total = 0;
  while (xp >= total + need) { total += need; level++; need = Math.floor(need * 1.3); }
  return { level, progress: xp - total, nextAt: need };
};

export const getUnlockedBadges = (): BadgeId[] => {
  try { return JSON.parse(localStorage.getItem(BADGE_KEY) || "[]"); }
  catch { return []; }
};

export const unlockBadge = (id: BadgeId): boolean => {
  const list = getUnlockedBadges();
  if (list.includes(id)) return false;
  list.push(id);
  localStorage.setItem(BADGE_KEY, JSON.stringify(list));
  addXP(50);
  // Dispatch a window event so UI can show a toast
  if (typeof window !== "undefined") {
    const def = BADGES.find((b) => b.id === id);
    window.dispatchEvent(new CustomEvent("badge-unlocked", { detail: def }));
  }
  return true;
};

// ============== EVENT HOOKS ==============

export const onTopicCompleted = () => {
  const s = getStats();
  s.topicsCompleted += 1;
  setStats(s);
  addXP(20);
  if (s.topicsCompleted >= 1) unlockBadge("first-step");
  if (s.topicsCompleted >= 5) unlockBadge("topic-master-5");
  if (s.topicsCompleted >= 25) unlockBadge("topic-master-25");
  if (s.topicsCompleted >= 50) unlockBadge("topic-master-50");
};

export const onQuizCompleted = (score: number, total: number) => {
  const s = getStats();
  s.quizzesAttempted += 1;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  s.bestQuizScore = Math.max(s.bestQuizScore, pct);
  setStats(s);
  addXP(10 + Math.round(pct / 5));
  unlockBadge("quiz-rookie");
  if (pct >= 80) unlockBadge("quiz-pro");
  if (pct === 100) unlockBadge("quiz-perfectionist");
};

export const onMockCompleted = (score: number, total: number, kind?: "all-in-one") => {
  const s = getStats();
  s.mocksCompleted += 1;
  setStats(s);
  addXP(40);
  if (s.mocksCompleted >= 5) unlockBadge("mock-warrior");
  if (kind === "all-in-one" && (score / total) >= 0.6) unlockBadge("all-in-one-champion");
};

export const onCodingSolved = (language?: string) => {
  const s = getStats();
  s.codingSolved += 1;
  if (language && !s.languagesPracticed.includes(language)) s.languagesPracticed.push(language);
  setStats(s);
  addXP(30);
  unlockBadge("code-cracker");
  if (s.languagesPracticed.length >= 3) unlockBadge("polyglot");
};

export const getAchievementMilestones = () => {
  const s = getStats();
  return [
    { label: "Topics Completed", value: s.topicsCompleted, next: nextMilestone(s.topicsCompleted, [5, 25, 50, 100]) },
    { label: "Quizzes Attempted", value: s.quizzesAttempted, next: nextMilestone(s.quizzesAttempted, [5, 20, 50, 100]) },
    { label: "Mock Tests", value: s.mocksCompleted, next: nextMilestone(s.mocksCompleted, [1, 5, 15, 30]) },
    { label: "Coding Problems", value: s.codingSolved, next: nextMilestone(s.codingSolved, [1, 10, 25, 50]) },
  ];
};
const nextMilestone = (cur: number, tiers: number[]) => tiers.find((t) => t > cur) ?? cur;
