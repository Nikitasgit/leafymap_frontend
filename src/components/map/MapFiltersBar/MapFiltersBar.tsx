"use client";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import styles from "./MapFiltersBar.module.scss";
import { ChevronDown, Filter, Bookmark } from "lucide-react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useFindUsers } from "@/hooks/useFindUsers";
import Button from "@/components/common/buttons/Button";
import { fetchLocationSuggestions } from "@/utils/map";
import type {
  CreatorSearchResult,
  LocationSearchResult,
  SearchType,
  MapFiltersBarProps,
} from "./MapFiltersBar.types";

const SEARCH_TYPES: SearchType[] = [
  { key: "membres", label: "Membres", placeholder: "Rechercher un membre" },
  { key: "lieux", label: "Lieux", placeholder: "Rechercher un lieu (ex: Paris)" },
];

const MapFiltersBar = ({
  mapRef,
  loading: loadingProps,
  filters,
  handleSelect,
  selectedItem,
  isFavoritesMode,
  onFavoritesModeToggle,
  onExitFavoritesMode,
}: MapFiltersBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(SEARCH_TYPES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchUsers, isLoading: isLoadingUsers } = useFindUsers();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleSearchTypeSelect = useCallback((type: SearchType) => {
    setSearchType(type);
    setIsDropdownOpen(false);
  }, []);

  const handleFilterToggle = useCallback(() => {
    if (selectedItem.type === "filters") {
      handleSelect({ id: "", type: null });
    } else {
      onExitFavoritesMode();
      handleSelect({ id: "", type: "filters" });
    }
  }, [handleSelect, onExitFavoritesMode, selectedItem.type]);

  const handleSearch = useCallback(
    async (
      query: string
    ): Promise<(CreatorSearchResult | LocationSearchResult)[]> => {
      if (searchType.key === "membres") {
        const creators = await searchUsers({ username: query }, 10);
        return creators.map((user) => ({
          _id: user._id,
          image: user.image?.urls?.thumbnail || user.googlePictureUrl || "",
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
      }

      if (query.length < 2) return [];

      try {
        const locations = await fetchLocationSuggestions(query);
        return locations.map((location) => ({
          _id:
            location.id ||
            `location-${location.coordinates[0]}-${location.coordinates[1]}`,
          name: location.label,
          coordinates: location.coordinates,
        }));
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
      }
    },
    [searchType.key, searchUsers]
  );

  const handleSelectSuggestion = useCallback(
    (item: CreatorSearchResult | LocationSearchResult) => {
      if (searchType.key === "membres") {
        handleSelect({ id: item._id, type: "creator" });
        return;
      }

      if ("coordinates" in item && item.coordinates && mapRef.current?.isReady) {
        const [longitude, latitude] = item.coordinates;
        handleSelect({ id: "", type: null });
        mapRef.current.setSelectedPlaceId(null);
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 12, duration: 1000 });
        mapRef.current.fetchPlacesInView(null);
      }
    },
    [handleSelect, mapRef, searchType.key]
  );

  useEffect(() => {
    if (isFavoritesMode) return;
    if (!mapRef.current?.isReady) return;
    mapRef.current.fetchPlacesInView(null);
    if (selectedItem?.type !== "creator") {
      mapRef.current.setSelectedPlaceId(null);
    }
  }, [filters, mapRef, isFavoritesMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const loading = isLoadingUsers || loadingProps;

  const hasActiveFilters = useMemo(
    () =>
      filters.placeTypes.length > 0 ||
      filters.placeCategories.length > 0 ||
      filters.minRating != null ||
      (filters.userCategoryIds?.length ?? 0) > 0 ||
      (filters.productCategoryIds?.length ?? 0) > 0,
    [filters]
  );

  return (
    <div className={styles.filtersBar}>
      <div className={styles.topRow}>
        <div className={styles.filtersBtnWrapper}>
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
          {hasActiveFilters && (
            <span className={styles.filtersDot} aria-label="Filtres actifs" />
          )}
        </div>
        <Button
          variant={isFavoritesMode ? "primary" : "outline"}
          size="small"
          type="button"
          onClick={onFavoritesModeToggle}
          startIcon={<Bookmark size={17} />}
          ariaLabel={
            isFavoritesMode
              ? "Désactiver les lieux enregistrés"
              : "Afficher les lieux enregistrés"
          }
        >
          Enregistrés
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
              {SEARCH_TYPES.map((type) => (
                <li key={type.key} role="presentation">
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleSearchTypeSelect(type)}
                    role="option"
                    aria-selected={searchType.key === type.key}
                  >
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.searchInputWrapper}>
          <SearchInput
            withIcons
            limit={10}
            onSelect={handleSelectSuggestion}
            fetchSuggestions={handleSearch}
            placeholder={searchType.placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default MapFiltersBar;
