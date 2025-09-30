import SigninForm from "@/components/auth/signinForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | SpotLight",
  description:
    "Connectez-vous à votre compte SpotLight pour accéder à votre tableau de bord, gérer vos lieux et événements, et entrer en contact avec la communauté.",
};

export default function SignIn() {
  return <SigninForm />;
}
