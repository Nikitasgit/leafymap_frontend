"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Button from "./button/Button";

function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
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
