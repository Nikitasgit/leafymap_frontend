import TextField from "@/components/common/inputs/textField/TextField";
import styles from "./ContactForm.module.scss";

import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "../../createProfileStepper/CreateProfileStepper.types";

interface ContactFormProps {
  user: InitialCreatorData;
  place: InitialPlaceData;
  onUserChange: FormDataChangeHandler;
  onPlaceChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}

const ContactForm = ({
  user,
  place,
  onUserChange,
  onPlaceChange,
  errors = {},
}: ContactFormProps) => {
  const isCreator = user.userType === "creator";
  return (
    <div className={styles.contactForm}>
      <h3 className={styles.title}>Contact</h3>
      <div className={styles.formFields}>
        <TextField
          label="Numéro de téléphone"
          value={isCreator ? user.phone : place.phone}
          onChange={isCreator ? onUserChange : onPlaceChange}
          name="phone"
          type="tel"
          placeholder="Entrez votre numéro de téléphone"
          required
          fullWidth
          error={!!errors.phone}
          errorMessage={errors.phone}
        />

        <TextField
          label="Adresse email"
          value={isCreator ? user.email : place.email}
          onChange={isCreator ? onUserChange : onPlaceChange}
          name="email"
          type="email"
          placeholder="Entrez votre adresse email"
          disabled={isCreator}
          required
          fullWidth
          error={!!errors.email}
          errorMessage={errors.email}
        />

        <TextField
          label="Site web"
          value={isCreator ? user.website : place.website}
          onChange={isCreator ? onUserChange : onPlaceChange}
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

export default ContactForm;
