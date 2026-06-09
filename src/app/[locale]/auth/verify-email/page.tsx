import VerifyEmailHandler from "@/components/auth/verifyEmailHandler";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("verifyEmail", locale);
}

export default function VerifyEmail() {
  return <VerifyEmailHandler />;
}
