import EventCreateContainer from "@/features/events/components/eventCreateContainer";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountEventCreate", locale);
}

const CreateEventPage = () => {
  return <EventCreateContainer />;
};

export default CreateEventPage;
