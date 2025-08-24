"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/common/buttons/button/Button";
import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../../CreateProfileStepper.types";
import PlaceInfos from "../../../formComponents/infos/PlaceInfos";
import { InitialPlaceData } from "../../CreateProfileStepper.types";
import styles from "./ActivityFormStep.module.scss";
import { useToast } from "@/hooks/useToast";
import { Partnership } from "@/types/partnerships";
import PlaceForm from "@/components/account/formComponents/placeForm/PlaceForm";
import Partnerships from "@/components/account/formComponents/collaborators/Partnerships";
import UserInfos from "@/components/account/formComponents/infos/UserInfos";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { validateNewUserData } from "@/validations/userValidations";
import UserContactForm from "@/components/account/formComponents/contactForm/UserContactForm";
import PlaceContactForm from "@/components/account/formComponents/contactForm/PlaceContactForm";
import { ValidationResult } from "@/validations/commonValidations";
import { Location } from "@/types/common";

interface ActivityFormStepProps {
  place: InitialPlaceData;
  user: InitialCreatorData;
  partnerships?: Partnership[];
  firstStep?: boolean;
  submitButtonText?: string;
  initialPlaceLocation?: Location | null;
  onPlaceChange: FormDataChangeHandler;
  onUserChange?: FormDataChangeHandler;
  onPartnershipsChange?: (partnerships: Partnership[]) => void;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
}

const ActivityFormStep = ({
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
}: ActivityFormStepProps) => {
  const [errors, setErrors] = useState<{
    place: Record<string, string>;
    user: Record<string, string>;
  }>({ place: {}, user: {} });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { showError } = useToast();

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

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (validateFormData()) {
      await onSubmit();
    } else {
      showError("Veuillez corriger les erreurs du formulaire");
    }
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      {user.userType === "organizer" ? (
        <PlaceInfos
          place={place}
          onPlaceChange={onPlaceChange}
          errors={errors.place}
        />
      ) : (
        <UserInfos
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
        <Partnerships
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
          >
            Précédent
          </Button>
        )}
        <Button size="large" fullWidth type="submit">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;
