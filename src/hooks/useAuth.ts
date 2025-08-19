import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signIn, signOut } from "@/store/authSlice";
import { User } from "@/types/user";
import { useToast } from "./useToast";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const { user, loading } = useSelector(selectAuth);
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const login = async (identifier: string, password: string) => {
    try {
      await dispatch(signIn({ identifier, password })).unwrap();
      showSuccess("Connexion réussie");
      router.push("/");
    } catch {
      showError("Échec de connexion");
    }
  };

  const logout = async () => {
    try {
      await dispatch(signOut()).unwrap();
      router.push("/auth/signin");
    } catch {
      showError("Échec de déconnexion");
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
