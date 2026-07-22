"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEventBookingsForEvent } from "../../hooks/useEventBookingsForEvent";
import EventBookingsManageList from "./EventBookingsManageList";
import EmptyState from "@/shared/ui/noResults/emptyState";
import LoadingBar from "@/shared/ui/loading/loadingBar";
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
  const { t } = useTranslation("events");
  const { eventBookings, isLoading, refetch } =
    useEventBookingsForEvent(eventId);

  if (isLoading) {
    return <LoadingBar />;
  }

  const bookedCount = bookedSeats ?? 0;

  return (
    <div className={styles.content}>
      <div className={styles.headerSection}>
        <p className={styles.label}>
          <Ticket size={20} className={styles.icon} />
          {t("eventBookingsManageTab.title")}
        </p>
        <p className={styles.info}>
          {typeof capacity === "number"
            ? t("eventBookingsManageTab.bookedSeatsLimited", {
                count: bookedCount,
                booked: bookedCount,
                capacity,
              })
            : t("eventBookingsManageTab.bookedSeatsUnlimited", {
                count: bookedCount,
                booked: bookedCount,
              })}
        </p>
      </div>
      {eventBookings.length === 0 ? (
        <EmptyState
          title={t("eventBookingsManageTab.emptyTitle")}
          description={t("eventBookingsManageTab.emptyDescription")}
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
