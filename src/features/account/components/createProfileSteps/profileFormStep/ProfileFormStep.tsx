"use client";
import { useMemo, useState } from "react";
import Button from "@/shared/ui/buttons/button";
import PlaceForm from "@/features/places/components/placeForm";
import { useToast } from "@/shared/hooks/useToast";
import { validateNewPlaceData } from "@/features/places/validations/placeValidations";
import { validateNewUserData } from "@/features/users/validations/userValidations";
import { useTranslation } from "react-i18next";
import styles from "./ProfileFormStep.module.scss";
import {
  ProfileFormStepErrors,
  ProfileFormStepProps,
} from "./ProfileFormStep.types";
import { UserContactForm } from "../../contactForm";
import { UserInfo } from "../../profileInfo";
import { validationT } from "@/shared/utils/i18n/validationT";

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

  const errors = useMemo<ProfileFormStepErrors>(() => {
    if (!hasAttemptedSubmit) {
      return { place: {}, user: {} };
    }

    const userValidation = validateNewUserData(validationT(t))(user);
    const placeValidation =
      place && place.active
        ? validateNewPlaceData(validationT(t))(place)
        : { errors: {}, isValid: true };

    return {
      user: userValidation.errors,
      place: placeValidation.errors,
    };
  }, [hasAttemptedSubmit, place, user, t]);

  const isFormValid = useMemo(() => {
    const userValidation = validateNewUserData(validationT(t))(user);
    const placeValidation =
      place && place.active
        ? validateNewPlaceData(validationT(t))(place)
        : { errors: {}, isValid: true };
    return userValidation.isValid && placeValidation.isValid;
  }, [place, user, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (isFormValid) {
      await onSubmit();
    } else {
      showError(t("profileFormStep.validationError"));
    }
  };

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
