import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import umatLogo from "@/assets/umat-logo.png";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) {
    return <Navigate to={user.mustChangePassword ? "/change-password" : "/dashboard"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing credentials", description: "Enter your email and password", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      // Navigation handled by the redirect above on next render
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Sign in failed";
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <SEO
        title="Sign in — UMaT Postgraduate Portal"
        description="Sign in to the UMaT School of Postgraduate Studies portal for students, supervisors and staff."
      />

      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 gradient-navy items-center justify-center p-12 relative overflow-hidden">
        {/* Layered decorative rings */}
        <div className="absolute top-16 left-16 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute top-24 left-24 w-64 h-64 rounded-full border border-white/[0.06]" />
        <div className="absolute bottom-20 right-12 w-56 h-56 rounded-full border border-white/10" />
        <div className="absolute bottom-28 right-20 w-40 h-40 rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-white/[0.04]" />
        {/* Faint watermark logo bottom-right */}
        <img src={umatLogo} alt="" aria-hidden="true" className="absolute bottom-8 right-8 w-40 opacity-[0.06] pointer-events-none select-none" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl ring-1 ring-white/20">
            <img src={umatLogo} alt="UMaT Logo" className="w-16 h-auto" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary-foreground mb-3 leading-tight">
            Postgraduate Administrative Support System
          </h1>
          <div className="w-12 h-0.5 bg-secondary/60 mx-auto my-4 rounded-full" />
          <p className="text-sm text-primary-foreground/70 font-medium">University of Mines and Technology</p>
          <p className="text-xs text-primary-foreground/40 mt-1">Tarkwa, Ghana</p>
          <p className="text-xs text-secondary/70 mt-4 italic tracking-wide">Knowledge · Truth · Excellence</p>
        </div>
      </div>

      {/* Right panel / Mobile full-screen */}
      <main className="flex-1 relative flex items-center justify-center p-6 lg:p-8 overflow-hidden">

        {/* Mobile background — navy gradient + decorative rings, hidden on desktop */}
        <div className="lg:hidden absolute inset-0 gradient-navy">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full border border-white/20" />
            <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full border border-white/20" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-white/10" />
          </div>
          {/* Watermark logo */}
          <img
            src={umatLogo}
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 opacity-[0.04] pointer-events-none select-none"
          />
        </div>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-md">

          {/* Mobile branding above card */}
          <div className="lg:hidden text-center mb-8">
            <img src={umatLogo} alt="UMaT Logo" className="w-16 h-auto mx-auto mb-3 drop-shadow-lg" />
            <p className="font-display text-base font-bold text-primary-foreground leading-snug">
              Postgraduate Administrative Support System
            </p>
            <p className="text-xs text-primary-foreground/60 mt-1">
              University of Mines and Technology, Tarkwa
            </p>
          </div>

          {/* Card */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border shadow-2xl p-7 lg:p-0 lg:bg-transparent lg:border-0 lg:shadow-none lg:backdrop-blur-none">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@umat.edu.gh"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg gradient-gold text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} UMaT School of Postgraduate Studies
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
