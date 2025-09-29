import PlaceProfileContainer from "@/components/placeProfile/PlaceProfileContainer";
import { generatePlaceMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    placeId: string;
  }>;
}) {
  const { placeId } = await params;
  return generatePlaceMetadata(placeId);
}

const PlacePage = () => {
  return <PlaceProfileContainer />;
};

export default PlacePage;
