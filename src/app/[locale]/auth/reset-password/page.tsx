import ResetPasswordForm from "@/components/auth/resetPasswordForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Réinitialiser le mot de passe | ${APP_NAME}`,
  description: `Réinitialisez votre mot de passe ${APP_NAME} en entrant votre nouveau mot de passe.`,
};

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token} />;
}
