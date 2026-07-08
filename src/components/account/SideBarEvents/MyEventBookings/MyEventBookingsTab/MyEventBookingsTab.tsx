"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { useMyEventBookings } from "@/hooks/useMyEventBookings";
import MyEventBookingsList from "../MyEventBookingsList";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./MyEventBookingsTab.module.scss";

export default function MyEventBookingsTab() {
  const { eventBookings, isLoading, refetch } = useMyEventBookings();

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.content}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Ticket size={20} className={styles.icon} />
            Mes réservations
          </p>
          <p className={styles.info}>
            Retrouvez vos réservations pour des évènements. Vous pouvez
            modifier le nombre de places ou annuler une réservation.
          </p>
        </div>
      </div>
      {eventBookings.length === 0 ? (
        <EmptyState
          title="Aucune réservation"
          description="Vous n'avez réservé aucun évènement pour le moment."
          icon={<Ticket className={styles.emptyIcon} />}
        />
      ) : (
        <MyEventBookingsList eventBookings={eventBookings} onChange={refetch} />
      )}
    </div>
  );
}
