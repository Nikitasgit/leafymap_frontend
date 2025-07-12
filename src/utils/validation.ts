import { z } from "zod";

/**
 * Zod schemas for form field validation
 */

export const emailSchema = z
  .string()
  .min(1, "L'email est requis")
  .email("L'email n'est pas valide");

export const phoneSchema = z
  .string()
  .min(1, "Le téléphone est requis")
  .regex(/^[0-9]{10}$/, "Le numéro de téléphone doit contenir 10 chiffres");

export const websiteSchema = z
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
      message: "L'URL du site web n'est pas valide",
    }
  );

export const nameSchema = z
  .string()
  .min(1, "Le nom est requis")
  .min(4, "Le nom doit contenir au moins 4 caractères")
  .max(40, "Le nom ne peut pas dépasser 40 caractères")
  .regex(
    /^[a-zA-ZÀ-ÿ0-9\s']+$/,
    "Le nom ne peut contenir que des lettres, chiffres, espaces et le caractère '"
  );

/**
 * Validation functions that use Zod schemas
 */

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns error message if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.errors[0].message;
};

/**
 * Validates a French phone number (10 digits)
 * @param phone - The phone number to validate
 * @returns error message if invalid, null if valid
 */
export const validatePhone = (phone: string): string | null => {
  const result = phoneSchema.safeParse(phone);
  return result.success ? null : result.error.errors[0].message;
};

/**
 * Validates a website URL
 * @param website - The website URL to validate
 * @returns error message if invalid, null if valid
 */
export const validateWebsite = (website: string): string | null => {
  const result = websiteSchema.safeParse(website);
  return result.success ? null : result.error.errors[0].message;
};

/**
 * Validates a name (letters, numbers, spaces, and apostrophe, minimum 4 characters)
 * @param name - The name to validate
 * @returns error message if invalid, null if valid
 */
export const validateName = (name: string): string | null => {
  const result = nameSchema.safeParse(name);
  return result.success ? null : result.error.errors[0].message;
};
