"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../../createProfileStepper";
import ActivityFormStep from "../../createProfileSteps/profileFormStep";
import useUpdateUser from "@/features/users/hooks/useSubmitUser";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useToast } from "@/shared/hooks/useToast";
import PageHeader from "@/shared/ui/pageHeader";
import styles from "./UpdateCreator.module.scss";
import { useCurrentUser } from "@/features/auth";
import { User } from "@/features/users/types";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";

const initialUserData = (user: Partial<User>): InitialCreatorData => ({
  userType: user.userType || "creator",
  username: user.username || "",
  description: user.description || "",
  userCategory: resolveRefId(user.userCategory) ?? "",
  website: user.website || "",
  phone: user.phone || "",
  firstname: user.firstname || "",
  lastname: user.lastname || "",
});

const UpdateCreator = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();
  const { t } = useTranslation("account");

  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [updatedUser, setUpdatedUser] = useState<InitialCreatorData | null>(
    null
  );
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setUpdatedUser(initialUserData(user));
  }

  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    try {
      if (updatedUser) {
        await submitUser(updatedUser);
        showSuccess(t("updateCreator.updateSuccess"));
        router.push("/account");
      }
    } catch {
      showError(t("updateCreator.updateError"));
    }
  };

  const loading = userLoading || !updatedUser || submitUserLoading;

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title={t("updateCreator.title")} showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <ActivityFormStep
            firstStep={true}
            user={updatedUser}
            onUserChange={onUserChange}
            onPlaceChange={() => {}}
            onSubmit={handleSubmit}
            submitButtonText={t("common:actions.save")}
            showPlaceForm={false}
            hideUserLegalName
          />
        )}
      </section>
    </div>
  );
};

export default UpdateCreator;
