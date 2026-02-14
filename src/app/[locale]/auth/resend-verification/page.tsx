import ResendVerificationForm from "@/components/auth/resendVerificationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renvoyer le lien de vérification | SpotLight",
  description:
    "Entrez votre email pour recevoir un nouveau lien de vérification.",
};

export default function ResendVerificationPage() {
  return <ResendVerificationForm />;
}
