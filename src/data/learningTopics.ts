import {
  Calculator, Brain, MessageSquare, Users, Code2, Terminal,
  Cpu, Globe, Palette, Zap,
} from "lucide-react";

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
  section: "placement" | "programming";
  topics: Topic[];
}

export const subjects: Subject[] = [
  // ============ SECTION 1: PLACEMENT PREPARATION ============
  {
    id: "aptitude",
    title: "Aptitude (Quantitative)",
    description: "Master numerical problem-solving for placement exams with shortcuts and tricks.",
    icon: "Calculator",
    color: "from-blue-500 to-indigo-600",
    section: "placement",
    topics: [
      { id: "number-system", title: "Number System", description: "Divisibility, HCF, LCM, prime numbers, remainders" },
      { id: "percentages", title: "Percentages", description: "Percentage calculations, increase/decrease, successive percentages" },
      { id: "profit-loss", title: "Profit & Loss", description: "Cost price, selling price, markup, discount, successive discounts" },
      { id: "time-work", title: "Time & Work", description: "Work efficiency, pipes & cisterns, alternate days" },
      { id: "time-speed-distance", title: "Time, Speed & Distance", description: "Average speed, relative speed, trains, boats & streams" },
      { id: "ratio-proportion", title: "Ratio & Proportion", description: "Ratios, proportions, mixtures, alligation" },
      { id: "simple-compound-interest", title: "Simple & Compound Interest", description: "SI, CI formulas, difference between SI and CI, installments" },
    ],
  },
  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    description: "Sharpen analytical thinking with puzzles, patterns, and deductive reasoning.",
    icon: "Brain",
    color: "from-purple-500 to-violet-600",
    section: "placement",
    topics: [
      { id: "blood-relations", title: "Blood Relations", description: "Family tree, coded relations, generation mapping" },
      { id: "coding-decoding", title: "Coding-Decoding", description: "Letter coding, number coding, mixed coding patterns" },
      { id: "syllogism", title: "Syllogism", description: "Venn diagrams, all/some/no statements, conclusions" },
      { id: "direction-problems", title: "Direction Problems", description: "Navigation, displacement, shadow-based direction" },
      { id: "seating-arrangement", title: "Seating Arrangement", description: "Linear, circular, rectangular seating arrangements" },
    ],
  },
  {
    id: "verbal-ability",
    title: "Verbal Ability",
    description: "Improve English grammar, vocabulary, and comprehension for placement tests.",
    icon: "MessageSquare",
    color: "from-emerald-500 to-teal-600",
    section: "placement",
    topics: [
      { id: "parts-of-speech", title: "Parts of Speech", description: "Nouns, verbs, adjectives, adverbs, prepositions, conjunctions" },
      { id: "tenses", title: "Tenses", description: "Present, past, future tenses with rules and examples" },
      { id: "synonyms-antonyms", title: "Synonyms & Antonyms", description: "Common word pairs, context-based usage, tips" },
      { id: "sentence-correction", title: "Sentence Correction", description: "Subject-verb agreement, parallelism, modifiers, common errors" },
      { id: "reading-comprehension", title: "Reading Comprehension Tips", description: "Strategies, inference, tone, main idea identification" },
    ],
  },
  {
    id: "hr-interview",
    title: "HR Interview Questions",
    description: "Prepare confident answers for the most common HR interview questions.",
    icon: "Users",
    color: "from-rose-500 to-pink-600",
    section: "placement",
    topics: [
      { id: "tell-me-about-yourself", title: "Tell Me About Yourself", description: "Structuring your introduction, dos and don'ts, sample answers" },
      { id: "strengths-weaknesses", title: "Strengths & Weaknesses", description: "How to present strengths, frame weaknesses positively" },
      { id: "why-hire-you", title: "Why Should We Hire You?", description: "Aligning skills with job role, unique selling points" },
      { id: "where-five-years", title: "Where Do You See Yourself in 5 Years?", description: "Goal-oriented answers, showing ambition without overcommitting" },
      { id: "sample-model-answers", title: "Sample Model Answers", description: "Complete model answers for 10+ common HR questions" },
    ],
  },

  // ============ SECTION 2: PROGRAMMING LANGUAGES ============
  {
    id: "java",
    title: "Java",
    description: "Learn Java from basics to OOP — the most popular language for placements.",
    icon: "Code2",
    color: "from-red-500 to-orange-500",
    section: "programming",
    topics: [
      { id: "java-intro", title: "Introduction to Java", description: "History, features, JDK vs JRE vs JVM" },
      { id: "java-setup", title: "Installation & Setup", description: "Installing JDK, setting PATH, first program" },
      { id: "java-syntax", title: "Basic Syntax", description: "Structure of a Java program, main method, comments" },
      { id: "java-variables", title: "Variables", description: "Declaration, initialization, naming conventions, scope" },
      { id: "java-datatypes", title: "Data Types", description: "Primitive types, reference types, type casting" },
      { id: "java-operators", title: "Operators", description: "Arithmetic, relational, logical, bitwise, ternary" },
      { id: "java-conditionals", title: "Conditional Statements", description: "if, if-else, else-if ladder, switch-case" },
      { id: "java-loops", title: "Loops", description: "for, while, do-while, enhanced for, break & continue" },
      { id: "java-functions", title: "Functions (Methods)", description: "Method declaration, parameters, return types, overloading" },
      { id: "java-arrays", title: "Arrays & Collections", description: "1D/2D arrays, ArrayList, HashMap, iterating collections" },
      { id: "java-oops", title: "OOP Concepts", description: "Classes, objects, inheritance, polymorphism, abstraction, encapsulation" },
      { id: "java-examples", title: "Example Programs", description: "Factorial, Fibonacci, palindrome, sorting, pattern printing" },
      { id: "java-errors", title: "Common Errors", description: "NullPointerException, ArrayIndexOutOfBounds, ClassCast" },
      { id: "java-interview", title: "Interview Questions", description: "Top 20 Java interview questions with answers" },
      { id: "java-summary", title: "Key Points Summary", description: "Quick revision notes for all Java concepts" },
    ],
  },
  {
    id: "python",
    title: "Python",
    description: "Python fundamentals — simple syntax, powerful capabilities.",
    icon: "Terminal",
    color: "from-yellow-500 to-green-500",
    section: "programming",
    topics: [
      { id: "python-intro", title: "Introduction to Python", description: "History, features, why Python is popular" },
      { id: "python-setup", title: "Installation & Setup", description: "Installing Python, IDLE, running first script" },
      { id: "python-syntax", title: "Basic Syntax", description: "Indentation, comments, print, input" },
      { id: "python-variables", title: "Variables", description: "Dynamic typing, naming rules, multiple assignment" },
      { id: "python-datatypes", title: "Data Types", description: "int, float, str, bool, list, tuple, dict, set" },
      { id: "python-operators", title: "Operators", description: "Arithmetic, comparison, logical, membership, identity" },
      { id: "python-conditionals", title: "Conditional Statements", description: "if, elif, else, nested conditions" },
      { id: "python-loops", title: "Loops", description: "for, while, range(), break, continue, list comprehension" },
      { id: "python-functions", title: "Functions", description: "def, parameters, return, lambda, *args, **kwargs" },
      { id: "python-collections", title: "Collections", description: "Lists, tuples, dictionaries, sets, comprehensions" },
      { id: "python-oops", title: "OOP Concepts", description: "Classes, inheritance, polymorphism, encapsulation" },
      { id: "python-examples", title: "Example Programs", description: "Calculator, string reversal, file reading, pattern printing" },
      { id: "python-errors", title: "Common Errors", description: "IndentationError, TypeError, NameError, IndexError" },
      { id: "python-interview", title: "Interview Questions", description: "Top 20 Python interview questions with answers" },
      { id: "python-summary", title: "Key Points Summary", description: "Quick revision cheat sheet for Python" },
    ],
  },
  {
    id: "c-lang",
    title: "C Programming",
    description: "The foundation of programming — pointers, memory, and system-level coding.",
    icon: "Cpu",
    color: "from-slate-500 to-gray-700",
    section: "programming",
    topics: [
      { id: "c-intro", title: "Introduction to C", description: "History, features, why learn C" },
      { id: "c-setup", title: "Installation & Setup", description: "GCC compiler, IDE setup, first program" },
      { id: "c-syntax", title: "Basic Syntax", description: "Structure of C program, header files, main function" },
      { id: "c-variables", title: "Variables", description: "Declaration, initialization, scope, storage classes" },
      { id: "c-datatypes", title: "Data Types", description: "int, float, char, double, sizeof operator" },
      { id: "c-operators", title: "Operators", description: "Arithmetic, relational, logical, bitwise, assignment" },
      { id: "c-conditionals", title: "Conditional Statements", description: "if, if-else, nested if, switch-case" },
      { id: "c-loops", title: "Loops", description: "for, while, do-while, nested loops, break & continue" },
      { id: "c-functions", title: "Functions", description: "Function declaration, call by value/reference, recursion" },
      { id: "c-arrays", title: "Arrays & Strings", description: "1D/2D arrays, string functions, character arrays" },
      { id: "c-pointers", title: "Pointers", description: "Pointer basics, pointer arithmetic, pointers with arrays" },
      { id: "c-examples", title: "Example Programs", description: "Swapping, factorial, prime check, matrix operations" },
      { id: "c-errors", title: "Common Errors", description: "Segmentation fault, uninitialized variables, memory leaks" },
      { id: "c-interview", title: "Interview Questions", description: "Top 20 C programming interview questions" },
      { id: "c-summary", title: "Key Points Summary", description: "Quick revision notes for C programming" },
    ],
  },
  {
    id: "html",
    title: "HTML",
    description: "The building block of every website — structure your web pages with HTML.",
    icon: "Globe",
    color: "from-orange-500 to-red-500",
    section: "programming",
    topics: [
      { id: "html-intro", title: "Introduction to HTML", description: "What is HTML, how browsers render pages" },
      { id: "html-setup", title: "Setup & First Page", description: "Text editor setup, creating your first HTML file" },
      { id: "html-syntax", title: "Basic Syntax & Structure", description: "DOCTYPE, html, head, body, tags and attributes" },
      { id: "html-headings", title: "Headings & Paragraphs", description: "h1-h6, p tag, line breaks, horizontal rules" },
      { id: "html-formatting", title: "Text Formatting", description: "Bold, italic, underline, superscript, subscript" },
      { id: "html-links", title: "Links & Images", description: "Anchor tags, image tags, alt text, paths" },
      { id: "html-lists", title: "Lists & Tables", description: "Ordered, unordered, definition lists, table structure" },
      { id: "html-forms", title: "Forms & Input", description: "Form elements, input types, textarea, select, buttons" },
      { id: "html-semantic", title: "Semantic HTML", description: "header, nav, main, article, section, footer" },
      { id: "html-examples", title: "Example Pages", description: "Portfolio page, contact form, blog layout" },
      { id: "html-errors", title: "Common Mistakes", description: "Unclosed tags, missing alt, improper nesting" },
      { id: "html-interview", title: "Interview Questions", description: "Top HTML interview questions with answers" },
      { id: "html-summary", title: "Key Points Summary", description: "Quick revision notes for HTML" },
    ],
  },
  {
    id: "css",
    title: "CSS",
    description: "Style your web pages — colors, layouts, animations, and responsive design.",
    icon: "Palette",
    color: "from-blue-400 to-purple-500",
    section: "programming",
    topics: [
      { id: "css-intro", title: "Introduction to CSS", description: "What is CSS, how it works with HTML" },
      { id: "css-syntax", title: "Syntax & Selectors", description: "Selectors, properties, values, specificity" },
      { id: "css-colors", title: "Colors & Backgrounds", description: "Color values, gradients, background properties" },
      { id: "css-box-model", title: "Box Model", description: "Margin, padding, border, content, box-sizing" },
      { id: "css-text", title: "Text & Fonts", description: "Font properties, text alignment, Google Fonts" },
      { id: "css-layout", title: "Display & Position", description: "Block, inline, flex intro, position types" },
      { id: "css-flexbox", title: "Flexbox", description: "Flex container, items, alignment, wrapping" },
      { id: "css-grid", title: "CSS Grid", description: "Grid template, areas, responsive grid layouts" },
      { id: "css-responsive", title: "Responsive Design", description: "Media queries, mobile-first, viewport units" },
      { id: "css-animations", title: "Animations & Transitions", description: "Transition properties, keyframes, transform" },
      { id: "css-examples", title: "Example Designs", description: "Card component, navbar, hero section styling" },
      { id: "css-errors", title: "Common Mistakes", description: "Specificity issues, z-index stacking, overflow" },
      { id: "css-interview", title: "Interview Questions", description: "Top CSS interview questions with answers" },
      { id: "css-summary", title: "Key Points Summary", description: "Quick revision notes for CSS" },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "The language of the web — add interactivity and logic to your pages.",
    icon: "Zap",
    color: "from-yellow-400 to-amber-500",
    section: "programming",
    topics: [
      { id: "js-intro", title: "Introduction to JavaScript", description: "What is JS, where it runs, ES6+ overview" },
      { id: "js-setup", title: "Setup & Console", description: "Browser console, script tag, external JS files" },
      { id: "js-syntax", title: "Basic Syntax", description: "Statements, semicolons, comments, strict mode" },
      { id: "js-variables", title: "Variables", description: "var, let, const, hoisting, scope" },
      { id: "js-datatypes", title: "Data Types", description: "String, number, boolean, null, undefined, object, symbol" },
      { id: "js-operators", title: "Operators", description: "Arithmetic, comparison, logical, spread, destructuring" },
      { id: "js-conditionals", title: "Conditional Statements", description: "if-else, ternary, switch, nullish coalescing" },
      { id: "js-loops", title: "Loops", description: "for, while, for...of, for...in, forEach, map" },
      { id: "js-functions", title: "Functions", description: "Function declaration, expression, arrow functions, closures" },
      { id: "js-arrays", title: "Arrays & Objects", description: "Array methods, object manipulation, JSON" },
      { id: "js-dom", title: "DOM Manipulation", description: "Selecting elements, events, creating/removing elements" },
      { id: "js-examples", title: "Example Programs", description: "Calculator, todo list logic, form validation" },
      { id: "js-errors", title: "Common Errors", description: "TypeError, ReferenceError, undefined is not a function" },
      { id: "js-interview", title: "Interview Questions", description: "Top 20 JavaScript interview questions" },
      { id: "js-summary", title: "Key Points Summary", description: "Quick revision notes for JavaScript" },
    ],
  },
];

