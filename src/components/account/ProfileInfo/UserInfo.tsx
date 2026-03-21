import TextField from "@/components/common/inputs/TextField/TextField";
import CategorySelectorInput from "@/components/account/CategorySelectorInput/CreatorCategorySelectorInput";
import { UserInfoProps } from "./info.types";
import styles from "./Info.module.scss";

const UserInfo = ({
  user,
  onUserChange,
  onPlaceChange,
  errors = {},
  showLegalName = true,
}: UserInfoProps) => {
  return (
    <div className={styles.container}>
      <fieldset className={styles.section}>
        <legend className={styles.title}>Informations</legend>
        <div className={styles.infosContainer}>
          {showLegalName && (
            <>
              <TextField
                fullWidth
                label={"Prénom"}
                name="firstname"
                value={user.firstname || ""}
                onChange={onUserChange}
                error={!!errors.firstname}
                errorMessage={errors.firstname}
              />
              <TextField
                fullWidth
                label={"Nom"}
                name="lastname"
                value={user.lastname || ""}
                onChange={onUserChange}
                error={!!errors.lastname}
                errorMessage={errors.lastname}
              />
            </>
          )}
          <TextField
            fullWidth
            label={"Nom de votre activité"}
            name="username"
            required
            value={user.username}
            onChange={onUserChange}
            error={!!errors.username}
            errorMessage={errors.username}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            required
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
            value={
              typeof user.userCategory === "string"
                ? user.userCategory
                : user.userCategory?._id ?? ""
            }
            error={!!errors.userCategory}
            errorMessage={errors.userCategory}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default UserInfo;
