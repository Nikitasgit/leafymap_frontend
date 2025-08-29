import axios from "axios";
import { useToast } from "./useToast";

const useHandleApiErrors = () => {
  const { showError } = useToast();

  const handleApiError = (
    err: unknown,
    setErrors?: (errors: Record<string, string>) => void,
    showValidationErrorsInToast: boolean = false
  ) => {
    if (axios.isAxiosError(err) && err.response?.data) {
      if (err.response.data.data) {
        const validationErrors = err.response.data.data;

        if (setErrors) {
          setErrors(validationErrors);
        }

        if (showValidationErrorsInToast) {
          Object.values(validationErrors).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        }
      } else {
        showError(err.response.data.message);
      }
    } else {
      showError("Une erreur inattendue s'est produite");
    }
  };

  return { handleApiError };
};

export default useHandleApiErrors;
