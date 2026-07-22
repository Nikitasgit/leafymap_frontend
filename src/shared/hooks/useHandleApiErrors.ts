import {
  parseApiValidationErrors,
} from "@/shared/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";

const useHandleApiErrors = () => {
  const { showError } = useToast();
  const { t } = useTranslation();

  const handleApiError = (
    err: unknown,
    setErrors?: (errors: Record<string, string>) => void,
    showValidationErrorsInToast: boolean = false,
  ) => {
    const validationErrors = parseApiValidationErrors(err);

    if (validationErrors) {
      if (setErrors) {
        setErrors(validationErrors as Record<string, string>);
      }

      if (showValidationErrorsInToast) {
        Object.entries(validationErrors).forEach(([field, message]) => {
          const text = Array.isArray(message) ? message.join(", ") : message;
          showError(field === "_root" ? text : `${field}: ${text}`);
        });
      }

      return;
    }

    showError(getErrorMessage(err, t));
  };

  return { handleApiError };
};

export default useHandleApiErrors;
