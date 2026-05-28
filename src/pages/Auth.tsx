import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2, MapPin,
  GraduationCap, ArrowLeft, ArrowRight, Loader2, BookOpen, ShieldCheck,
  Fingerprint, Sparkles, Check, Camera, ChevronRight, Quote, Bot,
  Sun, Moon, KeyRound,
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

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */
const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
  phone: z.string().trim().min(10, "Enter a valid phone").max(15),
  college: z.string().trim().min(2, "Enter college name").max(150),
  department: z.string().trim().min(2, "Select department"),
  state: z.string().trim().min(2, "Select state"),
  role: z.enum(["student", "faculty"]),
});
const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "AI/ML", "Data Science", "MBA", "Other"];
const STATES = [
  "Andhra Pradesh","Telangana","Karnataka","Tamil Nadu","Kerala","Maharashtra","Gujarat",
  "Rajasthan","Delhi","Uttar Pradesh","Madhya Pradesh","West Bengal","Odisha","Punjab",
  "Haryana","Bihar","Jharkhand","Chhattisgarh","Assam","Goa","Other",
];

const QUOTES = [
  { q: "Your dream company is one prep away.", a: "PlacementIQ" },
  { q: "Aptitude today. Offer letter tomorrow.", a: "Daily Streak" },
  { q: "Coding is the new superpower of India.", a: "Mentor AI" },
  { q: "Crack TCS, Infosys, Google — one topic at a time.", a: "Top Recruiters" },
];

/* ------------------------------------------------------------------ */
/* Floating Particles                                                  */
/* ------------------------------------------------------------------ */
const Particles = () => {
  const dots = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 10,
      delay: Math.random() * 4,
      dur: 8 + Math.random() * 10,
    })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Animated gradient background                                        */
/* ------------------------------------------------------------------ */
const AnimatedBg = ({ dark }: { dark: boolean }) => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div
      className={`absolute inset-0 transition-colors duration-700 ${
        dark
          ? "bg-[linear-gradient(135deg,#0b1020_0%,#1a1f4d_50%,#2d1b69_100%)]"
          : "bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_50%,#ec4899_100%)]"
      }`}
    />
    <motion.div
      animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-400/30 blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] rounded-full bg-cyan-400/30 blur-3xl"
    />
    <Particles />
  </div>
);

/* ------------------------------------------------------------------ */
/* Password strength                                                   */
/* ------------------------------------------------------------------ */
const usePasswordStrength = (pw: string) => {
  return useMemo(() => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const labels = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];
    const colors = ["bg-red-500","bg-orange-500","bg-amber-500","bg-lime-500","bg-emerald-500","bg-emerald-400"];
    return { score: s, label: labels[s], color: colors[s] };
  }, [pw]);
};

