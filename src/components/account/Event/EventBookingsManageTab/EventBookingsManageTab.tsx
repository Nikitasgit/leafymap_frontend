"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { useEventBookingsForEvent } from "@/hooks/useEventBookingsForEvent";
import EventBookingsManageList from "./EventBookingsManageList";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./EventBookingsManageTab.module.scss";

interface EventBookingsManageTabProps {
  eventId: string;
  maxSeatsPerBooking: number;
  capacity?: number | null;
  bookedSeats?: number;
  hasEventStarted?: boolean;
}

export default function EventBookingsManageTab({
  eventId,
  maxSeatsPerBooking,
  capacity,
  bookedSeats,
  hasEventStarted = false,
}: EventBookingsManageTabProps) {
  const { eventBookings, isLoading, refetch } =
    useEventBookingsForEvent(eventId);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.content}>
      <div className={styles.headerSection}>
        <p className={styles.label}>
          <Ticket size={20} className={styles.icon} />
          Réservations
        </p>
        <p className={styles.info}>
          {typeof capacity === "number"
            ? `${bookedSeats ?? 0} / ${capacity} place(s) réservée(s).`
            : `${bookedSeats ?? 0} place(s) réservée(s) — capacité illimitée.`}
        </p>
      </div>
      {eventBookings.length === 0 ? (
        <EmptyState
          title="Aucune réservation"
          description="Personne n'a encore réservé de place pour cet évènement."
          icon={<Ticket className={styles.emptyIcon} />}
        />
      ) : (
        <EventBookingsManageList
          eventBookings={eventBookings}
          maxSeatsPerBooking={maxSeatsPerBooking}
          hasEventStarted={hasEventStarted}
          onChange={refetch}
        />
      )}
    </div>
  );
}
