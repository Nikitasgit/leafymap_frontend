"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SearchInput.module.scss";
import TextField from "../textField/TextField";
import { useTranslation } from "react-i18next";

interface SearchInputProps<T> {
  value?: string;
  onSelect: (suggestion: T) => void;
  fetchSuggestions: (input: string) => Promise<T[]>;
  initialSuggestions?: T[];
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  loading?: boolean;
  debounce?: number;
  label?: string;
}

const SearchInput = <
  T extends {
    _id: string;
    username?: string;
    name?: string;
    image?: string;
    location?: { label: string };
    status?: string;
    categories?: { name: string }[];
  }
>({
  value = "",
  onSelect,
  fetchSuggestions,
  initialSuggestions = [],
  placeholder = "Rechercher...",
  limit = 5,
  withIcons = false,
  loading = false,
  debounce,
  label,
}: SearchInputProps<T>) => {
  const [input, setInput] = useState(value);
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showInitialSuggestions =
    input.trim() === "" && initialSuggestions.length > 0;

  const fetchSuggestionsDebounced = useCallback(
    async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const results = await fetchSuggestions(searchTerm);

          setSuggestions(results.slice(0, limit));
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    },
    [fetchSuggestions, limit]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (debounce) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestionsDebounced(newValue);
      }, debounce);
    } else {
      fetchSuggestionsDebounced(newValue);
    }
  };

  const handleSuggestionClick = (suggestion: T) => {
    setInput("");
    setSuggestions([]);
    onSelect(suggestion);
  };

  const getDisplayName = (item: T) => {
    return item.username || item.name || "";
  };

  const getCategories = (item: T) => {
    if ("categories" in item && item.categories) {
      return item.categories
        .map((category) => t(`creatorCategories.${category.name}`))
        .join(", ");
    }
    return null;
  };

  const getAddress = (item: T) => {
    if ("location" in item && item.location && "label" in item.location) {
      return item.location.label;
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== undefined && value !== input) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
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
          if (showInitialSuggestions) {
            setSuggestions(initialSuggestions.slice(0, limit));
          }
        }}
        placeholder={placeholder}
        fullWidth
        disabled={loading}
      />
      {isFocused && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((sug) => (
            <li
              key={sug._id}
              onClick={() => handleSuggestionClick(sug)}
              className={styles.suggestionItem}
            >
              {withIcons && sug.image && (
                <Image
                  src={sug.image}
                  alt={getDisplayName(sug)}
                  width={32}
                  height={32}
                  className={styles.suggestionImage}
                />
              )}
              <div className={styles.suggestionContent}>
                <span className={styles.suggestionName}>
                  {getDisplayName(sug)}
                </span>
                {sug.categories && (
                  <span className={styles.suggestionInfos}>
                    {getCategories(sug)}
                  </span>
                )}
                {getAddress(sug) && (
                  <div className={styles.suggestionInfos}>
                    <span>{getAddress(sug)}</span>
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
