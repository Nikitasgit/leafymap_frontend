import CreatePlaceContainer from "@/features/places/components/createPlaceContainer";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountPlaceCreate", locale);
}

const CreatePlace = () => {
  return <CreatePlaceContainer />;
};

export default CreatePlace;
