"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEvents } from "@/hooks/useUserEvents";
import EventsList from "@/components/account/AccountEventsList";
import Button from "@/components/common/buttons/Button";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./MyEventsTab.module.scss";

export default function MyEventsTab() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { events, isLoading: eventsLoading } = useUserEvents(user?._id ?? null);

  if (isLoadingUser || eventsLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.content}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Calendar size={20} className={styles.icon} />
            Mes évènements
          </p>
          <p className={styles.info}>
            Gérez vos événements. Créez-en de nouveaux, avec un lieu, une
            adresse dédiée ou en ligne.
          </p>
        </div>
      </div>
      <Button
        onClick={() => router.push("/account/events/create")}
        variant="outline"
        endIcon={<Plus size={16} />}
        className={styles.addEventButton}
        ariaLabel="Créer un évènement"
        fullWidth
      >
        Créer un évènement
      </Button>
      <EventsList events={events || []} />
    </div>
  );
}
