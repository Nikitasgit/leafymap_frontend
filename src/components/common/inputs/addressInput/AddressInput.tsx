import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MapboxFeature, Location } from "@/types/common";

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
    if (value) {
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
        }}
        placeholder="Rechercher une adresse..."
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
              <span>{sug.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
