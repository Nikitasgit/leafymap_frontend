import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  signIn,
  signInWithGoogle,
  signOut,
} from "@/store/authSlice";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { getAuthenticatedRedirectPath } from "@/utils/auth";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export interface AuthState {
  user: ReturnType<typeof selectAuth>["user"];
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
  const { t } = useTranslation("auth");

  const login = async (identifier: string, password: string) => {
    try {
      const signedInUser = await dispatch(
        signIn({ identifier, password }),
      ).unwrap();
      showSuccess(t("useAuth.loginSuccess"));
      router.push(getAuthenticatedRedirectPath(signedInUser));
    } catch (error: unknown) {
      showError(getErrorMessage(error, t));
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const data = await dispatch(signInWithGoogle(idToken)).unwrap();
      if (data.mergedUnverifiedAccount) {
        showSuccess(t("useAuth.googleMergedAccount"));
      } else {
        showSuccess(t("useAuth.loginSuccess"));
      }
      router.push(getAuthenticatedRedirectPath(data.user));
    } catch (error: unknown) {
      showError(
        getErrorMessage(error, t, t("useAuth.googleLoginError")),
      );
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
