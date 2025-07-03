"use client";

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
import ProfilePictureUploader from "@/components/account/formComponents/collaborators/profilePictureUploader/ProfilePictureUploader";
import styles from "./ActivityFormStep.module.scss";

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
  onNext = () => {},
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  isCreator,
  firstStep = false,
}: ActivityFormStepProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.image as string}
      />
      <Infos
        isCreator={isCreator}
        data={data as NewProfileFormData}
        onChange={onChange}
      />
      <ContactForm
        onChange={onChange}
        data={data as NewProfileFormData}
        disabled={isCreator}
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
        <Button size="large" fullWidth onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;
