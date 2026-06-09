import ForgotPasswordForm from "@/components/auth/forgotPasswordForm";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("forgotPassword", locale);
}

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
