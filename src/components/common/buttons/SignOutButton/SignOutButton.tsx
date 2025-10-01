"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";

function SignOutButton({ logout }: { logout: () => Promise<void> }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      Se déconnecter
    </Button>
  );
}

export default SignOutButton;
