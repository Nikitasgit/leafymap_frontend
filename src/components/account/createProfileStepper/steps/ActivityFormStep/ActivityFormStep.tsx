"use client";

import Button from "@/components/common/buttons/button/Button";
import { FormDataChangeHandler } from "../../CreateProfileStepper.types";
import Infos from "./formComponents/Infos";
import { FormData } from "../../CreateProfileStepper.types";
import ContactForm from "./formComponents/ContactForm";
import Partners from "./formComponents/Partners";
import ProfilePictureUploader from "./formComponents/ProfilePictureUploader";

interface ActivityFormStepProps {
  data: FormData;
  onChange: FormDataChangeHandler;
  onSubmit: () => Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
  submitButtonText?: string;
  isCreator: boolean;
}

const ActivityFormStep = ({
  data,
  onChange,
  onSubmit,
  onNext = () => {},
  onBack = () => {},
  submitButtonText = "Créer mon profil",
  isCreator,
}: ActivityFormStepProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <Infos isCreator={isCreator} data={data} onChange={onChange} />
      <ContactForm onChange={onChange} data={data} disabled={isCreator} />
      {!isCreator && <Partners onChange={onChange} data={data} />}
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.profilePicture as string}
      />
      <div>
        <Button type="button" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={onSubmit}>{submitButtonText}</Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;
