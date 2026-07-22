"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Button from "../button";

function SignOutButton({ logout }: { logout: () => Promise<void> }) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      router.push("/auth/signin");
      await logout();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      {t("nav.signout")}
    </Button>
  );
}

export default SignOutButton;
