import AccountEventsContainer from "@/components/account/AccountEventsContainer/AccountEventsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gérer vos événements | SpotLight",
  description:
    "Gérez les événements de votre lieu sur SpotLight. Créez, modifiez et organisez des événements pour attirer plus de monde.",
};

export default function EventsListPage() {
  return <AccountEventsContainer />;
}
