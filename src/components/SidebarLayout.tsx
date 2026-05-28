import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Home,
  BookOpen,
  Brain,
  Code,
  Trophy,
  LayoutDashboard,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Zap,
  ShieldCheck,
  StickyNote,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  authRequired?: boolean;
  facultyOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "AI Mentor", href: "/mentor", icon: Sparkles },
  { label: "Programming", href: "/programming", icon: Code },
  { label: "All-in-One Test", href: "/all-in-one-test", icon: MonitorPlay, authRequired: true },
  { label: "Mistakes", href: "/mistakes", icon: StickyNote, authRequired: true },
  { label: "Leaderboard", href: "/leaderboard", icon: Users, authRequired: true },
  { label: "Smart Tools", href: "/smart-tools", icon: Zap },
  { label: "Achievements", href: "/achievements", icon: Award, authRequired: true },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, authRequired: true },
];

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isFaculty, setIsFaculty] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsFaculty(false);
      return;
    }
    supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setIsFaculty(data?.role === "faculty"));
  }, [user]);

  const allNav = [
    ...navItems,
    ...(isFaculty
      ? [{ label: "Faculty", href: "/faculty", icon: ShieldCheck, authRequired: true, facultyOnly: true }]
      : []),
  ];

  const filteredNav = allNav.filter(
    (item) => !item.authRequired || user
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "relative flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out z-40",
          collapsed ? "w-[4.5rem]" : "w-[16rem]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-display font-bold text-foreground whitespace-nowrap"
            >
              PLACEMENT<span className="text-primary">IQ</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {filteredNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-[1.125rem] h-[1.125rem] shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
                {active && !collapsed && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: User + Logout */}
        <div className="shrink-0 border-t border-border p-3 space-y-2">
          {user && (
            <>
              {!collapsed && (
                <div className="flex items-center gap-2 px-2 pb-1">
                  <StreakBadge />
                </div>
              )}
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50",
                  collapsed && "justify-center px-2"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isFaculty ? "Faculty" : "Student"}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-[1.125rem] h-[1.125rem] shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </Button>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
