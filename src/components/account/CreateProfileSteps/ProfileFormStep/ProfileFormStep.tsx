"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "@/components/common/buttons/Button";
import PlaceForm from "@/components/account/Place/PlaceForm";
import { useToast } from "@/hooks/useToast";
import { ValidationResult } from "@/validations/commonValidations";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { validateNewUserData } from "@/validations/userValidations";
import { useTranslation } from "react-i18next";
import styles from "./ProfileFormStep.module.scss";
import {
  ProfileFormStepErrors,
  ProfileFormStepProps,
} from "./ProfileFormStep.types";
import { UserContactForm } from "../../ContactForm";
import { UserInfo } from "../../ProfileInfo";
import { validationT } from "@/utils/i18n/validationT";

const ProfileFormStep = ({
  place,
  user,
  initialPlaceLocation,
  onPlaceChange,
  onUserChange = () => {},
  onSubmit,
  onBack = () => {},
  submitButtonText,
  firstStep = false,
  showPlaceForm = true,
  showPlaceRadioYesOrNo = false,
  hideUserLegalName = false,
}: ProfileFormStepProps) => {
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState<ProfileFormStepErrors>({
    place: {},
    user: {},
  });
  const validateFormData = useCallback((): boolean => {
    const userValidation = validateNewUserData(validationT(t))(user);
    let placeValidation: ValidationResult = {
      errors: {},
      isValid: true,
    };
    if (place && place.active) {
      placeValidation = validateNewPlaceData(validationT(t))(place);
    }
    setErrors((prev) => ({
      ...prev,
      user: userValidation.errors,
      place: placeValidation.errors,
    }));
    return userValidation.isValid && placeValidation.isValid;
  }, [place, user, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (validateFormData()) {
      await onSubmit();
    } else {
      showError(t("profileFormStep.validationError"));
    }
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <UserInfo
        user={user}
        onUserChange={onUserChange}
        errors={errors.user}
        showLegalName={!hideUserLegalName}
      />
      {showPlaceForm && place && (
        <>
          <PlaceForm
            place={place}
            initialPlaceLocation={initialPlaceLocation}
            username={user.username}
            onChange={onPlaceChange}
            errors={errors.place}
            showRadioYesOrNo={showPlaceRadioYesOrNo}
          />
        </>
      )}
      <UserContactForm
        user={user}
        onUserChange={onUserChange}
        errors={errors.user}
      />

      <div className={styles.buttonContainer}>
        {!firstStep && (
          <Button
            size="large"
            variant="secondary"
            type="button"
            onClick={onBack}
            fullWidth
            ariaLabel={t("profileFormStep.previousAriaLabel")}
          >
            {t("common:actions.previous")}
          </Button>
        )}
        <Button
          size="large"
          fullWidth
          type="submit"
          ariaLabel={submitButtonText ?? t("profileFormStep.submitButton")}
        >
          {submitButtonText ?? t("profileFormStep.submitButton")}
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormStep;
