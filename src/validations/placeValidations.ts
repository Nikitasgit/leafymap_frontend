import { Place } from "@/types/place";
import { z } from "zod";
import type { TFunction } from "i18next";
import { ValidationResult } from "./commonValidations";

export const createPlaceCategorySchema = (t: TFunction<"validation">) =>
  z.string().min(1, t("place.category.required"));

export const createLocationSchema = () =>
  z.object({
    id: z.string(),
    label: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
    type: z.literal("Point"),
  });

export const createPlaceFormSchema = (t: TFunction<"validation">) =>
  z
    .object({
      placeCategory: createPlaceCategorySchema(t),
      location: createLocationSchema().nullable(),
      active: z.boolean(),
    })
    .passthrough()
    .superRefine((data, ctx) => {
      if (!data.location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("place.address.required"),
          path: ["location"],
        });
      }
    });

export const createValidateNewPlaceData =
  (t: TFunction<"validation">) =>
  (data: Partial<Place>): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createPlaceFormSchema(t).safeParse(data);
    if (!result.success && result.error?.issues) {
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

export const placeFormSchema = createPlaceFormSchema;
export const placeCategorySchema = createPlaceCategorySchema;
export const locationSchema = createLocationSchema;
export const validateNewPlaceData = createValidateNewPlaceData;
