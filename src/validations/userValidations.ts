import { z } from "zod";
import { User } from "@/types/user";
import {
  ValidationResult,
  websiteSchema,
  descriptionSchema,
} from "./commonValidations";

export const creatorNameSchema = z
  .string()
  .min(1, "Le nom est requis")
  .min(4, "Le nom doit contenir au moins 4 caractères")
  .max(30, "Le nom ne peut pas dépasser 30 caractères")
  .regex(
    /^[a-zA-ZÀ-ÿ0-9\s']+$/,
    "Le nom ne peut contenir que des lettres, chiffres, espaces et le caractère '"
  );

const userCategoriesSchema = z
  .array(z.string())
  .min(1, "Veuillez sélectionner une catégorie");

const newCreatorSchema = z.object({
  userType: z.literal("creator"),
  creatorName: creatorNameSchema,
  userCategories: userCategoriesSchema,
  description: descriptionSchema,
  website: websiteSchema.optional(),
});

const newOrganizerSchema = z.object({
  userType: z.literal("organizer"),
});

export const validateNewUserData = (data: Partial<User>): ValidationResult => {
  const errors: Record<string, string> = {};

  let result;
  if (data.userType === "creator") {
    result = newCreatorSchema.safeParse(data);
  } else if (data.userType === "organizer") {
    result = newOrganizerSchema.safeParse(data);
  }
  if (result && !result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path.join(".");
      errors[field] = err.message;
    });
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