/* ------------------------------------------------------------------ */
/* Animated input                                                       */
/* ------------------------------------------------------------------ */
const FxInput = ({
  icon: Icon, error, right, ...props
}: any) => (
  <div className="space-y-1.5">
    <div className="relative group">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-white transition-colors" />
      <Input
        {...props}
        className={`pl-11 ${right ? "pr-11" : ""} h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-md rounded-xl focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:border-white/40 transition-all ${error ? "border-red-400" : ""}`}
      />
      {right}
      <motion.div
        layout
        className="absolute inset-0 rounded-xl pointer-events-none ring-0 group-focus-within:ring-2 ring-white/40 transition-all"
      />
    </div>
    {error && <p className="text-xs text-red-200 pl-1">{error}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main Auth                                                            */
/* ------------------------------------------------------------------ */
type Stage = "welcome" | "role" | "signin" | "signup" | "otp";

const Auth = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [role, setRole] = useState<"student" | "faculty" | null>(null);
  const [dark, setDark] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    fullName: "", email: "", password: "", phone: "",
    college: "", department: "", state: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const pwStrength = usePasswordStrength(signup.password);

  useEffect(() => { if (!loading && user) navigate("/"); }, [user, loading, navigate]);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* welcome auto-advance */
  useEffect(() => {
    if (stage === "welcome") {
      const t = setTimeout(() => setStage("role"), 2400);
      return () => clearTimeout(t);
    }
  }, [stage]);

  /* ---------------- handlers ---------------- */
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setIsLoading(true);
    try {
      const data = signinSchema.parse(signin);
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      toast({ title: "Welcome back! 🎉", description: "You're signed in." });
      navigate("/");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fe: Record<string, string> = {};
        err.errors.forEach((e) => e.path[0] && (fe[e.path[0].toString()] = e.message));
        setErrors(fe);
      } else {
        toast({ title: "Sign in failed", description: err.message, variant: "destructive" });
      }
    } finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setIsLoading(true);
    try {
      const data = signupSchema.parse({ ...signup, role: role ?? "student" });
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
            username: data.email.split("@")[0],
            role: data.role,
            phone: data.phone,
            college: data.college,
            department: data.department,
            state: data.state,
            avatar_url: avatar,
          },
        },
      });
      if (error) throw error;
      toast({ title: "Account created! ✨", description: "Check your email to verify." });
      setStage("otp");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fe: Record<string, string> = {};
        err.errors.forEach((e) => e.path[0] && (fe[e.path[0].toString()] = e.message));
        setErrors(fe);
      } else {
        toast({ title: "Sign up failed", description: err.message, variant: "destructive" });
      }
    } finally { setIsLoading(false); }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setAvatar(r.result as string);
    r.readAsDataURL(f);
  };

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  /* ---------------- views ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-6 text-white">
      <AnimatedBg dark={dark} />

      {/* Theme toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {dark ? (
            <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <Sun className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Moon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Back */}
      {stage !== "welcome" && (
        <button
          onClick={() => {
            if (stage === "signup" && signupStep > 0) setSignupStep((s) => s - 1);
            else if (stage === "role") setStage("welcome");
            else setStage("role");
          }}
          className="absolute top-5 left-5 z-30 flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* ============== WELCOME ============== */}
          {stage === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-28 h-28 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl mb-6"
              >
                <GraduationCap className="w-14 h-14 text-white" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-display font-extrabold tracking-tight"
              >
                PLACEMENT<span className="text-amber-300">IQ</span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 text-white/80 text-lg"
              >
                Your AI placement coach
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-10 flex items-center justify-center gap-2 text-white/70"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Loading your future...</span>
              </motion.div>
            </motion.div>
          )}

          {/* ============== ROLE ============== */}
          {stage === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-7 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium mb-3">
                  <Bot className="w-3.5 h-3.5" /> Hi, I'm your AI Mentor 👋
                </div>
                <h2 className="text-2xl font-bold">Who are you?</h2>
                <p className="text-white/70 text-sm mt-1">Choose your role to personalize the experience</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { id: "student", label: "Student", icon: BookOpen, desc: "Learn & crack placements", grad: "from-amber-400 to-pink-500" },
                  { id: "faculty", label: "Faculty", icon: ShieldCheck, desc: "Manage & analyze", grad: "from-cyan-400 to-indigo-500" },
                ].map((r) => (
                  <motion.button
                    key={r.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRole(r.id as any)}
                    className={`relative p-5 rounded-2xl border-2 backdrop-blur-md text-left transition-all ${
                      role === r.id ? "border-white bg-white/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {role === r.id && (
                      <motion.div
                        layoutId="rolecheck"
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.grad} flex items-center justify-center shadow-lg mb-3`}>
                      <r.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-bold">{r.label}</div>
                    <div className="text-xs text-white/70 mt-0.5">{r.desc}</div>
                  </motion.button>
                ))}
              </div>

              {/* quote */}
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-5 min-h-[78px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3"
                  >
                    <Quote className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium leading-snug">{QUOTES[quoteIdx].q}</p>
                      <p className="text-xs text-white/60 mt-1">— {QUOTES[quoteIdx].a}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Button
                disabled={!role}
                onClick={() => setStage("signin")}
                className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-bold disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <p className="text-center text-sm text-white/70 mt-4">
                New here?{" "}
                <button onClick={() => role && setStage("signup")} className="text-amber-300 font-semibold">
                  Create account
                </button>
              </p>
            </motion.div>
          )}

          {/* ============== SIGN IN ============== */}
          {stage === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-7 shadow-2xl"
            >
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold">Welcome back 👋</h2>
                <p className="text-white/70 text-sm mt-1">
                  Sign in as <span className="font-semibold text-amber-300">{role}</span>
                </p>
              </div>

              <form onSubmit={handleSignin} className="space-y-4">
                <FxInput
                  icon={Mail} type="email" placeholder="Email"
                  value={signin.email}
                  onChange={(e: any) => setSignin({ ...signin, email: e.target.value })}
                  error={errors.email}
                />
                <FxInput
                  icon={Lock} type={showPw ? "text" : "password"} placeholder="Password"
                  value={signin.password}
                  onChange={(e: any) => setSignin({ ...signin, password: e.target.value })}
                  error={errors.password}
                  right={
                    <button type="button" onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <Button type="submit" disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:opacity-90 text-white font-bold shadow-lg">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </form>

              {/* biometric */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => toast({ title: "Biometric login", description: "Use on installed mobile app." })}
                  className="w-14 h-14 rounded-full bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center"
                >
                  <Fingerprint className="w-7 h-7 text-amber-300" />
                </motion.button>
              </div>
              <p className="text-center text-xs text-white/60 mt-2">Tap to use fingerprint</p>

              {/* divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-xs text-white/60">or continue with</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl bg-white text-slate-900 font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-8.2z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.7 7.8 23 12 23z"/><path fill="#FBBC05" d="M6 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.8H2.3C1.5 8.4 1 10.1 1 12s.5 3.6 1.3 5.2L6 14.4z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.3 2.3 6.8L6 9.6c.9-2.5 3.2-4.2 6-4.2z"/></svg>
                  Google
                </button>
                <button className="h-11 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.9.8 3.1.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1-.1-2.6-1-2.6-3.7zM15.2 5.6c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"/></svg>
                  Apple
                </button>
              </div>

              <p className="text-center text-sm text-white/70 mt-5">
                Don't have an account?{" "}
                <button onClick={() => setStage("signup")} className="text-amber-300 font-semibold">
                  Sign up
                </button>
              </p>
            </motion.div>
          )}

          {/* ============== SIGN UP (multi-step) ============== */}
          {stage === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-7 shadow-2xl"
            >
              {/* progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Step {signupStep + 1} of 3</span>
                  <span>{Math.round(((signupStep + 1) / 3) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: `${((signupStep + 1) / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-pink-500"
                  />
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <AnimatePresence mode="wait">
                  {/* Step 0: profile */}
                  {signupStep === 0 && (
                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h2 className="text-2xl font-bold text-center">Tell us about you</h2>

                      {/* avatar */}
                      <div className="flex flex-col items-center">
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
                        <motion.button
                          type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => fileRef.current?.click()}
                          className="relative w-24 h-24 rounded-full bg-white/15 border-2 border-dashed border-white/40 flex items-center justify-center overflow-hidden"
                        >
                          {avatar ? (
                            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-7 h-7 text-white/70" />
                          )}
                          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white/30">
                            <Camera className="w-3.5 h-3.5 text-slate-900" />
                          </div>
                        </motion.button>
                        <p className="text-xs text-white/60 mt-2">Add profile photo</p>
                      </div>

                      <FxInput icon={User} placeholder="Full name"
                        value={signup.fullName}
                        onChange={(e: any) => setSignup({ ...signup, fullName: e.target.value })}
                        error={errors.fullName} />
                      <FxInput icon={Mail} type="email" placeholder="Email"
                        value={signup.email}
                        onChange={(e: any) => setSignup({ ...signup, email: e.target.value })}
                        error={errors.email} />
                      <FxInput icon={Phone} type="tel" placeholder="Phone number"
                        value={signup.phone}
                        onChange={(e: any) => setSignup({ ...signup, phone: e.target.value })}
                        error={errors.phone} />

                      <Button type="button" onClick={() => setSignupStep(1)}
                        className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold">
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 1: education */}
                  {signupStep === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h2 className="text-2xl font-bold text-center">Your college</h2>

                      <FxInput icon={Building2} placeholder="College name"
                        value={signup.college}
                        onChange={(e: any) => setSignup({ ...signup, college: e.target.value })}
                        error={errors.college} />

                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 z-10" />
                        <Select value={signup.department} onValueChange={(v) => setSignup({ ...signup, department: v })}>
                          <SelectTrigger className="pl-11 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.department && <p className="text-xs text-red-200 mt-1 pl-1">{errors.department}</p>}
                      </div>

                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 z-10" />
                        <Select value={signup.state} onValueChange={(v) => setSignup({ ...signup, state: v })}>
                          <SelectTrigger className="pl-11 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.state && <p className="text-xs text-red-200 mt-1 pl-1">{errors.state}</p>}
                      </div>

                      <Button type="button" onClick={() => setSignupStep(2)}
                        className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold">
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: security */}
                  {signupStep === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h2 className="text-2xl font-bold text-center">Secure your account</h2>

                      <FxInput
                        icon={Lock} type={showPw ? "text" : "password"} placeholder="Create password"
                        value={signup.password}
                        onChange={(e: any) => setSignup({ ...signup, password: e.target.value })}
                        error={errors.password}
                        right={
                          <button type="button" onClick={() => setShowPw((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        }
                      />

                      {/* strength meter */}
                      {signup.password && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[0,1,2,3,4].map((i) => (
                              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < pwStrength.score ? pwStrength.color : "bg-white/15"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-white/70">Strength: <span className="font-semibold text-white">{pwStrength.label}</span></p>
                        </div>
                      )}

                      <div className="rounded-xl bg-white/5 border border-white/15 p-3 text-xs text-white/70 space-y-1">
                        <p className="flex items-center gap-1.5"><Check className="w-3 h-3" /> 6+ characters</p>
                        <p className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Mix of letters & numbers</p>
                        <p className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Special character recommended</p>
                      </div>

                      <div className="rounded-xl bg-amber-400/15 border border-amber-300/30 p-3 flex items-center gap-2 text-xs">
                        <Bot className="w-4 h-4 text-amber-300" />
                        <span>You're all set, <b>{signup.fullName || "future placement star"}</b>! Let's crack your dream company. 🚀</span>
                      </div>

                      <Button type="submit" disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold shadow-lg">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <Sparkles className="w-4 h-4 ml-1" /></>}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <p className="text-center text-sm text-white/70 mt-5">
                Already have an account?{" "}
                <button onClick={() => setStage("signin")} className="text-amber-300 font-semibold">Sign in</button>
              </p>
            </motion.div>
          )}

          {/* ============== OTP ============== */}
          {stage === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-7 shadow-2xl text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center mb-4">
                <KeyRound className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-2xl font-bold">Verify your email</h2>
              <p className="text-white/70 text-sm mt-1">We sent a code to <b>{signup.email}</b></p>

              <div className="flex justify-center gap-2 my-6">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={v}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    maxLength={1}
                    className="w-11 h-13 py-3 rounded-xl bg-white/10 border border-white/20 text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                ))}
              </div>

              <Button className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold"
                onClick={() => { toast({ title: "Verified! ✓", description: "You can now sign in." }); setStage("signin"); }}>
                Verify
              </Button>

              <p className="text-xs text-white/60 mt-4">
                Didn't receive code? <button className="text-amber-300 font-semibold">Resend</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* footer */}
        {stage !== "welcome" && (
          <p className="text-center text-xs text-white/60 mt-6">
            By continuing you agree to our <Link to="/" className="underline">Terms</Link> & <Link to="/" className="underline">Privacy</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
