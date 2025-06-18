"use client";

import axios from "axios";
import { useAppDispatch } from "@/store";
import { signOut } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import Button from "./button/Button";

function SignOutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
      dispatch(signOut());
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return <Button onClick={handleSignOut}>Se déconnecter</Button>;
}

export default SignOutButton;
