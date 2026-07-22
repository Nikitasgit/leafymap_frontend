import { z } from "zod";
import type { TFunction } from "i18next";
import {
  createEmailSchema,
  ValidationResult,
} from "@/shared/lib/validations/commonValidations";
import { RegisterFormData, LoginFormData } from "../types";

const isDev = () => process.env.NODE_ENV === "development";

export const createPasswordSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(10, t("auth.password.minLength"))
    .max(100, t("auth.password.maxLength"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t("auth.password.complexity"),
    );

export const createDevPasswordSchema = (t: TFunction<"validation">) =>
  z.string().min(1, t("auth.password.required"));

export const createRegisterSchema = (t: TFunction<"validation">) => {
  const passwordSchema = isDev()
    ? createDevPasswordSchema(t)
    : createPasswordSchema(t);

  return z
    .object({
      email: createEmailSchema(t),
      password: passwordSchema,
      confirmPassword: z
        .string()
        .min(1, t("auth.passwordConfirm.required")),
      acceptedCGU: z.boolean().refine((val) => val === true, {
        message: t("auth.cgu.required"),
      }),
      emailNotifications: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.passwordConfirm.mismatch"),
      path: ["confirmPassword"],
    });
};

export const createValidateRegisterData =
  (t: TFunction<"validation">) =>
  (data: RegisterFormData): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createRegisterSchema(t).safeParse(data);
    if (result && !result.success && result.error?.issues) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

export const createIdentifierSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(1, t("auth.identifier.required"))
    .refine(
      (val) => {
        const emailResult = createEmailSchema(t).safeParse(val);
        if (emailResult.success) return true;
        const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
        return usernameRegex.test(val);
      },
      {
        message: t("auth.identifier.invalid"),
      },
    );

export const createLoginSchema = (t: TFunction<"validation">) =>
  z.object({
    identifier: createIdentifierSchema(t),
    password: z.string().min(1, t("auth.password.required")),
  });

export const createValidateLoginData =
  (t: TFunction<"validation">) =>
  (data: LoginFormData): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createLoginSchema(t).safeParse(data);
    if (result && !result.success && result.error?.issues) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

export const createRequestPasswordResetSchema = (t: TFunction<"validation">) =>
  z.object({
    email: createEmailSchema(t),
  });

export interface RequestPasswordResetFormData {
  email: string;
}

export const createValidateRequestPasswordResetData =
  (t: TFunction<"validation">) =>
  (data: RequestPasswordResetFormData): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createRequestPasswordResetSchema(t).safeParse(data);
    if (result && !result.success && result.error?.issues) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

export const createResetPasswordSchema = (t: TFunction<"validation">) =>
  z
    .object({
      token: z.string().min(1, t("auth.token.required")),
      newPassword: createPasswordSchema(t),
      confirmPassword: z
        .string()
        .min(1, t("auth.passwordConfirm.required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.passwordConfirm.mismatch"),
      path: ["confirmPassword"],
    });

export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const createValidateResetPasswordData =
  (t: TFunction<"validation">) =>
  (data: ResetPasswordFormData): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createResetPasswordSchema(t).safeParse(data);
    if (result && !result.success && result.error?.issues) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

// Convenience aliases used by form components with useMemo
export const loginSchema = createLoginSchema;
export const registerSchema = createRegisterSchema;
export const requestPasswordResetSchema = createRequestPasswordResetSchema;
export const resetPasswordSchema = createResetPasswordSchema;
export const validateRegisterData = createValidateRegisterData;
export const validateLoginData = createValidateLoginData;
export const validateRequestPasswordResetData =
  createValidateRequestPasswordResetData;
export const validateResetPasswordData = createValidateResetPasswordData;
