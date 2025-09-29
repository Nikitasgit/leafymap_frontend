"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import styles from "./eventPage.module.scss";
import Text from "@/components/common/typography/Text";
import EventSchedule from "@/components/events/eventSchedule/EventSchedule";
import EventHeader from "@/components/events/eventPublicPage/eventHeader";
import ParticipantsList from "@/components/placeProfile/PlacePartnershipsList";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { PartnershipPopulated } from "@/types/partnerships";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import BackButton from "@/components/common/buttons/BackButton";

const EventPage = () => {
  const { eventId } = useParams();
  const { event, isLoading } = useEvent(eventId as string);

  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    event?.place?._id as string,
    eventId as string,
    "event",
    true
  );

  if (isLoading || partnershipsLoading || !event) return <LoadingBar />;

  return (
    <div className={styles.pageContainer}>
      <BackButton />
      <EventHeader event={event} />
      <div className={styles.eventInfo}>
        <TitleWithLine className={styles.eventDescriptionTitle}>
          Description de l&apos;évènement
        </TitleWithLine>
        <Text as="p" className={styles.eventDescription}>
          {event.description}
        </Text>
      </div>
      <ParticipantsList partnerships={partnerships as PartnershipPopulated[]} />
      <div className={styles.eventInfo}>
        <EventSchedule
          partnerships={partnerships as PartnershipPopulated[]}
          schedule={event.schedule || []}
        />
      </div>
    </div>
  );
};

export default EventPage;
