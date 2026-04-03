import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import {
  Eye, EyeOff, Mail, Lock, User, UserCheck, Building,
  GraduationCap, ArrowLeft, Loader2, BookOpen, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import authBackground from "@/assets/auth-background.jpg";

type AuthMode = "signin" | "signup";
type RoleChoice = "student" | "faculty" | null;

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  role: z.enum(["student", "faculty"], { required_error: "Please select a role" }),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [roleChoice, setRoleChoice] = useState<RoleChoice>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [signupForm, setSignupForm] = useState({
    fullName: "", email: "", role: "", username: "", password: "", confirmPassword: "",
  });

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      const validatedData = signupSchema.parse(signupForm);
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validatedData.fullName,
            username: validatedData.username,
            role: validatedData.role,
          },
        },
      });
      if (error) {
        toast({ title: "Sign Up Failed", description: error.message.includes("already registered") ? "This email is already registered. Please sign in instead." : error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Account Created!", description: "Please check your email to verify your account before signing in." });
      setMode("signin");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message; });
        setErrors(fieldErrors);
      }
    } finally { setIsLoading(false); }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      const validatedData = signinSchema.parse(signinForm);
      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });
      if (error) {
        const msg = error.message.includes("Invalid login credentials")
          ? "Invalid email or password."
          : error.message.includes("Email not confirmed")
          ? "Please verify your email first."
          : error.message;
        toast({ title: "Sign In Failed", description: msg, variant: "destructive" });
        return;
      }
      toast({ title: "Welcome Back!", description: "You've successfully signed in." });
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message; });
        setErrors(fieldErrors);
      }
    } finally { setIsLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role selection screen for sign-in
  if (mode === "signin" && !roleChoice) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={authBackground} alt="Professional setting" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 w-full max-w-lg mx-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card rounded-2xl p-8 shadow-elevated">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-medium">
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-display font-bold text-foreground">
                  PLACEMENT<span className="text-primary">IQ</span>
                </span>
              </Link>
              <h2 className="text-xl font-bold text-foreground mt-4 mb-2">Welcome! Who are you?</h2>
              <p className="text-muted-foreground text-sm">Choose your role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRoleChoice("student")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Student</span>
                <span className="text-xs text-muted-foreground text-center">Learn, practice & ace placements</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRoleChoice("faculty")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-secondary-foreground" />
                </div>
                <span className="font-bold text-foreground">Faculty</span>
                <span className="text-xs text-muted-foreground text-center">Manage students & assignments</span>
              </motion.button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold">
                Sign Up
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={authBackground} alt="Professional setting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 w-full max-w-lg mx-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {mode === "signin" ? (
            <button onClick={() => setRoleChoice(null)} className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Change Role</span>
            </button>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card rounded-2xl p-8 shadow-elevated">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-medium">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-display font-bold text-foreground">
                PLACEMENT<span className="text-primary">IQ</span>
              </span>
            </Link>
            {mode === "signin" && roleChoice && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {roleChoice === "student" ? <BookOpen className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                Signing in as {roleChoice === "student" ? "Student" : "Faculty"}
              </div>
            )}
            <p className="text-muted-foreground mt-2">
              {mode === "signin" ? "Welcome back!" : "Create your account"}
            </p>
          </div>

          {/* Auth Tabs */}
          <div className="flex rounded-xl bg-muted p-1 mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "signin" ? "bg-primary text-primary-foreground shadow-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "signup" ? "bg-primary text-primary-foreground shadow-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "signin" ? (
            <form onSubmit={handleSignin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="signin-email" type="email" placeholder="Enter your email" className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`} value={signinForm.email} onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })} required />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`} value={signinForm.password} onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>) : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{" "}
                <button type="button" onClick={() => setMode("signup")} className="text-primary hover:text-primary-light font-semibold transition-colors">Sign Up</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="fullName" placeholder="Enter your full name" className={`pl-10 h-12 ${errors.fullName ? "border-destructive" : ""}`} value={signupForm.fullName} onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })} required />
                </div>
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter your email" className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`} value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Select value={signupForm.role} onValueChange={(value) => setSignupForm({ ...signupForm, role: value })}>
                  <SelectTrigger className={`h-12 ${errors.role ? "border-destructive" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <SelectValue placeholder="Select your role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="username" placeholder="Choose a username" className={`pl-10 h-12 ${errors.username ? "border-destructive" : ""}`} value={signupForm.username} onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })} required />
                </div>
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`} value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? "border-destructive" : ""}`} value={signupForm.confirmPassword} onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>) : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("signin")} className="text-primary hover:text-primary-light font-semibold transition-colors">Sign In</button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
