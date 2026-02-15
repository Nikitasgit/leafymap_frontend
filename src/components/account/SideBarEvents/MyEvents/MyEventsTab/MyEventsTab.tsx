"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import EventsList from "@/components/account/AccountEventsList";
import Button from "@/components/common/buttons/Button";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { capitalizeFirstLetter } from "@/utils/functions";
import styles from "./MyEventsTab.module.scss";

export default function MyEventsTab() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const place =
    user?.place && typeof user.place === "object" ? user.place : null;
  const { events, isLoading: eventsLoading } = usePlaceEvents(place?._id ?? null);

  if (isLoadingUser || (place && eventsLoading)) {
    return <LoadingBar />;
  }

  if (!place) {
    return (
      <div className={styles.content}>
        <EmptyState
          title="Aucun lieu"
          description="Créez d'abord un lieu pour gérer des événements."
        />
      </div>
    );
  }

  const placeName =
    capitalizeFirstLetter(
      (place as { name?: string }).name ?? events?.[0]?.place?.name
    ) || "votre lieu";

  return (
    <div className={styles.content}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Calendar size={20} className={styles.icon} />
            Mes évènements
          </p>
          <p className={styles.info}>
            Gérez les événements de votre lieu. Créez-en de nouveaux ou
            modifiez les existants.
          </p>
        </div>
      </div>
      <Button
        onClick={() =>
          router.push(`/account/places/${place._id}/events/create`)
        }
        variant="outline"
        endIcon={<Plus size={16} />}
        className={styles.addEventButton}
        ariaLabel="Créer un évènement"
        fullWidth
      >
        Créer un évènement
      </Button>
      <EventsList
        events={events || []}
        placeId={place._id}
        placeName={placeName}
      />
    </div>
  );
}
