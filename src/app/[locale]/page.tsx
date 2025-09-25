import HomeHeader from "@/components/home/appPresentation";
import SuggestionsList from "@/components/home/suggestionsList";

export default async function Home() {
  return (
    <div>
      <HomeHeader />
      <SuggestionsList />
    </div>
  );
}
