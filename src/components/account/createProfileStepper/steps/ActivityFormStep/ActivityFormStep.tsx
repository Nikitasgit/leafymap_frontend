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
import ContactForm from "../../../formComponents/ContactForm";
import ProfilePictureUploader from "../../../formComponents/ProfilePictureUploader";

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
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.image as string}
      />
      <div>
        {!firstStep && (
          <Button type="button" onClick={onBack}>
            Précédent
          </Button>
        )}
        <Button onClick={onSubmit}>{submitButtonText}</Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;
