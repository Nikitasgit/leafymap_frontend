"use client";

import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import styles from "./FiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import { useFindCreators } from "@/hooks/useFindCreators";
import { useFindPlaces } from "@/hooks/useFindPlaces";
import { Collaborator } from "@/types/place/collaborators";

type SearchType = {
  label: string;
  placeholder: string;
};

type CreatorSearchResult = {
  _id: string;
  username: string;
  image: string;
};

type PlaceSearchResult = {
  _id: string;
  name: string;
  image?: string;
  location: {
    type: string;
    coordinates: number[];
    label: string;
    id: string;
  };
  placeCategory: {
    _id: string;
    name: string;
  };
};

type SearchResult = CreatorSearchResult | PlaceSearchResult;

const types = [
  { key: "all", label: "Tous", value: ["all"] },
  { key: "food", label: "Producteurs", value: ["food"] },
  { key: "art", label: "Art et artisanat", value: ["art", "craft"] },
];

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu" },
];

const FiltersBar = ({
  mapRef,
  loading,
  filters,
  setFilters,
  handleUserSelect,
  handlePlaceSelect,
  handleOpenFilters,
}: {
  mapRef: React.RefObject<ExtendedMapRef | null>;
  loading: boolean;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  handleUserSelect: (user: Collaborator) => void;
  handlePlaceSelect: (place: {
    _id: string;
    location: { coordinates: number[] };
  }) => void;
  handleOpenFilters: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchCreators } = useFindCreators();
  const { searchPlaces } = useFindPlaces();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setSearchValue("");
    setIsDropdownOpen(false);
  };

  const handleTypeSelect = (type: {
    key: string;
    label: string;
    value: string[];
  }) => {
    setFilters({
      ...filters,
      placeType: type.value,
    });
  };

  const handleSearch = async (query: string) => {
    if (searchType.label === "Membres") {
      return await searchCreators(query);
    } else {
      return await searchPlaces(query);
    }
  };

  const handleSelect = (item: SearchResult) => {
    if (searchType.label === "Membres") {
      handleUserSelect(item as CreatorSearchResult);
    } else {
      handlePlaceSelect(
        item as { _id: string; location: { coordinates: number[] } }
      );
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fetchPlacesInView(null);
    }
  }, [filters, mapRef]);

  return (
    <div className={styles.filtersBar}>
      <div className={styles.categories}>
        {types.map((type) => (
          <button
            key={type.key}
            className={`${styles.category} ${
              filters.placeType.includes(type.key) ? styles.active : ""
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className={styles.search}>
        <div className={styles.searchDropdownWrapper} ref={dropdownRef}>
          <div className={styles.searchDropdown} onClick={handleDropdownToggle}>
            <span>{searchType.label}</span>
            <ChevronDown size={20} />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {searchTypes.map((type) => (
                <div
                  key={type.label}
                  className={styles.dropdownItem}
                  onClick={() => handleSearchTypeSelect(type)}
                >
                  {type.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <SearchInput
          value={searchValue}
          withIcons={searchType.label === "Membres"}
          debounce={500}
          loading={loading}
          limit={10}
          onSelect={handleSelect}
          onDelete={() => {}}
          fetchSuggestions={handleSearch}
          placeholder={searchType.placeholder}
        />
      </div>
      <button
        className={styles.filterButton}
        onClick={handleOpenFilters}
        disabled={loading}
      >
        <Filter size={20} />
        Filtres
      </button>
    </div>
  );
};

export default FiltersBar;
