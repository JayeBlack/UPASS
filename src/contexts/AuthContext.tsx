import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "Student" | "Supervisor" | "Admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  program?: string;
  indexNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  Student: {
    id: "s1",
    email: "student@umat.edu.gh",
    name: "Kwame Mensah",
    role: "Student",
    department: "Computer Science",
    program: "MSc. Information Technology",
    indexNumber: "UMaT/PG/0234/22",
  },
  Supervisor: {
    id: "sup1",
    email: "supervisor@umat.edu.gh",
    name: "Dr. Abena Osei",
    role: "Supervisor",
    department: "Computer Science",
  },
  Admin: {
    id: "a1",
    email: "admin@umat.edu.gh",
    name: "Prof. Kofi Asante",
    role: "Admin",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    // Determine role from email for mock auth
    if (email.includes("admin")) {
      setUser(mockUsers.Admin);
    } else if (email.includes("supervisor") || email.includes("sup")) {
      setUser(mockUsers.Supervisor);
    } else {
      setUser(mockUsers.Student);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
