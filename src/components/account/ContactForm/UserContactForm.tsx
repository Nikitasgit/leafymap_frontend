import TextField from "@/components/common/inputs/TextFieldtempname/TextField";
import styles from "./ContactForm.module.scss";
import { UserContactFormProps } from "./ContactForm.types";

const UserContactForm = ({
  user,
  onUserChange,
  errors = {},
}: UserContactFormProps) => {
  return (
    <fieldset className={styles.contactForm}>
      <legend className={styles.title}>Contact</legend>
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
    </fieldset>
  );
};

export default UserContactForm;
