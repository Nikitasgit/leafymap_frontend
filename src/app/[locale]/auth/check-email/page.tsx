import CheckEmailMessage from "@/components/auth/checkEmailMessage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultez votre email | SpotLight",
  description:
    "Un email de vérification vous a été envoyé. Cliquez sur le lien pour activer votre compte.",
};

export default function CheckEmailPage() {
  return <CheckEmailMessage />;
}
