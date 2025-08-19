import TextField from "@/components/common/inputs/textField/TextField";
import styles from "./ContactForm.module.scss";

import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../../createProfileStepper/CreateProfileStepper.types";

interface UserContactFormProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}

const UserContactForm = ({
  user,
  onUserChange,
  errors = {},
}: UserContactFormProps) => {
  return (
    <div className={styles.contactForm}>
      <h3 className={styles.title}>Contact</h3>
      <div className={styles.formFields}>
        <TextField
          label="Site web"
          value={user.website}
          onChange={onUserChange}
          name="website"
          type="url"
          placeholder="Entrez l'URL de votre site web"
          fullWidth
          error={!!errors.website}
          errorMessage={errors.website}
        />
      </div>
    </div>
  );
};

export default UserContactForm;
