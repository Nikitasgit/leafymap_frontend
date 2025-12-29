"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "@/components/account/CreateProfileStepper";
import ActivityFormStep from "@/components/account/CreateProfileSteps/ProfileFormStep";
import useUpdateUser from "@/hooks/useSubmitUser";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useToast } from "@/hooks/useToast";
import PageHeader from "@/components/common/PageHeader";
import styles from "./UpdateCreator.module.scss";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialUserData = (user: InitialCreatorData): InitialCreatorData => ({
  userType: user.userType || "creator",
  username: user.username || "",
  description: user.description || "",
  userCategories: user.userCategories || [],
  website: user.website || "",
  phone: user.phone || "",
  firstname: user.firstname || "",
  lastname: user.lastname || "",
});

const UpdateCreator = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useUpdateUser();

  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [updatedUser, setUpdatedUser] = useState<InitialCreatorData | null>(
    null
  );

  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    try {
      if (updatedUser) {
        await submitUser(updatedUser);
        showSuccess("Profil mis à jour avec succès");
        router.push("/account");
      }
    } catch {
      showError("Erreur lors de la mise à jour");
    }
  };

  const loading = userLoading || !updatedUser || submitUserLoading;

  useEffect(() => {
    if (user) {
      setUpdatedUser(
        initialUserData({
          ...user,
          userCategories: user.userCategories.map(
            (category) => category._id
          ),
        })
      );
    }
  }, [user]);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier votre profil" showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <ActivityFormStep
            firstStep={true}
            user={updatedUser}
            onUserChange={onUserChange}
            onPlaceChange={() => {}}
            onSubmit={handleSubmit}
            submitButtonText="Enregistrer"
            showPlaceForm={false}
          />
        )}
      </section>
    </div>
  );
};

export default UpdateCreator;
