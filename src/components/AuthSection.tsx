import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, UserCheck, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup";

export const AuthSection = () => {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    role: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [signinForm, setSigninForm] = useState({
    email: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Account Created!",
      description: "Welcome to PlacementIQ. Start your preparation journey!",
    });
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome Back!",
      description: "You've successfully signed in.",
    });
  };

  return (
    <section
      id="auth"
      className="py-20 lg:py-28 bg-muted relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.08)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Join <span className="text-primary">PlacementIQ</span> Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your account and start your journey to placement success
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-elevated p-6 lg:p-8 border border-border">
            {/* Auth Tabs */}
            <div className="flex rounded-xl bg-muted p-1 mb-8">
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === "signin"
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
            </div>

            {mode === "signup" ? (
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      className="pl-10 h-12"
                      value={signupForm.fullName}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email / Register Number
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email or register number"
                      className="pl-10 h-12"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">
                    Role
                  </Label>
                  <Select
                    value={signupForm.role}
                    onValueChange={(value) =>
                      setSignupForm({ ...signupForm, role: value })
                    }
                  >
                    <SelectTrigger className="h-12">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    Username
                  </Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      className="pl-10 h-12"
                      value={signupForm.username}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, username: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Create Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-12"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full mt-6"
                >
                  Create Account
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">
                    Email / Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      placeholder="Enter your email or username"
                      className="pl-10 h-12"
                      value={signinForm.email}
                      onChange={(e) =>
                        setSigninForm({ ...signinForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12"
                      value={signinForm.password}
                      onChange={(e) =>
                        setSigninForm({ ...signinForm, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full mt-4"
                >
                  Sign In
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
