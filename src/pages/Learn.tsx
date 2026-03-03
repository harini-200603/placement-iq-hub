import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Code2,
  Database,
  Globe,
  Brain,
  ChevronRight,
  Play,
  BookOpen,
  Trophy,
  Zap,
  Terminal,
  FileCode,
  Layers,
  Cpu,
  PenTool,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessonsCount: number;
  category: string;
}

const tutorials: Tutorial[] = [
  {
    id: "html-css",
    title: "HTML & CSS",
    description: "Build beautiful web pages from scratch. Learn semantic HTML5, modern CSS3, Flexbox, Grid, and responsive design.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    topics: ["HTML Basics", "CSS Selectors", "Flexbox", "CSS Grid", "Responsive Design", "Animations"],
    difficulty: "Beginner",
    lessonsCount: 24,
    category: "Web Development",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Master the language of the web. From variables to async/await, closures, DOM manipulation, and ES6+ features.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-400 to-amber-500",
    topics: ["Variables & Types", "Functions", "DOM Manipulation", "Events", "Promises & Async", "ES6+ Features"],
    difficulty: "Beginner",
    lessonsCount: 32,
    category: "Web Development",
  },
  {
    id: "python",
    title: "Python",
    description: "Versatile and powerful. Learn Python fundamentals, data structures, OOP, file handling, and popular libraries.",
    icon: <Terminal className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400",
    topics: ["Syntax & Variables", "Data Structures", "Functions & OOP", "File I/O", "Error Handling", "Libraries"],
    difficulty: "Beginner",
    lessonsCount: 28,
    category: "Programming",
  },
  {
    id: "java",
    title: "Java Programming",
    description: "Enterprise-grade programming. OOP concepts, collections, multithreading, exception handling, and design patterns.",
    icon: <FileCode className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    topics: ["OOP Concepts", "Collections", "Multithreading", "Exception Handling", "Streams API", "Design Patterns"],
    difficulty: "Intermediate",
    lessonsCount: 30,
    category: "Programming",
  },
  {
    id: "sql",
    title: "SQL & Databases",
    description: "Master data management. Learn SQL queries, joins, subqueries, normalization, indexing, and database design.",
    icon: <Database className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-400",
    topics: ["Basic Queries", "Joins", "Subqueries", "Aggregate Functions", "Normalization", "Indexing"],
    difficulty: "Beginner",
    lessonsCount: 20,
    category: "Database",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Crack coding interviews. Arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-500 to-violet-500",
    topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Sorting Algorithms", "Searching", "Dynamic Programming"],
    difficulty: "Advanced",
    lessonsCount: 36,
    category: "Computer Science",
  },
  {
    id: "cpp",
    title: "C / C++",
    description: "Systems programming fundamentals. Pointers, memory management, STL, templates, and low-level concepts.",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
    topics: ["Pointers & Memory", "OOP in C++", "STL Containers", "Templates", "File Handling", "Preprocessor"],
    difficulty: "Intermediate",
    lessonsCount: 26,
    category: "Programming",
  },
  {
    id: "react",
    title: "React & Frontend",
    description: "Build modern web apps. Components, hooks, state management, routing, API integration, and best practices.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500",
    topics: ["Components & JSX", "Hooks", "State Management", "Routing", "API Calls", "Performance"],
    difficulty: "Intermediate",
    lessonsCount: 22,
    category: "Web Development",
  },
  {
    id: "aptitude",
    title: "Aptitude & Reasoning",
    description: "Ace placement tests. Quantitative aptitude, logical reasoning, verbal ability, and problem-solving techniques.",
    icon: <PenTool className="w-6 h-6" />,
    color: "from-rose-400 to-orange-400",
    topics: ["Number Systems", "Percentages", "Time & Work", "Logical Reasoning", "Puzzles", "Data Interpretation"],
    difficulty: "Beginner",
    lessonsCount: 30,
    category: "Placement Prep",
  },
];

const categories = ["All", ...Array.from(new Set(tutorials.map((t) => t.category)))];

const Learn = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = tutorials.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.topics.some((topic) => topic.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Interactive Learning Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn by <span className="gradient-text">Doing</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Step-by-step lessons with interactive code editors. Practice as you learn — 
              the best way to master programming and placement preparation.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search tutorials, topics, languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border bg-card shadow-sm"
              />
            </div>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="container mx-auto px-4 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: <BookOpen className="w-5 h-5" />, value: "9+", label: "Courses" },
              { icon: <Code2 className="w-5 h-5" />, value: "250+", label: "Lessons" },
              { icon: <Play className="w-5 h-5" />, value: "500+", label: "Examples" },
              { icon: <Trophy className="w-5 h-5" />, value: "Free", label: "Forever" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-card border border-border"
              >
                <div className="text-primary">{stat.icon}</div>
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Category Filter */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* Tutorial Cards Grid */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filtered.map((tutorial, i) => (
                <motion.div
                  key={tutorial.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredId(tutorial.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
                    onClick={() => navigate(`/learn/${tutorial.id}`)}
                  >
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${tutorial.color}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tutorial.color} text-white shadow-md`}>
                          {tutorial.icon}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            tutorial.difficulty === "Beginner"
                              ? "bg-secondary/10 text-secondary"
                              : tutorial.difficulty === "Advanced"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-accent/10 text-accent-foreground"
                          }`}
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tutorial.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Topics Preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tutorial.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                        {tutorial.topics.length > 4 && (
                          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            +{tutorial.topics.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {tutorial.lessonsCount} lessons
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Start Learning <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No tutorials found. Try a different search term.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
