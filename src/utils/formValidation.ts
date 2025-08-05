import { z } from "zod";
import { Location } from "@/types/common";
import {
  emailSchema,
  phoneSchema,
  websiteSchema,
  nameSchema,
  eventNameSchema,
  eventDescriptionSchema,
  eventImageSchema,
} from "./validation";
import { EventFormData } from "@/components/events/form/EventForm/EventForm";

interface BaseFormData {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  placeCategory?: string;
  location?: Location | null;
  placeType?: string[];
  placeActive?: boolean;
  userType?: string;
}

interface ValidationResult {
  errors: Record<string, string>;
  isValid: boolean;
}

/**
 * Validates a profile/activity form using Zod schemas
 * @param data - The form data to validate
 * @returns Validation result with errors and validity status
 */
export const validateForm = (data: BaseFormData): ValidationResult => {
  const isCreator = data.userType === "creator";
  const errors: Record<string, string> = {};

  try {
    // Basic validation for all user types
    const basicSchema = z.object({
      name: nameSchema.optional(),
      phone: phoneSchema.optional(),
      email: emailSchema.optional(),
      website: websiteSchema,
    });

    const basicResult = basicSchema.safeParse(data);
    if (!basicResult.success) {
      basicResult.error.errors.forEach((err) => {
        const field = err.path.join(".");
        errors[field] = err.message;
      });
    }

    // Creator-specific validation
    if (isCreator) {
      if (!data.name) {
        errors.name = "Le nom est requis";
      }
      if (!data.category) {
        errors.category = "La catégorie est requise";
      }
      if (!data.phone) {
        errors.phone = "Le téléphone est requis";
      }
      if (!data.email) {
        errors.email = "L'email est requis";
      }

      // Location and placeCategory validation for creators
      if (("placeActive" in data && data.placeActive) || !isCreator) {
        if (!data.placeCategory) {
          errors.placeCategory = "La catégorie du lieu est requise";
        }
        if (!data.location) {
          errors.location = "L'emplacement est requis";
        }
      }
    } else {
      // Non-creator validation
      if (!data.name) {
        errors.name = "Le nom est requis";
      }
      if (!data.phone) {
        errors.phone = "Le téléphone est requis";
      }
      if (!data.email) {
        errors.email = "L'email est requis";
      }
      if (!data.placeCategory) {
        errors.placeCategory = "La catégorie du lieu est requise";
      }
      if (!data.location) {
        errors.location = "L'emplacement est requis";
      }
      if (!data.placeType || data.placeType.length === 0) {
        errors.placeType = "Le type de lieu est requis";
      }
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  } catch {
    // Fallback for unexpected errors
    return {
      errors: { general: "Une erreur de validation s'est produite" },
      isValid: false,
    };
  }
};

/**
 * Validates an event form using Zod schemas
 * @param data - The event form data to validate
 * @returns Validation result with errors and validity status
 */
export const validateEventForm = (data: EventFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  try {
    // Event name validation
    const nameResult = eventNameSchema.safeParse(data.name);
    if (!nameResult.success) {
      errors.name = nameResult.error.errors[0].message;
    }

    // Event description validation
    const descriptionResult = eventDescriptionSchema.safeParse(
      data.description
    );
    if (!descriptionResult.success) {
      errors.description = descriptionResult.error.errors[0].message;
    }

    // Event image validation (optional)
    if (data.image) {
      const imageResult = eventImageSchema.safeParse(data.image);
      if (!imageResult.success) {
        errors.image = imageResult.error.errors[0].message;
      }
    }

    // Schedule validation - at least one period is required
    if (!data.schedule || data.schedule.length === 0) {
      errors.schedule = "Au moins une date est requise";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  } catch {
    // Fallback for unexpected errors
    return {
      errors: { general: "Une erreur de validation s'est produite" },
      isValid: false,
    };
  }
};
