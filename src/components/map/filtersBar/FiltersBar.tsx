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
import { Place } from "@/types/place";

type SearchType = {
  label: string;
  placeholder: string;
};

type CreatorSearchResult = {
  _id: string;
  name: string;
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

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu" },
];

const FiltersBar = ({
  mapRef,
  loading: loadingProps,
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
  handlePlaceSelect: (
    place: Pick<Place, "_id" | "location" | "image" | "name" | "placeCategory">
  ) => void;
  handleOpenFilters: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchCreators } = useFindCreators();
  const { searchPlaces, isLoading } = useFindPlaces();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const types = [
    {
      key: "all",
      label: "Tous",
      value: "all",
    },
    {
      key: "food",
      label: `Producteurs`,
      value: "food",
    },
    {
      key: "art",
      label: `Art et artisanat`,
      value: "art-craft",
    },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setSearchValue("");
    setIsDropdownOpen(false);
  };

  const handleTypeSelect = (type: { value: string }) => {
    setFilters({
      ...filters,
      placeType: type.value,
    });
  };

  const handleSearch = async (query: string) => {
    if (searchType.label === "Membres") {
      const creators = await searchCreators(query);
      return creators;
    } else {
      const places = await searchPlaces(query);
      return places;
    }
  };

  const handleSelect = (item: SearchResult) => {
    if (searchType.label === "Membres") {
      handleUserSelect({
        _id: item._id,
        name: item.name,
        image: item.image,
      } as Collaborator);
    } else {
      handlePlaceSelect(item as Place);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fetchPlacesInView(null);
      mapRef.current.setSelectedPlaceId(null);
    }
  }, [filters, mapRef]);

  const loading = isLoading || loadingProps;

  return (
    <div className={styles.filtersBar}>
      <div className={styles.categories}>
        {types.map((type) => (
          <button
            key={type.key}
            className={`${styles.category} ${
              type.value === filters.placeType ? styles.active : ""
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
