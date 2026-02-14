import ResetPasswordForm from "@/components/auth/resetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe | SpotLight",
  description:
    "Réinitialisez votre mot de passe SpotLight en entrant votre nouveau mot de passe.",
};

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { id?: string; token?: string };
}) {
  return (
    <ResetPasswordForm
      userId={searchParams.id}
      token={searchParams.token}
    />
  );
}
