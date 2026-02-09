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
  return () => {};
};

export default EventPage;
