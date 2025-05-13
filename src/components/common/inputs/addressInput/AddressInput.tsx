import React, { useEffect, useState } from "react";
import axios from "axios";

export interface Address {
  id: string;
  label: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

interface MapboxFeature {
  id: string;
  place_name_fr?: string;
  place_name: string;
  center: [number, number];
}

interface AddressInputProps {
  onAddressSelect: (address: Address) => void;
  value?: string;
}
const AddressInput = ({ onAddressSelect, value }: AddressInputProps) => {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState<Address[]>([]);

  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 2) {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json`,
          {
            params: {
              access_token: mapboxAccessToken,
              country: "fr",
              language: "fr",
              limit: 5,
            },
          }
        )
        .then((response) => {
          const mappedSuggestions: Address[] = response.data.features.map(
            (feature: MapboxFeature) => ({
              id: feature.id,
              label: feature.place_name_fr || feature.place_name,
              coordinates: {
                longitude: feature.center[0],
                latitude: feature.center[1],
              },
            })
          );
          setSuggestions(mappedSuggestions);
        })
        .catch((error) => {
          console.error("Error fetching data from Mapbox", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Address) => {
    setInput(suggestion.label);
    setSuggestions([]);
    onAddressSelect(suggestion);
  };
  useEffect(() => {
    if (value !== undefined && value !== input) {
      setInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Entrez une adresse"
      />
      {suggestions.length > 0 && (
        <ul
          style={{ background: "#fff", border: "1px solid #ccc", padding: 0 }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{ cursor: "pointer", listStyle: "none", padding: "5px" }}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressInput;
