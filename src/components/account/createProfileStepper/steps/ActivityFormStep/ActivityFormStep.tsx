"use client";

import Button from "@/components/common/buttons/button/Button";
import { FormDataChangeHandler } from "../../CreateProfileStepper.types";
import Infos from "./formComponents/Infos";
import { DefaultSchedule, FormData } from "../../CreateProfileStepper.types";
import ContactForm from "./formComponents/ContactForm";
import Partners from "./formComponents/Partners";
import ProfilePictureUploader from "./formComponents/ProfilePictureUploader";

interface ActivityFormStepProps {
  data: FormData;
  onChange: FormDataChangeHandler;
  onNext: () => void;
  onBack: () => void;
  onScheduleChange: (updatedSchedule: DefaultSchedule) => void;
  onSubmit: () => Promise<void>;
}

const ActivityFormStep = ({
  data,
  onChange,
  onSubmit,
  onNext,
  onBack,
  onScheduleChange,
}: ActivityFormStepProps) => {
  const isCreator = data.userType === "creator";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <Infos
        isCreator={isCreator}
        data={data}
        onChange={onChange}
        onScheduleChange={onScheduleChange}
      />
      <ContactForm onChange={onChange} data={data} />
      {!isCreator && <Partners onChange={onChange} data={data} />}
      <ProfilePictureUploader
        onChange={onChange}
        initialImage={data.profilePicture}
      />
      <div>
        <Button type="button" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={onSubmit}>Créer mon profil</Button>
      </div>
    </form>
  );
};

export default ActivityFormStep;
