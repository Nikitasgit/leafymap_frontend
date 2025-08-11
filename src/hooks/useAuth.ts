import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signIn, signOut } from "@/store/authSlice";
import { User } from "@/types/user";
import { useToast } from "./useToast";
import { useEffect } from "react";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const { user, loading, error } = useSelector(selectAuth);
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const login = async (identifier: string, password: string) => {
    await dispatch(signIn({ identifier, password }));
    router.push("/");
    showSuccess("Connexion réussie");
  };

  const logout = async () => {
    await dispatch(signOut());
    router.push("/auth/signin");
    showSuccess("Déconnexion réussie");
  };

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  return {
    user,
    loading,
    login,
    logout,
  };
};
