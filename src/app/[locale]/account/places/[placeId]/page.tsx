import UpdatePlaceContainer from "@/features/places/components/updatePlaceContainer";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountPlaceUpdate", locale);
}

const UpdatePlace = () => {
  return <UpdatePlaceContainer />;
};

export default UpdatePlace;
