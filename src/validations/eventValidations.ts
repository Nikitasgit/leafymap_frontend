import { z } from "zod";
import { descriptionSchema, ValidationResult } from "./commonValidations";
import { initialEventData } from "@/components/account/Event/EventForm/EventForm.types";

export const eventNameSchema = z
  .string()
  .min(1, "Le nom est requis")
  .min(4, "Le nom doit contenir au moins 4 caractères")
  .max(40, "Le nom ne peut pas dépasser 40 caractères")
  .regex(
    /^[a-zA-ZÀ-ÿ0-9\s']+$/,
    "Le nom ne peut contenir que des lettres, chiffres, espaces et le caractère '"
  );

const locationSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
  type: z.literal("Point"),
});

const eventSchema = z
  .object({
  name: eventNameSchema,
  description: descriptionSchema,
  eventCategory: z.string().min(1, "La catégorie est requise"),
  image: z.string().optional(),
  place: z.string().optional().nullable(),
  location: locationSchema.optional().nullable(),
  online: z.boolean().optional(),
  schedule: z
    .array(
      z.object({
        startDate: z.string(),
        endDate: z.string().optional(),
        timeSlots: z
          .array(
            z.object({
              startTime: z.string(),
              endTime: z.string(),
              title: z.string(),
              collaborators: z
                .array(
                  z.object({
                    _id: z.string(),
                  })
                )
                .optional(),
            })
          )
          .optional(),
      })
    )
    .min(1, "Le programme doit contenir au moins une date"),
})
  .superRefine((data, ctx) => {
    if (data.online) return;

    if (!data.place && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Un lieu ou une adresse est requis pour un évènement présentiel",
      });
    }
  });

export const validateEventData = (data: initialEventData): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = eventSchema.safeParse(data);

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
