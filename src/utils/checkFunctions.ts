/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns boolean - True if the phone number is valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  // This regex allows for international phone numbers with optional + prefix
  // and supports various formats including spaces, dashes, and parentheses
  const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns boolean - True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  // Standard email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a website URL
 * @param website - The website URL to validate
 * @returns boolean - True if the website URL is valid, false otherwise
 */
export const isValidWebsite = (website: string): boolean => {
  // This regex validates URLs with or without http/https protocol
  const websiteRegex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return websiteRegex.test(website);
};
