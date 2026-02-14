import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  signIn,
  signInWithGoogle,
  signOut,
  fetchCurrentUser,
} from "@/store/authSlice";
import { User } from "@/types/user";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
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
      await dispatch(fetchCurrentUser()).unwrap();
      showSuccess("Connexion réussie");
      router.push("/account");
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

  const loginWithGoogle = async (idToken: string) => {
    try {
      const data = await dispatch(signInWithGoogle(idToken)).unwrap();
      const user = data.user;
      await dispatch(fetchCurrentUser()).unwrap();
      if (data.mergedUnverifiedAccount) {
        showSuccess(
          "Nous avons détecté un compte email existant non vérifié et l'avons lié automatiquement à votre compte Google.",
        );
      } else {
        showSuccess("Connexion réussie");
      }
      if (user?.acceptedCGU === false) {
        router.push("/auth/accept-cgu");
      } else {
        router.push("/account");
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        showError(error.message);
      } else {
        showError("Une erreur s'est produite avec la connexion Google");
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
    loginWithGoogle,
    logout,
  };
};
