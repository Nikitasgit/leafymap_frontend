"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlace } from "@/hooks/usePlace";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { defaultSchedule } from "@/utils/createProfile";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import styles from "./UpdatePlaceContainer.module.scss";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { Partnership } from "@/types/partnerships";
import { useToast } from "@/hooks/useToast";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { separateNewAndUpdatedArrayValues } from "@/utils/tempId";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Button from "@/components/common/buttons/Button";
import PlaceForm from "@/components/account/Place/PlaceForm/PlaceForm";
import PartnershipsForm from "@/components/account/Partnership/PartnershipsForm/PartnershipsForm";
import { ValidationResult } from "@/validations/commonValidations";
import { validateNewPlaceData } from "@/validations/placeValidations";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialPlaceData = (place: InitialPlaceData): InitialPlaceData => ({
  name: place?.name || "",
  description: place?.description || "",
  location: place?.location || null,
  defaultSchedule: place?.defaultSchedule || defaultSchedule,
  placeCategory:
    typeof place?.placeCategory === "string"
      ? place.placeCategory
      : place?.placeCategory?._id || "",
  phone: place?.phone || "",
  email: place?.email || "",
  website: place?.website || "",
  placeType: place?.placeType || [],
  active: true,
});

const UpdatePlaceContainer = () => {
  const params = useParams();
  const placeId = params.placeId as string;
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const { place: placeData, isLoading: placeLoading } = usePlace(placeId);
  const { partnerships: partnershipsData, isLoading: partnershipsLoading } =
    usePlacePartnerships(placeId);
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();
  const [place, setPlace] = useState<InitialPlaceData | null>(null);
  const [partnerships, setPartnerships] = useState<Partnership[]>(
    partnershipsData || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { showError, showSuccess } = useToast();
  const router = useRouter();

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const validateFormData = useCallback((): boolean => {
    if (!place) return false;
    const placeValidation: ValidationResult = validateNewPlaceData(place);
    setErrors(placeValidation.errors);
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

    if (!validateFormData()) {
      showError("Veuillez corriger les erreurs du formulaire");
      return;
    }

    try {
      if (placeData && place) {
        const id = placeData._id;
        await submitPlace(place, true, id);
        if (partnerships.length > 0) {
          const { newValues, updatedValues } =
            separateNewAndUpdatedArrayValues(partnerships);
          if (newValues.length > 0) {
            await submitPartnerships(newValues, false, id);
          }
          if (updatedValues.length > 0) {
            await submitPartnerships(updatedValues, true, id);
          }
        }
        showSuccess("Lieu modifié avec succès");
        router.push("/account");
      }
    } catch {
      showError("Erreur lors de la modification du lieu");
    }
  };

  useEffect(() => {
    if (placeData) setPlace(initialPlaceData(placeData));
    if (partnershipsData) setPartnerships(partnershipsData);
  }, [placeData, partnershipsData]);

  const loading =
    placeLoading ||
    submitPlaceLoading ||
    partnershipsLoading ||
    submitPartnershipsLoading ||
    userLoading;

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier votre lieu" showBackButton={true} />
        {loading || !place || !user ? (
          <LoadingBar />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <PlaceForm
              place={place}
              username={user.username}
              initialPlaceLocation={place.location}
              onChange={onPlaceChange}
              errors={errors}
              showRadioYesOrNo={false}
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
                disabled={loading}
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
        )}
      </section>
    </div>
  );
};

export default UpdatePlaceContainer;
