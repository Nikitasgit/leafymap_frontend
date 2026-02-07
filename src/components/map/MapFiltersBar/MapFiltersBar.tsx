"use client";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import styles from "./MapFiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useFindUsers } from "@/hooks/useFindUsers";
import Button from "@/components/common/buttons/Button";
import { fetchLocationSuggestions } from "@/utils/map";
import {
  CreatorSearchResult,
  LocationSearchResult,
  SearchType,
  MapFiltersBarProps,
} from "./MapFiltersBar.types";

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu (ex: Paris)" },
];

const MapFiltersBar = ({
  mapRef,
  loading: loadingProps,
  filters,
  setFilters,
  handleSelect,
  selectedItem,
}: MapFiltersBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchUsers, isLoading: isLoadingUsers } = useFindUsers();
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

  const handleTypeSelect = (type: { value: string }) => {
    if (selectedItem.type !== "filters") {
      handleSelect({
        id: "",
        type: null,
      });
    }
    setFilters({
      ...filters,
      placeType: type.value,
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setIsDropdownOpen(false);
  };

  const handleFilterToggle = () => {
    if (selectedItem.type === "filters") {
      handleSelect({ id: "", type: null });
    } else {
      handleSelect({ id: "", type: "filters" });
    }
  };
  /**
   * Search handler that switches between user and location search
   * based on the selected search type.
   */
  const handleSearch = async (
    query: string
  ): Promise<(CreatorSearchResult | LocationSearchResult)[]> => {
    if (searchType.label === "Membres") {
      const creators = await searchUsers({ username: query });
      const suggestions: CreatorSearchResult[] = creators.map((user) => ({
        _id: user._id,
        image: user.image?.urls.thumbnail || "",
        name: user.username || "",
        place: user.place?.location
          ? {
              label: user.place.location.label,
              placeCategory: user.place.placeCategory,
            }
          : undefined,
        categories: user.userCategory
          ? [
              {
                name:
                  typeof user.userCategory === "object"
                    ? user.userCategory.name
                    : "",
                userCategoryType:
                  typeof user.userCategory === "object"
                    ? user.userCategory.userCategoryType
                    : undefined,
              },
            ]
          : [],
      }));

      return suggestions;
    } else {
      if (query.length < 2) {
        return [];
      }
      try {
        const locations = await fetchLocationSuggestions(query);
        const suggestions: LocationSearchResult[] = locations.map(
          (location) => ({
            _id:
              location.id ||
              `location-${location.coordinates[0]}-${location.coordinates[1]}`,
            name: location.label,
            coordinates: location.coordinates,
          })
        );
        return suggestions;
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
      }
    }
  };

  const handleSelectSuggestion = (
    item: CreatorSearchResult | LocationSearchResult
  ) => {
    if (searchType.label === "Membres") {
      // Pour les membres, ouvrir la MapCreatorCard
      handleSelect({
        id: item._id,
        type: "creator",
      });
    } else {
      if (
        "coordinates" in item &&
        item.coordinates &&
        mapRef.current?.isReady
      ) {
        const [longitude, latitude] = item.coordinates;
        handleSelect({ id: "", type: null });
        mapRef.current.setSelectedPlaceId(null);
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 1000,
        });

        if (mapRef.current) {
          mapRef.current.fetchPlacesInView(null);
        }
      }
    }
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.isReady) {
      mapRef.current.fetchPlacesInView(null);
      mapRef.current.setSelectedPlaceId(null);
    }
  }, [filters, mapRef]);

  const loading = isLoadingUsers || loadingProps;

  return (
    <div className={styles.filtersBar}>
      <div className={styles.topRow}>
        <div
          className={styles.categories}
          role="group"
          aria-label="Filtres par catégorie"
        >
          {types.map((type) => (
            <button
              key={type.key}
              type="button"
              className={`${styles.category} ${
                type.value === filters.placeType ? styles.active : ""
              }`}
              onClick={() => handleTypeSelect(type)}
              aria-pressed={type.value === filters.placeType}
            >
              {type.label}
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={handleFilterToggle}
          disabled={loading}
          startIcon={<Filter size={17} />}
          ariaLabel="Filtres"
        >
          Filtres
        </Button>
      </div>
      <div className={styles.search}>
        <div className={styles.searchDropdownWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.searchDropdown}
            onClick={handleDropdownToggle}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-label="Sélectionner le type de recherche"
          >
            <span>{searchType.label}</span>
            <ChevronDown size={20} aria-hidden="true" />
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu} role="listbox">
              {searchTypes.map((type) => (
                <li key={type.label} role="presentation">
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleSearchTypeSelect(type)}
                    role="option"
                    aria-selected={searchType.label === type.label}
                  >
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SearchInput
          withIcons
          limit={10}
          onSelect={handleSelectSuggestion}
          fetchSuggestions={handleSearch}
          placeholder={searchType.placeholder}
        />
      </div>
    </div>
  );
};

export default MapFiltersBar;
