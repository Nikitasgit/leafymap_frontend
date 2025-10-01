import HomeHeader from "@/components/home/HomeHeader";
import SuggestionsList from "@/components/home/SuggestionsListtempname";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "SpotLight - Découvrez les créateurs, artisans et lieux culturels près de chez vous",
  description:
    "SpotLight est la plateforme de mise en relation entre créateurs, artisans, responsables de lieux et passionnés d'art et de culture. Explorez une carte interactive, participez à des événements et entrez en contact avec les talents locaux.",
};

export default async function Home() {
  return (
    <>
      <HomeHeader />
      <SuggestionsList />
    </>
  );
}
