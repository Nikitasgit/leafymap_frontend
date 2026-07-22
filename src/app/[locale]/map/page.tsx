import MapPageContainer from "@/features/map/components/mapPageContainer";
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
  return <MapPageContainer />;
};

export default MapPage;
