import UpdatePlaceContainer from "@/components/account/Place/UpdatePlaceContainer";
import { getPageMetadata } from "@/lib/pageMetadata";

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
