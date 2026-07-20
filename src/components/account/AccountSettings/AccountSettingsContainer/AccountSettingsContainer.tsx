"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/buttons/Button";
import TextField from "@/components/common/inputs/TextField";
import InfoIcon from "@/components/common/Tooltip";
import LoadingBar from "@/components/common/loading/LoadingBar";
import BaseModal from "@/components/common/modals/BaseModal";
import infoStyles from "@/components/account/ProfileInfo/Info.module.scss";
import type { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import useDeletePlace from "@/hooks/useDeletePlace";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useUpdateUser from "@/hooks/useSubmitUser";
import { useToast } from "@/hooks/useToast";
import { validateLegalNameFields } from "@/validations/userValidations";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "@/utils/functions";
import {
  accountSettingsProfileFromUser,
  isAccountSettingsProfileKey,
  type AccountSettingsProfile,
} from "./accountSettingsProfile";
import styles from "./AccountSettingsContainer.module.scss";
import { validationT } from "@/utils/i18n/validationT";

const AccountSettingsContainer = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();
  const {
    performDeletePlace,
    isLoading: isDeletingPlace,
  } = useDeletePlace();
  const {
    user: sessionUser,
    isLoading: userLoading,
    refetch,
  } = useCurrentUser();
  const { submitUser } = useUpdateUser();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation("account");

  const [user, setUser] = useState<AccountSettingsProfile | null>(null);
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [isDeletePlaceModalOpen, setIsDeletePlaceModalOpen] = useState(false);
  const [isSavingEmailNotifications, setIsSavingEmailNotifications] =
    useState(false);

  useEffect(() => {
    if (sessionUser) {
      setUser(accountSettingsProfileFromUser(sessionUser));
    }
  }, [sessionUser]);

  const handleUserChange: FormDataChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    if (typeof value !== "string" || !isAccountSettingsProfileKey(name)) {
      return;
    }
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  }, []);

  const handleEmailNotificationsChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      const previousValue = user?.preferences.emailNotifications ?? false;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              preferences: {
                ...prev.preferences,
                emailNotifications: checked,
              },
            }
          : prev
      );
      setIsSavingEmailNotifications(true);
      try {
        const result = await submitUser({
          preferences: { emailNotifications: checked },
        });
        if (result === true) {
          showSuccess(t("accountSettingsContainer.preferenceSaved"));
          await refetch();
        } else {
          throw new Error("Preference update failed");
        }
      } catch {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                preferences: {
                  ...prev.preferences,
                  emailNotifications: previousValue,
                },
              }
            : prev
        );
        showError(t("accountSettingsContainer.preferenceSaveError"));
      } finally {
        setIsSavingEmailNotifications(false);
      }
    },
    [refetch, showError, showSuccess, submitUser, t, user]
  );

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    const { errors, isValid } = validateLegalNameFields(validationT(t))(user);
    setUserErrors(errors);
    if (!isValid) {
      showError(t("accountSettingsContainer.formValidationError"));
      return;
    }

    const normalizedCurrentFirstname = user.firstname?.trim().toLowerCase() ?? "";
    const normalizedCurrentLastname = user.lastname?.trim().toLowerCase() ?? "";
    const normalizedSessionFirstname =
      sessionUser?.firstname?.trim().toLowerCase() ?? "";
    const normalizedSessionLastname =
      sessionUser?.lastname?.trim().toLowerCase() ?? "";

    if (
      normalizedCurrentFirstname === normalizedSessionFirstname &&
      normalizedCurrentLastname === normalizedSessionLastname
    ) {
      return;
    }

    const result = await submitUser({
      firstname: user.firstname,
      lastname: user.lastname,
    });
    if (result === true) {
      showSuccess(t("accountSettingsContainer.profileSaved"));
      await refetch();
    }
  }, [refetch, sessionUser, showError, showSuccess, submitUser, t, user]);

  const isUserFormLoading = userLoading || !sessionUser || !user;

  const userPlace = sessionUser?.place;
  const placeId = userPlace?.id;
  const placeLabel = userPlace?.location?.label;

  const handleConfirmDeletePlace = async () => {
    if (!placeId) return;
    await performDeletePlace(placeId);
    setIsDeletePlaceModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container} aria-labelledby="settings-title">
        <PageHeader
          subtitle={t("accountSettingsContainer.subtitle")}
          title={t("accountSettingsContainer.title")}
          showBackButton
        />
        {isUserFormLoading ? (
          <LoadingBar />
        ) : (
          <div className={styles.informationsForm}>
            <div className={infoStyles.container}>
              <fieldset className={infoStyles.section}>
                <legend className={infoStyles.title}>
                  {t("accountSettingsContainer.informationsSection")}
                </legend>
                <div className={infoStyles.infosContainer}>
                  <TextField
                    fullWidth
                    label={t("accountSettingsContainer.firstnameLabel")}
                    name="firstname"
                    value={capitalizeFirstLetter(user.firstname)}
                    onChange={handleUserChange}
                    onBlur={handleSaveProfile}
                    error={!!userErrors.firstname}
                    errorMessage={userErrors.firstname}
                  />
                  <TextField
                    fullWidth
                    label={t("accountSettingsContainer.lastnameLabel")}
                    name="lastname"
                    value={capitalizeFirstLetter(user.lastname)}
                    onChange={handleUserChange}
                    onBlur={handleSaveProfile}
                    error={!!userErrors.lastname}
                    errorMessage={userErrors.lastname}
                  />
                </div>
              </fieldset>
              <fieldset className={infoStyles.section}>
                <legend className={infoStyles.title}>
                  {t("accountSettingsContainer.notificationsSection")}
                </legend>
                <label className={styles.notificationPreference}>
                  <input
                    type="checkbox"
                    checked={user.preferences.emailNotifications}
                    onChange={handleEmailNotificationsChange}
                    disabled={isSavingEmailNotifications}
                    className={styles.notificationCheckbox}
                  />
                  <span className={styles.notificationText}>
                    <span className={styles.notificationTitle}>
                      {t("accountSettingsContainer.emailNotificationsTitle")}
                    </span>
                    <span className={styles.notificationDescription}>
                      {t("accountSettingsContainer.emailNotificationsDescription")}
                      {isSavingEmailNotifications &&
                        t("accountSettingsContainer.saving")}
                    </span>
                  </span>
                </label>
              </fieldset>
            </div>
          </div>
        )}
        <section
          className={styles.settingsContainer}
          aria-label={t("accountSettingsContainer.sensitiveActionsAriaLabel")}
        >
          {placeId && (
            <article className={styles.deletePlaceCard}>
              <div className={styles.deletePlaceInfo}>
                <div className={styles.placeTitleRow}>
                  <h3
                    id="place-delete-title"
                    className={styles.deletePlaceTitle}
                  >
                    {t("accountSettingsContainer.deletePlaceTitle")}
                  </h3>
                  <InfoIcon
                    tooltip={t("accountSettingsContainer.deletePlaceTooltip")}
                    place="right"
                    className={styles.infoIcon}
                  />
                </div>
                <p className={styles.deletePlaceDescription}>
                  {t("accountSettingsContainer.deletePlaceDescription")}
                </p>
                {placeLabel && (
                  <p className={styles.placeAddress}>
                    <MapPin size={14} aria-hidden />
                    {placeLabel}
                  </p>
                )}
              </div>
              <Button
                variant="danger"
                onClick={() => setIsDeletePlaceModalOpen(true)}
                disabled={isDeletingPlace}
                startIcon={<Trash2 size={16} />}
                ariaLabel={t("accountSettingsContainer.deletePlaceAriaLabel")}
              >
                {t("accountSettingsContainer.deletePlaceButton")}
              </Button>
            </article>
          )}
          <article className={styles.deleteAccountCard}>
            <div className={styles.deleteAccountInfo}>
              <div className={styles.titleRow}>
                <h3 id="danger-zone-title" className={styles.deleteTitle}>
                  {t("accountSettingsContainer.deleteAccountTitle")}
                </h3>
                <InfoIcon
                  tooltip={t("accountSettingsContainer.deleteAccountTooltip")}
                  place="right"
                  className={styles.infoIcon}
                />
              </div>
              <p className={styles.deleteDescription}>
                {t("accountSettingsContainer.deleteAccountDescription")}
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={deleteAccount}
              disabled={isLoading}
              startIcon={<Trash2 size={16} />}
              ariaLabel={t("accountSettingsContainer.deleteAccountAriaLabel")}
            >
              {isLoading
                ? t("accountSettingsContainer.deleting")
                : t("common:actions.delete")}
            </Button>
          </article>
        </section>
        {placeId && (
          <BaseModal
            isOpen={isDeletePlaceModalOpen}
            onClose={() => setIsDeletePlaceModalOpen(false)}
            title={t("accountSettingsContainer.deletePlaceModalTitle")}
            primaryButtonLabel={t(
              "accountSettingsContainer.deletePlaceModalPrimary",
            )}
            secondaryButtonLabel={t("common:actions.cancel")}
            onPrimaryAction={handleConfirmDeletePlace}
            primaryButtonType="button"
            isSubmitLoading={isDeletingPlace}
            withLoadingState={false}
          >
            <p className={styles.modalMessage}>
              {t("accountSettingsContainer.deletePlaceModalBody")}
            </p>
          </BaseModal>
        )}
      </section>
    </div>
  );
};

export default AccountSettingsContainer;
