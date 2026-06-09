import { UpdateCreator } from "@/components/account/Creator/UpdateCreator";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountUpdateCreator", locale);
}

const UpdateCreatorPage = () => {
  return <UpdateCreator />;
};

export default UpdateCreatorPage;
