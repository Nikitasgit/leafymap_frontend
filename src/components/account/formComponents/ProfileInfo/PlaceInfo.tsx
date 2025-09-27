import TextField from "@/components/common/inputs/textField/TextField";
import { PlaceInfoProps } from "./info.types";
import styles from "./Info.module.scss";

const PlaceInfo = ({ place, onPlaceChange, errors = {} }: PlaceInfoProps) => {
  return (
    <div className={styles.container}>
      <fieldset className={styles.section}>
        <legend className={styles.title}>Informations</legend>
        <div className={styles.infosContainer}>
          <TextField
            fullWidth
            label="Nom du lieu"
            name="name"
            required
            value={place.name}
            onChange={onPlaceChange}
            error={!!errors.name}
            errorMessage={errors.name}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={place.description}
            onChange={onPlaceChange}
            multiline
            rows={2}
            required
            showCharCount
            maxLength={300}
            error={!!errors.description}
            errorMessage={errors.description}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default PlaceInfo;
