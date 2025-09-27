"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/common/buttons/button/Button";
import { useToast } from "@/hooks/useToast";
import { Partnership } from "@/types/partnerships";
import PlaceForm from "@/components/account/Place/PlaceForm/PlaceForm";
import Partnerships from "@/components/account/PartnershipsForm/PartnershipsForm";
import { validateNewPlaceData } from "@/validations/placeValidations";
import PlaceContactForm from "@/components/account/FormComponents/ContactForm/PlaceContactForm";
import { ValidationResult } from "@/validations/commonValidations";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "../account/CreateProfileStepper/CreateProfileStepper.types";
import { defaultSchedule } from "@/utils/createProfile";
import { User } from "@/types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PlaceInfos from "../account/FormComponents/ProfileInfo/PlaceInfo";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import styles from "./CreatePlaceForm.module.scss";
import { useRouter } from "next/navigation";

const initialPlaceData = (user: Partial<User> | null): InitialPlaceData => ({
  name: "",
  description: "",
  location: null,
  defaultSchedule: defaultSchedule,
  placeCategory: "",
  phone: user?.phone || "",
  email: user?.email || "",
  website: user?.website || "",
  placeType: [],
  active: true,
});
const CreatePlaceForm = () => {
  const [errors, setErrors] = useState<{
    place: Record<string, string>;
  }>({ place: {} });
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(user));
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  const validateFormData = useCallback((): boolean => {
    let placeValidation: ValidationResult = {
      errors: {},
      isValid: true,
    };
    placeValidation = validateNewPlaceData(place, "organizer");

    setErrors((prev) => ({
      ...prev,
      place: placeValidation.errors,
    }));
    return placeValidation.isValid;
  }, [place]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (validateFormData()) {
      try {
        const placeId = await submitPlace(place);
        if (partnerships.length > 0 && placeId) {
          await submitPartnerships(partnerships, false, placeId);
        }
        showSuccess("Lieu créé avec succès");
        router.push("/account");
      } catch {
        showError("Erreur lors de la création du lieu");
      }
    } else {
      showError("Veuillez corriger les erreurs du formulaire");
    }
  };
  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      setPlace(initialPlaceData(user));
    }
  }, [user]);

  const loading =
    userLoading || submitPartnershipsLoading || submitPlaceLoading;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PlaceInfos
        place={place}
        onPlaceChange={onPlaceChange}
        errors={errors.place}
      />
      <PlaceForm
        place={place}
        initialPlaceLocation={null}
        userType="organizer"
        onChange={onPlaceChange}
        errors={errors.place}
      />
      <Partnerships onChange={setPartnerships} partnerships={partnerships} />
      <PlaceContactForm
        place={place}
        onPlaceChange={onPlaceChange}
        errors={errors.place}
      />
      <div className={styles.buttonContainer}>
        <Button
          type="button"
          fullWidth
          size="large"
          variant="secondary"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" fullWidth size="large" disabled={loading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default CreatePlaceForm;
