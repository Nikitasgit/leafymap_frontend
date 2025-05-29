import React from "react";

import axios from "axios";
import { MapboxFeature, Location } from "@/types/map";
import SearchInput from "../searchInput/SearhInput";

interface AddressInputProps {
  onLocationSelect: (location: Location) => void;
  value?: string;
}

const AddressInput = ({ onLocationSelect, value }: AddressInputProps) => {
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
      id: feature.id,
      label: feature.place_name_fr || feature.place_name,
      coordinates: {
        longitude: feature.center[0],
        latitude: feature.center[1],
      },
    }));
  };

  return (
    <SearchInput
      value={value}
      onSelect={(suggestion) => onLocationSelect(suggestion as Location)}
      fetchSuggestions={fetchLocationSuggestions}
      placeholder="Entrez une adresse"
      limit={5}
    />
  );
};

export default AddressInput;
