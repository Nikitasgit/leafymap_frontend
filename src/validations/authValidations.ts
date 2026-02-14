import { z } from "zod";
import { emailSchema, ValidationResult } from "./commonValidations";
import { RegisterFormData, LoginFormData } from "@/types/auth";

const isDev = () => process.env.NODE_ENV === "development";

const passwordSchema = z
  .string()
  .min(10, "Le mot de passe doit contenir au moins 10 caractères")
  .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
  );

const devPasswordSchema = z.string().min(1, "Le mot de passe est requis");

export const registerSchema = z
  .object({
    email: emailSchema,
    password: isDev() ? devPasswordSchema : passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
    acceptedCGU: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les Conditions Générales d'Utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const validateRegisterData = (
  data: RegisterFormData
): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = registerSchema.safeParse(data);
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

const identifierSchema = z
  .string()
  .min(1, "L'identifiant est requis")
  .refine(
    (val) => {
      const emailResult = emailSchema.safeParse(val);
      if (emailResult.success) return true;

      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      return usernameRegex.test(val);
    },
    {
      message:
        "L'identifiant doit être un email valide ou un nom d'utilisateur valide (3-30 caractères, lettres, chiffres, tirets et underscores uniquement)",
    }
  );
export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});
export const validateLoginData = (data: LoginFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = loginSchema.safeParse(data);
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

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export interface RequestPasswordResetFormData {
  email: string;
}

export const validateRequestPasswordResetData = (
  data: RequestPasswordResetFormData
): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = requestPasswordResetSchema.safeParse(data);
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

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Le token est requis"),
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const validateResetPasswordData = (
  data: ResetPasswordFormData
): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = resetPasswordSchema.safeParse(data);
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
