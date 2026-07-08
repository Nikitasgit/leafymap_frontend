"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { UserRole } from "@/types/user";

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
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
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
  }, [user, isLoading, router, redirectTo, allowedUserTypes, allowedRoles]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (
    !user ||
    (allowedUserTypes && !allowedUserTypes.includes(user.userType)) ||
    (allowedRoles && !allowedRoles.includes(user.role || "user"))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
