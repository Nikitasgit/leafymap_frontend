"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button/Button";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  onBackHandler,
  onNextHandler,
} from "../../CreateProfileStepper.types";
import PlaceInfos from "../../../formComponents/infos/PlaceInfos";
import { InitialPlaceData } from "../../CreateProfileStepper.types";
import ContactForm from "../../../formComponents/contactForm/ContactForm";
import styles from "./ActivityFormStep.module.scss";
import { useToast } from "@/hooks/useToast";
import {
  validatePlaceData,
  validateUserData,
  validatePartnershipsData,
} from "@/utils/formValidation";
import { Partnership } from "@/types/partnerships";
import PlaceForm from "@/components/account/formComponents/placeForm/PlaceForm";
import Partnerships from "@/components/account/formComponents/collaborators/Partnerships";
import UserInfos from "@/components/account/formComponents/infos/UserInfos";

interface ActivityFormStepProps {
  place: InitialPlaceData;
  user: InitialCreatorData;
  partnerships: Partnership[];
  firstStep: boolean;
  submitButtonText?: string;
  onPlaceChange: FormDataChangeHandler;
  onUserChange: FormDataChangeHandler;
  onPartnershipsChange: (partnerships: Partnership[]) => void;
  onSubmit: () => Promise<void>;
  onNext?: onNextHandler;
  onBack?: onBackHandler;
}

const ActivityFormStep = ({
  place,
  user,
  partnerships,
  onPlaceChange,
  onUserChange,
  onPartnershipsChange,
  onSubmit,
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  firstStep = false,
}: ActivityFormStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { showError } = useToast();

  const validateFormData = (): boolean => {
    const placeValidation = validatePlaceData(place, "place");
    const userValidation = validateUserData(user, "user");
    const partnershipsValidation = validatePartnershipsData(
      partnerships,
      "partnerships"
    );

    const allErrors = {
      ...placeValidation.errors,
      ...userValidation.errors,
      ...partnershipsValidation.errors,
    };

    setErrors(allErrors);

    return (
      placeValidation.isValid &&
      userValidation.isValid &&
      partnershipsValidation.isValid
    );
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [place, user, partnerships, hasAttemptedSubmit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasAttemptedSubmit(true);

    if (validateFormData()) {
      await onSubmit();
    } else {
      Object.keys(errors).forEach((key) => {
        showError(errors[key]);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {user.userType === "organizer" ? (
        <PlaceInfos
          place={place}
          onPlaceChange={onPlaceChange}
          errors={errors}
        />
      ) : (
        <UserInfos user={user} onUserChange={onUserChange} errors={errors} />
      )}
      <PlaceForm
        place={place}
        userType={user.userType}
        onChange={onPlaceChange}
        errors={errors}
      />
      {user.userType === "organizer" && (
        <Partnerships
          onChange={onPartnershipsChange}
          partnerships={partnerships}
        />
      )}
      <ContactForm
        user={user}
        place={place}
        onUserChange={onUserChange}
        onPlaceChange={onPlaceChange}
        errors={errors}
      />
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
