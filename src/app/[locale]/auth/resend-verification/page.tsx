import ResendVerificationForm from "@/components/auth/resendVerificationForm";
import { getPageMetadata } from "@/lib/pageMetadata";

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
