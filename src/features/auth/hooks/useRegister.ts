"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useToast } from "@/shared/hooks/useToast";
import useHandleApiErrors from "@/shared/hooks/useHandleApiErrors";
import { useLoading } from "@/shared/hooks/useLoading";
import { validateRegisterData } from "../validations/authValidations";
import { RegisterFormData } from "../types";
import { validationT } from "@/shared/utils/i18n/validationT";
import { authApi } from "../api/authApi";

export interface RegisterState {
  formData: RegisterFormData;
  errors: { register: Record<string, string> };
  isLoading: boolean;
  hasAttemptedSubmit: boolean;
  handleInputChange: (
    field: keyof RegisterFormData,
    value: string | boolean,
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
    email: "",
    password: "",
    confirmPassword: "",
    acceptedCGU: false,
    emailNotifications: false,
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
    [],
  );

  const validateFormData = useCallback((): boolean => {
    const registerValidation = validateRegisterData(validationT(t))(formData);
    setErrors((prev) => ({
      ...prev,
      register: registerValidation.errors,
    }));
    return registerValidation.isValid;
  }, [formData, t]);

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
            await authApi.register({
              email: formData.email,
              password: formData.password,
              acceptedCGU: formData.acceptedCGU,
              emailNotifications: formData.emailNotifications,
            });
            showSuccess(t("messages.success"));
            router.push("/auth/check-email");
          } catch (err: unknown) {
            handleApiError(
              err,
              (validationErrors) => {
                setErrors((prev) => ({
                  ...prev,
                  register: validationErrors,
                }));
              },
              false,
            );
          }
        });
      } catch (err) {
        handleApiError(err);
      }
    },
    [
      formData,
      router,
      t,
      handleApiError,
      validateFormData,
      withLoading,
      showSuccess,
    ],
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
