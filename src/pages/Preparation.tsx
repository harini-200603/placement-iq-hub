import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  ChevronRight,
  Search,
  GraduationCap,
  Calculator,
  Clock,
  TrendingUp,
  Target,
  Layers,
  Dumbbell,
  Code2,
  Mic,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Topic {
  name: string;
  slug: string;
  icon: React.ElementType;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
}

const APTITUDE_TOPICS: Topic[] = [
  { name: "Problems on Trains", slug: "problems-on-trains", icon: TrendingUp, category: "Arithmetic", difficulty: "medium", description: "Speed, distance and time problems involving trains passing poles, platforms and other trains." },
  { name: "Time and Distance", slug: "time-and-distance", icon: Clock, category: "Arithmetic", difficulty: "easy", description: "Concepts of speed, distance and time with relative speed and average speed problems." },
  { name: "Height and Distance", slug: "height-and-distance", icon: TrendingUp, category: "Arithmetic", difficulty: "hard", description: "Trigonometric ratios applied to find heights and distances of objects." },
  { name: "Time and Work", slug: "time-and-work", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Problems on work done by individuals or groups working together or alternately." },
  { name: "Simple Interest", slug: "simple-interest", icon: Calculator, category: "Arithmetic", difficulty: "easy", description: "Calculate interest using principal, rate and time with SI formula." },
  { name: "Compound Interest", slug: "compound-interest", icon: Calculator, category: "Arithmetic", difficulty: "medium", description: "Interest calculated on principal plus accumulated interest over periods." },
  { name: "Profit and Loss", slug: "profit-and-loss", icon: TrendingUp, category: "Arithmetic", difficulty: "easy", description: "Cost price, selling price, profit percentage, loss percentage and discounts." },
  { name: "Partnership", slug: "partnership", icon: Layers, category: "Arithmetic", difficulty: "medium", description: "Ratio of investments and time to divide profits among business partners." },
  { name: "Percentage", slug: "percentage", icon: Target, category: "Arithmetic", difficulty: "easy", description: "Conversion between fractions, decimals and percentages with applications." },
  { name: "Problems on Ages", slug: "problems-on-ages", icon: Clock, category: "Arithmetic", difficulty: "easy", description: "Linear equations involving present, past and future ages of individuals." },
  { name: "Calendar", slug: "calendar", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Finding day of the week for any given date using odd days concept." },
  { name: "Clock", slug: "clock", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Angle between clock hands, meeting times and gaining/losing time." },
  { name: "Average", slug: "average", icon: Calculator, category: "Arithmetic", difficulty: "easy", description: "Mean of numbers with weighted averages and average speed/age problems." },
  { name: "Area", slug: "area", icon: Layers, category: "Geometry", difficulty: "medium", description: "Area of triangles, circles, rectangles, squares, parallelograms and trapezoids." },
  { name: "Volume and Surface Area", slug: "volume-and-surface-area", icon: Layers, category: "Geometry", difficulty: "hard", description: "Volume and surface area of cubes, cuboids, cylinders, cones and spheres." },
  { name: "Permutation and Combination", slug: "permutation-and-combination", icon: Target, category: "Advanced", difficulty: "hard", description: "Arrangements and selections of objects with and without repetition." },
  { name: "Numbers", slug: "numbers", icon: Calculator, category: "Number System", difficulty: "easy", description: "Types of numbers, divisibility rules, remainders and properties." },
  { name: "Problems on Numbers", slug: "problems-on-numbers", icon: Calculator, category: "Number System", difficulty: "medium", description: "Word problems involving relationships between numbers." },
  { name: "Problems on H.C.F and L.C.M", slug: "problems-on-hcf-and-lcm", icon: Calculator, category: "Number System", difficulty: "medium", description: "Finding HCF and LCM using prime factorization and division methods." },
  { name: "Decimal Fraction", slug: "decimal-fraction", icon: Calculator, category: "Number System", difficulty: "easy", description: "Operations with decimal fractions and conversion between forms." },
  { name: "Simplification", slug: "simplification", icon: Calculator, category: "Number System", difficulty: "easy", description: "BODMAS rule and simplification of complex arithmetic expressions." },
  { name: "Square Root and Cube Root", slug: "square-root-and-cube-root", icon: Calculator, category: "Number System", difficulty: "easy", description: "Finding square roots and cube roots using factorization and estimation." },
  { name: "Surds and Indices", slug: "surds-and-indices", icon: Calculator, category: "Number System", difficulty: "medium", description: "Laws of indices, rationalization of surds and simplification." },
  { name: "Ratio and Proportion", slug: "ratio-and-proportion", icon: Target, category: "Arithmetic", difficulty: "easy", description: "Direct and inverse proportion, compound ratios and proportional division." },
  { name: "Chain Rule", slug: "chain-rule", icon: Layers, category: "Arithmetic", difficulty: "medium", description: "Direct and indirect variation problems using chain rule method." },
  { name: "Pipes and Cistern", slug: "pipes-and-cistern", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Problems on filling and emptying tanks with pipes working together." },
  { name: "Boats and Streams", slug: "boats-and-streams", icon: TrendingUp, category: "Arithmetic", difficulty: "medium", description: "Speed of boat in still water, upstream and downstream concepts." },
  { name: "Alligation or Mixture", slug: "alligation-or-mixture", icon: Layers, category: "Arithmetic", difficulty: "hard", description: "Mixing two or more quantities to find the ratio or mean price." },
  { name: "Logarithm", slug: "logarithm", icon: Calculator, category: "Advanced", difficulty: "hard", description: "Properties of logarithms, change of base and solving log equations." },
  { name: "Races and Games", slug: "races-and-games", icon: Target, category: "Arithmetic", difficulty: "medium", description: "Head start, dead heat and problems on races between contestants." },
  { name: "Stocks and Shares", slug: "stocks-and-shares", icon: TrendingUp, category: "Advanced", difficulty: "hard", description: "Market value, face value, dividend and return on investment." },
  { name: "Probability", slug: "probability", icon: Target, category: "Advanced", difficulty: "hard", description: "Classical probability, conditional probability and Bayes theorem basics." },
  { name: "True Discount", slug: "true-discount", icon: Calculator, category: "Advanced", difficulty: "hard", description: "Present worth, true discount and relationship with simple interest." },
  { name: "Banker's Discount", slug: "bankers-discount", icon: Calculator, category: "Advanced", difficulty: "hard", description: "Banker's discount, banker's gain and their relation with true discount." },
  { name: "Odd Man Out and Series", slug: "odd-man-out-and-series", icon: Target, category: "Reasoning", difficulty: "medium", description: "Number series patterns, finding the odd element and missing terms." },
];

const VERBAL_TOPICS: Topic[] = [
  { name: "Spotting Errors", slug: "spotting-errors", icon: BookOpen, category: "Grammar", difficulty: "medium", description: "Identify grammatical errors in sentences." },
  { name: "Sentence Correction", slug: "sentence-correction", icon: BookOpen, category: "Grammar", difficulty: "medium", description: "Choose the correct alternative to fix sentence errors." },
  { name: "Synonyms", slug: "synonyms", icon: BookOpen, category: "Vocabulary", difficulty: "easy", description: "Words with similar meanings." },
  { name: "Antonyms", slug: "antonyms", icon: BookOpen, category: "Vocabulary", difficulty: "easy", description: "Words with opposite meanings." },
  { name: "Ordering of Sentences", slug: "ordering-of-sentences", icon: BookOpen, category: "Comprehension", difficulty: "medium", description: "Rearrange jumbled sentences into a coherent paragraph." },
  { name: "Idioms and Phrases", slug: "idioms-and-phrases", icon: BookOpen, category: "Vocabulary", difficulty: "medium", description: "Common English idioms and their meanings." },
  { name: "One Word Substitutes", slug: "one-word-substitutes", icon: BookOpen, category: "Vocabulary", difficulty: "medium", description: "Single words that replace a group of words." },
  { name: "Reading Comprehension", slug: "reading-comprehension", icon: BookOpen, category: "Comprehension", difficulty: "hard", description: "Read passages and answer questions based on them." },
];

const TECHNICAL_TOPICS: Topic[] = [
  { name: "Data Structures", slug: "data-structures", icon: Layers, category: "CS Fundamentals", difficulty: "hard", description: "Arrays, linked lists, stacks, queues, trees, graphs." },
  { name: "Algorithms", slug: "algorithms", icon: Target, category: "CS Fundamentals", difficulty: "hard", description: "Sorting, searching, dynamic programming, greedy algorithms." },
  { name: "OOP Concepts", slug: "oop-concepts", icon: Layers, category: "Programming", difficulty: "medium", description: "Encapsulation, inheritance, polymorphism, abstraction." },
  { name: "DBMS", slug: "dbms", icon: Layers, category: "CS Fundamentals", difficulty: "medium", description: "Normalization, SQL, transactions, indexing." },
  { name: "Operating Systems", slug: "operating-systems", icon: Layers, category: "CS Fundamentals", difficulty: "hard", description: "Process management, memory, scheduling, deadlocks." },
  { name: "Networking", slug: "networking", icon: Layers, category: "CS Fundamentals", difficulty: "medium", description: "OSI model, TCP/IP, protocols, subnetting." },
  { name: "SQL Queries", slug: "sql-queries", icon: Calculator, category: "Programming", difficulty: "medium", description: "Joins, subqueries, aggregate functions, group by." },
  { name: "C/C++ Basics", slug: "c-cpp-basics", icon: Layers, category: "Programming", difficulty: "medium", description: "Pointers, memory management, STL, templates." },
  { name: "Java Programming", slug: "java-programming", icon: Layers, category: "Programming", difficulty: "medium", description: "Collections, multithreading, exception handling." },
  { name: "Python Programming", slug: "python-programming", icon: Layers, category: "Programming", difficulty: "easy", description: "Data types, list comprehension, OOP in Python." },
];

const INTERVIEW_TOPICS: Topic[] = [
  { name: "HR Questions", slug: "hr-questions", icon: GraduationCap, category: "HR", difficulty: "easy", description: "Tell me about yourself, strengths, weaknesses, career goals." },
  { name: "Behavioral Questions", slug: "behavioral-questions", icon: GraduationCap, category: "HR", difficulty: "medium", description: "Situational and behavioral interview questions using STAR method." },
  { name: "Group Discussion", slug: "group-discussion", icon: GraduationCap, category: "Communication", difficulty: "medium", description: "GD tips, common topics and evaluation criteria." },
  { name: "Technical Interview", slug: "technical-interview", icon: GraduationCap, category: "Technical", difficulty: "hard", description: "How to approach technical rounds and explain projects." },
];

const MODULE_TOPICS: Record<string, Topic[]> = {
  aptitude: APTITUDE_TOPICS,
  verbal: VERBAL_TOPICS,
  technical: TECHNICAL_TOPICS,
  interview: INTERVIEW_TOPICS,
  general: APTITUDE_TOPICS,
};

const MODULE_LABELS: Record<string, string> = {
  aptitude: "Aptitude Preparation",
  verbal: "Verbal Ability",
  technical: "Technical Preparation",
  interview: "Interview Preparation",
  general: "General Knowledge",
};

const CATEGORIES_ORDER = ["Arithmetic", "Number System", "Geometry", "Advanced", "Reasoning", "Grammar", "Vocabulary", "Comprehension", "CS Fundamentals", "Programming", "HR", "Communication", "Technical"];

const difficultyColor: Record<string, string> = {
  easy: "bg-secondary/10 text-secondary border-secondary/20",
  medium: "bg-accent/10 text-accent-foreground border-accent/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const Preparation = () => {
  const { module } = useParams<{ module: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const topics = MODULE_TOPICS[module || ""] || APTITUDE_TOPICS;
  const label = MODULE_LABELS[module || ""] || "Preparation";

  const filtered = topics.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = CATEGORIES_ORDER.reduce<Record<string, Topic[]>>((acc, cat) => {
    const items = filtered.filter((t) => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{label}</h1>
              <p className="text-muted-foreground">
                {topics.length} topics · Master each topic before the mock test
              </p>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap">
              <Button
                variant="outline"
                onClick={() => navigate(`/practice/${module}`)}
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Practice
              </Button>
              {module === "technical" && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/coding-practice")}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Coding Practice
                </Button>
              )}
              {module === "interview" && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/interview-practice")}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Interview Sim
                </Button>
              )}
              <Button
                size="lg"
                onClick={() => navigate(`/mock-test/${module}`)}
              >
                <Play className="w-4 h-4 mr-2" />
                Mock Test (15 Qs)
              </Button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {Object.entries(grouped).map(([category, items], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.05 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((topic, idx) => (
                <Card
                  key={topic.slug}
                  className="group hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() =>
                    navigate(`/topic/${module}/${topic.slug}`)
                  }
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <topic.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {topic.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${difficultyColor[topic.difficulty]}`}
                        >
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {topic.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No topics found matching "{search}"
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Preparation;
