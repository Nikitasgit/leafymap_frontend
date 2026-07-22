import HomeHeader from "@/features/home/components/homeHeader";
import SuggestionsList from "@/features/home/components/suggestionsList";
import EventSuggestionsList from "@/features/events/components/eventSuggestionsList";
import { AnnouncementBanner } from "@/features/announcements";
import { getHomeMetadata } from "@/app/lib/pageMetadata";

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
      <AnnouncementBanner />
      <HomeHeader />
      <EventSuggestionsList />
      <SuggestionsList />
    </>
  );
}
