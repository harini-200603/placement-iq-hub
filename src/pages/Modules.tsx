import { Header } from "@/components/Header";
import { ModulesSection } from "@/components/ModulesSection";
import { Footer } from "@/components/Footer";

const Modules = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <ModulesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Modules;
