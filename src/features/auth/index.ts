// Public API of the auth feature — import from "@/features/auth" only.

// Components
export { default as SigninForm } from "./components/signinForm";
export { default as RegisterForm } from "./components/registerForm";
export { default as ForgotPasswordForm } from "./components/forgotPasswordForm";
export { default as ResetPasswordForm } from "./components/resetPasswordForm";
export { default as ResendVerificationForm } from "./components/resendVerificationForm";
export { default as AccountConsentForm } from "./components/accountConsentForm";
export { default as CheckEmailMessage } from "./components/checkEmailMessage";
export { default as VerifyEmailHandler } from "./components/verifyEmailHandler";
export { default as ProtectedRoute } from "./components/protectedRoute";
export { default as GuestOnlyRoute } from "./components/guestOnlyRoute";

// Hooks
export { useAuth } from "./hooks/useAuth";
export type { AuthState } from "./hooks/useAuth";
export { useRegister } from "./hooks/useRegister";
export type { RegisterState } from "./hooks/useRegister";
export { usePasswordReset } from "./hooks/usePasswordReset";
export { useCurrentUser } from "./hooks/useCurrentUser";

// Model (slice actions / selectors — needed by store & other slices)
export {
  default as authReducer,
  fetchCurrentUser,
  signIn,
  signInWithGoogle,
  signOut,
  selectAuth,
} from "./model/authSlice";

// Types
export type { RegisterFormData, LoginFormData } from "./types";

// Utils
export { getAuthenticatedRedirectPath } from "./utils/authRedirect";

// Validations (used by forms outside the feature if needed)
export {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  validateRegisterData,
  validateLoginData,
  validateRequestPasswordResetData,
  validateResetPasswordData,
} from "./validations/authValidations";
