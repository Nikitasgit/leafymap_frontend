import ResetPasswordForm from "@/components/auth/resetPasswordForm";
import { getPageMetadata } from "@/lib/pageMetadata";

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
