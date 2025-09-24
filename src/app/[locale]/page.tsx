import HomeHeader from "@/components/home/appPresentation";
import styles from "./HomePage.module.scss";
import SuggestionsList from "@/components/home/suggestionsList";

export default async function Home() {
  return (
    <main className={styles.home}>
      <HomeHeader />
      <SuggestionsList />
    </main>
  );
}
