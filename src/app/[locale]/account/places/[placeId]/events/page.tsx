"use client";

import { useParams, useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { Plus } from "lucide-react";
import styles from "./eventsPage.module.scss";
import { getEventStatusFromSchedule } from "@/utils/eventDates";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import EventsList from "@/components/events/EventsList";

export default function EventsListPage() {
  const params = useParams();
  const router = useRouter();
  const { events, isLoading } = usePlaceEvents(params.placeId as string);

  const placeName = events?.[0]?.place?.name || "Événements de votre lieu";

  if (isLoading) return <LoadingBar />;

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
        onBackClick={() => router.push("/account")}
        backButtonLabel="Retour au compte"
        rightComponent={
          <Button
            onClick={() =>
              router.push(`/account/places/${params.placeId}/events/create`)
            }
            variant="secondary"
            endIcon={<Plus size={16} />}
          >
            Ajouter un événement
          </Button>
        }
      />

      <EventsList
        events={eventsWithStatus || []}
        placeId={params.placeId as string}
        placeName={placeName}
      />
    </div>
  );
}
