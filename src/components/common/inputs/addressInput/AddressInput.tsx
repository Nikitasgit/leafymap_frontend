import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MapboxFeature, Location } from "@/types/common";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import styles from "./AddressInput.module.scss";
import TextField from "../textField/TextField";

interface AddressInputProps {
  onLocationSelect: (location: Location) => void;
  value?: string;
}

const AddressInput = ({ onLocationSelect, value }: AddressInputProps) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
  const { showError } = useToast();

  const fetchLocationSuggestions = async (
    input: string
  ): Promise<Location[]> => {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        input
      )}.json`,
      {
        params: {
          access_token: mapboxAccessToken,
          country: "fr",
          language: "fr",
          limit: 5,
        },
      }
    );

    return response.data.features.map((feature: MapboxFeature) => ({
      type: "Point",
      id: feature.id,
      label: feature.place_name_fr || feature.place_name,
      coordinates: [feature.center[0], feature.center[1]],
    }));
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

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
    }
  }, [value]);

  return (
    <div ref={wrapperRef} className={styles.addressInputWrapper}>
      <TextField
        name="address"
        label="Adresse"
        type="text"
        value={input}
        onChange={(e) =>
          handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
        }
        onFocus={() => setIsFocused(true)}
        placeholder="Rechercher une adresse..."
        fullWidth
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
