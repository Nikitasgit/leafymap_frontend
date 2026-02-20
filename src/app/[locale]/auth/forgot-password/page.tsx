import ForgotPasswordForm from "@/components/auth/forgotPasswordForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Mot de passe oublié | ${APP_NAME}`,
  description: `Réinitialisez votre mot de passe ${APP_NAME}. Entrez votre adresse email pour recevoir un lien de réinitialisation.`,
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
