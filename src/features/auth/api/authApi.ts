import { apiClient, request } from "@/shared/api/client";
import type { User } from "@/features/users/types";

export type SignInCredentials = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  acceptedCGU: boolean;
  emailNotifications: boolean;
};

export type AcceptCguPayload = {
  emailNotifications: boolean;
};

export type GoogleSignInResult = {
  user: User;
  isNewUser?: boolean;
  mergedAccount?: boolean;
  mergedUnverifiedAccount?: boolean;
};

export const authApi = {
  getMe: async (): Promise<User> => {
    const data = await request<{ user: User }>({
      method: "GET",
      url: "/api/auth/me",
    });
    return data.user;
  },

  signIn: async ({
    identifier,
    password,
  }: SignInCredentials): Promise<User> => {
    const data = await request<{ user: User }>({
      method: "POST",
      url: "/api/auth/signin",
      data: { identifier, password },
    });
    return data.user;
  },

  signInWithGoogle: async (idToken: string): Promise<GoogleSignInResult> => {
    return request<GoogleSignInResult>({
      method: "POST",
      url: "/api/auth/google",
      data: { id_token: idToken },
    });
  },

  signOut: async () => {
    await request<void>({ method: "POST", url: "/api/auth/signout" });
  },

  register: async (payload: RegisterPayload) => {
    // Register returns the full envelope body, not only `.data.data`
    const response = await apiClient.post("/api/auth/register", payload);
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    await request<void>({
      method: "POST",
      url: "/api/auth/forgot-password",
      data: { email },
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    await request<void>({
      method: "POST",
      url: "/api/auth/reset-password",
      data: { token, newPassword },
    });
  },

  verifyEmail: async (token: string) => {
    await request<void>({
      method: "GET",
      url: "/api/auth/verify-email",
      params: { token },
    });
  },

  resendVerificationEmail: async (email: string) => {
    await request<void>({
      method: "POST",
      url: "/api/auth/resend-verification-email",
      data: { email },
    });
  },

  acceptCgu: async (payload: AcceptCguPayload) => {
    await request<void>({
      method: "PATCH",
      url: "/api/auth/accept-cgu",
      data: payload,
    });
  },
};
