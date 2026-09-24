"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTwoFactorChallenge,
  fetchCurrentUser,
  selectAuth,
  signIn,
  signInWithGoogle,
  signOut,
  verifyTwoFactor,
} from "../model/authSlice";
import { useToast } from "@/shared/hooks/useToast";
import useHandleApiErrors from "@/shared/hooks/useHandleApiErrors";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
export interface AuthState {
  user: ReturnType<typeof selectAuth>["user"];
  loading: boolean;
  twoFactorChallengeToken: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  completeTwoFactorLogin: (code: string) => Promise<void>;
  cancelTwoFactorLogin: () => void;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const { user, loading, twoFactorChallengeToken } = useSelector(selectAuth);
  const { showSuccess, showError } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const finishAuthenticatedSession = async (successMessage: string) => {
    const currentUser = await dispatch(fetchCurrentUser()).unwrap();
    if (!currentUser) {
      return;
    }
    showSuccess(successMessage);
    router.push(getAuthenticatedRedirectPath(currentUser));
  };

  const login = async (identifier: string, password: string) => {
    try {
      const result = await dispatch(
        signIn({ identifier, password }),
      ).unwrap();
      if (result.twoFactorRequired) {
        return;
      }
      if (result.user) {
        await finishAuthenticatedSession(t("useAuth.loginSuccess"));
      }
    } catch (error: unknown) {
      showError(getErrorMessage(error, t));
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const data = await dispatch(signInWithGoogle(idToken)).unwrap();
      if (data.twoFactorRequired) {
        return;
      }
      if (data.user) {
        await finishAuthenticatedSession(
          data.mergedUnverifiedAccount
            ? t("useAuth.googleMergedAccount")
            : t("useAuth.loginSuccess"),
        );
      }
    } catch (error: unknown) {
      showError(
        getErrorMessage(error, t, t("useAuth.googleLoginError")),
      );
    }
  };

  const completeTwoFactorLogin = async (code: string) => {
    if (!twoFactorChallengeToken) return;
    try {
      await dispatch(
        verifyTwoFactor({
          challengeToken: twoFactorChallengeToken,
          code,
        }),
      ).unwrap();
      await finishAuthenticatedSession(t("useAuth.loginSuccess"));
    } catch (error: unknown) {
      showError(getErrorMessage(error, t));
    }
  };

  const cancelTwoFactorLogin = () => {
    dispatch(clearTwoFactorChallenge());
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
    twoFactorChallengeToken,
    login,
    loginWithGoogle,
    completeTwoFactorLogin,
    cancelTwoFactorLogin,
    logout,
  };
};
