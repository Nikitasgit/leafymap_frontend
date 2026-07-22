"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import AccountEventCard from "../accountEventCard";
import { Event } from "../../types/event";
import styles from "./AccountEventsList.module.scss";
import EmptyState from "@/shared/ui/noResults/emptyState";

interface EventsListProps {
  events: Event[];
  placeId?: string;
  placeName?: string;
  onEventDeleted?: () => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  placeId,
  placeName,
  onEventDeleted,
}) => {
  const { t } = useTranslation("events");

  return (
    <section className={styles.content}>
      <h2 className={styles.placeName}>
        {placeName ? (
          <Trans
            i18nKey="accountEventsList.placeEventsTitle"
            ns="events"
            values={{ placeName }}
            components={{ span: <span /> }}
          />
        ) : (
          t("accountEventsList.myEventsTitle")
        )}
      </h2>
      {events.length === 0 ? (
        <EmptyState
          title={t("accountEventsList.emptyTitle")}
          description={t("accountEventsList.emptyDescription")}
        />
      ) : (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <AccountEventCard
              key={event.id}
              event={event}
              placeId={placeId}
              onDeleted={onEventDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsList;
