import { AccountConsentForm } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("acceptCgu", locale);
}

export default function AcceptCguPage() {
  return <AccountConsentForm />;
}
