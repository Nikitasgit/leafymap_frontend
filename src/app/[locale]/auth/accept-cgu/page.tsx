import AcceptCguForm from "@/components/auth/acceptCguForm/AcceptCguForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accepter les CGU | SpotLight",
  description:
    "Acceptez les conditions générales d'utilisation pour finaliser votre inscription.",
};

export default function AcceptCguPage() {
  return <AcceptCguForm />;
}
