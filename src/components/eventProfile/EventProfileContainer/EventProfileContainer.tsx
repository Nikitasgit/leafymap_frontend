"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import styles from "./EventProfileContainer.module.scss";
import EventProfileSchedule from "@/components/eventProfile/EventProfileSchedule";
import EventHeader from "@/components/eventProfile/EventHeader";
import EventInfo from "@/components/eventProfile/EventInfo";
import PartnershipsList from "@/components/placeProfile/PartnershipsList";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { PartnershipPopulated } from "@/types/partnerships";

const EventProfileContainer = () => {
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
      <article className={styles.container}>
        <EventHeader event={event} />
        <EventInfo description={event.description} />
        <PartnershipsList
          partnerships={partnerships as PartnershipPopulated[]}
        />
        <EventProfileSchedule
          partnerships={partnerships as PartnershipPopulated[]}
          schedule={event.schedule || []}
        />
      </article>
    </div>
  );
};

export default EventProfileContainer;
