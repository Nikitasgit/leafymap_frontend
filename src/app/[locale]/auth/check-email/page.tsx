import CheckEmailMessage from "@/components/auth/checkEmailMessage";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Consultez votre email | ${APP_NAME}`,
  description:
    "Un email de vérification vous a été envoyé. Cliquez sur le lien pour activer votre compte.",
};

export default function CheckEmailPage() {
  return <CheckEmailMessage />;
}
