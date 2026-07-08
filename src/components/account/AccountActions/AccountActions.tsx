"use client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/buttons/Button";
import {
  Edit,
  Users,
  CalendarDays,
  Star,
  Leaf,
  Package,
  MapPin,
  Settings,
  Image as ImageIcon,
  Ticket,
} from "lucide-react";
import styles from "./AccountActions.module.scss";
import { User } from "@/types/user";
import { SIDEBAR_VALUES, type SidebarValue } from "@/utils/accountTabs";

interface AccountActionButtonProps {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
  creatorOnly?: boolean;
}

function AccountActionButton({
  label,
  ariaLabel,
  icon,
  onClick,
  disabled,
}: AccountActionButtonProps) {
  return (
    <div className={styles.actionItem}>
      <Button
        disabled={disabled}
        variant="secondary"
        onClick={onClick}
        fullWidth
        startIcon={icon}
        className={styles.actionButton}
        ariaLabel={ariaLabel}
      >
        {label}
      </Button>
    </div>
  );
}

interface AccountActionsProps {
  user: User;
  isLoadingUser: boolean;
  onToggleSidebar: (sidebar: SidebarValue) => void;
}

export default function AccountActions({
  user,
  isLoadingUser,
  onToggleSidebar,
}: AccountActionsProps) {
  const router = useRouter();
  const { t } = useTranslation("marketing");
  const { userType } = user || {};

  const isCreator = userType === "creator";
  const hasPlaceObject = !!(user?.place && typeof user.place === "object");

  const primaryActions: AccountActionButtonProps[] = [
    ...(isCreator && hasPlaceObject
      ? [
          {
            label: "Lieu",
            ariaLabel: "Gérer mon lieu",
            icon: <MapPin size={16} />,
            onClick: () =>
              hasPlaceObject &&
              router.push(`/account/places/${(user.place as any)._id}`),
            disabled: isLoadingUser,
            creatorOnly: true,
          } as AccountActionButtonProps,
        ]
      : []),
    {
      label: "Images",
      ariaLabel: "Gérer mes images",
      icon: <ImageIcon size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.IMAGES),
      disabled: isLoadingUser,
      creatorOnly: true,
    },
    {
      label: "Collaborations",
      ariaLabel: "Ouvrir les collaborations",
      icon: <Users size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.COLLABORATIONS),
      disabled: isLoadingUser,
      creatorOnly: true,
    },
    {
      label: "Évènements",
      ariaLabel: "Ouvrir les évènements",
      icon: <CalendarDays size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.EVENTS),
      disabled: isLoadingUser,
      creatorOnly: true,
    },
    {
      label: "Réservations",
      ariaLabel: "Ouvrir mes réservations",
      icon: <Ticket size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.BOOKINGS),
      disabled: isLoadingUser,
    },
    {
      label: "Avis",
      ariaLabel: "Ouvrir les avis",
      icon: <Star size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.REVIEWS),
      disabled: isLoadingUser,
    },
    {
      label: "Abonnements",
      ariaLabel: "Ouvrir les abonnements",
      icon: <Leaf size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.FOLLOWS),
      disabled: isLoadingUser,
    },
    {
      label: "Produits",
      ariaLabel: "Ouvrir les produits",
      icon: <Package size={16} />,
      onClick: () => onToggleSidebar(SIDEBAR_VALUES.PRODUCTS),
      disabled: isLoadingUser,
      creatorOnly: true,
    },
  ];

  const buttonParameters =
    isCreator
      ? { route: "/account/update-creator", text: t("account.editProfile") }
      : userType === "guest"
      ? {
          route: "/account/create",
          text: t("account.addActivity"),
        }
      : null;

  const shouldShowAddPlace = isCreator && !user?.place;

  return (
    <section className={styles.actions}>
      <Button
        disabled={isLoadingUser}
        variant="secondary"
        onClick={() => router.push("/account/settings")}
        fullWidth
        startIcon={<Settings size={16} />}
        ariaLabel="Accéder aux paramètres du compte"
      >
        Paramètres du compte
      </Button>

      {buttonParameters && (
        <Button
          disabled={isLoadingUser}
          variant="outline"
          startIcon={<Edit size={16} />}
          onClick={() => {
            router.push(buttonParameters.route);
          }}
          fullWidth
          ariaLabel={buttonParameters.text}
        >
          {buttonParameters.text}
        </Button>
      )}

      <div className={styles.actionsGrid}>
        {primaryActions.map((action, index) => {
          if (action.creatorOnly && !isCreator) {
            return null;
          }

          return (
            <AccountActionButton
              key={`${action.label}-${index}`}
              label={action.label}
              ariaLabel={action.ariaLabel}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
            />
          );
        })}
      </div>

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
          <p className={styles.infoText}>{t("account.guestInfoLine1")}</p>
          <p className={styles.infoText}>{t("account.guestInfoLine2")}</p>
          <p className={styles.infoText}>{t("account.guestInfoLine3")}</p>
        </div>
      )}
    </section>
  );
}
