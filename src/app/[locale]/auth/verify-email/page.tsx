import VerifyEmailHandler from "@/components/auth/verifyEmailHandler/VerifyEmailHandler";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Vérification de l'email | ${APP_NAME}`,
  description: "Vérifiez votre adresse email pour activer votre compte.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <VerifyEmailHandler token={token} />;
}
