"use client";

import { useTranslation } from "react-i18next";
import TextField from "@/shared/ui/inputs/textField";
import CategorySelectorInput from "../categorySelectorInput/CreatorCategorySelectorInput";
import { UserInfoProps } from "./info.types";
import styles from "./Info.module.scss";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";

const UserInfo = ({
  user,
  onUserChange,
  errors = {},
  showLegalName = true,
}: UserInfoProps) => {
  const { t } = useTranslation("account");

  return (
    <div className={styles.container}>
      <fieldset className={styles.section}>
        <legend className={styles.title}>
          {t("userInfo.informationsSection")}
        </legend>
        <div className={styles.infosContainer}>
          {showLegalName && (
            <>
              <TextField
                fullWidth
                label={t("userInfo.firstnameLabel")}
                name="firstname"
                required
                value={user.firstname || ""}
                onChange={onUserChange}
                error={!!errors.firstname}
                errorMessage={errors.firstname}
              />
              <TextField
                fullWidth
                label={t("userInfo.lastnameLabel")}
                name="lastname"
                required
                value={user.lastname || ""}
                onChange={onUserChange}
                error={!!errors.lastname}
                errorMessage={errors.lastname}
              />
            </>
          )}
          <TextField
            fullWidth
            label={t("userInfo.activityNameLabel")}
            name="username"
            required
            value={user.username}
            onChange={onUserChange}
            error={!!errors.username}
            errorMessage={errors.username}
          />
          <TextField
            fullWidth
            label={t("userInfo.descriptionLabel")}
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
          <div className={styles.roleSelector}>
            <CategorySelectorInput
              onUserChange={onUserChange}
              value={resolveRefId(user.userCategory) ?? ""}
              error={!!errors.userCategory}
              errorMessage={errors.userCategory}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default UserInfo;
