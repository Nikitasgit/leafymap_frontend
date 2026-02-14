import ResetPasswordForm from "@/components/auth/resetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe | SpotLight",
  description:
    "Réinitialisez votre mot de passe SpotLight en entrant votre nouveau mot de passe.",
};

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token} />;
}
