import { useAuthStore } from "@/store/useAuthStore";

export const useMenuPermission = () => {
  const listPermission = useAuthStore((state) => state.listPermission) || [];

  console.log("Current Permissions:", listPermission); // Debugging: Log permissions to console

  const hasAccess = (permission) => {
    return listPermission.includes(permission);
  };

  return { hasAccess };
};