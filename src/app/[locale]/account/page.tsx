"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";
import React from "react";
import PlacesEditList from "@/components/account/placesList/PlacesEditList";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./account.module.scss";
import { PlusCircleIcon } from "lucide-react";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import { capitalizeFirstLetter } from "@/utils/functions";
import Text from "@/components/common/typography/Text";
import useSubmitUser from "@/hooks/useSubmitUser";
import { Image } from "@/types/image";

export default function AccountPage() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { submitUser } = useSubmitUser();
  const { userType } = user || {};
  const router = useRouter();

  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "guest"
      ? {
          route: "/account/create",
          text: "Ajouter mon activité",
        }
      : userType === "organizer" && user?.places && user.places.length < 3
      ? {
          route: "/account/places/create",
          text: "Ajouter un lieu",
        }
      : null;

  if (isLoadingUser || !user) return <LoadingBar />;

  const handleImageUploaded = async (imageId: string | null) => {
    if (imageId) {
      await submitUser({
        image: imageId,
      });
    }
  };

  return (
    <main className={styles.accountPage}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Text as="h1" className={styles.username}>
            {capitalizeFirstLetter(user?.username)}
          </Text>
          {user?.creatorName && (
            <Text as="p" className={styles.creatorName}>
              {user?.creatorName}
            </Text>
          )}
          <Text as="p" className={styles.email}>
            {user?.email}
          </Text>
        </div>
        <ProfilePictureUploader
          onImageUploaded={handleImageUploaded}
          type="User"
          reference={user?._id}
          initialImage={user.image as Image}
          isOwner={true}
          size="medium"
          rounded
          disabled={isLoadingUser}
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.buttonGroup}>
          <Button
            disabled={isLoadingUser}
            variant="secondary"
            onClick={() => router.push("/account/settings")}
            fullWidth
          >
            Paramètres du compte
          </Button>
          <Button
            disabled={isLoadingUser}
            variant="secondary"
            onClick={() => router.push("/account/reviews")}
            fullWidth
          >
            Mes Avis
          </Button>
        </div>
        {buttonParameters && (
          <Button
            disabled={isLoadingUser}
            endIcon={<PlusCircleIcon size={18} />}
            onClick={() => {
              router.push(buttonParameters.route);
            }}
            fullWidth
          >
            {buttonParameters.text}
          </Button>
        )}
      </div>

      {user?.places && user.places.length > 0 && (
        <div className={styles.placesSection}>
          <PlacesEditList places={user?.places} />
        </div>
      )}
    </main>
  );
}
