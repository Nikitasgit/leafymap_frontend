import ResendVerificationForm from "@/components/auth/resendVerificationForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Renvoyer le lien de vérification | ${APP_NAME}`,
  description:
    "Entrez votre email pour recevoir un nouveau lien de vérification.",
};

export default function ResendVerificationPage() {
  return <ResendVerificationForm />;
}
