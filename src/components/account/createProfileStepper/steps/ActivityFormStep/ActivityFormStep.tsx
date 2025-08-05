"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button/Button";
import {
  FormDataChangeHandler,
  onBackHandler,
  onNextHandler,
  PlaceFormData,
} from "../../CreateProfileStepper.types";
import Infos from "../../../formComponents/infos/Infos";
import { NewProfileFormData } from "../../CreateProfileStepper.types";
import ContactForm from "../../../formComponents/contactForm/ContactForm";
import styles from "./ActivityFormStep.module.scss";
import { useToast } from "@/hooks/useToast";
import { validateForm } from "@/utils/formValidation";

interface ActivityFormStepProps {
  data: NewProfileFormData | PlaceFormData;
  onChange: FormDataChangeHandler;
  onSubmit: () => Promise<void>;
  onNext?: onNextHandler;
  onBack?: onBackHandler;
  submitButtonText?: string;
  isCreator: boolean;
  firstStep: boolean;
}

const ActivityFormStep = ({
  data,
  onChange,
  onSubmit,
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  isCreator,
  firstStep = false,
}: ActivityFormStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const { showError } = useToast();

  const validateFormData = (): boolean => {
    const result = validateForm(data);
    setErrors(result.errors);
    return result.isValid;
  };

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [data, hasAttemptedSubmit]);

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
      <Infos
        isCreator={isCreator}
        data={data as NewProfileFormData}
        onChange={onChange}
        errors={errors}
      />
      <ContactForm
        onChange={onChange}
        data={data as NewProfileFormData}
        disabled={isCreator}
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
