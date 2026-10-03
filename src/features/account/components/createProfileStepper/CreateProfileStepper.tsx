"use client";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileFormStep from "../createProfileSteps/profileFormStep";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "./CreateProfileStepper.types";
import { defaultSchedule } from "../../utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import useSubmitUser from "@/features/users/hooks/useSubmitUser";
import useSubmitPlace from "@/features/places/hooks/useSubmitPlace";
import { User } from "@/features/users/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";
import PageHeader from "@/shared/ui/pageHeader";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { ProtectedRoute, useAuth, useCurrentUser } from "@/features/auth";
import { useApp } from "@/features/categories";

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
  const { refetch: refetchCurrentUser } = useCurrentUser();
  const { userCategories } = useApp();
  const skipGuestGuardRef = useRef(false);
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

  const nextPath =
    searchParams.get("redirectTo") === "/account/events/create"
      ? "/account/events/create"
      : "/account";

  const handleSubmit = async () => {
    try {
      const updatedUser = await submitUser(newUser);
      if (!updatedUser) {
        return;
      }
      if (place.active === true) {
        const createdPlace = await submitPlace(place);
        if (!createdPlace) {
          return;
        }
      }
      // The session still holds the guest profile. Refresh it before leaving
      // so the event form can offer the new place. Skip the guest-only guard
      // first: once the user becomes a creator, that guard would send them
      // to /account instead of the event form.
      skipGuestGuardRef.current = true;
      try {
        await refetchCurrentUser();
      } catch {
        // The profile is already saved. A later load picks up the place.
      }
      showSuccess(t("createProfileStepper.createSuccess"));
      router.push(nextPath);
    } catch {
      skipGuestGuardRef.current = false;
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
      allowedUserTypes={skipGuestGuardRef.current ? undefined : ["guest"]}
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
