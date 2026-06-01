import React, { createContext, useContext, useState, useCallback } from "react";

export interface Student {
  id: string;
  name: string;
  index: string;
  email: string;
  program: string;
  department: string;
  status: "Active" | "Inactive";
}

export interface Graduand {
  name: string;
  index: string;
  program: string;
  department: string;
  cwa: number;
  year: string;
  status: string;
}

export type SystemRole =
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

export interface Supervisor {
  id: string;
  staffId: string;
  name: string;
  email: string;
  title: string;
  department: string;
  specialization?: string;
  isActive: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  department?: string;
  phone?: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  supervisorId: string;
  isPrimary: boolean;
  assignedAt: string;
}

interface DataStoreContextType {
  students: Student[];
  graduands: Graduand[];
  supervisors: Supervisor[];
  systemUsers: SystemUser[];
  assignments: Assignment[];
  addStudent: (s: Student) => void;
  addStudents: (s: Student[]) => void;
  removeStudent: (id: string) => void;
  addGraduands: (g: Graduand[]) => void;
  addSupervisor: (s: Supervisor) => void;
  toggleSupervisorActive: (id: string) => void;
  addSystemUser: (u: SystemUser) => void;
  toggleSystemUserActive: (id: string) => void;
  removeSystemUser: (id: string) => void;
  assignSupervisor: (studentId: string, supervisorId: string, isPrimary?: boolean) => void;
  unassignSupervisor: (assignmentId: string) => void;
}

// NOTE: All seed data has been removed. Lists start empty and populate from
// real records created by admins through the UI (or, in future, fetched from
// the Node/Express backend).
const initialStudents: Student[] = [];
const initialGraduands: Graduand[] = [];
const initialSupervisors: Supervisor[] = [];
const initialSystemUsers: SystemUser[] = [];
const initialAssignments: Assignment[] = [];

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

export const DataStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [graduands, setGraduands] = useState<Graduand[]>(initialGraduands);
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(initialSystemUsers);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);

  const addStudent = useCallback((s: Student) => {
    setStudents((prev) => [s, ...prev]);
  }, []);

  const addStudents = useCallback((newStudents: Student[]) => {
    setStudents((prev) => [...newStudents, ...prev]);
  }, []);

  const removeStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addGraduands = useCallback((items: Graduand[]) => {
    setGraduands((prev) => [...items, ...prev]);
  }, []);

  const addSupervisor = useCallback((s: Supervisor) => {
    setSupervisors((prev) => [s, ...prev]);
  }, []);

  const toggleSupervisorActive = useCallback((id: string) => {
    setSupervisors((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  }, []);

  const addSystemUser = useCallback((u: SystemUser) => {
    setSystemUsers((prev) => [u, ...prev]);
  }, []);

  const toggleSystemUserActive = useCallback((id: string) => {
    setSystemUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  }, []);

  const removeSystemUser = useCallback((id: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const assignSupervisor = useCallback((studentId: string, supervisorId: string, isPrimary = false) => {
    setAssignments((prev) => {
      if (prev.some((a) => a.studentId === studentId && a.supervisorId === supervisorId)) return prev;
      const next: Assignment = {
        id: `as${Date.now()}`,
        studentId,
        supervisorId,
        isPrimary,
        assignedAt: new Date().toISOString().slice(0, 10),
      };
      return [next, ...prev];
    });
  }, []);

  const unassignSupervisor = useCallback((assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  }, []);

  return (
    <DataStoreContext.Provider
      value={{
        students,
        graduands,
        supervisors,
        systemUsers,
        assignments,
        addStudent,
        addStudents,
        removeStudent,
        addGraduands,
        addSupervisor,
        toggleSupervisorActive,
        addSystemUser,
        toggleSystemUserActive,
        removeSystemUser,
        assignSupervisor,
        unassignSupervisor,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) throw new Error("useDataStore must be used within DataStoreProvider");
  return context;
};
