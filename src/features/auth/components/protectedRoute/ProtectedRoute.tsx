"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { UserRole } from "@/features/users/types";

const ACCEPT_CGU_PATH = "/auth/accept-cgu";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowedUserTypes?: string[];
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/auth/signin",
  allowedUserTypes,
  allowedRoles,
  fallback = <LoadingBar />,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }
      if (user.acceptedCGU === false) {
        router.push(ACCEPT_CGU_PATH);
        return;
      }
      if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
        router.push(redirectTo);
        return;
      }
      if (allowedRoles && !allowedRoles.includes(user.role || "user")) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, loading, router, redirectTo, allowedUserTypes, allowedRoles]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (
    !user ||
    user.acceptedCGU === false ||
    (allowedUserTypes && !allowedUserTypes.includes(user.userType)) ||
    (allowedRoles && !allowedRoles.includes(user.role || "user"))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
