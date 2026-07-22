import { z } from "zod";
import type { TFunction } from "i18next";
import {
  createDescriptionSchema,
  ValidationResult,
} from "@/shared/lib/validations/commonValidations";
import { initialEventData } from "../components/eventForm/EventForm.types";

export const createEventNameSchema = (t: TFunction<"validation">) =>
  z
    .string()
    .min(1, t("event.name.required"))
    .min(4, t("event.name.minLength"))
    .max(40, t("event.name.maxLength"))
    .regex(/^[a-zA-ZÀ-ÿ0-9\s']+$/, t("event.name.invalidChars"));

const createLocationSchema = () =>
  z.object({
    id: z.string().optional(),
    label: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
    type: z.literal("Point"),
  });

export const createEventSchema = (t: TFunction<"validation">) =>
  z
    .object({
      name: createEventNameSchema(t),
      description: createDescriptionSchema(t),
      eventCategory: z.string().min(1, t("event.category.required")),
      image: z.string().optional(),
      place: z.string().optional().nullable(),
      location: createLocationSchema().optional().nullable(),
      online: z.boolean().optional(),
      isBookable: z.boolean().optional(),
      capacity: z.string().optional(),
      maxSeatsPerBooking: z.string().optional(),
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
                        id: z.string(),
                      }),
                    )
                    .optional(),
                }),
              )
              .optional(),
          }),
        )
        .min(1, t("event.schedule.minDates")),
    })
    .superRefine((data, ctx) => {
      if (!data.online) {
        if (!data.place && !data.location) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["location"],
            message: t("event.location.required"),
          });
        }
      }

      if (!data.isBookable) return;

      const capacity =
        data.capacity && data.capacity.trim() !== ""
          ? Number(data.capacity)
          : null;
      const maxSeatsPerBooking = Number(data.maxSeatsPerBooking);

      if (
        data.capacity &&
        (!Number.isInteger(capacity) || (capacity as number) < 1)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["capacity"],
          message: t("event.capacity.positiveInteger"),
        });
      }

      if (!Number.isInteger(maxSeatsPerBooking) || maxSeatsPerBooking < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxSeatsPerBooking"],
          message: t("event.maxSeatsPerBooking.positive"),
        });
      } else if (
        capacity !== null &&
        Number.isInteger(capacity) &&
        maxSeatsPerBooking > capacity
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxSeatsPerBooking"],
          message: t("event.maxSeatsPerBooking.exceedsCapacity"),
        });
      }
    });

export const createValidateEventData =
  (t: TFunction<"validation">) =>
  (data: initialEventData): ValidationResult => {
    const errors: Record<string, string> = {};
    const result = createEventSchema(t).safeParse(data);

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

export const validateEventData = createValidateEventData;
export const eventSchema = createEventSchema;
export const eventNameSchema = createEventNameSchema;
