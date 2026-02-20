import RegisterForm from "@/components/auth/registerForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Inscription | ${APP_NAME}`,
  description: `Rejoignez ${APP_NAME} et créez votre profil pour découvrir des lieux culturels, organiser des événements et collaborer avec des créateurs et artisans locaux.`,
};

export default function Register() {
  return <RegisterForm />;
}
