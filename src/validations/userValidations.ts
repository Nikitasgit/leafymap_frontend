import { z } from "zod";
import type { TFunction } from "i18next";
import { User } from "@/types/user";
import {
  ValidationResult,
  createWebsiteSchema,
  createDescriptionSchema,
  createPhoneSchema,
  createFirstnameSchema,
  createLastnameSchema,
} from "./commonValidations";

export const createUsernameSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(1, t("common.name.required"))
    .min(4, t("common.name.minLength"))
    .max(30, t("common.name.maxLength"))
    .regex(/^[a-zA-ZÀ-ÿ0-9\s']+$/, t("common.name.invalidChars"));

const createUserCategorySchema = (t: TFunction<"validation">) =>
  z.string().min(1, t("user.category.required"));

const createNewCreatorSchema = (t: TFunction<"validation">) =>
  z.object({
    userType: z.literal("creator"),
    username: createUsernameSchema(t),
    userCategory: createUserCategorySchema(t),
    description: createDescriptionSchema(t),
    website: createWebsiteSchema(t).optional(),
    phone: createPhoneSchema(t).optional(),
    firstname: createFirstnameSchema(t),
    lastname: createLastnameSchema(t),
  });

export const createValidateNewUserData =
  (t: TFunction<"validation">) =>
  (data: Partial<User>): ValidationResult => {
    const errors: Record<string, string> = {};

    let result;
    if (data.userType === "creator") {
      result = createNewCreatorSchema(t).safeParse(data);
    }
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

export const createValidateLegalNameFields =
  (t: TFunction<"validation">) =>
  (data: {
    firstname?: string;
    lastname?: string;
  }): ValidationResult => {
    const errors: Record<string, string> = {};
    const fn = data.firstname?.trim() ?? "";
    const ln = data.lastname?.trim() ?? "";
    if (fn) {
      const r = createFirstnameSchema(t).safeParse(fn);
      if (!r.success && r.error.issues[0]) {
        errors.firstname = r.error.issues[0].message;
      }
    }
    if (ln) {
      const r = createLastnameSchema(t).safeParse(ln);
      if (!r.success && r.error.issues[0]) {
        errors.lastname = r.error.issues[0].message;
      }
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };

export const usernameSchema = createUsernameSchema;
export const validateNewUserData = createValidateNewUserData;
export const validateLegalNameFields = createValidateLegalNameFields;
