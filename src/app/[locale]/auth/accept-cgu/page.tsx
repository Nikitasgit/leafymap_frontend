import AccountConsentForm from "@/components/auth/accountConsentForm/AccountConsentForm";
import { getPageMetadata } from "@/lib/pageMetadata";

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
