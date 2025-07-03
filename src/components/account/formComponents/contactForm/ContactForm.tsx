import TextField from "@/components/common/inputs/textField/TextField";
import styles from "./ContactForm.module.scss";

import {
  FormDataChangeHandler,
  NewProfileFormData,
} from "../../createProfileStepper/CreateProfileStepper.types";

interface ContactFormProps {
  onChange: FormDataChangeHandler;
  data: NewProfileFormData;
  disabled?: boolean;
}

const ContactForm = ({ onChange, data, disabled }: ContactFormProps) => {
  return (
    <div className={styles.contactForm}>
      <h3 className={styles.title}>Contact</h3>
      <div className={styles.formFields}>
        <TextField
          label="Numéro de téléphone"
          value={data.phone}
          onChange={onChange}
          name="phone"
          type="tel"
          placeholder="Entrez votre numéro de téléphone"
          required
          fullWidth
        />

        <TextField
          label="Adresse email"
          value={data.email}
          onChange={onChange}
          name="email"
          type="email"
          placeholder="Entrez votre adresse email"
          disabled={disabled}
          required
          fullWidth
        />

        <TextField
          label="Site web"
          value={data.website}
          onChange={onChange}
          name="website"
          type="url"
          placeholder="Entrez l'URL de votre site web"
          fullWidth
        />
      </div>
    </div>
  );
};

export default ContactForm;
