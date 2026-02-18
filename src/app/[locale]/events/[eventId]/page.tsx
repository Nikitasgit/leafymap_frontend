import { generateEventMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    eventId: string;
  }>;
}) {
  const { eventId } = await params;
  return generateEventMetadata(eventId);
}

const EventPage = () => {
  return <div>Event Page</div>;
};

export default EventPage;
