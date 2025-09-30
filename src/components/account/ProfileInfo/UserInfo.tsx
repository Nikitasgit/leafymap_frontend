import TextField from "@/components/common/inputs/textField/TextField";
import CategorySelectorInput from "@/components/account/CategorySelectorInput/CreatorCategorySelectorInput";
import { UserInfoProps } from "./info.types";
import styles from "./Info.module.scss";

const UserInfo = ({
  user,
  onUserChange,
  onPlaceChange,
  errors = {},
}: UserInfoProps) => {
  return (
    <div className={styles.container}>
      <fieldset className={styles.section}>
        <legend className={styles.title}>Informations</legend>
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
            value={user.creatorCategories[0] as string}
            error={!!errors.creatorCategories}
            errorMessage={errors.creatorCategories}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default UserInfo;
