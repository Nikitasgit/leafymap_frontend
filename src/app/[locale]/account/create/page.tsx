import { Suspense } from "react";
import CreateProfileStepper from "@/components/account/CreateProfileStepper";
import LoadingBar from "@/components/common/loading/LoadingBar";
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
  return (
    <Suspense fallback={<LoadingBar />}>
      <CreateProfileStepper />
    </Suspense>
  );
};

export default CreateAccount;