export const getSubject = (id: string) => subjects.find((s) => s.id === id);

export const getSubjectsBySection = (section: "placement" | "programming") =>
  subjects.filter((s) => s.section === section);

export const getTopic = (subjectId: string, topicId: string) => {
  const subject = getSubject(subjectId);
  return subject?.topics.find((t) => t.id === topicId);
};

export const getContentPrompt = (subject: Subject, topic: Topic): string => {
  if (subject.section === "placement") {
    return `You are an expert placement preparation tutor creating content in the style of IndiaBix.com — India's #1 aptitude preparation platform.

Create comprehensive study notes for "${topic.title}" under "${subject.title}".

IMPORTANT STYLE RULES (IndiaBix style):
- Write like a teacher explaining to Indian engineering students preparing for campus placements
- Include formula boxes with clear formatting
- Every example must show step-by-step working
- Use "Type 1", "Type 2" classification for problem types
- Include "Shortcut Method" alongside "Detailed Method"
- Reference TCS, Infosys, Wipro, Cognizant, Accenture exam patterns
- Include previous year placement question patterns
- Use ₹ for currency examples, Indian names, Indian context

Structure your response EXACTLY like this:

## 📚 Introduction
What is ${topic.title}? 3-4 lines explaining the concept simply.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 3-5 questions | Easy-Medium |
| Infosys | 2-4 questions | Medium |
| Wipro | 2-3 questions | Easy |
| Cognizant | 3-4 questions | Medium |
| Accenture | 2-3 questions | Easy-Medium |

## 📐 Important Formulas & Concepts

> **Formula Box**
> List ALL important formulas in a clear box format. Number each formula.

### Core Concepts Explained
Explain each concept with bullet points. Use simple language.

## ✅ Solved Examples (Type-wise)

### Type 1: [Category Name]
**Question:** [Write a realistic placement exam question]
**Shortcut Method:**
Step 1: ...
Step 2: ...
**Answer:** ...

**Detailed Method:**
Step 1: ...
Step 2: ...
Step 3: ...
**Answer:** ...

### Type 2: [Category Name]
**Question:** [Another realistic question]
**Solution:**
Step 1: ...
**Answer:** ...

### Type 3: [Category Name]
**Question:** [Harder question]
**Solution:**
Step 1: ...
**Answer:** ...

(Include at least 5 solved examples across types)

## ⚡ Shortcut Tricks & Mental Math
Number each trick (at least 5 tricks). These should save time in exams.

## ⚠️ Common Mistakes Students Make
List 5 common pitfalls with explanations of how to avoid them.

## 📝 Practice Questions (with Answers)
Give 10 practice questions in MCQ format:

**Q1.** [Question text]
(a) Option A  (b) Option B  (c) Option C  (d) Option D
**Answer:** (b) Option B
**Explanation:** Brief explanation

(Continue for all 10 questions)

## 🔄 Previous Year Placement Patterns
- TCS pattern: [what type of questions they ask]
- Infosys pattern: [their style]
- Wipro pattern: [their style]

## 💡 Key Points for Quick Revision
10-12 bullet points for last-minute revision.

Make it beginner-friendly with Indian context. Use encouraging tone.`;
  }

  const langMap: Record<string, string> = {
    html: "html", css: "css", javascript: "javascript",
    python: "python", "c-lang": "c", java: "java",
  };
  const lang = langMap[subject.id] || subject.id;

  return `You are an expert programming tutor creating content in the style of W3Schools.com — the world's most popular web development learning platform.

Create comprehensive beginner-friendly study notes for "${topic.title}" in ${subject.title}.

IMPORTANT STYLE RULES (W3Schools style):
- Write in simple, clear English — like W3Schools "Try it Yourself" approach
- Every concept MUST have a code example with output
- Use "Definition and Usage" pattern
- Include "Tip:" boxes for helpful hints
- Include "Note:" boxes for important warnings
- Show syntax in a clean code block, then example, then output
- Keep paragraphs SHORT (2-3 lines max)
- Use tables for property/method references
- Make it step-by-step and self-learning friendly

Structure your response EXACTLY like this:

## 📚 ${topic.title}

${topic.title} in ${subject.title} is used for... (2-3 line simple intro)

---

## 🔑 Definition and Usage

A clear, concise explanation of what ${topic.title} is and when to use it.

> **Tip:** Include a practical tip here.

---

## 💻 Syntax

\`\`\`${lang}
// Show the basic syntax template
\`\`\`

---

## ✅ Example 1: Basic Usage

\`\`\`${lang}
// Complete working code with comments explaining each line
\`\`\`

**Output:**
\`\`\`
Show the exact output
\`\`\`

### Try It Yourself
Change the values and predict what happens.

---

## ✅ Example 2: Practical Application

\`\`\`${lang}
// Another example building on the first
\`\`\`

**Output:**
\`\`\`
Show the exact output
\`\`\`

---

## ✅ Example 3: Real-World Scenario

\`\`\`${lang}
// A realistic use case
\`\`\`

**Output:**
\`\`\`
Show the exact output
\`\`\`

---

## ✅ Example 4: Advanced Usage

\`\`\`${lang}
// A slightly more complex example
\`\`\`

**Output:**
\`\`\`
Show the exact output
\`\`\`

---

## 📋 Reference Table

| Feature/Property | Description | Example |
|-----------------|-------------|---------|
| ... | ... | ... |

(Include 5-8 rows covering key features)

---

## 📝 Key Notes

> **Note:** Important things to remember about ${topic.title}:

- Point 1
- Point 2
- Point 3
- Point 4
- Point 5

---

## ⚠️ Common Errors & Debugging

### Error 1: [Error Name]
**Problem:** What goes wrong
**Fix:** How to fix it
\`\`\`${lang}
// Wrong code vs correct code
\`\`\`

### Error 2: [Error Name]
**Problem:** ...
**Fix:** ...

### Error 3: [Error Name]
**Problem:** ...
**Fix:** ...

---

## ❓ Interview Questions

**Q1:** [Question about ${topic.title}]
**A:** [Concise answer]

**Q2:** [Question]
**A:** [Answer]

**Q3:** [Question]
**A:** [Answer]

**Q4:** [Question]
**A:** [Answer]

**Q5:** [Question]
**A:** [Answer]

---

## 💡 Quick Summary

- Key point 1
- Key point 2
- Key point 3
- Key point 4
- Key point 5
- Key point 6
- Key point 7
- Key point 8

Keep ALL code examples simple, beginner-level, and well-commented. Explain every line. Use encouraging tone. Write as if the reader is learning programming for the first time.`;
};
