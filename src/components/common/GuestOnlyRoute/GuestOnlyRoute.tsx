"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useAuth } from "@/hooks/useAuth";
import { getAuthenticatedRedirectPath } from "@/utils/auth";

type GuestOnlyRouteProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

const GuestOnlyRoute = ({
  children,
  fallback = <LoadingBar />,
}: GuestOnlyRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(getAuthenticatedRedirectPath(user));
    }
  }, [loading, router, user]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
