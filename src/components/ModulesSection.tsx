import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Code,
  ClipboardList,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    icon: Brain,
    title: "Aptitude Preparation",
    description:
      "Master quantitative aptitude, logical reasoning, and data interpretation with comprehensive practice sets.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    slug: "aptitude",
  },
  {
    icon: BookOpen,
    title: "Verbal Ability",
    description:
      "Enhance grammar, vocabulary, reading comprehension, and verbal reasoning skills with targeted exercises.",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    slug: "verbal",
  },
  {
    icon: Code,
    title: "Technical Preparation",
    description:
      "Prepare for coding interviews with DSA, programming concepts, and domain-specific technical questions.",
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600",
    slug: "technical",
  },
  {
    icon: ClipboardList,
    title: "Mock Tests",
    description:
      "Take placement-oriented mock tests simulating real company patterns with detailed performance analysis.",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    slug: "general",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description:
      "Practice HR and technical interviews with common questions, tips, and mock interview simulations.",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
    slug: "interview",
  },
];

export const ModulesSection = () => {
  const navigate = useNavigate();
  return (
    <section id="modules" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Core Modules
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive preparation modules designed to help you excel in
            every aspect of campus placements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-soft hover-lift cursor-pointer">
                <div
                  className={`w-14 h-14 rounded-xl ${module.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <module.icon className={`w-7 h-7 ${module.iconColor}`} />
                </div>

                <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {module.description}
                </p>

                <Button
                  variant="ghost"
                  className="p-0 h-auto text-primary font-semibold group/btn"
                  onClick={() => navigate(`/preparation/${module.slug}`)}
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
