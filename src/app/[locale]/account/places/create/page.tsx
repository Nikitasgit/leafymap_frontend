import CreatePlaceContainer from "@/components/account/Place/CreatePlaceContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

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
