import ForgotPasswordForm from "@/components/auth/forgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié | SpotLight",
  description:
    "Réinitialisez votre mot de passe SpotLight. Entrez votre adresse email pour recevoir un lien de réinitialisation.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
