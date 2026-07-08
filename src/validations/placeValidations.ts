import { Place } from "@/types/place";
import { z } from "zod";
import { ValidationResult } from "./commonValidations";

export const placeCategorySchema = z
  .string()
  .min(1, "La catégorie du lieu est requise");

export const locationSchema = z.object({
  id: z.string(),
  label: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  type: z.literal("Point"),
});

export const placeTypeSchema = z
  .array(z.string().min(1, "Le type de lieu est requis"))
  .min(1, "Le type de lieu est requis");

const newPlaceSchema = z.object({
  placeCategory: placeCategorySchema,
  placeType: placeTypeSchema,
  location: locationSchema,
  active: z.boolean(),
});

export const validateNewPlaceData = (
  data: Partial<Place>
): ValidationResult => {
  const errors: Record<string, string> = {};
  const placeSchema = newPlaceSchema;
  const result = placeSchema.safeParse(data);
  if (!result.success && result.error?.issues) {
    result.error.issues.forEach((err) => {
      const field = err.path.join(".");
      errors[field] = err.message;
    });
  }

  if (!data.location) {
    errors.location = "L'adresse du lieu est obligatoire";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
