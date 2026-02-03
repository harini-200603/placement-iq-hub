import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export const MotivationSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
            <Quote className="w-8 h-8 text-primary" />
          </div>

          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground leading-relaxed mb-8">
            "Success is not final, failure is not fatal: it is the courage to
            continue that counts.{" "}
            <span className="text-primary">
              Your placement journey starts with a single step.
            </span>
            "
          </blockquote>

          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-accent rounded-full mb-4" />
            <p className="text-lg text-muted-foreground font-medium">
              — Winston Churchill (adapted)
            </p>
          </div>

          {/* Motivational Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                value: "Every",
                highlight: "Expert",
                subtext: "was once a beginner",
              },
              {
                value: "Practice",
                highlight: "Makes",
                subtext: "perfect placement",
              },
              {
                value: "Your",
                highlight: "Dream Job",
                subtext: "is within reach",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              >
                <p className="text-lg text-muted-foreground">{item.value}</p>
                <p className="text-2xl font-display font-bold text-primary mb-1">
                  {item.highlight}
                </p>
                <p className="text-muted-foreground">{item.subtext}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
