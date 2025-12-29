"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/buttons/Button";
import PlaceForm from "@/components/account/Place/PlaceForm";
import PartnershipsForm from "../../Partnership/PartnershipsForm";
import { useToast } from "@/hooks/useToast";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { Partnership } from "@/types/partnerships";
import { User } from "@/types/user";
import { ValidationResult } from "@/validations/commonValidations";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { defaultSchedule } from "@/utils/createProfile";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "../../CreateProfileStepper";
import styles from "./CreatePlaceContainer.module.scss";
import { CreatePlaceContainerErrors } from "./CreatePlaceContainer.types";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";

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
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { user, loading: userLoading } = useAuth();
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const [errors, setErrors] = useState<CreatePlaceContainerErrors>({
    place: {},
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(user));
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);

  const validateFormData = useCallback((): boolean => {
    let placeValidation: ValidationResult = {
      errors: {},
      isValid: true,
    };
    placeValidation = validateNewPlaceData(place);

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
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title="Créer un lieu" showBackButton={true} />
        <form onSubmit={handleSubmit} noValidate>
          <PlaceForm
            place={place}
            initialPlaceLocation={null}
            username={user?.username || ""}
            onChange={onPlaceChange}
            errors={errors.place}
          />
          <PartnershipsForm
            onChange={setPartnerships}
            partnerships={partnerships}
          />
          <div className={styles.buttonContainer}>
            <Button
              type="button"
              fullWidth
              size="large"
              variant="secondary"
              onClick={() => router.back()}
              ariaLabel="Annuler"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              ariaLabel="Enregistrer"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreatePlaceForm;
