import { isAxiosError } from "axios";
import type { TFunction } from "i18next";
import type { ApiErrorResponse } from "@/lib/api/client";
import { getApiValidationErrorMessages } from "@/lib/api/client";

export function getErrorMessage(
  error: unknown,
  t: TFunction,
  fallback?: string,
): string {
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data) {
    const { code, message } = error.response.data;

    if (code) {
      const translated = t(`errors:${code}`, { defaultValue: "" });
      if (translated) {
        return translated;
      }
    }

    if (message) {
      return message;
    }

    const validationMessages = getApiValidationErrorMessages(error);
    if (validationMessages.length > 0) {
      return validationMessages[0];
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback ?? t("errors:INTERNAL_SERVER_ERROR");
}
