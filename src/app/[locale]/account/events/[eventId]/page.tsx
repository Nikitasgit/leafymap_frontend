import EventModifyContainer from "@/components/account/Event/EventModifyContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountEventUpdate", locale);
}

const UpdateEventPage = () => {
  return <EventModifyContainer />;
};

export default UpdateEventPage;
