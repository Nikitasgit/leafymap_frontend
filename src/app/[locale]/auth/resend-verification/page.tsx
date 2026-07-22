import { ResendVerificationForm } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("resendVerification", locale);
}

export default function ResendVerification() {
  return <ResendVerificationForm />;
}
