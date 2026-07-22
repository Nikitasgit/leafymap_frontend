export const APP_NAME = "Leafy Map";
export const APP_PRODUCTION_URL = "https://leafymap.com";
export const APP_URL =
  process.env.NODE_ENV === "production"
    ? APP_PRODUCTION_URL
    : "http://localhost:3001";
