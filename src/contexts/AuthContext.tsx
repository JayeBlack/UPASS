import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const AUTH_STORAGE_KEY = "umat_sps_auth_user";

export type UserRole =
  | "Student"
  | "Supervisor"
  | "Admin"
  | "Dean"
  | "ViceDean"
  | "Registrar"
  | "AdminAssistant"
  | "Accountant"
  | "AccountingAssistant"
  | "ExamsOfficer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  program?: string;
  indexNumber?: string;
  avatarUrl?: string;
  isSuperAdmin?: boolean;
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Mock user resolver ----------
// Any password is accepted. Role + profile are derived from the email.
const titleCase = (s: string) =>
  s.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();

const resolveMockUser = (rawEmail: string): User => {
  const email = rawEmail.trim().toLowerCase();
  const local = email.split("@")[0] || "user";

  // Super Admin
  if (local === "superadmin" || local.startsWith("superadmin")) {
    return {
      id: `u-${local}`,
      email,
      name: "Super Administrator",
      role: "Admin",
      isSuperAdmin: true,
    };
  }

  // Departmental Admins: admin.cs, admin.mining, admin.electrical, admin.mechanical, ...
  if (local.startsWith("admin.") || local === "admin") {
    const deptKey = local.replace(/^admin\.?/, "");
    const deptMap: Record<string, string> = {
      cs: "Computer Science and Engineering",
      mining: "Mining Engineering",
      electrical: "Electrical and Electronic Engineering",
      mechanical: "Mechanical Engineering",
    };
    return {
      id: `u-${local}`,
      email,
      name: deptKey ? `${titleCase(deptKey)} Admin` : "Department Admin",
      role: "Admin",
      department: deptMap[deptKey] || (deptKey ? titleCase(deptKey) : undefined),
    };
  }

  // Role-by-keyword
  const byKeyword: Array<[RegExp, UserRole, string?]> = [
    [/^supervisor/, "Supervisor"],
    [/^dean/, "Dean"],
    [/^vicedean|^vice\.dean/, "ViceDean"],
    [/^registrar/, "Registrar"],
    [/^accountant/, "Accountant"],
    [/^accounting\.?assistant/, "AccountingAssistant"],
    [/^admin\.?assistant/, "AdminAssistant"],
    [/^exams?\.?officer|^exams?/, "ExamsOfficer"],
    [/^student/, "Student"],
  ];
  for (const [re, role] of byKeyword) {
    if (re.test(local)) {
      return {
        id: `u-${local}`,
        email,
        name: titleCase(local),
        role,
        ...(role === "Student"
          ? {
              indexNumber: "UMaT/PG/0001/24",
              program: "MPhil Computer Science",
              department: "Computer Science and Engineering",
            }
          : role === "Supervisor"
          ? { department: "Computer Science and Engineering" }
          : {}),
      };
    }
  }

  // Default: treat as student
  return {
    id: `u-${local}`,
    email,
    name: titleCase(local),
    role: "Student",
    indexNumber: "UMaT/PG/0001/24",
    program: "MPhil Computer Science",
    department: "Computer Science and Engineering",
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, [user]);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock: any password accepted; role + profile derived from email.
    if (!email) throw new Error("Email required");
    setUser(resolveMockUser(email));
  }, []);

  const changePassword = useCallback(async (_oldPassword: string, _newPassword: string) => {
    // Mock: no real password store. Clear the must-change flag.
    setUser((u) => (u ? { ...u, mustChangePassword: false } : u));
  }, []);

  const refresh = useCallback(async () => {
    // No-op in mock mode (user is restored from localStorage on mount).
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { window.localStorage.removeItem(AUTH_STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, changePassword, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
