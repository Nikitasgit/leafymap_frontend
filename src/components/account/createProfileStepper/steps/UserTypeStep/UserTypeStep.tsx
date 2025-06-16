import Radio from "@/components/common/inputs/radios/radioWithLabel/Radio";
import {
  FormDataChangeHandler,
  onNextHandler,
} from "../../CreateProfileStepper.types";

interface UserTypeStepProps {
  userType: string;
  onChange: FormDataChangeHandler;
  onNext: onNextHandler;
}

const UserTypeStep = ({ userType, onChange, onNext }: UserTypeStepProps) => {
  return (
    <div>
      <h1>Quel type d&apos;activité souhaitez-vous ajouter ?</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <Radio
          label="Artiste / Artisan / Agriculteur"
          name="userType"
          value="creator"
          checked={userType === "creator"}
          onChange={onChange}
        />
        <Radio
          label="Organisateur (marché, boutique, exposition, etc.)"
          name="userType"
          value="organizer"
          checked={userType === "organizer"}
          onChange={onChange}
        />
        <button type="submit">Suivant</button>
      </form>
    </div>
  );
};

export default UserTypeStep;
