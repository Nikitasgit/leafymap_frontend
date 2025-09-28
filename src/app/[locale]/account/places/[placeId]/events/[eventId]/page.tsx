import EventModifyContainer from "@/components/account/Event/EventModifyContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier un événement | SpotLight",
  description:
    "Mettez à jour les informations de votre événement sur SpotLight : description, horaires, participants et visuels. Gardez votre programmation claire et attrayante pour vos visiteurs.",
};
const UpdateEventPage = () => {
  return <EventModifyContainer />;
};

export default UpdateEventPage;
