"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowedUserTypes?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/auth/signin",
  allowedUserTypes,
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
    }
  }, [user, isLoading, router, redirectTo, allowedUserTypes]);

  if (isLoading) {
    return <>{fallback}</>;
  }
  
  if (
    !user ||
    (allowedUserTypes && !allowedUserTypes.includes(user.userType))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
