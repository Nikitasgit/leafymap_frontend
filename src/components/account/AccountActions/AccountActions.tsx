"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";
import React from "react";
import { Edit, Eye } from "lucide-react";
import styles from "./AccountActions.module.scss";
import { User } from "@/types/user";

interface AccountActionsProps {
  user: User;
  isLoadingUser: boolean;
}

export default function AccountActions({
  user,
  isLoadingUser,
}: AccountActionsProps) {
  const router = useRouter();
  const { userType } = user || {};

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

  return (
    <section className={styles.actions}>
      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={() => router.push("/account/settings")}
        fullWidth
        ariaLabel="Accéder aux paramètres du compte"
      >
        Paramètres du compte
      </Button>
      {userType === "creator" && (
        <Button
          disabled={isLoadingUser}
          variant="secondary"
          onClick={() => router.push(`/users/${user._id}`)}
          fullWidth
          endIcon={<Eye size={16} />}
          ariaLabel="Voir mon profil public"
        >
          Voir mon profil public
        </Button>
      )}
      {buttonParameters && (
        <Button
          disabled={isLoadingUser}
          variant="secondary"
          endIcon={<Edit size={16} />}
          onClick={() => {
            router.push(buttonParameters.route);
          }}
          fullWidth
          ariaLabel={buttonParameters.text}
        >
          {buttonParameters.text}
        </Button>
      )}
    </section>
  );
}
