import TextField from "@/components/common/inputs/TextField/TextField";
import styles from "./ContactForm.module.scss";
import { PlaceContactFormProps } from "./ContactForm.types";

const PlaceContactForm = ({
  place,
  onPlaceChange,
  errors = {},
}: PlaceContactFormProps) => {
  return (
    <fieldset className={styles.contactForm}>
      <legend className={styles.title}>Contact</legend>
      <div className={styles.formFields}>
        <TextField
          label="Numéro de téléphone"
          value={place.phone}
          onChange={onPlaceChange}
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
          value={place.email}
          onChange={onPlaceChange}
          name="email"
          type="email"
          placeholder="Entrez votre adresse email"
          required
          fullWidth
          error={!!errors.email}
          errorMessage={errors.email}
        />
        <TextField
          label="Site web"
          value={place.website}
          onChange={onPlaceChange}
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

export default PlaceContactForm;
