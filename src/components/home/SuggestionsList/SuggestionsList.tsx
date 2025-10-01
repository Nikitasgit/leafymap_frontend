"use client";
import { useFindPlaces } from "@/hooks/useFindPlaces";
import React, { useEffect } from "react";
import styles from "./SuggestionsList.module.scss";
import PlaceSuggestionCard from "../PlaceSuggestionCard";

const SuggestionsList = () => {
  const { searchResults, isLoading, searchPlaces } = useFindPlaces();
  useEffect(() => {
    if (searchResults.length === 0) {
      searchPlaces();
    }
  }, [searchPlaces, searchResults]);

  return (
    <section className={styles.suggestionsList}>
      <h2>Les lieux à ne pas manquer</h2>
      {isLoading ? (
        <div className={`${styles.suggestionsListGrid} skeleton`}></div>
      ) : (
        <div className={styles.suggestionsListGrid}>
          {searchResults.map((suggestion) => (
            <PlaceSuggestionCard key={suggestion._id} place={suggestion} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SuggestionsList;
