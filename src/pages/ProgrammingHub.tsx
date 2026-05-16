import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Code2, Terminal, Cpu, Globe, Palette, Zap, Building2,
  Play, BookOpen, Trophy, Search, Sparkles, ChevronRight,
} from "lucide-react";
import { getSubjectsBySection } from "@/data/learningTopics";

const PROGRAM_CATEGORIES = [
  { id: "basics", label: "Basics & Syntax", desc: "Hello world, variables, I/O, operators", problems: 25 },
  { id: "patterns", label: "Pattern Programs", desc: "Pyramid, diamond, star, number patterns", problems: 30 },
  { id: "strings", label: "String Programs", desc: "Palindrome, reverse, anagram, manipulations", problems: 40 },
  { id: "arrays", label: "Array Programs", desc: "Sorting, searching, rotation, subarrays", problems: 45 },
  { id: "math", label: "Mathematical", desc: "Prime, Fibonacci, factorial, GCD, LCM", problems: 35 },
  { id: "recursion", label: "Recursion & Backtracking", desc: "N-Queens, tower of Hanoi, permutations", problems: 25 },
  { id: "dsa", label: "Data Structures", desc: "Stack, queue, linked list, tree, graph", problems: 50 },
  { id: "algorithms", label: "Algorithms", desc: "DP, greedy, divide & conquer, sliding window", problems: 40 },
];

const COMPANIES = [
  { id: "TCS", name: "TCS", topics: ["String manipulation", "Number patterns", "Simple DP"], color: "from-blue-600 to-indigo-700", asked: "Pyramid patterns, string reversal, prime check" },
  { id: "Infosys", name: "Infosys", topics: ["Array problems", "Sorting", "Searching"], color: "from-emerald-600 to-teal-700", asked: "Find duplicates, binary search, Kadane's algorithm" },
  { id: "Wipro", name: "Wipro", topics: ["Basic logic", "Loops", "Recursion"], color: "from-violet-600 to-purple-700", asked: "Factorial, Fibonacci, swap without temp" },
  { id: "Cognizant", name: "Cognizant", topics: ["DSA basics", "Strings", "OOP"], color: "from-cyan-600 to-blue-700", asked: "Anagrams, linked list reversal, matrix problems" },
  { id: "Accenture", name: "Accenture", topics: ["Coding logic", "Math", "Strings"], color: "from-rose-600 to-pink-700", asked: "Number series, palindrome, count vowels" },
  { id: "Amazon", name: "Amazon", topics: ["DSA", "Trees", "DP"], color: "from-orange-600 to-amber-700", asked: "Two-sum, BFS/DFS, LRU cache, tree problems" },
  { id: "Microsoft", name: "Microsoft", topics: ["DSA", "System Design", "Algorithms"], color: "from-sky-600 to-blue-700", asked: "Graph traversal, sliding window, heap problems" },
  { id: "Google", name: "Google", topics: ["Hard DSA", "DP", "Graphs"], color: "from-green-600 to-emerald-700", asked: "Advanced DP, segment trees, complex algorithms" },
];

const LANGUAGES = [
  { id: "python", label: "Python", icon: Terminal, color: "from-yellow-500 to-green-500" },
  { id: "java", label: "Java", icon: Code2, color: "from-red-500 to-orange-500" },
  { id: "c-lang", label: "C", icon: Cpu, color: "from-slate-500 to-gray-700" },
  { id: "html", label: "HTML", icon: Globe, color: "from-orange-500 to-red-500" },
  { id: "css", label: "CSS", icon: Palette, color: "from-blue-400 to-purple-500" },
  { id: "javascript", label: "JavaScript", icon: Zap, color: "from-yellow-400 to-amber-500" },
];

const ProgrammingHub = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const programmingSubjects = getSubjectsBySection("programming");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-6xl">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Code2 className="w-3 h-3" /> Programming Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Master Coding for <span className="gradient-text">Placements</span></h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Learn languages, solve company-specific programs, and practice live in our online IDE — all in one place.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a language, topic or company..." className="pl-11 h-11" />
          </div>
        </motion.div>

        {/* Quick action cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" onClick={() => navigate("/coding-practice")}>
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-3"><Play className="w-5 h-5" /></div>
              <h3 className="font-bold">Live Coding Practice</h3>
              <p className="text-xs text-muted-foreground mt-1">Solve AI-generated problems in Python, Java, C++, JS with test-case validation.</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-accent/30 bg-gradient-to-br from-accent/5 to-transparent" onClick={() => navigate("/all-in-one-test")}>
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-3"><Trophy className="w-5 h-5" /></div>
              <h3 className="font-bold">Coding Round in Mock Test</h3>
              <p className="text-xs text-muted-foreground mt-1">Solve coding problems inside the full company simulator.</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent" onClick={() => navigate("/learn")}>
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center mb-3"><BookOpen className="w-5 h-5" /></div>
              <h3 className="font-bold">Learning Notes</h3>
              <p className="text-xs text-muted-foreground mt-1">Read AI-generated tutorials for every programming concept.</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="languages" className="space-y-6">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 h-11">
            <TabsTrigger value="languages"><Code2 className="w-4 h-4 mr-1.5" /> Languages</TabsTrigger>
            <TabsTrigger value="programs"><Sparkles className="w-4 h-4 mr-1.5" /> Programs</TabsTrigger>
            <TabsTrigger value="company"><Building2 className="w-4 h-4 mr-1.5" /> By Company</TabsTrigger>
          </TabsList>

          {/* LANGUAGES */}
          <TabsContent value="languages">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LANGUAGES.filter((l) => l.label.toLowerCase().includes(search.toLowerCase())).map((lang) => {
                const subject = programmingSubjects.find((s) => s.id === lang.id);
                return (
                  <Card key={lang.id} className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => navigate(`/learn/${lang.id}`)}>
                    <div className={`h-1.5 bg-gradient-to-r ${lang.color}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lang.color} text-white flex items-center justify-center mb-2`}>
                        <lang.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">{lang.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{subject?.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary">{subject?.topics.length || 0} topics</Badge>
                        <span className="text-xs text-primary font-medium flex items-center gap-1">Start <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* PROGRAMS */}
          <TabsContent value="programs">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROGRAM_CATEGORIES.filter((p) => p.label.toLowerCase().includes(search.toLowerCase())).map((cat) => (
                <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/coding-practice")}>
                  <CardHeader>
                    <CardTitle className="text-base">{cat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{cat.desc}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{cat.problems}+ programs</Badge>
                      <Button size="sm" variant="ghost" className="gap-1">Practice <ChevronRight className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* BY COMPANY */}
          <TabsContent value="company">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPANIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).map((c) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />
                  <CardHeader>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-2`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <CardTitle>{c.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2"><span className="font-semibold text-foreground">Frequently asked:</span> {c.asked}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.topics.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/coding-practice")}><Play className="w-3 h-3 mr-1" /> Practice</Button>
                      <Button size="sm" className="flex-1" onClick={() => navigate("/all-in-one-test")}><Trophy className="w-3 h-3 mr-1" /> Mock</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProgrammingHub;
