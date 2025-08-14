"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import React from "react";
import PlacesEditList from "@/components/account/placesList/PlacesEditList";
import { Creator, Organizer } from "@/types/user";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./account.module.scss";
import { PlusCircleIcon } from "lucide-react";

export default function AccountPage() {
  const { user, isLoading } = useCurrentUser();
  const { userType } = user || {};
  const organizer = user as Organizer;
  const creator = user as Creator;
  const router = useRouter();

  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/account/places/create", text: "Ajouter un lieu" }
      : { route: "/account/create", text: "Ajouter mon activité" };

  return (
    <main className={styles.accountPage}>
      {isLoading && <LoadingBar />}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <h1 className={styles.username}>{user?.username}</h1>
          <p className={styles.email}>{user?.email}</p>
        </div>
        <Image
          src={user?.image || "/images/default-avatar.png"}
          alt="Profile"
          width={80}
          height={80}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.buttonGroup}>
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={() => router.push("/account/settings")}
            fullWidth
          >
            Paramètres du compte
          </Button>
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={() => router.push("/account/reviews")}
            fullWidth
          >
            Mes Avis
          </Button>
        </div>
        <Button
          disabled={isLoading}
          endIcon={<PlusCircleIcon size={18} />}
          onClick={() => {
            router.push(buttonParameters.route);
          }}
          fullWidth
        >
          {buttonParameters.text}
        </Button>{" "}
        {userType === "creator" && creator?.creatorProfile?.place && (
          <>
            <Button
              fullWidth
              onClick={() =>
                router.push(
                  `account/places/${creator?.creatorProfile?.place?._id}/events/create`
                )
              }
            >
              Ajouter un événement
            </Button>
            <Button
              fullWidth
              onClick={() =>
                router.push(
                  `account/places/${creator?.creatorProfile?.place?._id}/events`
                )
              }
            >
              Voir les événements
            </Button>
          </>
        )}
      </div>

      {userType === "organizer" && organizer?.places && (
        <div className={styles.placesSection}>
          <PlacesEditList places={organizer?.places} />
        </div>
      )}
    </main>
  );
}
