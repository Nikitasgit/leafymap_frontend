import MapPageContainer from "@/features/map/components/mapPageContainer";
import { AnnouncementBanner } from "@/features/announcements";
import { getMapMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getMapMetadata(locale);
}

const MapPage = () => {
  return (
    <>
      <AnnouncementBanner />
      <MapPageContainer />
    </>
  );
};

export default MapPage;
