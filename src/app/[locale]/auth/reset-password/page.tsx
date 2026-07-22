import { ResetPasswordForm } from "@/features/auth";
import { getPageMetadata } from "@/app/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getPageMetadata("resetPassword", locale);
}

export default function ResetPassword() {
  return <ResetPasswordForm />;
}
