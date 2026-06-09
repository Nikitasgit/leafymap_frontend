import AcceptCguForm from "@/components/auth/acceptCguForm/AcceptCguForm";
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
  return <AcceptCguForm />;
}
