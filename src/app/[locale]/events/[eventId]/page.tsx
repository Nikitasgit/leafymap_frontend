import { notFound } from "next/navigation";
import { generateEventMetadata } from "@/lib/metadata";
import { getEventById } from "@/lib/api/events";
import EventDetails from "@/components/eventProfile/EventDetails/EventDetails";
import { capitalizeFirstLetter } from "@/utils/functions";

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

  return (
    <main className="container">
      <h1>{title}</h1>
      <EventDetails
        event={eventData}
        place={eventData.place}
        user={eventData.user}
      />
    </main>
  );
};

export default EventPage;
