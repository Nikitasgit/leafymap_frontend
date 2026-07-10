"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "@/components/account/CreateProfileStepper";
import ActivityFormStep from "@/components/account/CreateProfileSteps/ProfileFormStep";
import useUpdateUser from "@/hooks/useSubmitUser";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import PageHeader from "@/components/common/PageHeader";
import styles from "./UpdateCreator.module.scss";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialUserData = (user: InitialCreatorData): InitialCreatorData => ({
  userType: user.userType || "creator",
  username: user.username || "",
  description: user.description || "",
  userCategory:
    typeof user.userCategory === "string"
      ? user.userCategory
      : user.userCategory?._id ?? "",
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
    null,
  );
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

  if (user && user._id !== syncedUserId) {
    setSyncedUserId(user._id);
    setUpdatedUser(
      initialUserData({
        ...user,
        userCategory:
          typeof user.userCategory === "string"
            ? user.userCategory
            : user.userCategory?._id ?? "",
      }),
    );
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
