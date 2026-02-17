import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CertificateCard } from "@/components/CertificateCard";
import { Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  module: string;
  title: string;
  score: number;
  total_questions: number;
  user_name: string;
  completed_at: string;
}

const Certificates = () => {
  const { user, loading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setCertificates((data as Certificate[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
              <Award className="w-8 h-8 text-accent" />
              My Certificates
            </h1>
            <p className="text-muted-foreground text-lg">
              Download and share your achievement certificates.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-xl font-semibold">No certificates yet</p>
              <p className="mt-2">Complete a mock test to earn your first certificate!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CertificateCard
                    userName={cert.user_name}
                    module={cert.module}
                    score={cert.score}
                    totalQuestions={cert.total_questions}
                    completedAt={cert.completed_at}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;
