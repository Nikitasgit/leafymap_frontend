import axios, { AxiosError, isAxiosError } from "axios";

export type ApiErrorResponse = {
  message?: string;
  code?: string;
  data?: Record<string, string | string[]>;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message = getApiErrorMessage(error);
    return Promise.reject(
      Object.assign(error, {
        message,
      }),
    );
  },
);

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Une erreur inattendue s'est produite",
): string => {
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data) {
    const { message, code, data } = error.response.data;

    if (message) {
      return message;
    }

    if (code) {
      return code;
    }

    if (data) {
      const validationMessages = getApiValidationErrorMessages(error);
      if (validationMessages.length > 0) {
        return validationMessages[0];
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const parseApiValidationErrors = (
  error: unknown,
): Record<string, string | string[]> | null => {
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.data) {
    return error.response.data.data;
  }

  return null;
};

export const getApiValidationErrorMessages = (error: unknown): string[] => {
  const validationErrors = parseApiValidationErrors(error);
  if (!validationErrors) {
    return [];
  }

  const messages: string[] = [];

  Object.values(validationErrors).forEach((validationError) => {
    if (Array.isArray(validationError)) {
      validationError.forEach((message) => messages.push(message));
    } else if (typeof validationError === "string") {
      messages.push(validationError);
    }
  });

  return messages;
};

export { isAxiosError };
