import HomeHeader from "@/components/home/HomeHeader";
import SuggestionsList from "@/components/home/SuggestionsList";
import EventSuggestionsList from "@/components/home/EventSuggestionsList";
import { getHomeMetadata } from "@/lib/pageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getHomeMetadata(locale);
}

export default async function Home() {
  return (
    <>
      <HomeHeader />
      <EventSuggestionsList />
      <SuggestionsList />
    </>
  );
}
