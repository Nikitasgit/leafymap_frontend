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
} from "../utils/validation";
import { EventFormData } from "@/components/events/form/EventForm/EventForm";
import { Place } from "@/types/place";
import { Partnership } from "@/types/partnerships";
import { BaseProfileFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";

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
 * Validates place data with a specific key prefix
 * @param data - The place data to validate
 * @param keyPrefix - The prefix to add to error keys (e.g., "place.")
 * @returns Validation result with errors and validity status
 */
export const validatePlaceData = (
  data: Partial<Place>,
  keyPrefix: string = ""
): ValidationResult => {
  const errors: Record<string, string> = {};

  try {
    const placeSchema = z.object({
      name: nameSchema,
      description: z.string().min(1, "La description est requise").optional(),
      phone: phoneSchema.optional(),
      email: emailSchema.optional(),
      website: websiteSchema,
      placeCategory: z
        .string()
        .min(1, "La catégorie du lieu est requise")
        .optional(),
      location: z
        .object({
          id: z.string(),
          label: z.string(),
          coordinates: z.tuple([z.number(), z.number()]),
          type: z.literal("Point"),
        })
        .optional(),
      placeType: z
        .array(z.string())
        .min(1, "Le type de lieu est requis")
        .optional(),
    });

    const result = placeSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path.join(".");
        const key = keyPrefix ? `${keyPrefix}.${field}` : field;
        errors[key] = err.message;
      });
    }

    // Additional business logic validation
    if (!data.name) {
      const key = keyPrefix ? `${keyPrefix}.name` : "name";
      errors[key] = "Le nom est requis";
    }

    if (!data.placeCategory) {
      const key = keyPrefix ? `${keyPrefix}.placeCategory` : "placeCategory";
      errors[key] = "La catégorie du lieu est requise";
    }

    if (!data.location) {
      const key = keyPrefix ? `${keyPrefix}.location` : "location";
      errors[key] = "L'emplacement est requis";
    }

    if (!data.placeType || data.placeType.length === 0) {
      const key = keyPrefix ? `${keyPrefix}.placeType` : "placeType";
      errors[key] = "Le type de lieu est requis";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  } catch {
    return {
      errors: {
        [keyPrefix ? `${keyPrefix}.general` : "general"]:
          "Une erreur de validation s'est produite",
      },
      isValid: false,
    };
  }
};

/**
 * Validates user data with a specific key prefix
 * @param data - The user data to validate
 * @param keyPrefix - The prefix to add to error keys (e.g., "user.")
 * @returns Validation result with errors and validity status
 */
export const validateUserData = (
  data: Partial<BaseProfileFormData>,
  keyPrefix: string = ""
): ValidationResult => {
  const errors: Record<string, string> = {};

  try {
    // Basic user validation
    const userSchema = z.object({
      userType: z
        .string()
        .min(1, "Le type d'utilisateur est requis")
        .optional(),
      name: nameSchema.optional(),
      description: z.string().min(1, "La description est requise").optional(),
      categories: z
        .array(z.string())
        .min(1, "Au moins une catégorie est requise")
        .optional(),
      phone: phoneSchema.optional(),
      email: emailSchema.optional(),
      website: websiteSchema,
    });

    const result = userSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path.join(".");
        const key = keyPrefix ? `${keyPrefix}.${field}` : field;
        errors[key] = err.message;
      });
    }

    // Additional business logic validation
    if (!data.userType) {
      const key = keyPrefix ? `${keyPrefix}.userType` : "userType";
      errors[key] = "Le type d'utilisateur est requis";
    }

    if (!data.name) {
      const key = keyPrefix ? `${keyPrefix}.name` : "name";
      errors[key] = "Le nom est requis";
    }

    if (!data.phone) {
      const key = keyPrefix ? `${keyPrefix}.phone` : "phone";
      errors[key] = "Le téléphone est requis";
    }

    if (!data.email) {
      const key = keyPrefix ? `${keyPrefix}.email` : "email";
      errors[key] = "L'email est requis";
    }

    if (!data.categories || data.categories.length === 0) {
      const key = keyPrefix ? `${keyPrefix}.categories` : "categories";
      errors[key] = "Au moins une catégorie est requise";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  } catch {
    return {
      errors: {
        [keyPrefix ? `${keyPrefix}.general` : "general"]:
          "Une erreur de validation s'est produite",
      },
      isValid: false,
    };
  }
};

/**
 * Validates partnerships data with a specific key prefix
 * @param data - The partnerships array to validate
 * @param keyPrefix - The prefix to add to error keys (e.g., "partnerships.")
 * @returns Validation result with errors and validity status
 */
export const validatePartnershipsData = (
  data: Partnership[],
  keyPrefix: string = ""
): ValidationResult => {
  const errors: Record<string, string> = {};

  try {
    // Validate each partnership in the array
    data.forEach((partnership, index) => {
      const partnershipSchema = z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Le nom du partenariat est requis"),
        description: z
          .string()
          .min(1, "La description du partenariat est requise"),
        website: websiteSchema,
        phone: phoneSchema.optional(),
        email: emailSchema.optional(),
      });

      const result = partnershipSchema.safeParse(partnership);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const field = err.path.join(".");
          const key = keyPrefix
            ? `${keyPrefix}.${index}.${field}`
            : `${index}.${field}`;
          errors[key] = err.message;
        });
      }
    });

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  } catch {
    return {
      errors: {
        [keyPrefix ? `${keyPrefix}.general` : "general"]:
          "Une erreur de validation s'est produite",
      },
      isValid: false,
    };
  }
};

/**
 * Validates a profile/activity form using Zod schemas
 * @param data - The form data to validate
 * @returns Validation result with errors and validity status
 */
export const validatePlace = (data: BaseFormData): ValidationResult => {
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
