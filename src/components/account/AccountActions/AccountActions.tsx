"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/common/buttons/Button";
import { Edit, Eye, Users, CalendarDays, Star, Leaf, Package } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import styles from "./AccountActions.module.scss";
import { User } from "@/types/user";

interface AccountActionsProps {
  user: User;
  isLoadingUser: boolean;
  onOpenCollaborations: () => void;
  onOpenEvents: () => void;
  onOpenReviews: () => void;
  onOpenFollows: () => void;
  onOpenProducts: () => void;
}

export default function AccountActions({
  user,
  isLoadingUser,
  onOpenCollaborations,
  onOpenEvents,
  onOpenReviews,
  onOpenFollows,
  onOpenProducts,
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
      : null;

  const shouldShowAddPlace = userType === "creator" && !user?.place;

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

      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={onOpenCollaborations}
        fullWidth
        endIcon={<Users size={16} />}
        ariaLabel="Ouvrir les collaborations"
      >
        Collaborations
      </Button>

      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={onOpenEvents}
        fullWidth
        endIcon={<CalendarDays size={16} />}
        ariaLabel="Ouvrir mes évènements"
      >
        Mes évènements
      </Button>

      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={onOpenReviews}
        fullWidth
        endIcon={<Star size={16} />}
        ariaLabel="Ouvrir les avis"
      >
        Avis
      </Button>

      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={onOpenFollows}
        fullWidth
        endIcon={<Leaf size={16} />}
        ariaLabel="Ouvrir les abonnements"
      >
        Abonnements
      </Button>

      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={onOpenProducts}
        fullWidth
        endIcon={<Package size={16} />}
        ariaLabel="Ouvrir les produits"
      >
        Produits
      </Button>

      {buttonParameters && (
        <Button
          disabled={isLoadingUser}
          variant="outline"
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

      {shouldShowAddPlace && (
        <Button
          disabled={isLoadingUser}
          variant="outline"
          endIcon={<Edit size={16} />}
          onClick={() => {
            router.push("/account/places/create");
          }}
          fullWidth
          ariaLabel="Ajouter un lieu"
        >
          Ajouter un lieu
        </Button>
      )}

      {userType === "guest" && (
        <div className={styles.infoCard}>
          <p className={styles.infoText}>
            ✨ Artisan, artiste, producteur local ou responsable de lieu
            (marché, boutique, espace culturel…)?
          </p>
          <p className={styles.infoText}>
            Mettez en lumière votre activité et rejoignez {APP_NAME} dès
            aujourd&apos;hui.
          </p>
          <p className={styles.infoText}>
            👉 Cliquez sur «Ajouter mon activité » pour créer votre profil !
          </p>
        </div>
      )}
    </section>
  );
}
