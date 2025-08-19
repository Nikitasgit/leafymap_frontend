import TextField from "@/components/common/inputs/textField/TextField";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "../../createProfileStepper/CreateProfileStepper.types";
import styles from "./Infos.module.scss";

interface InfosProps {
  place: InitialPlaceData;
  onPlaceChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}

const PlaceInfos = ({ place, onPlaceChange, errors = {} }: InfosProps) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.title}>Informations</h3>
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
      </section>
    </div>
  );
};

export default PlaceInfos;
