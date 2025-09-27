"use client";
import EventForm from "@/components/account/Event/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import PageHeader from "@/components/common/PageHeader";
import styles from "./EventModifyContainer.module.scss";

const EventModifyContainer = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  const placeId = params.placeId as string;
  const { event, isLoading: eventLoading } = useEvent(eventId);
  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    placeId,
    eventId,
    "event"
  );

  const loading = eventLoading || partnershipsLoading;

  return (
    <div className={styles.EventModifyContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier un événement" showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <EventForm
            eventData={event}
            isUpdate={true}
            partnershipsData={partnerships}
          />
        )}
      </section>
    </div>
  );
};

export default EventModifyContainer;
