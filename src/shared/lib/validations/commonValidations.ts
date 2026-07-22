import { z } from "zod";
import type { TFunction } from "i18next";

export interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

export const createPhoneSchema = (t: TFunction<"validation">) =>
  z.string().refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return /^[0-9]{10}$/.test(val);
    },
    {
      message: t("common.phone.tenDigits"),
    },
  );

export const createEmailSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(1, t("common.email.required"))
    .email(t("common.email.invalid"));

export const createWebsiteSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const urlToValidate = val.replace(/^https?:\/\//, "");
        if (urlToValidate.length < 3) return false;
        if (!urlToValidate.includes(".")) return false;
        const domainRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!domainRegex.test(urlToValidate)) return false;
        try {
          let url = val;
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
          }
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: t("common.website.invalidUrl"),
      },
    );

export const createDescriptionSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(10, t("common.description.minLength"))
    .max(300, t("common.description.maxLength"));

export const createFirstnameSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .trim()
    .min(1, t("common.firstname.required"))
    .max(50, t("common.firstname.maxLength"))
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, t("common.firstname.invalidChars"));

export const createLastnameSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .trim()
    .min(1, t("common.lastname.required"))
    .max(50, t("common.lastname.maxLength"))
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, t("common.lastname.invalidChars"));

// Legacy exports for gradual migration — use create* factories in new code
export const phoneSchema = z.string();
export const emailSchema = z.string();
export const websiteSchema = z.string().optional();
export const descriptionSchema = z.string();
export const firstnameSchema = z.string();
export const lastnameSchema = z.string();
