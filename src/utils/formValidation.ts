import { Location } from "@/types/common";
import {
  validateEmail,
  validatePhone,
  validateWebsite,
  validateName,
} from "./validation";

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
 * Validates a profile/activity form
 * @param data - The form data to validate
 * @returns Validation result with errors and validity status
 */
export const validateForm = (data: BaseFormData): ValidationResult => {
  const isCreator = data.userType === "creator";
  const newErrors: Record<string, string> = {};
  console.log(data);

  const nameError: string | null = validateName(data.name || "");
  if (nameError) {
    newErrors.name = nameError;
  }

  if (isCreator && "category" in data && !data.category) {
    newErrors.category = "La catégorie est requise";
  }

  const phoneError: string | null = validatePhone(data.phone || "");
  if (phoneError) {
    newErrors.phone = phoneError;
  }

  const emailError: string | null = validateEmail(data.email || "");
  if (emailError) {
    newErrors.email = emailError;
  }

  if (data.website && data.website.trim() !== "") {
    const websiteError: string | null = validateWebsite(data.website);
    if (websiteError) {
      newErrors.website = websiteError;
    }
  }

  if (("placeActive" in data && data.placeActive && isCreator) || !isCreator) {
    if (!data.placeCategory) {
      newErrors.placeCategory = "La catégorie du lieu est requise";
    }
    if (!data.location) {
      newErrors.location = "L'emplacement est requis";
    }
  }

  if (!isCreator && "placeType" in data && data.placeType?.length === 0) {
    newErrors.placeType = "Le type de lieu est requis";
  }

  return {
    errors: newErrors,
    isValid: Object.keys(newErrors).length === 0,
  };
};
