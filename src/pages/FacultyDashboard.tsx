import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacultyAssignments } from "@/components/faculty/FacultyAssignments";
import { FacultyAnalytics } from "@/components/faculty/FacultyAnalytics";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const FacultyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFaculty, setIsFaculty] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    const checkRole = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data?.role === "faculty") {
        setIsFaculty(true);
      } else {
        toast({ title: "Access denied", description: "Faculty account required", variant: "destructive" });
        navigate("/dashboard");
      }
      setChecking(false);
    };
    checkRole();
  }, [user, authLoading, navigate, toast]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!isFaculty) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
              <p className="text-muted-foreground">Assign questions & track student progress</p>
            </div>
          </div>

          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="analytics">Student Analytics</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <FacultyAnalytics />
            </TabsContent>

            <TabsContent value="assignments">
              <FacultyAssignments facultyId={user!.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
