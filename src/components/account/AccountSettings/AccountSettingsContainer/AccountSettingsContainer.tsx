"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/common/buttons/Button";
import TextField from "@/components/common/inputs/TextField/TextField";
import InfoIcon from "@/components/common/Tooltip/Tooltip";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import infoStyles from "@/components/account/ProfileInfo/Info.module.scss";
import type { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import useDeletePlace from "@/hooks/useDeletePlace";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useUpdateUser from "@/hooks/useSubmitUser";
import { useToast } from "@/hooks/useToast";
import { validateLegalNameFields } from "@/validations/userValidations";
import { capitalizeFirstLetter } from "@/utils/functions";
import {
  accountSettingsProfileFromUser,
  isAccountSettingsProfileKey,
  type AccountSettingsProfile,
} from "./accountSettingsProfile";
import styles from "./AccountSettingsContainer.module.scss";

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
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();
  const { showSuccess, showError } = useToast();

  const [user, setUser] = useState<AccountSettingsProfile | null>(null);
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [isDeletePlaceModalOpen, setIsDeletePlaceModalOpen] = useState(false);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { errors, isValid } = validateLegalNameFields(user);
    setUserErrors(errors);
    if (!isValid) {
      showError("Veuillez corriger les erreurs du formulaire");
      return;
    }

    const result = await submitUser(user);
    if (result === true) {
      showSuccess("Informations enregistrées");
      await refetch();
    }
  };

  const isUserFormLoading = userLoading || !sessionUser || !user;

  const userPlace = sessionUser?.place;
  const placeId = userPlace?._id;
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
          subtitle="Gérez vos paramètres de compte"
          title="Paramètres du compte"
          showBackButton
        />
        {isUserFormLoading ? (
          <LoadingBar />
        ) : (
          <form
            className={styles.informationsForm}
            onSubmit={handleSaveProfile}
            noValidate
          >
            <div className={infoStyles.container}>
              <fieldset className={infoStyles.section}>
                <legend className={infoStyles.title}>Informations</legend>
                <div className={infoStyles.infosContainer}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstname"
                    value={capitalizeFirstLetter(user.firstname)}
                    onChange={handleUserChange}
                    error={!!userErrors.firstname}
                    errorMessage={userErrors.firstname}
                  />
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastname"
                    value={capitalizeFirstLetter(user.lastname)}
                    onChange={handleUserChange}
                    error={!!userErrors.lastname}
                    errorMessage={userErrors.lastname}
                  />
                </div>
              </fieldset>
            </div>
            <div className={styles.namesButtonRow}>
              <Button
                size="large"
                type="submit"
                fullWidth
                disabled={submitUserLoading}
                ariaLabel="Enregistrer les informations du profil"
              >
                {submitUserLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        )}
        <section
          className={styles.settingsContainer}
          aria-label="Actions sensibles sur le compte"
        >
          {placeId && (
            <article className={styles.deletePlaceCard}>
              <div className={styles.deletePlaceInfo}>
                <div className={styles.placeTitleRow}>
                  <h3
                    id="place-delete-title"
                    className={styles.deletePlaceTitle}
                  >
                    Supprimer mon lieu
                  </h3>
                  <InfoIcon
                    tooltip="La suppression de votre lieu est définitive : événements, photos du lieu, avis sur le lieu et sur ses événements, ainsi que les commentaires associés à ces avis seront supprimés."
                    place="right"
                    className={styles.infoIcon}
                  />
                </div>
                <p className={styles.deletePlaceDescription}>
                  Retirez votre lieu de la carte et supprimez toutes les données
                  liées (événements, avis, commentaires).
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
                ariaLabel="Supprimer mon lieu et toutes les données associées"
              >
                Supprimer le lieu
              </Button>
            </article>
          )}
          <article className={styles.deleteAccountCard}>
            <div className={styles.deleteAccountInfo}>
              <div className={styles.titleRow}>
                <h3 id="danger-zone-title" className={styles.deleteTitle}>
                  Supprimer mon compte
                </h3>
                <InfoIcon
                  tooltip="La suppression de votre compte entraînera la suppression définitive de : vos lieux, vos événements, vos partenariats, vos avis et commentaires et votre profil utilisateur. Cette action est irréversible et ne peut pas être annulée."
                  place="right"
                  className={styles.infoIcon}
                />
              </div>
              <p className={styles.deleteDescription}>
                Suppression définitive de votre compte et de toutes vos données.
                Cette action est irréversible.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={deleteAccount}
              disabled={isLoading}
              startIcon={<Trash2 size={16} />}
              ariaLabel="Supprimer définitivement mon compte et toutes mes données"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </Button>
          </article>
        </section>
        {placeId && (
          <BaseModal
            isOpen={isDeletePlaceModalOpen}
            onClose={() => setIsDeletePlaceModalOpen(false)}
            title="Supprimer ce lieu ?"
            primaryButtonLabel="Supprimer définitivement"
            secondaryButtonLabel="Annuler"
            onPrimaryAction={handleConfirmDeletePlace}
            primaryButtonType="button"
            isSubmitLoading={isDeletingPlace}
            withLoadingState={false}
          >
            <p className={styles.modalMessage}>
              Cette action est irréversible. Votre lieu, ses images, tous ses
              événements, les avis (lieu et événements) et les commentaires
              associés seront supprimés.
            </p>
          </BaseModal>
        )}
      </section>
    </div>
  );
};

export default AccountSettingsContainer;
