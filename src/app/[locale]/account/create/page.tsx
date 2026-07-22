import { Suspense } from "react";
import { CreateProfileStepper } from "@/features/account";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { getPageMetadata } from "@/app/lib/pageMetadata";

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
