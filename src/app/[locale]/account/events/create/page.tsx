import EventCreateContainer from "@/components/account/Event/EventCreateContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

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
