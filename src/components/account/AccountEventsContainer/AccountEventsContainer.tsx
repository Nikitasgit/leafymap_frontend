"use client";

import { useParams, useRouter } from "next/navigation";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import styles from "./AccountEventsContainer.module.scss";
import { getEventStatusFromSchedule } from "@/utils/eventDates";
import PageHeader from "@/components/common/PageHeader";
import EventsList from "@/components/account/AccountEventsList";
import Button from "@/components/common/buttons/Buttontempname";
import { Plus } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/functions";

export default function AccountEventsContainer() {
  const params = useParams();
  const router = useRouter();
  const { events, isLoading: eventsLoading } = usePlaceEvents(
    params.placeId as string
  );

  const placeName =
    capitalizeFirstLetter(events?.[0]?.place?.name) || "votre lieu";

  if (eventsLoading) return <LoadingBar />;

  const eventsWithStatus = events?.map((event) => ({
    ...event,
    status: ["cancelled", "full"].includes(event.status)
      ? event.status
      : getEventStatusFromSchedule(event.schedule || []),
  }));

  return (
    <div className={styles.container}>
      <PageHeader
        title="Événements"
        subtitle="Gérez les événements de votre lieu"
        showBackButton={true}
      />
      <Button
        onClick={() =>
          router.push(`/account/places/${params.placeId}/events/create`)
        }
        variant="outline"
        endIcon={<Plus size={16} />}
        className={styles.addEventButton}
        ariaLabel="Ajouter un événement"
      >
        Ajouter un événement
      </Button>
      <EventsList
        events={eventsWithStatus || []}
        placeId={params.placeId as string}
        placeName={placeName}
      />
    </div>
  );
}
