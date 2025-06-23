"use client";

import { Delete, Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SearchInput.module.scss";

interface SearchInputProps<T> {
  value?: string;
  onSelect: (suggestion: T) => void;
  onDelete: (id: string) => void;
  fetchSuggestions: (input: string) => Promise<T[]>;
  initialSuggestions?: T[];
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  list?: T[];
  displayList?: boolean;
  loading?: boolean;
  debounce?: number; // Delay in milliseconds
}

const SearchInput = <
  T extends {
    _id?: string;
    username?: string;
    image?: string;
  }
>({
  value = "",
  onSelect,
  onDelete,
  fetchSuggestions,
  initialSuggestions = [],
  placeholder = "Rechercher...",
  limit = 5,
  withIcons = false,
  list = [],
  displayList = false,
  loading = false,
  debounce,
}: SearchInputProps<T>) => {
  const [input, setInput] = useState(value);
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

    // Clear previous timeout if debounce is enabled
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (debounce) {
      // Use debounce
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestionsDebounced(newValue);
      }, debounce);
    } else {
      // Immediate fetch
      fetchSuggestionsDebounced(newValue);
    }
  };

  const handleSuggestionClick = (suggestion: T) => {
    setInput("");
    setSuggestions([]);
    onSelect(suggestion);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.searchInput}>
      <div style={{ position: "relative" }}>
        <Search size={20} className={styles.icon} />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (showInitialSuggestions) {
              setSuggestions(initialSuggestions.slice(0, limit));
            }
          }}
          placeholder={placeholder}
          className={styles.input}
          disabled={loading}
        />
      </div>
      {isFocused && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((sug) => (
            <li
              key={sug._id}
              onClick={() => handleSuggestionClick(sug as T)}
              className={styles.suggestionItem}
            >
              {withIcons && sug.image && (
                <Image
                  src={sug.image}
                  alt={sug.username || ""}
                  width={20}
                  height={20}
                  style={{ borderRadius: "50%" }}
                />
              )}
              <span>{sug.username}</span>
            </li>
          ))}
        </ul>
      )}
      {displayList && list.length > 0 && (
        <ul>
          {list.map((item) => {
            const id = item._id || "";
            return (
              <li key={id}>
                {withIcons && item.image && (
                  <Image
                    src={item.image}
                    alt={item.username || ""}
                    width={20}
                    height={20}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                {item.username}
                <Delete
                  onClick={() => handleDelete(id)}
                  style={{ cursor: "pointer" }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
