import { useDispatch, useSelector } from "react-redux";
import { selectAuth, signIn, signOut } from "@/store/authSlice";
import { User } from "@/types/user";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
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
  const { showSuccess, showError } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const login = async (identifier: string, password: string) => {
    try {
      await dispatch(signIn({ identifier, password })).unwrap();
      showSuccess("Connexion réussie");
      router.push("/");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        showError(error.message);
      } else {
        showError("Une erreur inattendue s'est produite");
      }
    }
  };

  const logout = async () => {
    try {
      await dispatch(signOut()).unwrap();
      router.push("/auth/signin");
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
