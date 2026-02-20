import SigninForm from "@/components/auth/signinForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Connexion | ${APP_NAME}`,
  description: `Connectez-vous à votre compte ${APP_NAME} pour accéder à votre tableau de bord, gérer vos lieux et événements, et entrer en contact avec la communauté.`,
};

export default function SignIn() {
  return <SigninForm />;
}
