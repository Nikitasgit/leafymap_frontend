import React from "react";

import axios from "axios";
import { Address, MapboxFeature } from "@/types/map";
import SearchInput from "../searchInput/SearhInput";

interface AddressInputProps {
  onAddressSelect: (address: Address) => void;
  value?: string;
}

const AddressInput = ({ onAddressSelect, value }: AddressInputProps) => {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  const fetchAddressSuggestions = async (input: string): Promise<Address[]> => {
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
      onSelect={(suggestion) => onAddressSelect(suggestion as Address)}
      fetchSuggestions={fetchAddressSuggestions}
      placeholder="Entrez une adresse"
      limit={5}
    />
  );
};

export default AddressInput;
