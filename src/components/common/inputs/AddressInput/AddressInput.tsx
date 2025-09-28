import React, { useState, useRef, useEffect } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import { fetchLocationSuggestions } from "@/utils/map";
import styles from "./AddressInput.module.scss";
import TextField from "../textField/TextField";
import { AddressInputProps } from "./AddressInput.types";
import { Location } from "@/types/common";

const AddressInput = ({
  onLocationSelect,
  value,
  selectedLocation,
  error,
  errorMessage,
}: AddressInputProps) => {
  const { showError } = useToast();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [lastSelectedLocation, setLastSelectedLocation] =
    useState<Location | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

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
        showError("Erreur lors de la recherche d'adresse. Veuillez réessayer.");
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

  useEffect(() => {
    if (value) {
      setInput(value);
      if (selectedLocation && value === selectedLocation.label) {
        setLastSelectedLocation(selectedLocation);
      } else if (lastSelectedLocation && value !== lastSelectedLocation.label) {
        setLastSelectedLocation(null);
      }
    } else {
      setInput("");
      setLastSelectedLocation(null);
    }
  }, [value, selectedLocation, lastSelectedLocation]);

  return (
    <div ref={wrapperRef} className={styles.addressInputWrapper}>
      <TextField
        name="address"
        label="Adresse"
        required
        type="text"
        value={input}
        onChange={(e) =>
          handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
        }
        onFocus={() => setIsFocused(true)}
        placeholder="Rechercher une adresse..."
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
