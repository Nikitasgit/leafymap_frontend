"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useEvent } from "@/hooks/useEvent";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import styles from "./eventPage.module.scss";
import { ArrowLeft } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventSchedule from "@/components/events/eventSchedule/EventSchedule";
import EventHeader from "@/components/events/eventPublicPage/eventHeader";
import Button from "@/components/common/buttons/button/Button";
import ParticipantsList from "@/components/events/eventPublicPage/participantsList";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { PartnershipPopulated } from "@/types/partnerships";
import TitleWithLine from "@/components/common/typography/titleWithLine";

const EventPage = () => {
  const { eventId } = useParams();
  const router = useRouter();
  const { event, isLoading } = useEvent(eventId as string);

  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    event?.place?._id as string,
    eventId as string,
    "event"
  );

  if (isLoading || partnershipsLoading || !event) return <LoadingBar />;

  return (
    <main className={styles.pageContainer}>
      <Button
        variant="simple"
        onClick={() => router.back()}
        className={styles.backButton}
        startIcon={<ArrowLeft size={16} />}
      >
        Retour
      </Button>
      <EventHeader event={event} />
      <div className={styles.eventInfo}>
        <TitleWithLine as="h3" className={styles.eventDescriptionTitle}>
          Description de l&apos;évènement
        </TitleWithLine>
        <Text as="p" className={styles.eventDescription}>
          {event.description}
        </Text>
      </div>
      <ParticipantsList partnerships={partnerships as PartnershipPopulated[]} />
      <div className={styles.eventInfo}>
        <EventSchedule schedule={event.schedule || []} />
      </div>
    </main>
  );
};

export default EventPage;
