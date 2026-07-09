"use client";

import { useTranslation } from "react-i18next";
import TextField from "@/components/common/inputs/TextField";
import styles from "./ContactForm.module.scss";
import { UserContactFormProps } from "./ContactForm.types";

const UserContactForm = ({
  user,
  onUserChange,
  errors = {},
}: UserContactFormProps) => {
  const { t } = useTranslation("account");

  return (
    <fieldset className={styles.contactForm}>
      <legend className={styles.title}>{t("userContactForm.contactSection")}</legend>
      <div className={styles.formFields}>
        <TextField
          label={t("userContactForm.phoneLabel")}
          value={user.phone}
          onChange={onUserChange}
          name="phone"
          type="tel"
          placeholder={t("userContactForm.phonePlaceholder")}
          fullWidth
          error={!!errors.phone}
          errorMessage={errors.phone}
        />
        <TextField
          label={t("userContactForm.websiteLabel")}
          value={user.website}
          onChange={onUserChange}
          name="website"
          type="url"
          placeholder={t("userContactForm.websitePlaceholder")}
          fullWidth
          error={!!errors.website}
          errorMessage={errors.website}
        />
      </div>
    </fieldset>
  );
};

export default UserContactForm;
