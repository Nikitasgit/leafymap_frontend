"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "@/components/common/buttons/Button";
import PlaceForm from "@/components/account/Place/PlaceForm/PlaceForm";
import { useToast } from "@/hooks/useToast";
import { ValidationResult } from "@/validations/commonValidations";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { validateNewUserData } from "@/validations/userValidations";
import styles from "./ProfileFormStep.module.scss";
import {
  ProfileFormStepErrors,
  ProfileFormStepProps,
} from "./ProfileFormStep.types";
import { UserContactForm } from "../../ContactForm";
import { UserInfo } from "../../ProfileInfo";
import PartnershipsForm from "@/components/account/Partnership/PartnershipsForm/PartnershipsForm";

const ProfileFormStep = ({
  place,
  user,
  initialPlaceLocation,
  onPlaceChange,
  onUserChange = () => {},
  onPartnershipsChange = () => {},
  partnerships = [],
  onSubmit,
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  firstStep = false,
  showPlaceForm = true,
  showPlaceRadioYesOrNo = false,
}: ProfileFormStepProps) => {
  const { showError } = useToast();

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [errors, setErrors] = useState<ProfileFormStepErrors>({
    place: {},
    user: {},
  });
  const validateFormData = useCallback((): boolean => {
    const userValidation = validateNewUserData(user);
    let placeValidation: ValidationResult = {
      errors: {},
      isValid: true,
    };
    if (place && place.active) {
      placeValidation = validateNewPlaceData(place);
    }
    setErrors((prev) => ({
      ...prev,
      user: userValidation.errors,
      place: placeValidation.errors,
    }));
    return userValidation.isValid && placeValidation.isValid;
  }, [place, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (validateFormData()) {
      await onSubmit();
    } else {
      showError("Veuillez corriger les erreurs du formulaire");
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
        onPlaceChange={onPlaceChange}
        errors={errors.user}
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
          {Boolean(place.active) && (
            <PartnershipsForm
              onChange={onPartnershipsChange}
              partnerships={partnerships}
            />
          )}
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
            ariaLabel="Précédent"
          >
            Précédent
          </Button>
        )}
        <Button
          size="large"
          fullWidth
          type="submit"
          ariaLabel={submitButtonText}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ProfileFormStep;
