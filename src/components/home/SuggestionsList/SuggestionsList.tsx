"use client";
import { useFindPlaces } from "@/hooks/useFindPlaces";
import { useEffect, useState } from "react";
import styles from "./SuggestionsList.module.scss";
import PlaceSuggestionCard from "../PlaceSuggestionCard";
import EmptyState from "@/components/common/noResults/EmptyState";
import { MapPin } from "lucide-react";

const SuggestionsList = () => {
  const { searchResults, isLoading, searchPlaces } = useFindPlaces();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    searchPlaces().finally(() => setHasFetched(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.suggestionsList}>
      <h2>Les lieux à ne pas manquer</h2>
      {hasFetched && searchResults.length === 0 ? (
        <EmptyState
          title="Aucun lieu trouvé"
          icon={<MapPin className={styles.icon} />}
        />
      ) : (
        <div
          className={
            styles.suggestionsListGrid +
            " " +
            (!hasFetched || isLoading ? "skeleton" : "")
          }
        >
          {searchResults.map((suggestion) => (
            <PlaceSuggestionCard key={suggestion._id} place={suggestion} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SuggestionsList;
