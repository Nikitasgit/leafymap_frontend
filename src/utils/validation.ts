/**
 * Validation functions for form fields
 */

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns error message if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) {
    return "L'email est requis";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "L'email n'est pas valide";
  }

  return null;
};

/**
 * Validates a French phone number (10 digits)
 * @param phone - The phone number to validate
 * @returns error message if invalid, null if valid
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone?.trim()) {
    return "Le téléphone est requis";
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return "Le numéro de téléphone doit contenir 10 chiffres";
  }

  return null;
};

/**
 * Validates a website URL
 * @param website - The website URL to validate
 * @returns error message if invalid, null if valid
 */
export const validateWebsite = (website: string): string | null => {
  if (!website || website.trim() === "") {
    return null;
  }
  const urlToValidate = website.replace(/^https?:\/\//, "");
  if (urlToValidate.length < 3) {
    return "L'URL du site web doit contenir au moins 3 caractères";
  }
  if (!urlToValidate.includes(".")) {
    return "L'URL du site web doit contenir un nom de domaine valide";
  }
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!domainRegex.test(urlToValidate)) {
    return "L'URL du site web n'est pas valide";
  }

  try {
    let url = website;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    new URL(url);
    return null;
  } catch {
    return "L'URL du site web n'est pas valide";
  }
};

/**
 * Validates a name (letters, numbers, spaces, and apostrophe, minimum 4 characters)
 * @param name - The name to validate
 * @returns error message if invalid, null if valid
 */
export const validateName = (name: string): string | null => {
  if (!name?.trim()) {
    return "Le nom est requis";
  }

  if (name.trim().length < 4) {
    return "Le nom doit contenir au moins 4 caractères";
  }

  const nameRegex = /^[a-zA-Z0-9\s']+$/;
  if (!nameRegex.test(name)) {
    return "Le nom ne peut contenir que des lettres, chiffres, espaces et le caractère '";
  }

  return null;
};
