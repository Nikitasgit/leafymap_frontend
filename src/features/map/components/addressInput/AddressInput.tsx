"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useOnClickOutside from "@/shared/hooks/useOnClickOutside";
import { useToast } from "@/shared/hooks/useToast";
import { fetchLocationSuggestions } from "@/features/map/utils/map";
import styles from "./AddressInput.module.scss";
import TextField from "@/shared/ui/inputs/textField";
import { AddressInputProps } from "./AddressInput.types";
import { Location } from "@/shared/types/common";

const AddressInput = ({
  onLocationSelect,
  value,
  selectedLocation,
  error,
  errorMessage,
}: AddressInputProps) => {
  const { t } = useTranslation("common");
  const { showError } = useToast();
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [lastSelectedLocation, setLastSelectedLocation] =
    useState<Location | null>(null);
  const [prevValue, setPrevValue] = useState(value);
  const [prevSelectedLocation, setPrevSelectedLocation] =
    useState(selectedLocation);

  const wrapperRef = useRef<HTMLDivElement>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setInput(value || "");
  }

  if (selectedLocation !== prevSelectedLocation) {
    setPrevSelectedLocation(selectedLocation);
    if (selectedLocation && value === selectedLocation.label) {
      setLastSelectedLocation(selectedLocation);
    } else if (!selectedLocation) {
      setLastSelectedLocation(null);
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    if (lastSelectedLocation && newValue !== lastSelectedLocation.label) {
      setLastSelectedLocation(null);
      onLocationSelect(null);
    }
    if (newValue.length > 2) {
      try {
        const results = await fetchLocationSuggestions(newValue);
        setSuggestions(results);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        showError(t("addressInput.searchError"));
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Location) => {
    setInput(suggestion.label || "");
    setSuggestions([]);
    setLastSelectedLocation(suggestion);
    onLocationSelect(suggestion);
  };

  const handleClickOutside = () => {
    setSuggestions([]);
    setIsFocused(false);
  };

  useOnClickOutside(wrapperRef, handleClickOutside);

  return (
    <div ref={wrapperRef} className={styles.addressInputWrapper}>
      <TextField
        name="address"
        label={t("addressInput.label")}
        required
        type="text"
        value={input}
        onChange={(e) =>
          handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
        }
        onFocus={() => setIsFocused(true)}
        placeholder={t("addressInput.placeholder")}
        fullWidth
        error={error}
        errorMessage={errorMessage}
      />
      {isFocused && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((sug) => (
            <li
              key={sug.id}
              onClick={() => handleSuggestionClick(sug)}
              className={styles.suggestionItem}
            >
              <span>{sug.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
