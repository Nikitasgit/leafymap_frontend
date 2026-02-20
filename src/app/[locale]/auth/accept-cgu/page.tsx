import AcceptCguForm from "@/components/auth/acceptCguForm/AcceptCguForm";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Accepter les CGU | ${APP_NAME}`,
  description:
    "Acceptez les conditions générales d'utilisation pour finaliser votre inscription.",
};

export default function AcceptCguPage() {
  return <AcceptCguForm />;
}
