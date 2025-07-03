"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import React from "react";
import PlacesEditList from "@/components/account/placesList/PlacesEditList";
import { Organizer } from "@/types/user";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import styles from "./account.module.scss";
import { PlusCircleIcon } from "lucide-react";

export default function AccountPage() {
  const { user, loading, error } = useUser();
  const { showError } = useToast();
  const { userType } = user || {};
  const organizer = user as Organizer;
  const router = useRouter();

  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/account/places/create", text: "Ajouter un lieu" }
      : { route: "/account/create", text: "Ajouter mon activité" };

  if (error) {
    showError(error);
  }

  return (
    <main className={styles.accountPage}>
      {loading && <LoadingBar />}{" "}
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
            variant="secondary"
            onClick={() => router.push("/account/settings")}
            fullWidth
          >
            Paramètres du compte
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/account/reviews")}
            fullWidth
          >
            Mes Avis
          </Button>
        </div>
        {userType && (
          <Button
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
      {userType === "organizer" && organizer?.places && (
        <div className={styles.placesSection}>
          <PlacesEditList places={organizer?.places} />
        </div>
      )}
    </main>
  );
}
