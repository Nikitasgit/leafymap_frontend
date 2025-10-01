import Button from "@/components/common/buttons/Button";
import {
  FormDataChangeHandler,
  onNextHandler,
} from "../../CreateProfileStepper/CreateProfileStepper.types";
import styles from "./UserTypeStep.module.scss";
import { useToast } from "@/hooks/useToast";

interface UserTypeStepProps {
  userType: string;
  onChange: FormDataChangeHandler;
  onNext: onNextHandler;
  loading: boolean;
}

const UserTypeStep = ({
  userType,
  onChange,
  onNext,
  loading,
}: UserTypeStepProps) => {
  const { showError } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (["creator", "organizer"].includes(userType)) {
      onNext();
    } else {
      showError("Veuillez sélectionner un type d'utilisateur");
    }
  };

  const handleOptionClick = (value: string) => {
    onChange({ target: { name: "userType", value } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Choisissez le type d&apos;utilisateur qui vous correspond le mieux.
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.radioGroup}>
          <legend className={styles.legend}>Type d&apos;utilisateur</legend>
          <label
            className={`${styles.radioOption} ${
              userType === "creator" ? styles.selected : ""
            }`}
            htmlFor="userType-creator"
          >
            <input
              type="radio"
              id="userType-creator"
              name="userType"
              value="creator"
              checked={userType === "creator"}
              onChange={() => handleOptionClick("creator")}
              className={styles.radioInput}
            />
            <span className={styles.radioLabel}>
              Un <b>créateur, artisan ou un agriculteur</b> qui souhaite donner
              de la visibilité à son activité.
            </span>
          </label>

          <label
            className={`${styles.radioOption} ${
              userType === "organizer" ? styles.selected : ""
            }`}
            htmlFor="userType-organizer"
          >
            <input
              type="radio"
              id="userType-organizer"
              name="userType"
              value="organizer"
              checked={userType === "organizer"}
              onChange={() => handleOptionClick("organizer")}
              className={styles.radioInput}
            />
            <span className={styles.radioLabel}>
              Un <b>organisateur</b> (marché, boutique, exposition, etc.) qui
              souhaite donner de la visibilité à son lieu.
            </span>
          </label>
        </fieldset>

        <Button type="submit" disabled={loading} ariaLabel="Étape suivante">
          Étape suivante
        </Button>
      </form>
    </div>
  );
};

export default UserTypeStep;
