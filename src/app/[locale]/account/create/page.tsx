import CreateProfileStepper from "@/components/account/CreateProfileStepper";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("accountCreate", locale);
}

const CreateAccount = () => {
  return <CreateProfileStepper />;
};

export default CreateAccount;
