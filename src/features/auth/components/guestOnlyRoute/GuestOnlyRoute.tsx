"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useAuth } from "../../hooks/useAuth";
import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";

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
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSessionChecked(true);
    }
  }, [loading]);

  useEffect(() => {
    if (sessionChecked && user) {
      router.replace(getAuthenticatedRedirectPath(user));
    }
  }, [sessionChecked, user, router]);

  if (!sessionChecked) {
    return <>{fallback}</>;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
