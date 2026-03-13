// Smart Features - localStorage-based utilities for PlacementIQ

export interface MistakeEntry {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  module: string;
  topic: string;
  timestamp: number;
  reviewed: boolean;
}

export interface RevisionItem {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  reason: "wrong_answer" | "skipped" | "low_confidence" | "manual";
  priority: "high" | "medium" | "low";
  addedAt: number;
  completed: boolean;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  mood: Mood | null;
  tasks: PlanTask[];
  completedCount: number;
}

export interface PlanTask {
  id: string;
  title: string;
  type: "learn" | "practice" | "revision" | "mock";
  subjectId?: string;
  topicId?: string;
  duration: number; // minutes
  completed: boolean;
}

export type Mood = "focused" | "motivated" | "normal" | "tired" | "stressed";

const MISTAKES_KEY = "placementiq-mistakes";
const REVISION_KEY = "placementiq-revision-queue";
const DAILY_PLAN_KEY = "placementiq-daily-plan";
const MOOD_KEY = "placementiq-mood";
const STREAK_KEY = "placementiq-streak";

// ============ MISTAKE NOTEBOOK ============

export const getMistakes = (): MistakeEntry[] => {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

export const addMistake = (entry: Omit<MistakeEntry, "id" | "timestamp" | "reviewed">): void => {
  const mistakes = getMistakes();
  mistakes.unshift({
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    reviewed: false,
  });
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes.slice(0, 200))); // Keep max 200
};

export const markMistakeReviewed = (id: string): void => {
  const mistakes = getMistakes();
  const updated = mistakes.map((m) => (m.id === id ? { ...m, reviewed: true } : m));
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
};

export const deleteMistake = (id: string): void => {
  const mistakes = getMistakes().filter((m) => m.id !== id);
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
};

export const clearAllMistakes = (): void => {
  localStorage.setItem(MISTAKES_KEY, JSON.stringify([]));
};

// ============ REVISION QUEUE ============

export const getRevisionQueue = (): RevisionItem[] => {
  try {
    const stored = localStorage.getItem(REVISION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

export const addToRevision = (item: Omit<RevisionItem, "id" | "addedAt" | "completed">): void => {
  const queue = getRevisionQueue();
  // Don't add duplicates
  if (queue.some((q) => q.subjectId === item.subjectId && q.topicId === item.topicId && !q.completed)) return;
  queue.unshift({
    ...item,
    id: crypto.randomUUID(),
    addedAt: Date.now(),
    completed: false,
  });
  localStorage.setItem(REVISION_KEY, JSON.stringify(queue));
};

export const completeRevisionItem = (id: string): void => {
  const queue = getRevisionQueue().map((q) => (q.id === id ? { ...q, completed: true } : q));
  localStorage.setItem(REVISION_KEY, JSON.stringify(queue));
};

export const removeRevisionItem = (id: string): void => {
  const queue = getRevisionQueue().filter((q) => q.id !== id);
  localStorage.setItem(REVISION_KEY, JSON.stringify(queue));
};

// ============ MOOD & DAILY PLANNER ============

export const getMood = (): Mood | null => {
  try {
    const stored = localStorage.getItem(MOOD_KEY);
    if (!stored) return null;
    const { mood, date } = JSON.parse(stored);
    // Only valid for today
    if (date === new Date().toISOString().split("T")[0]) return mood;
    return null;
  } catch { return null; }
};

export const setMood = (mood: Mood): void => {
  localStorage.setItem(MOOD_KEY, JSON.stringify({ mood, date: new Date().toISOString().split("T")[0] }));
};

export const getDailyPlan = (): DailyPlan | null => {
  try {
    const stored = localStorage.getItem(DAILY_PLAN_KEY);
    if (!stored) return null;
    const plan: DailyPlan = JSON.parse(stored);
    if (plan.date === new Date().toISOString().split("T")[0]) return plan;
    return null;
  } catch { return null; }
};

export const saveDailyPlan = (plan: DailyPlan): void => {
  localStorage.setItem(DAILY_PLAN_KEY, JSON.stringify(plan));
};

export const completePlanTask = (taskId: string): void => {
  const plan = getDailyPlan();
  if (!plan) return;
  plan.tasks = plan.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t));
  plan.completedCount = plan.tasks.filter((t) => t.completed).length;
  saveDailyPlan(plan);
};

// ============ STREAK ============

export const getStreak = (): { current: number; lastDate: string } => {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (!stored) return { current: 0, lastDate: "" };
    return JSON.parse(stored);
  } catch { return { current: 0, lastDate: "" }; }
};

