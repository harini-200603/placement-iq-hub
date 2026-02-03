import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ModulesSection } from "@/components/ModulesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { MotivationSection } from "@/components/MotivationSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ModulesSection />
        <FeaturesSection />
        <MotivationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
