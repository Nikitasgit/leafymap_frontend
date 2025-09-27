"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "@/components/common/buttons/button/Button";
import PlaceForm from "@/components/account/Place/PlaceForm/PlaceForm";
import PartnershipsForm from "@/components/account/FormComponents/PartnershipsForm/PartnershipsForm";
import { UserInfo } from "@/components/account/FormComponents/ProfileInfo";
import { UserContactForm } from "@/components/account/FormComponents/ContactForm";
import { PlaceContactForm } from "@/components/account/FormComponents/ContactForm";
import { PlaceInfo } from "@/components/account/FormComponents/ProfileInfo";
import { useToast } from "@/hooks/useToast";
import { ValidationResult } from "@/validations/commonValidations";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { validateNewUserData } from "@/validations/userValidations";
import styles from "./ProfileFormStep.module.scss";
import {
  ProfileFormStepErrors,
  ProfileFormStepProps,
} from "./ProfileFormStep.types";

const ProfileFormStep = ({
  place,
  user,
  partnerships = [],
  initialPlaceLocation,
  onPlaceChange,
  onUserChange = () => {},
  onPartnershipsChange = () => {},
  onSubmit,
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  firstStep = false,
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
    if (place.active) {
      placeValidation = validateNewPlaceData(place, user.userType);
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
      {user.userType === "organizer" ? (
        <PlaceInfo
          place={place}
          onPlaceChange={onPlaceChange}
          errors={errors.place}
        />
      ) : (
        <UserInfo
          user={user}
          onUserChange={onUserChange}
          onPlaceChange={onPlaceChange}
          errors={errors.user}
        />
      )}
      <PlaceForm
        place={place}
        initialPlaceLocation={initialPlaceLocation}
        creatorName={user.creatorName}
        userType={user.userType}
        onChange={onPlaceChange}
        errors={errors.place}
      />
      {user.userType === "organizer" && (
        <PartnershipsForm
          onChange={onPartnershipsChange}
          partnerships={partnerships}
        />
      )}
      {user.userType === "creator" ? (
        <UserContactForm
          user={user}
          onUserChange={onUserChange}
          errors={errors.user}
        />
      ) : (
        <PlaceContactForm
          place={place}
          onPlaceChange={onPlaceChange}
          errors={errors.place}
        />
      )}

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
