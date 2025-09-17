import TextField from "@/components/common/inputs/textField/TextField";
import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../../createProfileStepper/CreateProfileStepper.types";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import styles from "./Infos.module.scss";

interface InfosProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  onPlaceChange: FormDataChangeHandler;
}

const UserInfos = ({
  user,
  onUserChange,
  onPlaceChange,
  errors = {},
}: InfosProps) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.title}>Informations</h3>
        <div className={styles.infosContainer}>
          <TextField
            fullWidth
            label={"Nom de votre activité"}
            name="creatorName"
            required
            value={user.creatorName}
            onChange={onUserChange}
            error={!!errors.creatorName}
            errorMessage={errors.creatorName}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={user.description}
            onChange={onUserChange}
            multiline
            rows={2}
            showCharCount
            maxLength={300}
            error={!!errors.description}
            errorMessage={errors.description}
          />
          <CategorySelectorInput
            onUserChange={onUserChange}
            onPlaceChange={onPlaceChange}
            value={user.creatorCategories.map((category) => category._id)}
            error={!!errors.creatorCategories}
            errorMessage={errors.creatorCategories}
          />
        </div>
      </section>
    </div>
  );
};

export default UserInfos;
