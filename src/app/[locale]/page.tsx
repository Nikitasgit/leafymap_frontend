import HomeHeader from "@/components/home/HomeHeader";
import SuggestionsList from "@/components/home/SuggestionsList";
import EventSuggestionsList from "@/components/home/EventSuggestionsList";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${APP_NAME} - Découvrez les créateurs, artisans et lieux culturels où que vous soyez`,
  description: `${APP_NAME} est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture. Explorez une carte interactive, participez à des événements et entrez en contact avec les talents locaux.`,
};

export default async function Home() {
  return (
    <>
      <HomeHeader />
      <SuggestionsList />
      <EventSuggestionsList />
    </>
  );
}
