import EventModifyContainer from "@/features/account/components/eventModifyContainer";
import { getPageMetadata } from "@/app/lib/pageMetadata";

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
