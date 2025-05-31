"use client";

import { Collaborator } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { Delete } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export interface Suggestion {
  id: string;
  label: string;
  icon?: string;
}

interface SearchInputProps {
  value?: string;
  onSelect: (suggestion: Suggestion) => void;
  onDelete: (id: string) => void;
  fetchSuggestions: (input: string) => Promise<Suggestion[]>;
  initialSuggestions?: Suggestion[];
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  list?: Collaborator[];
  displayList?: boolean;
}

const SearchInput = ({
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
}: SearchInputProps) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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

  const handleSuggestionClick = (suggestion: Suggestion) => {
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
    <div ref={wrapperRef} style={{ position: "relative" }}>
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
        style={{ width: "100%", padding: "8px" }}
      />
      {isFocused && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            background: "#fff",
            border: "1px solid #ccc",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 1000,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((sug) => (
            <li
              key={sug.id}
              onClick={() => handleSuggestionClick(sug)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px",
                gap: "8px",
              }}
            >
              {withIcons && sug.icon && (
                <Image
                  src={sug.icon}
                  alt={sug.label}
                  width={20}
                  height={20}
                  style={{ borderRadius: "50%" }}
                />
              )}
              <span>{sug.label}</span>
            </li>
          ))}
        </ul>
      )}
      {displayList && list.length > 0 && (
        <ul>
          {list.map((collaborator) => (
            <li key={collaborator.id}>
              {withIcons && collaborator.icon && (
                <Image
                  src={collaborator.icon}
                  alt={collaborator.label}
                  width={20}
                  height={20}
                  style={{ borderRadius: "50%" }}
                />
              )}
              {collaborator.label}
              <Delete
                onClick={() => handleDelete(collaborator.id)}
                style={{ cursor: "pointer" }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
