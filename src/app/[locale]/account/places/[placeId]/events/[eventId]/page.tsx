"use client";
import EventForm from "@/components/account/formComponents/Event/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import styles from "./editEventPage.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import PageHeader from "@/components/common/PageHeader";

const UpdateEventPage = () => {
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
    <div className={styles.pageContainer}>
      <div className={styles.container}>
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
      </div>
    </div>
  );
};

export default UpdateEventPage;
