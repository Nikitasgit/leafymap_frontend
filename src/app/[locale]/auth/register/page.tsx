import RegisterForm from "@/components/auth/registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | SpotLight",
  description:
    "Rejoignez SpotLight et créez votre profil pour découvrir des lieux culturels, organiser des événements et collaborer avec des créateurs et artisans locaux.",
};

export default function Register() {
  return <RegisterForm />;
}
