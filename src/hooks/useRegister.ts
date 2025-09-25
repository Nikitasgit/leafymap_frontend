import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";
import { useLoading } from "./useLoading";
import { validateRegisterData } from "@/validations/authValidations";
import { RegisterFormData } from "@/types/auth";

export interface RegisterState {
  formData: RegisterFormData;
  errors: { register: Record<string, string> };
  isLoading: boolean;
  hasAttemptedSubmit: boolean;
  handleInputChange: (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => void;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  validateFormData: () => boolean;
}

export const useRegister = (): RegisterState => {
  const router = useRouter();
  const { t } = useTranslation("subscription");
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const { isLoading, withLoading } = useLoading();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedCGU: false,
  });

  const [errors, setErrors] = useState<{
    register: Record<string, string>;
  }>({ register: {} });

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof RegisterFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    []
  );

  const validateFormData = useCallback((): boolean => {
    const registerValidation = validateRegisterData(formData);
    setErrors((prev) => ({
      ...prev,
      register: registerValidation.errors,
    }));
    return registerValidation.isValid;
  }, [formData]);

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setHasAttemptedSubmit(true);

      if (!validateFormData()) {
        return;
      }

      try {
        await withLoading(async () => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
              {
                email: formData.email,
                password: formData.password,
                username: formData.username,
                acceptedCGU: formData.acceptedCGU,
              }
            );
            showSuccess(t("messages.success"));
            router.push("/auth/signin");
          } catch (err: unknown) {
            handleApiError(
              err,
              (validationErrors) => {
                setErrors((prev) => ({
                  ...prev,
                  register: validationErrors,
                }));
              },
              false
            );
          }
        });
      } catch (err) {
        handleApiError(err);
      }
    },
    [
      formData,
      validateFormData,
      withLoading,
      showSuccess,
      t,
      router,
      handleApiError,
    ]
  );

  return {
    formData,
    errors,
    isLoading,
    hasAttemptedSubmit,
    handleInputChange,
    handleRegister,
    validateFormData,
  };
};
