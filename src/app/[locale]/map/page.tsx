import { AnnouncementBanner } from "@/features/announcements";
import { getMapMetadata } from "@/app/lib/pageMetadata";
import MapPageClient from "@/features/map/components/mapPageClient";

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
      <MapPageClient />
    </>
  );
};

export default MapPage;
