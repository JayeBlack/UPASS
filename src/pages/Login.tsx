import { useState } from "react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ChevronDown } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [roleOpen, setRoleOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
    navigate("/dashboard");
  };

  const roles: UserRole[] = ["Student", "Supervisor", "Admin"];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-navy items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full border border-sidebar-foreground/20" />
          <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full border border-sidebar-foreground/20" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full border border-sidebar-foreground/10" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-8">
            <GraduationCap size={40} className="text-secondary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            PG-SIMS
          </h1>
          <p className="text-lg text-primary-foreground/70 mb-2">
            Postgraduate Administrative Support System
          </p>
          <p className="text-sm text-primary-foreground/50">
            University of Mines and Technology, Tarkwa
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { val: "250+", label: "PG Students" },
              { val: "45", label: "Supervisors" },
              { val: "30+", label: "Programs" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-gradient-gold font-display">{s.val}</p>
                <p className="text-xs text-primary-foreground/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <GraduationCap size={22} className="text-secondary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">PG-SIMS</h1>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <button
                type="button"
                onClick={() => setRoleOpen(!roleOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm hover:border-ring transition-colors"
              >
                {role}
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>
              {roleOpen && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setRoleOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${
                        r === role ? "bg-muted font-medium" : ""
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg gradient-gold text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} UMaT School of Postgraduate Studies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
