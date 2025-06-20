"use client";

import { Delete, Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
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
  disabled?: boolean;
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
  disabled = false,
}: SearchInputProps<T>) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showInitialSuggestions =
    input.trim() === "" && initialSuggestions.length > 0;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    if (newValue.length > 2) {
      try {
        const results = await fetchSuggestions(newValue);
        setSuggestions(results.slice(0, limit));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
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
          disabled={disabled}
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
