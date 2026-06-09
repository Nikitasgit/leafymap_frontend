import MapPageContainer from "@/components/map/MapPageContainer";
import { getMapMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getMapMetadata(locale);
}

const MapPage = () => {
  return <MapPageContainer />;
};

export default MapPage;