export const updateStreak = (): number => {
  const today = new Date().toISOString().split("T")[0];
  const streak = getStreak();
  
  if (streak.lastDate === today) return streak.current; // Already counted today
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = streak.lastDate === yesterday ? streak.current + 1 : 1;
  
  localStorage.setItem(STREAK_KEY, JSON.stringify({ current: newStreak, lastDate: today }));
  return newStreak;
};

// ============ GENERATE DAILY PLAN ============

import { subjects } from "@/data/learningTopics";

export const generateDailyPlan = (mood: Mood): DailyPlan => {
  const today = new Date().toISOString().split("T")[0];
  const tasks: PlanTask[] = [];
  
  // Adjust intensity based on mood
  const config = {
    focused: { learnCount: 3, practiceCount: 2, revisionCount: 1, duration: 25 },
    motivated: { learnCount: 3, practiceCount: 2, revisionCount: 2, duration: 20 },
    normal: { learnCount: 2, practiceCount: 1, revisionCount: 1, duration: 20 },
    tired: { learnCount: 1, practiceCount: 1, revisionCount: 1, duration: 15 },
    stressed: { learnCount: 1, practiceCount: 0, revisionCount: 1, duration: 10 },
  }[mood];

  // Find incomplete topics across all subjects
  const incompletePairs: { subjectId: string; topicId: string; title: string; subjectTitle: string }[] = [];
  
  subjects.forEach((subject) => {
    try {
      const stored = localStorage.getItem(`learn-progress-${subject.id}`);
      const completed: string[] = stored ? JSON.parse(stored) : [];
      subject.topics.forEach((topic) => {
        if (!completed.includes(topic.id)) {
          incompletePairs.push({
            subjectId: subject.id,
            topicId: topic.id,
            title: topic.title,
            subjectTitle: subject.title,
          });
        }
      });
    } catch {}
  });

  // Shuffle and pick topics
  const shuffled = incompletePairs.sort(() => Math.random() - 0.5);

  for (let i = 0; i < config.learnCount && i < shuffled.length; i++) {
    const t = shuffled[i];
    tasks.push({
      id: crypto.randomUUID(),
      title: `📖 Learn: ${t.title} (${t.subjectTitle})`,
      type: "learn",
      subjectId: t.subjectId,
      topicId: t.topicId,
      duration: config.duration,
      completed: false,
    });
  }

  // Add practice tasks
  for (let i = 0; i < config.practiceCount; i++) {
    const modules = ["aptitude", "technical", "verbal", "interview"];
    tasks.push({
      id: crypto.randomUUID(),
      title: `🎯 Practice: ${modules[i % modules.length]} questions`,
      type: "practice",
      duration: config.duration,
      completed: false,
    });
  }

  // Add revision from queue
  const revisionQueue = getRevisionQueue().filter((r) => !r.completed);
  for (let i = 0; i < config.revisionCount && i < revisionQueue.length; i++) {
    tasks.push({
      id: crypto.randomUUID(),
      title: `🔄 Revise: ${revisionQueue[i].title}`,
      type: "revision",
      subjectId: revisionQueue[i].subjectId,
      topicId: revisionQueue[i].topicId,
      duration: 15,
      completed: false,
    });
  }

  // Add mock test if motivated or focused
  if (mood === "focused" || mood === "motivated") {
    tasks.push({
      id: crypto.randomUUID(),
      title: "📝 Take a Mock Test",
      type: "mock",
      duration: 15,
      completed: false,
    });
  }

  return { date: today, mood, tasks, completedCount: 0 };
};
