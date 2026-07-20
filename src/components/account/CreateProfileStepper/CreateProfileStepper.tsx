"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileFormStep from "../CreateProfileSteps/ProfileFormStep";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "./CreateProfileStepper.types";
import { defaultSchedule } from "@/utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import useSubmitUser from "@/hooks/useSubmitUser";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { User } from "@/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import PageHeader from "@/components/common/PageHeader";
import LoadingBar from "@/components/common/loading/LoadingBar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useApp } from "@/hooks/useApp";

const initialUserData = (user: Partial<User> | null): InitialCreatorData => ({
  userType: "creator",
  username: "",
  description: "",
  userCategory: "",
  website: user?.website || "",
  phone: user?.phone || "",
  firstname: user?.firstname || "",
  lastname: user?.lastname || "",
});

const initialPlaceData = (user: Partial<User> | null): InitialPlaceData => ({
  name: "",
  description: "",
  location: null,
  defaultSchedule: defaultSchedule,
  placeCategory: "",
  active: true,
  phone: user?.phone || "",
  email: user?.email || "",
  website: user?.website || "",
});

const CreateProfileStepper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation("account");
  const { user } = useAuth();
  const { userCategories } = useApp();
  const { submitUser } = useSubmitUser();
  const { submitPlace } = useSubmitPlace();

  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(null));
  const [newUser, setNewUser] = useState<InitialCreatorData>(
    initialUserData(null),
  );
  const [initializedGuestUserId, setInitializedGuestUserId] = useState<
    string | null
  >(null);

  if (
    user &&
    user.userType === "guest" &&
    initializedGuestUserId !== user.id
  ) {
    setInitializedGuestUserId(user.id);
    setNewUser(initialUserData(user));
    setPlace(initialPlaceData(user));
  }

  const organizerCategory = userCategories.find(
    (category) => category.name === "organizer",
  );

  if (!newUser.userCategory && organizerCategory) {
    setNewUser((prev) =>
      prev.userCategory
        ? prev
        : { ...prev, userCategory: organizerCategory.id },
    );
  }

  const handleSubmit = async () => {
    try {
      const user = await submitUser(newUser);
      if (place.active === true && user) {
        await submitPlace(place);
      }
      showSuccess(t("createProfileStepper.createSuccess"));
      const redirectTo = searchParams.get("redirectTo");
      router.push(
        redirectTo === "/account/events/create"
          ? "/account/events/create"
          : "/account",
      );
    } catch {
      showError(t("createProfileStepper.createError"));
    }
  };

  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <ProtectedRoute
      allowedUserTypes={["guest"]}
      redirectTo="/account"
      fallback={<LoadingBar />}
    >
      <div className={styles.pageContainer}>
        <section className={styles.container}>
          <PageHeader title={t("createProfileStepper.title")} showBackButton />

          <ProfileFormStep
            place={place}
            user={newUser}
            onPlaceChange={onPlaceChange}
            onUserChange={onUserChange}
            onSubmit={handleSubmit}
            firstStep={true}
            showPlaceForm={true}
            showPlaceRadioYesOrNo={true}
          />
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default CreateProfileStepper;
