import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that returns admin department context.
 * - Departmental admins: locked to their department, no filter shown
 * - Super admin: sees all departments with a filter dropdown
 */
export const useAdminDepartment = () => {
  const { user } = useAuth();
  // Super admin and Dean both get global access with department filters
  const isSuperAdmin = user?.isSuperAdmin === true || user?.role === "Dean";
  const adminDepartment = isSuperAdmin ? undefined : user?.department;

  return { isSuperAdmin, adminDepartment, user };
};
