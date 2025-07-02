import Button from "@/components/common/buttons/button/Button";
import {
  FormDataChangeHandler,
  onNextHandler,
} from "../../CreateProfileStepper.types";
import styles from "./UserTypeStep.module.scss";

interface UserTypeStepProps {
  userType: string;
  onChange: FormDataChangeHandler;
  onNext: onNextHandler;
}

const UserTypeStep = ({ userType, onChange, onNext }: UserTypeStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType) {
      onNext();
    }
  };

  const handleOptionClick = (value: string) => {
    onChange({ target: { name: "userType", value } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vous êtes ...</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.radioGroup}>
          <div
            className={`${styles.radioOption} ${
              userType === "creator" ? styles.selected : ""
            }`}
            onClick={() => handleOptionClick("creator")}
          >
            <div className={styles.radioLabel}>
              Un <b>créateur, artisan ou un agriculteur</b> qui souhaite donner
              de la visibilité à son activité.
            </div>
          </div>

          <div
            className={`${styles.radioOption} ${
              userType === "organizer" ? styles.selected : ""
            }`}
            onClick={() => handleOptionClick("organizer")}
          >
            <div className={styles.radioLabel}>
              Un <b>organisateur</b> (marché, boutique, exposition, etc.) qui
              souhaite donner de la visibilité à son lieu.
            </div>
          </div>
        </div>

        <Button type="submit" disabled={!userType}>
          Suivant
        </Button>
      </form>
    </div>
  );
};

export default UserTypeStep;
