"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import styles from "./SearchInput.module.scss";
import TextField from "../TextField/TextField";
import { SearchInputProps, SearchSuggestion } from "./SearchInput.types";
import CreatorCategoryBadge from "../../users/CreatorCategoryBadge";
import PlaceCategoryBadge from "../../places/placeCategoryBadge/PlaceCategoryBadge";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import { MapPin } from "lucide-react";

const SearchInput = <T extends SearchSuggestion>({
  value = "",
  onSelect,
  fetchSuggestions: fetchSuggestionsProps,
  placeholder = "Rechercher...",
  limit = 5,
  withIcons = false,
  label,
}: SearchInputProps<T>) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef<string>(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(
    async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const results = await fetchSuggestionsProps(searchTerm);
          setSuggestions(results.slice(0, limit));
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    },
    [fetchSuggestionsProps, limit],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    // Cancel previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls to avoid excessive requests (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: T) => {
    setInput("");
    setSuggestions([]);
    onSelect(suggestion);
  };

  const handleClickOutside = () => {
    setSuggestions([]);
    setIsFocused(false);
  };

  useOnClickOutside(wrapperRef, handleClickOutside);

  useEffect(() => {
    if (value !== undefined && value !== prevValueRef.current) {
      setInput(value);
      prevValueRef.current = value;
    }
  }, [value]);

  // Cleanup: clear debounce timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.searchInput}>
      <TextField
        name="searchInput"
        label={label}
        type="text"
        value={input}
        onChange={(e) =>
          handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
        }
        onFocus={() => {
          setIsFocused(true);
        }}
        placeholder={placeholder}
        fullWidth
      />
      {isFocused && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((sug) => (
            <li
              key={sug._id}
              onClick={() => handleSuggestionClick(sug)}
              className={styles.suggestionItem}
            >
              {withIcons && !("coordinates" in sug) && (
                <Image
                  src={sug.image || (sug as SearchSuggestion).googlePictureUrl || creatorDefaultsSvg}
                  alt={sug.name || "Créateur"}
                  width={32}
                  height={32}
                  className={styles.suggestionImage}
                />
              )}
              <div className={styles.suggestionContent}>
                <div className={styles.suggestionNameRow}>
                  <span className={styles.suggestionName}>{sug.name}</span>
                  {sug.categories &&
                    sug.categories.length > 0 &&
                    sug.categories[0]?.type?.name !== "organization" && (
                      <CreatorCategoryBadge
                        categoryName={sug.categories[0].name}
                      />
                    )}
                </div>
                {sug.place?.label && (
                  <div className={styles.locationInfo}>
                    <MapPin size={14} className={styles.detailIcon} />
                    <div className={styles.locationInfoRow}>
                      <p className={styles.detailText}>{sug.place.label}</p>
                      {sug.place.placeCategory?.name && (
                        <PlaceCategoryBadge
                          categoryName={sug.place.placeCategory.name}
                        />
                      )}
                    </div>
                  </div>
                )}
                {!sug.place && sug.location?.label && (
                  <div className={styles.suggestionInfos}>
                    <span>{sug.location.label}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
