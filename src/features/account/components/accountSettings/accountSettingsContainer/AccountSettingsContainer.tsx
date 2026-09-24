"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, MapPin, Shield, ShieldOff, Trash2 } from "lucide-react";
import PageHeader from "@/shared/ui/pageHeader";
import Button from "@/shared/ui/buttons/button";
import TextField from "@/shared/ui/inputs/textField";
import InfoIcon from "@/shared/ui/tooltip";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import BaseModal from "@/shared/ui/modals/baseModal";
import infoStyles from "../../profileInfo/Info.module.scss";
import type { FormDataChangeHandler } from "../../createProfileStepper";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import useDeletePlace from "@/features/places/hooks/useDeletePlace";
import { authApi, useCurrentUser } from "@/features/auth";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import useUpdateUser from "@/features/users/hooks/useSubmitUser";
import { useToast } from "@/shared/hooks/useToast";
import { validateLegalNameFields } from "@/features/users/validations/userValidations";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import {
  accountSettingsProfileFromUser,
  isAccountSettingsProfileKey,
  type AccountSettingsProfile,
} from "./accountSettingsProfile";
import styles from "./AccountSettingsContainer.module.scss";
import { validationT } from "@/shared/utils/i18n/validationT";

const AccountSettingsContainer = () => {
  const { deleteAccount, isLoading } = useDeleteAccount();
  const { performDeletePlace, isLoading: isDeletingPlace } = useDeletePlace();
  const { user: sessionUser, refetch } = useCurrentUser();
  const { submitUser } = useUpdateUser();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation("account");

  const [user, setUser] = useState<AccountSettingsProfile | null>(null);
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [isDeletePlaceModalOpen, setIsDeletePlaceModalOpen] = useState(false);
  const [isSavingEmailNotifications, setIsSavingEmailNotifications] =
    useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<
    "setup" | "recovery" | "disable" | null
  >(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [twoFactorQr, setTwoFactorQr] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isTwoFactorSubmitting, setIsTwoFactorSubmitting] = useState(false);

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

    const normalizedCurrentFirstname =
      user.firstname?.trim().toLowerCase() ?? "";
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

  const isUserFormLoading = !user;

  const userPlace = sessionUser?.place;
  const placeId = userPlace?.id;
  const placeLabel = userPlace?.location?.label;

  const isTwoFactorEnabled = sessionUser?.twoFactorEnabled === true;

  const resetTwoFactorModal = () => {
    setTwoFactorStep(null);
    setTwoFactorSecret(null);
    setTwoFactorQr(null);
    setRecoveryCodes([]);
    setTwoFactorCode("");
  };

  const handleEnableTwoFactor = async () => {
    setIsTwoFactorSubmitting(true);
    try {
      const setup = await authApi.setupTwoFactor();
      setTwoFactorSecret(setup.secret);
      setTwoFactorQr(setup.qrDataUrl);
      setTwoFactorCode("");
      setTwoFactorStep("setup");
    } catch (error) {
      showError(getErrorMessage(error, t));
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  const handleConfirmTwoFactor = async () => {
    if (!twoFactorCode.trim()) return;
    setIsTwoFactorSubmitting(true);
    try {
      const result = await authApi.confirmTwoFactor(twoFactorCode.trim());
      setRecoveryCodes(result.recoveryCodes);
      setTwoFactorCode("");
      setTwoFactorStep("recovery");
      await refetch();
    } catch (error) {
      showError(getErrorMessage(error, t));
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  const handleCopyRecoveryCodes = async () => {
    if (recoveryCodes.length === 0) return;
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      showSuccess(t("accountSettingsContainer.twoFactorRecoveryCopied"));
    } catch {
      showError(t("accountSettingsContainer.twoFactorRecoveryCopyFailed"));
    }
  };

  const handleDisableTwoFactor = async () => {
    if (!twoFactorCode.trim()) return;
    setIsTwoFactorSubmitting(true);
    try {
      await authApi.disableTwoFactor(twoFactorCode.trim());
      resetTwoFactorModal();
      showSuccess(t("accountSettingsContainer.twoFactorDisabled"));
      await refetch();
    } catch (error) {
      showError(getErrorMessage(error, t));
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  const handleConfirmDeletePlace = async () => {
    if (!placeId) return;
    const deleted = await performDeletePlace(placeId);
    setIsDeletePlaceModalOpen(false);
    if (deleted) {
      await refetch();
    }
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
                      {t(
                        "accountSettingsContainer.emailNotificationsDescription"
                      )}
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
          <article className={styles.twoFactorCard}>
            <div className={styles.twoFactorInfo}>
              <div className={styles.titleRow}>
                <h3 className={styles.twoFactorTitle}>
                  {t("accountSettingsContainer.twoFactorTitle")}
                </h3>
                <InfoIcon
                  tooltip={t("accountSettingsContainer.twoFactorTooltip")}
                  place="right"
                  className={styles.infoIcon}
                />
              </div>
              <p className={styles.twoFactorDescription}>
                {isTwoFactorEnabled
                  ? t("accountSettingsContainer.twoFactorEnabledDescription")
                  : t("accountSettingsContainer.twoFactorDescription")}
              </p>
            </div>
            <Button
              variant={isTwoFactorEnabled ? "secondary" : "primary"}
              onClick={
                isTwoFactorEnabled
                  ? () => {
                      setTwoFactorCode("");
                      setTwoFactorStep("disable");
                    }
                  : handleEnableTwoFactor
              }
              disabled={isTwoFactorSubmitting}
              startIcon={
                isTwoFactorEnabled ? (
                  <ShieldOff size={16} />
                ) : (
                  <Shield size={16} />
                )
              }
              ariaLabel={
                isTwoFactorEnabled
                  ? t("accountSettingsContainer.twoFactorDisableAriaLabel")
                  : t("accountSettingsContainer.twoFactorEnableAriaLabel")
              }
            >
              {isTwoFactorEnabled
                ? t("accountSettingsContainer.twoFactorDisableButton")
                : t("accountSettingsContainer.twoFactorEnableButton")}
            </Button>
          </article>
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
        <BaseModal
          isOpen={twoFactorStep !== null}
          onClose={resetTwoFactorModal}
          title={
            twoFactorStep === "recovery"
              ? t("accountSettingsContainer.twoFactorRecoveryTitle")
              : twoFactorStep === "disable"
              ? t("accountSettingsContainer.twoFactorDisableTitle")
              : t("accountSettingsContainer.twoFactorSetupTitle")
          }
          primaryButtonLabel={
            twoFactorStep === "recovery"
              ? t("accountSettingsContainer.twoFactorRecoveryPrimary")
              : twoFactorStep === "disable"
              ? t("accountSettingsContainer.twoFactorDisablePrimary")
              : t("accountSettingsContainer.twoFactorSetupPrimary")
          }
          secondaryButtonLabel={
            twoFactorStep === "recovery"
              ? undefined
              : t("common:actions.cancel")
          }
          onPrimaryAction={
            twoFactorStep === "recovery"
              ? resetTwoFactorModal
              : twoFactorStep === "disable"
              ? handleDisableTwoFactor
              : handleConfirmTwoFactor
          }
          primaryButtonType="button"
          isPrimaryDisabled={
            twoFactorStep !== "recovery" && !twoFactorCode.trim()
          }
          isSubmitLoading={isTwoFactorSubmitting}
          withLoadingState={false}
        >
          {twoFactorStep === "setup" && (
            <div className={styles.twoFactorModal}>
              <p className={styles.modalMessage}>
                {t("accountSettingsContainer.twoFactorSetupBody")}
              </p>
              {twoFactorQr && (
                // Data URL from the API; next/image cannot optimize it.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={twoFactorQr}
                  alt={t("accountSettingsContainer.twoFactorQrAlt")}
                  className={styles.twoFactorQr}
                />
              )}
              {twoFactorSecret && (
                <p className={styles.twoFactorSecret}>
                  {t("accountSettingsContainer.twoFactorSecretLabel")}{" "}
                  <code>{twoFactorSecret}</code>
                </p>
              )}
              <TextField
                fullWidth
                label={t("accountSettingsContainer.twoFactorCodeLabel")}
                name="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder={t(
                  "accountSettingsContainer.twoFactorCodePlaceholder"
                )}
              />
            </div>
          )}
          {twoFactorStep === "recovery" && (
            <div className={styles.twoFactorModal}>
              <p className={styles.modalMessage}>
                {t("accountSettingsContainer.twoFactorRecoveryBody")}
              </p>
              <ul className={styles.recoveryCodes}>
                {recoveryCodes.map((code) => (
                  <li key={code}>
                    <code>{code}</code>
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="secondary"
                size="small"
                startIcon={<Copy size={16} />}
                onClick={handleCopyRecoveryCodes}
                ariaLabel={t(
                  "accountSettingsContainer.twoFactorRecoveryCopyAriaLabel"
                )}
              >
                {t("accountSettingsContainer.twoFactorRecoveryCopy")}
              </Button>
            </div>
          )}
          {twoFactorStep === "disable" && (
            <div className={styles.twoFactorModal}>
              <p className={styles.modalMessage}>
                {t("accountSettingsContainer.twoFactorDisableBody")}
              </p>
              <TextField
                fullWidth
                label={t("accountSettingsContainer.twoFactorCodeLabel")}
                name="twoFactorDisableCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder={t(
                  "accountSettingsContainer.twoFactorCodePlaceholder"
                )}
              />
            </div>
          )}
        </BaseModal>
        {placeId && (
          <BaseModal
            isOpen={isDeletePlaceModalOpen}
            onClose={() => setIsDeletePlaceModalOpen(false)}
            title={t("accountSettingsContainer.deletePlaceModalTitle")}
            primaryButtonLabel={t(
              "accountSettingsContainer.deletePlaceModalPrimary"
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
