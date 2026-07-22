import { notFound } from "next/navigation";
import { generateEventMetadata } from "@/app/lib/entityMetadata";
import { getEventById } from "@/features/events/api/eventsApi";
import EventDetailsWithParticipants from "@/features/eventInvitations/components/eventDetailsWithParticipants";
import EventBookingWidget from "@/features/eventBookings/components/eventBookingWidget";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";
import styles from "./EventPage.module.scss";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    eventId: string;
  }>;
}) {
  const { locale, eventId } = await params;
  return generateEventMetadata(eventId, locale);
}

interface EventPageProps {
  params: Promise<{
    locale: string;
    eventId: string;
  }>;
}

const EventPage = async ({ params }: EventPageProps) => {
  const { eventId } = await params;

  const eventData = await getEventById(eventId);

  if (!eventData || typeof eventData === "string") {
    notFound();
  }

  const title = capitalizeFirstLetter(eventData.name);
  const place = resolveRefObject(eventData.place) ?? undefined;
  const user = resolveRefObject(eventData.user) ?? undefined;

  return (
    <main className={styles.container}>
      <h1>{title}</h1>
      <EventDetailsWithParticipants event={eventData} place={place} user={user} />
      {eventData.isBookable && <EventBookingWidget event={eventData} />}
    </main>
  );
};

export default EventPage;
